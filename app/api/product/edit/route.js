// app/product/edit/route.js
import { NextResponse } from "next/server";
import db from "@/app/lib/db";
import sharp from "sharp";

export async function POST(request) {
  const formData = await request.formData();

  const image = formData.get("image"); // Ambil image di awal

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

    filename = image.name.replace(/\.[^/.]+$/, "") + ".webp";
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
      const [insertResult] = await db.query(
        `
        INSERT INTO products (name, sku, price, stock, description, created_date, updated_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          product.name,
          product.sku,
          product.price,
          product.stock,
          product.description,
          currentDate,
          currentDate,
        ]
      );

      const newProductId = insertResult.insertId;

      // Insert gambar jika ada
      if (imageProvided) {
        await db.query(
          `INSERT INTO product_image (product_id, image, file_name, mime_type, bytes_size) VALUES (?, ?, ?, ?, ?)`,
          [newProductId, buffer, filename, mime, size]
        );
      }

      // Insert log ke imported_stock_history
      await db.query(
        `
        INSERT INTO imported_stock_history (product_id, imported_date, total_imported)
        VALUES (?, ?, ?)
        `,
        [newProductId, currentDate, product.stock]
      );
    } else {
      // Produk sudah ada → update data dan tambahkan stok
      const [existing] = await db.query(
        `SELECT stock FROM products WHERE product_id = ?`,
        [product.product_id]
      );

      if (existing.length === 0) {
        return new Response("Produk tidak ditemukan", { status: 404 });
      }

      const newStock = existing[0].stock + product.stock;

      await db.query(
        `
        UPDATE products
        SET name = ?, sku = ?, price = ?, stock = ?, description = ?, updated_date = ?
        WHERE product_id = ?
        `,
        [
          product.name,
          product.sku,
          product.price,
          newStock,
          product.description,
          currentDate,
          product.product_id,
        ]
      );

      // Update gambar jika ada
      if (imageProvided) {
        await db.query(`DELETE FROM product_image WHERE product_id = ?`, [
          product.product_id,
        ]);

        await db.query(
          `INSERT INTO product_image (product_id, image, file_name, mime_type, bytes_size) VALUES (?, ?, ?, ?, ?)`,
          [product.product_id, buffer, filename, mime, size]
        );
      }

      // Insert log ke imported_stock_history
      await db.query(
        `
        INSERT INTO imported_stock_history (product_id, imported_date, total_imported)
        VALUES (?, ?, ?)
        `,
        [product.product_id, currentDate, product.stock]
      );
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
