// app/tansaksi/page.js
"use client";
import { useEffect, useState } from "react";
import SearchProductListTransaction from "../components/SearchProductListTransaction";
import TransactionList from "../components/TransactionList";
import { getTransactionNumber } from "../lib/data-service";

export default function Page() {
  const [trNo, setTrNo] = useState("");

  useEffect(() => {
    getTransactionNumber().then((data) => {
      if (data.length === 0) {
        // Tidak ada transaksi sebelumnya
        setTrNo("TR-001");
      } else {
        // Ada transaksi sebelumnya
        const [{ transaction_number }] = data;
        const currentNumber = parseInt(transaction_number.split("-")[1]);
        const nextNumber = String(currentNumber + 1).padStart(3, "0");
        setTrNo(`TR-${nextNumber}`);
      }
    });
  }, []);
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex flex-col lg:flex-row md:flex-row md:gap-1 lg:gap-4">
        <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 dark:drop-shadow-white rounded-xl drop-shadow-md lg:p-4 md:p-2">
          <SearchProductListTransaction />
        </div>
        <div className="w-full lg:w-1/2 bg-white rounded-xl drop-shadow-md lg:p-4 md:p-2 dark:bg-gray-900 dark:drop-shadow-white">
          {/* Kirim prop agar di-clear di TransactionList */}
          <div className="flex flex-col dark:bg-gray-900  ">
            <header className="mb-4">
              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                {trNo}
              </h2>
            </header>
            <div className="grid grid-cols-8 gap-1 text-xs items-center border border-gray-200 rounded-md p-1 shadow-sm bg-white dark:bg-gray-900 dark:text-white ">
              <div className="col-span-2 ps-10">Nama</div>
              <div className="col-start-3 text-center">Harga</div>
              <div className="col-start-4 text-center">Diskon</div>
              <div className="col-start-5 text-center">Qty</div>
              <div className=" col-span-2 text-right">Total</div>
            </div>
            <TransactionList trNo={trNo} resetOnLoad />
          </div>
        </div>
      </div>
    </div>
  );
}
