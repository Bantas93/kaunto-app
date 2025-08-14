// api/product/delete/route.js

import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req) {
  try {
    const { product_id } = await req.json();

    // Ambil nama image
    let { data: product_image } = await supabase
      .from("product_image")
      .select("file_name")
      .eq("product_id", product_id)
      .single();

    // Hapus gambar di Bucket
    await supabase.storage.from("images").remove(product_image.file_name);

    // Hapus data product_image
    await supabase.from("product_image").delete().eq("product_id", product_id);

    // Hapus data product_discount
    await supabase
      .from("product_discount")
      .delete()
      .eq("product_id", product_id);

    // Hapus data imported_stock_history
    await supabase
      .from("imported_stock_history")
      .delete()
      .eq("product_id", product_id);

    // Hapus transaksi berdasarkan product_id
    const { data: details, error: detailError } = await supabase
      .from("transaction_detail")
      .select("transaction_id")
      .eq("product_id", product_id);

    if (detailError) {
      return NextResponse.json(
        { success: false, message: detailError.message },
        { status: 400 }
      );
    }

    // Ambil semua transaction_id unik
    const transactionIds = [...new Set(details.map((d) => d.transaction_id))];

    // Hapus di transaction_detail
    await supabase
      .from("transaction_detail")
      .delete()
      .eq("product_id", product_id);

    // Hapus di transactions (jika ingin hapus transaksi yang tidak punya detail lagi)
    if (transactionIds.length > 0) {
      await supabase
        .from("transactions")
        .delete()
        .in("transaction_id", transactionIds);
    }

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
