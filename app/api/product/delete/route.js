// api/product/delete/route.js

import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const { product_id } = await req.json();

    // Hapus data terkait
    await supabase.from("product_image").delete().eq("product_id", product_id);
    await supabase
      .from("product_discount")
      .delete()
      .eq("product_id", product_id);
    await supabase
      .from("imported_stock_history")
      .delete()
      .eq("product_id", product_id);

    // Hapus produk utama
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", product_id);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Hapus berhasil!" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus produk", error: err.message },
      { status: 500 }
    );
  }
}
