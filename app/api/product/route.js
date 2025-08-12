// app/api/product/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import sharp from "sharp";

export async function POST(req) {
  const formData = await req.formData();

  const name = formData.get("name")?.trim();
  const sku = formData.get("sku")?.trim();
  const price = parseInt(formData.get("price"), 10);
  const stock = parseInt(formData.get("stock"), 10);
  const description = formData.get("description")?.trim();
  const image = formData.get("image");
  const allowWithoutImage = formData.get("allowWithoutImage") === "true";

  const start_date = formData.get("start_date");
  const end_date = formData.get("end_date");
  const discount_amount = parseInt(formData.get("discount_amount"), 10);
  const original_price = parseInt(formData.get("original_price"), 10);

  const isDiscountValid =
    start_date && end_date && !isNaN(discount_amount) && !isNaN(original_price);

  // Validasi wajib
  if (!name || !sku || isNaN(price) || isNaN(stock)) {
    return NextResponse.json({
      success: false,
      message: "Data tidak lengkap.",
    });
  }

  if (price <= 0 || stock <= 0) {
    return NextResponse.json({
      success: false,
      message: "Harga/Stok tidak boleh input minus(-).",
    });
  }

  try {
    // Cek produk existing
    const { data: existingBySKU, error: errSku } = await supabase
      .from("products")
      .select("*")
      .eq("sku", sku);
    if (errSku) throw errSku;

    const { data: existingByName, error: errName } = await supabase
      .from("products")
      .select("*")
      .eq("name", name);
    if (errName) throw errName;

    // Upload ke Supabase Storage (jika ada gambar)
    let publicImageUrl = null;
    let fileName = null;

    if (image && typeof image.name === "string") {
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
      const buffer = await sharp(Buffer.from(arrayBuffer))
        .resize({ width: 800, withoutEnlargement: true })
        .toFormat("webp")
        .toBuffer();

      fileName = `${Date.now()}-${image.name.replace(/\.[^/.]+$/, "")}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, buffer, {
          cacheControl: "60", // 1 menit cache
          upsert: false,
          contentType: "image/webp",
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      publicImageUrl = publicUrlData?.publicUrl || null;
    } else if (!allowWithoutImage) {
      return NextResponse.json({
        success: false,
        confirmWithoutImage: true,
        message: "Gambar kosong. Apakah Anda ingin input tanpa gambar?",
      });
    }

    let productId;
    let message = "";

    // Update stok produk yang sama
    if (
      existingBySKU.length > 0 &&
      existingByName.length > 0 &&
      existingBySKU[0].product_id === existingByName[0].product_id
    ) {
      productId = existingBySKU[0].product_id;

      const updateData = {
        price,
        stock: existingBySKU[0].stock + stock,
        description,
        updated_date: new Date(),
      };

      const { error: errUpdate } = await supabase
        .from("products")
        .update(updateData)
        .eq("product_id", productId);
      if (errUpdate) throw errUpdate;

      await supabase.from("imported_stock_history").insert([
        {
          product_id: productId,
          total_imported: stock,
          imported_date: new Date(),
        },
      ]);

      // simpan gambar baru jika ada
      if (publicImageUrl) {
        await supabase.from("product_image").insert([
          {
            product_id: productId,
            image_url: publicImageUrl,
            file_name: fileName,
            mime_type: "image/webp",
            bytes_size: buffer.length,
          },
        ]);
      }

      message = "Produk berhasil diperbarui.";
    }
    // SKU cocok tapi nama beda
    else if (existingBySKU.length > 0 && existingByName.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Nama produk tidak sesuai dengan SKU.",
      });
    }
    // Nama cocok tapi SKU beda
    else if (existingByName.length > 0 && existingBySKU.length === 0) {
      return NextResponse.json({
        success: false,
        message: "SKU tidak sesuai dengan nama produk.",
      });
    }
    // Produk baru
    else {
      const insertData = {
        name,
        sku,
        price,
        stock,
        description,
        created_date: new Date(),
        updated_date: new Date(),
      };

      const { data: inserted, error: errInsert } = await supabase
        .from("products")
        .insert([insertData])
        .select();
      if (errInsert) throw errInsert;

      productId = inserted[0].product_id;
      message = "Produk berhasil ditambahkan.";

      await supabase.from("imported_stock_history").insert([
        {
          product_id: productId,
          total_imported: stock,
          imported_date: new Date(),
        },
      ]);
      console.log("publicImageurl NIH BOSS :", publicImageUrl);
      // simpan gambar kalau ada
      if (publicImageUrl) {
        await supabase.from("product_image").insert([
          {
            product_id: productId,
            image_url: publicImageUrl,
            file_name: fileName,
            mime_type: "image/webp",
            bytes_size: buffer.length,
          },
        ]);
      }
    }

    // Simpan diskon jika valid
    if (isDiscountValid) {
      await supabase.from("product_discount").insert([
        {
          product_id: productId,
          start_date,
          end_date,
          discount_amount,
          original_price,
        },
      ]);
    }

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error saat memproses produk:", error);
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
}
