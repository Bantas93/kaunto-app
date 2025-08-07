// app/dashboard/page.js
"use client";

import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  CubeTransparentIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";
import { useProducts } from "../context/ProductContext";
import DateTimeDisplay from "../components/DateTimeDisplay";

export default function DashboardPage() {
  const { stats } = useProducts();

  const cards = [
    {
      title: "Total Produk Tersedia",
      icon: <CubeIcon className="w-5 h-5 mr-2" />,
      value: stats?.stock_available || 0,
      link: "/barang",
      linkLabel: "Tabel Produk",
    },
    {
      title: "Total Barang Masuk",
      icon: <TruckIcon className="w-5 h-5 mr-2" />,
      value: stats?.imported_stock_total || 0,
      link: "/barang/stock-history",
      linkLabel: "Tabel Laporan",
    },
    {
      title: "Produk Diskon",
      icon: <CubeTransparentIcon className="w-5 h-5 mr-2" />,
      value: stats?.product_discount || 0,
      link: "/diskon",
      linkLabel: "Tabel Diskon",
    },
    {
      title: "Total Omset",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: stats?.turnover_transaction || 0,
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
    },
    {
      title: "Omset Hari Ini",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: stats?.turnover_transaction_today || 0,
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
    },
    {
      title: "Omset Kemarin",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: stats?.turnover_transaction_before || 0,
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
    },
    {
      title: "Total Transaksi",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: stats?.transaction_total || 0,
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
    },
    {
      title: "Transaksi Hari Ini",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: stats?.transaction_today || 0,
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
    },
    {
      title: "Transaksi Kemarin",
      icon: <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />,
      value: stats?.transaction_before || 0,
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
    },
  ];
  if (!stats) {
    return (
      <div className="p-6">
        <LoadingSpinner params="Mengambil data dashboard ..." />
      </div>
    );
  }

  const categories = [
    { title: "Statistik Omset", cards: cards.slice(3, 6) },
    { title: "Statistik Transaksi", cards: cards.slice(6, 9) },
    { title: "Statistik Produk", cards: cards.slice(0, 3) },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900 dark:text-white">
      <div className="grid grid-cols-7">
        <div className="col-start-6 col-span-2 text-right">
          <DateTimeDisplay />
        </div>
      </div>

      {categories.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">
            {group.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {group.cards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg drop-shadow-md border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-yellow-600"
              >
                <div className="bg-gray-600 text-white p-3 flex items-center dark:bg-yellow-600 dark:text-black">
                  {card.icon}
                  <span className="font-medium">{card.title}</span>
                </div>
                <div className="text-center py-6 text-3xl text-gray-600 font-bold dark:text-white">
                  {card.value}
                </div>
                <div className="bg-gray-50 p-3 border-t text-sm text-gray-600 text-center hover:underline dark:bg-gray-900 dark:text-white dark:border-yellow-600">
                  <Link href={card.link}>{card.linkLabel} &raquo;</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
