// app/lib/data-service.js
"use server";

import db from "./db";
import { supabase } from "./supabase";

export const getProducts = async function () {
  try {
    const [rows] = await db.query(`
      SELECT 
      p.*,
      pi.image,
      pd.discount_amount, 
      pd.original_price
      FROM products p
      LEFT JOIN product_image pi
      ON pi.product_id = p.product_id
      LEFT JOIN product_discount pd 
      ON pd.product_id = p.product_id 
      ORDER BY p.name
        `);
    // AND NOW() BETWEEN pd.start_date AND pd.end_date
    return rows.map((row) => {
      let image = null;
      if (row.image) {
        const base64 = Buffer.from(row.image).toString("base64");
        image = `data:image/jpeg;base64,${base64}`;
      }
      return {
        ...row,
        image,
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

    const query = `
      INSERT INTO products (name, sku, price, stock, description, created_date, updated_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      product.name,
      product.sku,
      product.price,
      product.stock,
      product.description || null,
      created_date,
      updated_date,
    ];

    const [result] = await db.query(query, values);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Product could not be created");
  }
};

export const updateProduct = async function (formData) {
  const product = {
    product_id: Number(formData.get("product_id")),
    name: formData.get("name"),
    sku: formData.get("sku"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    description: formData.get("description") || null,
  };

  return product;
};

export async function getProductById(product_id) {
  const id = parseInt(product_id);
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE product_id = ? LIMIT 1",
      [id]
    );

    if (!rows || rows.length === 0) {
      console.error("Produk tidak ditemukan.");
      return null;
    }
    // console.log(rows);
    return rows[0];
  } catch (error) {
    console.error("Gagal mengambil data produk:", error.message);
    return null;
  }
}

// export const getUsers = async function () {
//   try {
//     const [rows] = await db.query(
//       `SELECT user_id, name, email, password, role,created_at
//          FROM users
//          ORDER BY name`
//     );
//     return rows;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Users could not be loaded");
//   }
// };

// SUPABASE
export const getUsers = async function () {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("user_id, name, email, password, role, created_at")
      .order("name", { ascending: true });

    if (error) {
      console.error(error);
      throw new Error("Users could not be loaded");
    }

    return data; // data = array of users
  } catch (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }
};

export const getAllStockHistory = async function () {
  try {
    const query = `
      WITH stock_flow AS (
      SELECT 
      pr.product_id,
      pr.name AS produk,
      pr.sku,
      ish.imported_date AS tanggal,
      'IMPORT' AS flag,
      ish.total_imported AS qty
      FROM kaunto.imported_stock_history ish
      LEFT JOIN products pr ON ish.product_id = pr.product_id

      UNION ALL

      SELECT 
      pr.product_id,
      pr.name AS produk,
      pr.sku,
      tr.created_date AS tanggal,
      'SALES' AS flag,
      -td.quantity AS qty  -- sales are negative
      FROM kaunto.transaction_detail td
      LEFT JOIN transactions tr ON td.transaction_id = tr.transaction_id
      LEFT JOIN products pr ON td.product_id = pr.product_id
      )

      SELECT 
      product_id,
      produk,
      sku,
      tanggal,
      flag,
      qty AS subTotal,
      SUM(qty) OVER (PARTITION BY product_id ORDER BY tanggal) AS totalStock
      FROM stock_flow
      ORDER BY product_id, tanggal;

    `;

    const [rows] = await db.query(query);
    // console.log(rows);
    return rows;
  } catch (error) {
    console.error("Gagal mengambil semua riwayat stok:", error.message);
    throw new Error("Stock history tidak dapat dimuat");
  }
};

export const getStockHistoryByProductId = async function (productId) {
  try {
    const [rows] = await db.query(
      `
      SELECT 
      pr.product_id, 
      pr.name AS namaProduk,
      pr.sku AS sku,
      ish.imported_date AS tanggal,
      'IMPORT' AS flag,
      ish.total_imported AS subTotal,
      pr.stock AS totalStok
      FROM kaunto.imported_stock_history AS ish
      LEFT JOIN products AS pr ON ish.product_id = pr.product_id
      WHERE pr.product_id = ?

      UNION

      SELECT 
      td.product_id, 
      pr.name AS namaProduk,
      pr.sku AS sku, 
      tr.created_date AS tanggal,
      'SALES' AS flag,
      td.quantity AS subTotal,
      pr.stock AS totalStok
      FROM kaunto.transaction_detail AS td
      LEFT JOIN transactions AS tr ON td.transaction_id = tr.transaction_id 
      LEFT JOIN products AS pr ON td.product_id = pr.product_id
      WHERE pr.product_id = ?
      ORDER BY tanggal DESC
      `,
      [productId, productId]
    );

    return rows;
  } catch (error) {
    console.error("Gagal mengambil riwayat stok:", error.message);
    throw new Error("Stock history tidak dapat dimuat");
  }
};

export const getAllTransactionHistory = async function () {
  try {
    const query = `
    SELECT td.transaction_detail_id ,
    tr.created_date as "tanggal",
    tr.transaction_number as "transaction_number",
    pr.name as "produk", 
    us.name as "user",
    us.role as "role",
    td.quantity as "quantity",
    tr.payment_method as "metode",
    td.price_per_item as "pricePerItem",
    td.subtotal as "total"
    FROM kaunto.transaction_detail as td
    left join products as pr on td.product_id = pr.product_id
    left join transactions as tr on tr.transaction_id = td.transaction_id
    left join users as us on us.user_id = tr.user_id
    ORDER BY tanggal DESC
    `;

    const [rows] = await db.query(query);
    // console.log(rows);
    return rows;
  } catch (error) {
    console.error("Gagal mengambil semua riwayat transaksi:", error.message);
    throw new Error("Transaksi history tidak dapat dimuat");
  }
};

export const getTransactionHistoryById = async function (productId) {
  try {
    const [rows] = await db.query(
      `
    SELECT td.transaction_detail_id,
    tr.created_date as "tanggal",
    pr.name as "produk",
    pr.product_id as "productId",
    us.name as "user",
    us.role as "role",
    td.quantity as "quantity",
    tr.payment_method as "metode",
    td.price_per_item as "pricePerItem",
    td.subtotal as "total"
    FROM kaunto.transaction_detail as td
    LEFT JOIN products as pr ON td.product_id = pr.product_id
    LEFT JOIN transactions as tr ON tr.transaction_id = td.transaction_id
    LEFT JOIN users as us ON us.user_id = tr.user_id
    WHERE td.product_id = ?
    ORDER BY tr.created_date DESC
      `,
      [productId]
    );
    // console.log(rows);
    return rows;
  } catch (error) {
    console.error("Gagal mengambil riwayat stok:", error.message);
    throw new Error("Stock history tidak dapat dimuat");
  }
};

export const getTransactionNumber = async () => {
  try {
    const [rows] = await db.query(
      `SELECT transaction_number FROM transactions ORDER BY transaction_id DESC LIMIT 1`
    );
    return rows;
  } catch (error) {
    console.error("Gagal mengambil riwayat stok:", error.message);
    throw new Error("Stock history tidak dapat dimuat");
  }
};

export async function saveTransaction(payload) {
  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const {
      transaction_number,
      total_amount,
      payment_method,
      user_id,
      tax,
      items,
    } = payload;

    // 1. Simpan ke tabel `transactions`
    const [transResult] = await conn.query(
      `
        INSERT INTO transactions 
        (user_id, total_amount, tax, payment_method, created_date, transaction_number)
        VALUES (?, ?, ?, ?, NOW(), ?)
      `,
      [user_id, total_amount, tax, payment_method, transaction_number]
    );

    const transactionId = transResult.insertId;

    // 2. Simpan detail transaksi
    for (const item of items) {
      const subtotal = item.price * item.quantity;

      await conn.query(
        `
          INSERT INTO transaction_detail 
          (transaction_id, product_id, quantity, price_per_item, subtotal)
          VALUES (?, ?, ?, ?, ?)
        `,
        [transactionId, item.product_id, item.quantity, item.price, subtotal]
      );

      // Kurangi stok produk
      await conn.query(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE product_id = ?
      `,
        [item.quantity, item.product_id]
      );
    }

    await conn.commit();

    // Ambil created_date dari transaksi yang baru disimpan
    const [createdDateRows] = await conn.query(
      `
    SELECT created_date FROM transactions WHERE transaction_id = ?
    `,
      [transactionId]
    );
    const createdDate = createdDateRows[0]?.created_date;

    conn.release();

    return { success: true, transactionId, createdDate };
  } catch (error) {
    await conn.rollback();
    conn.release();
    console.error("saveTransaction error:", error);
    return { success: false, error };
  }
}

export const getProductsOption = async function () {
  try {
    const [rows] = await db.query(`
    SELECT
    p.product_id,
    p.name,
    p.sku,
    p.price,
    pd.discount_amount,
    pd.original_price,
    pd.start_date,
    pd.end_date,
    p.stock,
    p.description
    FROM products as p
    LEFT JOIN product_discount pd
    ON p.product_id = pd.product_id
    ORDER BY p.name
      `);
    // AND NOW() BETWEEN pd.start_date AND pd.end_date
    return rows;
  } catch (error) {
    console.error("Gagal mengambil produk dengan diskon:", error.message);
    throw new Error("Produk diskon tidak dapat dimuat");
  }
};
export const getProductsWithDiscount = async function () {
  try {
    const [rows] = await db.query(`
    SELECT
    p.product_id,
    p.name,
    p.sku,
    p.price,
    pd.discount_amount,
    pd.original_price,
    pd.start_date,
    pd.end_date
    FROM product_discount pd
    LEFT JOIN products as p
    ON p.product_id = pd.product_id
    ORDER BY p.name
      `);
    // AND NOW() BETWEEN pd.start_date AND pd.end_date
    return rows;
  } catch (error) {
    console.error("Gagal mengambil produk dengan diskon:", error.message);
    throw new Error("Produk diskon tidak dapat dimuat");
  }
};

export const addProductDiscount = async function (payload) {
  try {
    const query = `
    INSERT INTO product_discount (product_id, start_date, end_date, discount_amount, original_price)
    VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      payload.product_id,
      payload.start_date,
      payload.end_date,
      payload.discount_amount,
      payload.original_price,
    ];
    const [result] = await db.query(query, values);
    return result;
  } catch (error) {
    console.error("Gagal menambahkan diskon:", error.message);
    throw new Error("Diskon gagal disimpan");
  }
};

export const getAllData = async () => {
  try {
    const [rows] = await db.query(
      `
    SELECT
    (SELECT COUNT(*) FROM products) AS stock_available,
    (SELECT COUNT(*) FROM transactions) AS transaction_total,
    (SELECT SUM(subtotal) FROM transaction_detail) AS turnover_transaction,
    (SELECT SUM(td.subtotal) 
    FROM transactions AS tr 
    LEFT JOIN transaction_detail AS td ON td.transaction_id = tr.transaction_id 
    WHERE tr.created_date >= CURDATE() AND tr.created_date <= NOW()) AS turnover_transaction_today,
    (SELECT SUM(td.subtotal) 
    FROM transactions AS tr 
    LEFT JOIN transaction_detail AS td ON td.transaction_id = tr.transaction_id 
    WHERE tr.created_date >= CURDATE() - INTERVAL 1 DAY AND tr.created_date < CURDATE()) AS turnover_transaction_before,
    (SELECT COUNT(DISTINCT product_id) FROM imported_stock_history) AS imported_stock_total,
    (SELECT COUNT(*) FROM product_discount) AS product_discount,
    (SELECT COUNT(*) FROM transactions WHERE created_date >= CURDATE() AND created_date <= NOW()) AS transaction_today,
    (SELECT COUNT(*) FROM transactions 
    WHERE created_date >= CURDATE() - INTERVAL 1 DAY AND created_date < CURDATE()) AS transaction_before;

    `
    );
    return rows;
  } catch (err) {
    console.error(err);
    throw new Error("Products could not be loaded");
  }
};

export const getAllUsers = async () => {
  try {
    const [rows] = await db.query(`SELECT * FROM users`);
    return rows;
  } catch (err) {
    console.log(err);
    throw new Error("Gagal ambil data user", err);
  }
};

export const deleteUser = async (user_id) => {
  try {
    const query = `
      DELETE FROM users
      WHERE user_id = ?
    `;

    const [result] = await db.query(query, [user_id]);

    if (result.affectedRows === 0) {
      throw new Error("Product not found or already deleted");
    }

    return { message: "User deleted successfully" };
  } catch (err) {
    throw new Error("Gagal menghapus user", err);
  }
};
