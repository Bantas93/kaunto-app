// app/lib/data-service.js
"use server";

import { supabase } from "./supabase";

/* =========================
      PRODUCTS
========================= */

export const getProducts = async function () {
  try {
    // Ambil semua produk
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });
    if (prodError) throw prodError;

    // Ambil semua gambar
    const { data: images, error: imgError } = await supabase
      .from("product_image")
      .select("product_id, image_url");
    if (imgError) throw imgError;

    // Ambil semua diskon
    const { data: discounts, error: discError } = await supabase
      .from("product_discount")
      .select("product_id, discount_amount, original_price");
    if (discError) throw discError;

    // Gabungkan hasil seperti LEFT JOIN MySQL
    const result = products.map((p) => {
      // cari gambar sesuai product_id
      const imgRow = images.find((i) => i.product_id === p.product_id);
      const image = imgRow?.image_url || null;

      // cari diskon sesuai product_id
      const discRow =
        discounts.find((d) => d.product_id === p.product_id) || {};

      return {
        ...p,
        image, // langsung URL dari Supabase Storage
        discount_amount: discRow.discount_amount ?? null,
        original_price: discRow.original_price ?? null,
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Products could not be loaded");
  }
};

// Ambil semua produk + diskon (LEFT JOIN)

export const getProductsOption = async function () {
  try {
    // Ambil semua produk
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("product_id, name, sku, price, stock, description")
      .order("name", { ascending: true });

    if (prodError) throw prodError;

    // Ambil semua diskon
    const { data: discounts, error: discError } = await supabase
      .from("product_discount")
      .select(
        "product_id, discount_amount, original_price, start_date, end_date"
      );

    if (discError) throw discError;

    // Gabungkan seperti hasil LEFT JOIN MySQL
    const result = products.map((p) => {
      const foundDiscount =
        discounts.find((d) => d.product_id === p.product_id) || {};
      return {
        ...p,
        discount_amount: foundDiscount.discount_amount ?? null,
        original_price: foundDiscount.original_price ?? null,
        start_date: foundDiscount.start_date ?? null,
        end_date: foundDiscount.end_date ?? null,
      };
    });

    return result;
  } catch (error) {
    console.error("Gagal mengambil produk dengan diskon:", error.message);
    throw new Error("Produk diskon tidak dapat dimuat");
  }
};

// Ambil produk yang hanya ada di tabel diskon
export const getProductsWithDiscount = async function () {
  try {
    const { data: discounts, error: discError } = await supabase.from(
      "product_discount"
    ).select(`
        product_id,
        discount_amount,
        original_price,
        start_date,
        end_date,
        products (
          name,
          sku,
          price
        )
      `);

    if (discError) throw discError;

    // Sort manual berdasarkan nama produk
    const sorted = (discounts || []).sort((a, b) => {
      const nameA = a.products?.name?.toLowerCase() || "";
      const nameB = b.products?.name?.toLowerCase() || "";
      return nameA.localeCompare(nameB);
    });

    return sorted.map((d) => ({
      product_id: d.product_id,
      name: d.products?.name || null,
      sku: d.products?.sku || null,
      price: d.products?.price || null,
      discount_amount: d.discount_amount,
      original_price: d.original_price,
      start_date: d.start_date,
      end_date: d.end_date,
    }));
  } catch (error) {
    console.error("Gagal mengambil produk dengan diskon:", error.message);
    throw new Error("Produk diskon tidak dapat dimuat");
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
export const getTransactionNumber = async () => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("transaction_number")
      .order("transaction_id", { ascending: false })
      .limit(1);

    if (error) throw error;

    // Kembalikan array seperti versi MySQL kamu
    return data || [];
  } catch (error) {
    console.error("Gagal mengambil nomor transaksi:", error.message);
    throw new Error("Nomor transaksi tidak dapat dimuat");
  }
};

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
      supabase.from("transactions").select("*"), // pastikan ada kolom created_at
      supabase.from("transaction_detail").select("subtotal, transaction_id"),
      supabase.from("imported_stock_history").select("*"),
      supabase.from("product_discount").select("*"),
    ];

    const [products, transactions, transDetail, importedStock, discounts] =
      await Promise.all(tables);

    // Waktu untuk filter
    const now = new Date();
    const startToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endToday = new Date(startToday);
    endToday.setHours(23, 59, 59, 999);

    const startYesterday = new Date(startToday);
    startYesterday.setDate(startYesterday.getDate() - 1);
    const endYesterday = new Date(startYesterday);
    endYesterday.setHours(23, 59, 59, 999);

    // Filter transaksi
    const todayTransactions = transactions.data.filter((t) => {
      const tDate = new Date(t.created_date);
      return tDate >= startToday && tDate <= endToday;
    });

    const yesterdayTransactions = transactions.data.filter((t) => {
      const tDate = new Date(t.created_date);
      return tDate >= startYesterday && tDate <= endYesterday;
    });

    // Hitung omzet hari ini & kemarin
    const turnoverToday = transDetail.data
      .filter((td) =>
        todayTransactions.some((t) => t.transaction_id === td.transaction_id)
      )
      .reduce((sum, td) => sum + (td.subtotal || 0), 0);

    const turnoverYesterday = transDetail.data
      .filter((td) =>
        yesterdayTransactions.some(
          (t) => t.transaction_id === td.transaction_id
        )
      )
      .reduce((sum, td) => sum + (td.subtotal || 0), 0);

    // Omzet total semua transaksi
    const turnoverTotal = transDetail.data.reduce(
      (sum, td) => sum + (td.subtotal || 0),
      0
    );

    return [
      {
        stock_available: products.data.length,
        transaction_total: transactions.data.length,
        turnover_transaction: turnoverTotal,
        turnover_transaction_today: turnoverToday,
        turnover_transaction_before: turnoverYesterday,
        transaction_today: todayTransactions.length,
        transaction_before: yesterdayTransactions.length,
        imported_stock_total: importedStock.data.length,
        product_discount: discounts.data.length,
      },
    ];
  } catch (err) {
    console.error(err);
    throw new Error("Products could not be loaded");
  }
};
