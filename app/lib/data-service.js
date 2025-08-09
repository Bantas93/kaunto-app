// app/lib/data-service.js
"use server";

import { supabase } from "./supabase";

/* =========================
   PRODUCTS
========================= */
export const getProducts = async function () {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_image(image),
        product_discount(discount_amount, original_price)
      `
      )
      .order("name", { ascending: true });

    if (error) throw error;

    return data.map((row) => {
      let image = null;
      if (row.product_image?.length && row.product_image[0].image) {
        const base64 = Buffer.from(row.product_image[0].image).toString(
          "base64"
        );
        image = `data:image/jpeg;base64,${base64}`;
      }
      return {
        ...row,
        image,
        discount_amount: row.product_discount?.[0]?.discount_amount || null,
        original_price: row.product_discount?.[0]?.original_price || null,
      };
    });
  } catch (error) {
    console.error(error);
    throw new Error("Products could not be loaded");
  }
};

export const createProduct = async function (product) {
  try {
    const created_date = new Date();
    const updated_date = new Date();

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: product.name,
          sku: product.sku,
          price: product.price,
          stock: product.stock,
          description: product.description || null,
          created_date,
          updated_date,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Product could not be created");
  }
};

export const updateProduct = async function (formData) {
  try {
    const product_id = Number(formData.get("product_id"));
    const { error } = await supabase
      .from("products")
      .update({
        name: formData.get("name"),
        sku: formData.get("sku"),
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        description: formData.get("description") || null,
        updated_date: new Date(),
      })
      .eq("product_id", product_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("Product could not be updated");
  }
};

export async function getProductById(product_id) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("product_id", product_id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Gagal mengambil data produk:", error.message);
    return null;
  }
}

/* =========================
   USERS
========================= */
export const getUsers = async function () {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("user_id, name, email, password, role, created_at")
      .order("name", { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }
};

export const getAllUsers = async () => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) throw error;
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Gagal ambil data user");
  }
};

export const deleteUser = async (user_id) => {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("user_id", user_id);
    if (error) throw error;
    return { message: "User deleted successfully" };
  } catch (err) {
    throw new Error("Gagal menghapus user");
  }
};

/* =========================
   STOCK HISTORY
========================= */
export const getAllStockHistory = async function () {
  try {
    const { data: imported, error: err1 } = await supabase
      .from("imported_stock_history")
      .select("product_id, imported_date, total_imported, products(name, sku)");
    if (err1) throw err1;

    const { data: sales, error: err2 } = await supabase
      .from("transaction_detail")
      .select(
        "product_id, quantity, transactions(created_date), products(name, sku)"
      );
    if (err2) throw err2;

    const stock_flow = [
      ...imported.map((row) => ({
        product_id: row.product_id,
        produk: row.products.name,
        sku: row.products.sku,
        tanggal: row.imported_date,
        flag: "IMPORT",
        qty: row.total_imported,
      })),
      ...sales.map((row) => ({
        product_id: row.product_id,
        produk: row.products.name,
        sku: row.products.sku,
        tanggal: row.transactions.created_date,
        flag: "SALES",
        qty: -row.quantity,
      })),
    ];

    stock_flow.sort((a, b) => {
      if (a.product_id === b.product_id) {
        return new Date(a.tanggal) - new Date(b.tanggal);
      }
      return a.product_id - b.product_id;
    });

    let totalMap = {};
    return stock_flow.map((row) => {
      totalMap[row.product_id] = (totalMap[row.product_id] || 0) + row.qty;
      return {
        ...row,
        subTotal: row.qty,
        totalStock: totalMap[row.product_id],
      };
    });
  } catch (error) {
    console.error("Gagal mengambil semua riwayat stok:", error.message);
    throw new Error("Stock history tidak dapat dimuat");
  }
};

export const getStockHistoryByProductId = async function (productId) {
  try {
    const { data: imported, error: err1 } = await supabase
      .from("imported_stock_history")
      .select(
        "product_id, imported_date, total_imported, products(name, sku, stock)"
      )
      .eq("product_id", productId);
    if (err1) throw err1;

    const { data: sales, error: err2 } = await supabase
      .from("transaction_detail")
      .select(
        "product_id, quantity, products(name, sku, stock), transactions(created_date)"
      )
      .eq("product_id", productId);
    if (err2) throw err2;

    const merged = [
      ...imported.map((row) => ({
        product_id: row.product_id,
        namaProduk: row.products.name,
        sku: row.products.sku,
        tanggal: row.imported_date,
        flag: "IMPORT",
        subTotal: row.total_imported,
        totalStok: row.products.stock,
      })),
      ...sales.map((row) => ({
        product_id: row.product_id,
        namaProduk: row.products.name,
        sku: row.products.sku,
        tanggal: row.transactions.created_date,
        flag: "SALES",
        subTotal: row.quantity,
        totalStok: row.products.stock,
      })),
    ];

    return merged.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  } catch (error) {
    console.error("Gagal mengambil riwayat stok:", error.message);
    throw new Error("Stock history tidak dapat dimuat");
  }
};

/* =========================
   TRANSACTIONS
========================= */
export const getAllTransactionHistory = async function () {
  try {
    const { data, error } = await supabase
      .from("transaction_detail")
      .select(
        `
        transaction_detail_id,
        quantity,
        price_per_item,
        subtotal,
        products(name),
        transactions(created_date, transaction_number, payment_method, users(name, role))
      `
      )
      .order("created_date", {
        referencedTable: "transactions",
        ascending: false,
      });

    if (error) throw error;

    return data.map((td) => ({
      transaction_detail_id: td.transaction_detail_id,
      tanggal: td.transactions.created_date,
      transaction_number: td.transactions.transaction_number,
      produk: td.products.name,
      user: td.transactions.users.name,
      role: td.transactions.users.role,
      quantity: td.quantity,
      metode: td.transactions.payment_method,
      pricePerItem: td.price_per_item,
      total: td.subtotal,
    }));
  } catch (error) {
    console.error("Gagal mengambil semua riwayat transaksi:", error.message);
    throw new Error("Transaksi history tidak dapat dimuat");
  }
};

export const getTransactionHistoryById = async function (productId) {
  try {
    const { data, error } = await supabase
      .from("transaction_detail")
      .select(
        `
        transaction_detail_id,
        quantity,
        price_per_item,
        subtotal,
        products(name, product_id),
        transactions(created_date, payment_method, users(name, role))
      `
      )
      .eq("product_id", productId)
      .order("created_date", {
        referencedTable: "transactions",
        ascending: false,
      });

    if (error) throw error;

    return data.map((td) => ({
      transaction_detail_id: td.transaction_detail_id,
      tanggal: td.transactions.created_date,
      produk: td.products.name,
      productId: td.products.product_id,
      user: td.transactions.users.name,
      role: td.transactions.users.role,
      quantity: td.quantity,
      metode: td.transactions.payment_method,
      pricePerItem: td.price_per_item,
      total: td.subtotal,
    }));
  } catch (error) {
    console.error("Gagal mengambil riwayat stok:", error.message);
    throw new Error("Stock history tidak dapat dimuat");
  }
};

export async function saveTransaction(payload) {
  try {
    const {
      transaction_number,
      total_amount,
      payment_method,
      user_id,
      tax,
      items,
    } = payload;

    const { data: trans, error: err1 } = await supabase
      .from("transactions")
      .insert([
        {
          user_id,
          total_amount,
          tax,
          payment_method,
          created_date: new Date(),
          transaction_number,
        },
      ])
      .select();

    if (err1) throw err1;
    const transactionId = trans[0].transaction_id;

    for (const item of items) {
      const subtotal = item.price * item.quantity;

      const { error: err2 } = await supabase.from("transaction_detail").insert([
        {
          transaction_id: transactionId,
          product_id: item.product_id,
          quantity: item.quantity,
          price_per_item: item.price,
          subtotal,
        },
      ]);
      if (err2) throw err2;

      // Update stock
      const { data: prod, error: err3 } = await supabase
        .from("products")
        .select("stock")
        .eq("product_id", item.product_id)
        .single();
      if (err3) throw err3;

      const newStock = (prod.stock || 0) - item.quantity;
      const { error: err4 } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("product_id", item.product_id);
      if (err4) throw err4;
    }

    return { success: true, transactionId };
  } catch (error) {
    console.error("saveTransaction error:", error);
    return { success: false, error };
  }
}

/* =========================
   DASHBOARD DATA
========================= */
export const getAllData = async () => {
  try {
    const tables = [
      supabase.from("products").select("*"),
      supabase.from("transactions").select("*"),
      supabase.from("transaction_detail").select("subtotal"),
      supabase.from("imported_stock_history").select("*"),
      supabase.from("product_discount").select("*"),
    ];

    const [products, transactions, transDetail, importedStock, discounts] =
      await Promise.all(tables);

    const turnoverTotal = transDetail.data.reduce(
      (sum, td) => sum + (td.subtotal || 0),
      0
    );

    return [
      {
        stock_available: products.data.length,
        transaction_total: transactions.data.length,
        turnover_transaction: turnoverTotal,
        imported_stock_total: importedStock.data.length,
        product_discount: discounts.data.length,
      },
    ];
  } catch (err) {
    console.error(err);
    throw new Error("Products could not be loaded");
  }
};
