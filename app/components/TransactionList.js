//app/components/TransactionList.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import { useTransaction } from "../context/TransactionContext";

import PaymentQRCode from "./PaymentQRCode";
import PaymentSection from "./PaymentSection";
import TransactionItem from "./TransactionItem";
import TransactionPagination from "./TransactionPagination";
import { useUser } from "../context/UserContext";

export default function TransactionList({ trNo, resetOnLoad = false }) {
  const { user_id, name } = useUser();

  const router = useRouter();
  const {
    transactionList,
    productList,
    addToTransaction,
    checkStock,
    removeTransactionByName,
    removeSingleTransaction,
    setFinalTransaction,
    clearTransaction,
  } = useTransaction();

  const bayarRef = useRef();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (resetOnLoad && !clearedRef.current) {
      clearTransaction();
      clearedRef.current = true;
    }
  }, [transactionList, resetOnLoad]);

  const totalAmount = useMemo(
    () =>
      transactionList.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    [transactionList]
  );

  const taxRate = 0.1;
  const taxAmount = totalAmount * taxRate;
  const totalWithTax = totalAmount + taxAmount;

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return transactionList.slice(start, start + itemsPerPage);
  }, [transactionList, currentPage]);

  const totalPages = Math.ceil(transactionList.length / itemsPerPage);

  // Fungsi untuk validasi stock
  const validateStock = () => {
    const stockErrors = [];

    for (const transactionItem of transactionList) {
      const product = productList.find(
        (p) => p.product_id === transactionItem.product_id
      );

      if (!product) {
        stockErrors.push(`Produk ${transactionItem.name} tidak ditemukan`);
        continue;
      }

      if (product.stock < transactionItem.quantity) {
        stockErrors.push(
          `Stock ${transactionItem.name} tidak cukup. Tersedia: ${product.stock}, Diinput: ${transactionItem.quantity}`
        );
      }
    }

    return stockErrors;
  };

  const updateQuantity = (product_id, delta) => {
    const item = transactionList.find((t) => t.product_id === product_id);
    if (!item) return;

    if (delta > 0) {
      // Cek stock dulu sebelum menambah
      const stockInfo = checkStock(product_id);

      if (!stockInfo.available) {
        Swal.fire("⚠️ Stock Over Input", stockInfo.message, "warning");
        return;
      }

      // Gunakan addToTransaction tanpa alert karena sudah dicek di atas
      const success = addToTransaction(item);
      if (!success) {
        Swal.fire(
          "⚠️ Stock Tidak Mencukupi",
          `Stock ${item.name} sudah habis`,
          "warning"
        );
      }
    } else {
      removeSingleTransaction(item.product_id);
    }
  };

  const handlePayment = async (params) => {
    if (!user_id) {
      return Swal.fire(
        "❌ Error",
        "User tidak ditemukan. Silakan login ulang.",
        "error"
      );
    }

    // VALIDASI STOCK SEBELUM PEMBAYARAN
    const stockErrors = validateStock();
    if (stockErrors.length > 0) {
      return Swal.fire({
        title: "❌ Stok Kurang",
        html: stockErrors.map((error) => `• ${error}`).join("<br>"),
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    let bayar;

    if (paymentMethod === "qris") {
      bayar = params || totalWithTax;
    } else if (paymentMethod === "cash") {
      const value = bayarRef.current?.value;
      if (!value || isNaN(value)) {
        return Swal.fire(
          "❌Error",
          "Masukkan jumlah bayar yang valid!",
          "error"
        );
      }

      bayar = value;

      if (bayar < totalWithTax) {
        return Swal.fire(
          "❌ Uang tidak cukup",
          "Jumlah bayar kurang dari total + pajak.",
          "error"
        );
      }

      const confirm = await Swal.fire({
        title: "Pastikan input benar",
        text: `Total: Rp.${Math.round(
          totalWithTax
        ).toLocaleString()} (termasuk PPN) | Bayar: Rp.${bayar.toLocaleString()}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, lanjutkan",
        cancelButtonText: "Batal",
      });

      if (!confirm.isConfirmed) return;
    } else {
      return Swal.fire("❌Error", "Metode pembayaran belum dipilih!", "error");
    }

    const payload = {
      transaction_number: trNo,
      total_amount: Math.round(totalWithTax),
      payment_method: paymentMethod,
      tax: Math.round(taxAmount),
      user_id: user_id,
      items: transactionList.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Gagal menyimpan transaksi:", result.error);
        return Swal.fire("❌ Gagal", "Gagal menyimpan transaksi.", "error");
      }

      setFinalTransaction({
        trNo,
        name,
        items: transactionList,
        total: Math.round(totalWithTax),
        bayar,
        kembalian: bayar - Math.round(totalWithTax),
        paymentMethod,
        createdDate: result.createdDate,
      });

      if (paymentMethod === "qris") {
        await Swal.fire(
          "✅ QR Pembayaran Berhasil",
          "Transaksi disimpan via QR.",
          "success"
        );
      } else if (paymentMethod === "cash") {
        await Swal.fire(
          "✅ Pembayaran Tunai Berhasil",
          "Transaksi disimpan.",
          "success"
        );
      }

      router.push("/transaksi/result");
    } catch (error) {
      console.error("Error transaksi:", error);
      Swal.fire(
        "❌ Gagal",
        "Terjadi kesalahan saat menyimpan transaksi.",
        "error"
      );
    }
  };

  return (
    <section>
      {paginatedTransactions.length > 0 ? (
        <div className="space-y-2">
          {paginatedTransactions.map((item) => (
            <TransactionItem
              key={item.product_id}
              item={item}
              updateQuantity={updateQuantity}
              removeTransactionByName={removeTransactionByName}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 italic mt-4">
          Belum ada produk dipilih
        </p>
      )}

      {totalPages > 1 && (
        <TransactionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      <div className="grid grid-cols-2">
        <div className="text-gray-800">
          {transactionList.length > 0 && (
            <button
              onClick={() => {
                Swal.fire({
                  title: "Reset Transaksi?",
                  text: "Semua item akan dihapus.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Ya, reset",
                  cancelButtonText: "Batal",
                }).then((result) => {
                  if (result.isConfirmed) {
                    clearTransaction();
                  }
                });
              }}
              className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Reset Transaksi
            </button>
          )}
        </div>
        <div className="text-right text-gray-800 dark:text-white">
          <p>Sub Total : Rp.{Math.round(totalAmount).toLocaleString()}</p>
          <p>PPN 10% : Rp.{Math.round(taxAmount).toLocaleString()}</p>
        </div>
      </div>

      <div className="text-right mt-2 font-bold text-gray-800 dark:text-white">
        Jumlah yang harus dibayar :
        <span className="text-2xl px-2 py-2 border-2 rounded text-white bg-red-500 dark:bg-yellow-600 dark:text-black">
          Rp.{Math.round(totalWithTax).toLocaleString()}
        </span>
      </div>

      <PaymentSection
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />

      {paymentMethod === "qris" ? (
        <PaymentQRCode
          totalAmount={Math.round(totalWithTax)}
          handlePayment={handlePayment}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2 mt-6 dark:text-white">
          <input
            ref={bayarRef}
            type="number"
            placeholder="Masukkan jumlah bayar"
            className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 dark:focus:ring-yellow-600 dark:text-white"
            id="masukkan_jumlah_bayar"
          />

          <button
            onClick={handlePayment}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 dark:bg-yellow-600 dark:text-black dark:hover:bg-yellow-700"
          >
            Bayar
          </button>
        </div>
      )}
    </section>
  );
}
