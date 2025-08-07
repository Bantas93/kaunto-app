// app/api/diskon/route.js
import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      product_id,
      start_date,
      end_date,
      discount_amount,
      original_price,
    } = data;

    if (
      !product_id ||
      !start_date ||
      !end_date ||
      isNaN(discount_amount) ||
      isNaN(original_price)
    ) {
      return NextResponse.json({
        success: false,
        message: "Data diskon tidak lengkap atau tidak valid.",
      });
    }

    await db.query(
      `
      INSERT INTO product_discount 
      (product_id, start_date, end_date, discount_amount, original_price)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
      start_date = VALUES(start_date),
      end_date = VALUES(end_date),
      discount_amount = VALUES(discount_amount),
      original_price = VALUES(original_price)
      `,
      [product_id, start_date, end_date, discount_amount, original_price]
    );

    return NextResponse.json({
      success: true,
      message: "Diskon berhasil ditambahkan atau diperbarui.",
    });
  } catch (error) {
    console.error("Gagal menyimpan diskon:", error);
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan saat menyimpan diskon.",
    });
  }
}
