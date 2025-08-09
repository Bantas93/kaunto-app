// app/api/diskon/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const {
      product_id,
      start_date,
      end_date,
      discount_amount,
      original_price,
    } = await req.json();

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

    // Supabase upsert (insert jika belum ada, update jika sudah ada)
    const { error } = await supabase.from("product_discount").upsert(
      [
        {
          product_id,
          start_date,
          end_date,
          discount_amount,
          original_price,
        },
      ],
      { onConflict: "product_id" } // kolom unique/primary key
    );

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Diskon berhasil ditambahkan atau diperbarui.",
    });
  } catch (error) {
    console.error("Gagal menyimpan diskon:", error.message);
    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan saat menyimpan diskon.",
    });
  }
}
