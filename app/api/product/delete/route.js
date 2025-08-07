import db from "@/app/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { product_id } = body;

    const deleteImageQuery = `
      DELETE FROM product_image
      WHERE product_id = ?
    `;
    await db.query(deleteImageQuery, [product_id]);

    const deleteProductDiscount = `
      DELETE FROM product_discount
      WHERE product_id = ?
    `;
    await db.query(deleteProductDiscount, [product_id]);

    const deleteImportedStory = `
      DELETE FROM imported_stock_history
      WHERE product_id = ?
    `;
    await db.query(deleteImportedStory, [product_id]);

    const query = `
      DELETE FROM products
      WHERE product_id = ?
    `;

    const [result] = await db.query(query, [product_id]);

    return new Response(
      JSON.stringify({ success: true, message: "Hapus berhasil!" }),
      { status: 200 }
    );
  } catch (err) {
    throw new Error("Gagal menghapus produk", err);
  }
}
