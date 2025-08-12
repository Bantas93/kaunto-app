// app/product/edit/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import sharp from "sharp";

export async function POST(request) {
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

  // Validasi
  if (product.price <= 0 || product.stock <= 0) {
    return NextResponse.json({
      success: false,
      message: "Harga/Stok tidak boleh input minus(-).",
    });
  }

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

    if (product?.product_id) {
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
        // Ambil file lama
        const { data: oldImage } = await supabase
          .from("product_image")
          .select("file_name")
          .eq("product_id", product.product_id)
          .single();

        // Kalau ada file lama → hapus di storage
        if (oldImage?.file_name) {
          await supabase.storage.from("images").remove([oldImage.file_name]);
        }

        await supabase
          .from("product_image")
          .delete()
          .eq("product_id", product.product_id);

        const { error: storageError } = await supabase.storage
          .from("images")
          .upload(filename, buffer, { contentType: mime });

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filename);

        const publicImageUrl = publicUrlData?.publicUrl || null;

        await supabase.from("product_image").insert([
          {
            product_id: product.product_id,
            image_url: publicImageUrl,
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
