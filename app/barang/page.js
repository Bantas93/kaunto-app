// app/barang/page.js
"use client";
import BackButton from "../components/BackButton";
import ProductTableWrapper from "../components/ProductTableWrapper";
import Link from "next/link";
import { useProducts } from "../context/ProductContext";
import { useState } from "react";

export default function Page() {
  const [keyword, setKeyword] = useState("");
  const { items } = useProducts();
  return (
    <main className="p-4 max-w-7xl mx-auto dark:text-white">
      <BackButton />
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold">Daftar Produk</h1>
      </header>

      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
          {/* Kiri: Tombol + Input */}
          <div className="flex items-center gap-2">
            <Link
              href="/barang/tambahBarang"
              className="px-4 py-2 text-sm border rounded hover:bg-gray-500 hover:text-white transition-all"
            >
              Tambah Produk
            </Link>
            <input
              type="text"
              placeholder="Cari produk..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              id="cari_produk"
            />
          </div>

          {/* Kanan: Jumlah Qty */}
          <div className="text-sm text-right">
            Total produk : {items.length}
          </div>
        </div>

        <div className="rounded">
          <ProductTableWrapper keyword={keyword} />
        </div>
      </section>
    </main>
  );
}
