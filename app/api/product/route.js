// app/api/product/route.js
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import sharp from "sharp";

export async function POST(req) {
  try {
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
      start_date &&
      end_date &&
      !isNaN(discount_amount) &&
      !isNaN(original_price);

    if (!name || !sku || isNaN(price) || isNaN(stock)) {
      return NextResponse.json({
        success: false,
        message: "Data tidak lengkap.",
      });
    }

    if (price <= 0 || stock <= 0) {
      return NextResponse.json({
        success: false,
        message: "Harga dan stok harus lebih dari 0.",
      });
    }

    const [existingBySKU] = await db.query(
      "SELECT * FROM products WHERE sku = ?",
      [sku]
    );
    const [existingByName] = await db.query(
      "SELECT * FROM products WHERE name = ?",
      [name]
    );

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

      // Process image dengan sharp
      const arrayBuffer = await image.arrayBuffer();
      buffer = await sharp(Buffer.from(arrayBuffer))
        .resize({ width: 800, withoutEnlargement: true })
        .toFormat("webp")
        .toBuffer();

      // Update metadata
      filename = image.name.replace(/\.[^/.]+$/, "") + ".webp";
      mime = "image/webp";
      size = buffer.length; // Ukuran file setelah di-compress
    } else if (!allowWithoutImage) {
      return NextResponse.json({
        success: false,
        confirmWithoutImage: true,
        message: "Gambar kosong. Apakah Anda ingin input tanpa gambar?",
      });
    }

    let productId;
    let message = "";

    if (
      existingBySKU.length > 0 &&
      existingByName.length > 0 &&
      existingBySKU[0].product_id === existingByName[0].product_id
    ) {
      productId = existingBySKU[0].product_id;

      await db.query(
        `UPDATE products SET price = ?, stock = stock + ?, description = ?, updated_date = NOW() WHERE product_id = ?`,
        [price, stock, description, productId]
      );

      await db.query(
        `INSERT INTO imported_stock_history (product_id, total_imported, imported_date) VALUES (?, ?, NOW())`,
        [productId, stock]
      );

      if (imageProvided) {
        await db.query(`DELETE FROM product_image WHERE product_id = ?`, [
          productId,
        ]);

        await db.query(
          `INSERT INTO product_image (product_id, image, file_name, mime_type, bytes_size) VALUES (?, ?, ?, ?, ?)`,
          [productId, buffer, filename, mime, size]
        );
      }

      message = "Produk berhasil diperbarui.";
    } else if (existingBySKU.length > 0 && existingByName.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Nama produk tidak sesuai dengan SKU.",
      });
    } else if (existingByName.length > 0 && existingBySKU.length === 0) {
      return NextResponse.json({
        success: false,
        message: "SKU tidak sesuai dengan nama produk.",
      });
    } else {
      const [result] = await db.query(
        `INSERT INTO products (name, sku, price, stock, description, created_date, updated_date)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [name, sku, price, stock, description]
      );

      productId = result.insertId;
      message = "Produk berhasil ditambahkan.";

      await db.query(
        `INSERT INTO imported_stock_history (product_id, total_imported, imported_date)
         VALUES (?, ?, NOW())`,
        [productId, stock]
      );

      await db.query(
        `INSERT INTO product_image (product_id, image, file_name, mime_type, bytes_size)
         VALUES (?, ?, ?, ?, ?)`,
        [productId, buffer, filename, mime, size]
      );
    }

    if (isDiscountValid) {
      await db.query(
        `INSERT INTO product_discount (product_id, start_date, end_date, discount_amount, original_price)
         VALUES (?, ?, ?, ?, ?)`,
        [productId, start_date, end_date, discount_amount, original_price]
      );
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
