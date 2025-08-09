// api/diskon/delete/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const { product_id } = await req.json();

    // Hapus data dari product_discount
    const { error } = await supabase
      .from("product_discount")
      .delete()
      .eq("product_id", product_id);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Hapus diskon berhasil!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Gagal menghapus produk diskon:", err.message);
    return NextResponse.json(
      { success: false, message: "Gagal menghapus produk diskon" },
      { status: 500 }
    );
  }
}
