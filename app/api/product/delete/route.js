// api/product/delete/route.js

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });

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
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Hapus berhasil!" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Gagal menghapus produk",
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
