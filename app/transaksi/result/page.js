// app/transaksi/result/page.js
"use client";

import BackButton from "@/app/components/BackButton";
import { useTransaction } from "@/app/context/TransactionContext";

export default function Page() {
  const { finalTransaction } = useTransaction();

  if (!finalTransaction) {
    return <p className="p-4 text-gray-500">Tidak ada transaksi.</p>;
  }

  const handlePrint = () => {
    window.print();
  };

  const created = new Date(finalTransaction.createdDate);
  const tanggal = created.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const jam = created.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const subTotal = finalTransaction.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.1;
  const tax = subTotal * taxRate;
  const total = Math.round(subTotal) + Math.round(tax);

  const totalDiscount = finalTransaction.items.reduce((acc, item) => {
    if (item.original_price && item.original_price > item.price) {
      return acc + (item.original_price - item.price) * item.quantity;
    }
    return acc;
  }, 0);

  return (
    <div className="p-4">
      <div className="text-center p-4 print:hidden">
        <BackButton className="mb-4" />
      </div>

      <div className="flex justify-center print:block">
        <div
          id="struk-print"
          className="bg-white shadow p-4 max-w-sm w-full font-mono text-sm border border-gray-300 print:border-none print:shadow-none"
        >
          <h2 className="text-center font-bold text-lg mb-1">K-App</h2>
          <p className="text-center text-xs mb-1">Jl. Ciledug Raya</p>
          <p className="text-center text-xs mb-2">{finalTransaction.trNo}</p>
          <p className="text-center text-xs font-semibold mb-2">
            ## Struk Pembelian ##
          </p>

          <hr className="border-dashed border-t my-2" />

          <div className="text-xs mb-2">
            <div className="flex justify-between">
              <span>{tanggal}</span>
              <span>{finalTransaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>{jam}</span>
              <span>Kasir: {finalTransaction.name || "Kasir"}</span>
            </div>
          </div>

          <hr className="border-dashed border-t my-2" />

          <ul className="space-y-1 mb-2">
            {finalTransaction.items.map((item, index) => {
              const hasDiscount =
                item.original_price && item.original_price > item.price;
              const discount = hasDiscount
                ? (item.original_price - item.price) * item.quantity
                : 0;

              return (
                <li key={index}>
                  <div className="flex justify-between font-semibold">
                    <span>{item.name}</span>
                    <span>
                      Rp.{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.quantity} x Rp.{item.price.toLocaleString()}
                  </div>
                  {hasDiscount && (
                    <div className="text-xs italic">
                      Diskon: Rp.{discount.toLocaleString()}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <span>Total Diskon</span>
              <span>Rp.{totalDiscount.toLocaleString()}</span>
            </div>
          )}

          <hr className="border-dashed border-t my-2" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>Rp.{subTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (10%)</span>
              <span>Rp.{tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-300 pt-1">
              <span>Total</span>
              <span>Rp.{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Bayar</span>
              <span>Rp.{finalTransaction.bayar.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Kembali</span>
              <span>Rp.{finalTransaction.kembalian.toLocaleString()}</span>
            </div>
          </div>

          <hr className="border-dashed border-t my-2" />
          <p className="text-center text-xs text-gray-500">
            Link Kritik dan Saran:
            <br />
            www.K-app.com
          </p>

          <div className="mt-4 flex justify-center print:hidden gap-2">
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Cetak Struk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
