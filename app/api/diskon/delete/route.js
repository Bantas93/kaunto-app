import db from "@/app/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { product_id } = body;

    const deleteImageQuery = `
      DELETE FROM product_discount
      WHERE product_id = ?
    `;
    await db.query(deleteImageQuery, [product_id]);

    const deleteProductDiscount = `
      DELETE FROM product_discount
      WHERE product_id = ?
    `;
    await db.query(deleteProductDiscount, [product_id]);

    return new Response(
      JSON.stringify({ success: true, message: "Hapus diskon berhasil!" }),
      { status: 200 }
    );
  } catch (err) {
    throw new Error("Gagal menghapus produk diskon", err);
  }
}
