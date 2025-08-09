// app/product/edit/route.js
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import sharp from "sharp";

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies });

  const formData = await request.formData();
  const image = formData.get("image");

  const product = {
    product_id: parseInt(formData.get("product_id")),
    name: formData.get("name"),
    sku: formData.get("sku"),
    price: parseFloat(formData.get("price")),
    stock: parseInt(formData.get("stock")),
    description: formData.get("description") || null,
  };

  const currentDate = new Date();

  let buffer = null,
    filename = null,
    mime = null,
    size = null;

  const imageProvided = image && typeof image.arrayBuffer === "function";

  if (imageProvided) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({
        success: false,
        message: "Format gambar tidak didukung.",
      });
    }

    if (image.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: "Ukuran gambar terlalu besar. Maksimal 5MB.",
      });
    }

    const arrayBuffer = await image.arrayBuffer();
    buffer = await sharp(Buffer.from(arrayBuffer))
      .resize({ width: 800, withoutEnlargement: true })
      .toFormat("webp")
      .toBuffer();

    filename = `${Date.now()}-${image.name.replace(/\.[^/.]+$/, "")}.webp`;
    mime = "image/webp";
    size = buffer.length;
  }

  try {
    if (
      !product.name ||
      !product.sku ||
      isNaN(product.price) ||
      isNaN(product.stock)
    ) {
      return new Response("Data tidak valid", { status: 400 });
    }

    if (isNaN(product.product_id) || product.product_id === 0) {
      // Produk baru → INSERT
      const { data: insertedProduct, error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name: product.name,
            sku: product.sku,
            price: product.price,
            stock: product.stock,
            description: product.description,
            created_date: currentDate,
            updated_date: currentDate,
          },
        ])
        .select("product_id")
        .single();

      if (insertError) throw insertError;
      const newProductId = insertedProduct.product_id;

      // Upload gambar ke Supabase Storage & simpan metadata
      if (imageProvided) {
        const { error: storageError } = await supabase.storage
          .from("product-images")
          .upload(filename, buffer, { contentType: mime });

        if (storageError) throw storageError;

        await supabase.from("product_image").insert([
          {
            product_id: newProductId,
            image_url: filename,
            file_name: filename,
            mime_type: mime,
            bytes_size: size,
          },
        ]);
      }

      // Log ke imported_stock_history
      await supabase.from("imported_stock_history").insert([
        {
          product_id: newProductId,
          imported_date: currentDate,
          total_imported: product.stock,
        },
      ]);
    } else {
      // Produk sudah ada → update data dan tambahkan stok
      const { data: existing, error: selectError } = await supabase
        .from("products")
        .select("stock")
        .eq("product_id", product.product_id)
        .single();

      if (selectError || !existing) {
        return new Response("Produk tidak ditemukan", { status: 404 });
      }

      const newStock = existing.stock + product.stock;

      await supabase
        .from("products")
        .update({
          name: product.name,
          sku: product.sku,
          price: product.price,
          stock: newStock,
          description: product.description,
          updated_date: currentDate,
        })
        .eq("product_id", product.product_id);

      // Update gambar jika ada
      if (imageProvided) {
        await supabase
          .from("product_image")
          .delete()
          .eq("product_id", product.product_id);

        const { error: storageError } = await supabase.storage
          .from("product-images")
          .upload(filename, buffer, { contentType: mime });

        if (storageError) throw storageError;

        await supabase.from("product_image").insert([
          {
            product_id: product.product_id,
            image_url: filename,
            file_name: filename,
            mime_type: mime,
            bytes_size: size,
          },
        ]);
      }

      // Insert log ke imported_stock_history
      await supabase.from("imported_stock_history").insert([
        {
          product_id: product.product_id,
          imported_date: currentDate,
          total_imported: product.stock,
        },
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diupdate",
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("Terjadi kesalahan", { status: 500 });
  }
}
