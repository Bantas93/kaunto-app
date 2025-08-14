// app/components/ProductTableWrapper.js
"use client";
import {
  ArchiveBoxIcon,
  PencilSquareIcon,
  ReceiptPercentIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import { motion } from "framer-motion";
import "jspdf-autotable";
import Link from "next/link";
import Swal from "sweetalert2";
import { useProducts } from "../context/ProductContext";
import ExportButtons from "./ExportButton";
import LoadingSpinner from "./LoadingSpinner";
import { useMemo } from "react";

export default function ProductTableWrapper({ keyword }) {
  const { items, isLoading, refreshProducts } = useProducts();
  // const minimumStock = 10;
  const filteredItems = useMemo(
    () =>
      Array.isArray(items)
        ? items.filter((product) =>
            product.name.toLowerCase().includes(keyword.toLowerCase())
          )
        : [],
    [items, keyword]
  );

  const handleDelete = async (product) => {
    Swal.fire({
      title: `Hapus ${product.name}?`,
      text: "Kamu tidak dapat mengembalikannya!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Tidak",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch("/api/product/delete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product_id: product.product_id }),
          });

          const result = await res.json();
          if (!res.ok || !result.success) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: result.message,
            });
          }
          Swal.fire({
            title: "Berhasil!",
            text: "Produk telah terhapus!",
            icon: "success",
          });
          refreshProducts();
        } catch (error) {
          console.error("Error hapus produk:", error);
        }
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <ExportButtons
        data={items.map((p) => ({
          Nama: p.name,
          Sku: p.sku,
          Deskripsi: p.description,
          Stok: p.stock,
          Gambar: p.image,
          Harga: p.price,
        }))}
        filename="Data Produk"
        columns={["Gambar", "Nama", "Sku", "Harga", "Stok", "Deskripsi"]}
      />
      <div className="overflow-auto min-h-[500px]">
        <table className="min-w-[700px] table-fixed border-collapse border border-gray-400 text-sm">
          <thead>
            <tr className="uppercase bg-gray-100 dark:bg-gray-900">
              <th className="border px-4 py-2">Nama</th>
              <th className="border px-4 py-2">SKU</th>
              <th className="border px-4 py-2">Gambar</th>
              <th className="border px-4 py-2">Harga</th>
              <th className="border px-4 py-2">Stok</th>
              <th className="border px-4 py-2">Deskripsi</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  {<LoadingSpinner params="Mengambil data produk..." />}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center px-4 py-2 p text-gray-500"
                >
                  Tidak ada data produk.
                </td>
              </tr>
            ) : (
              filteredItems.map((product) => (
                <tr key={product.product_id}>
                  <td className="border px-4 py-2 uppercase">{product.name}</td>
                  <td className="border px-4 py-2">{product.sku}</td>
                  <td className="border px-4 py-2">
                    {!product.image ? (
                      <p className="text-center">tidak ada</p>
                    ) : (
                      <img
                        src={product.image || null} // base64 inline image
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover border border-gray-500 rounded"
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.price}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {product.stock}
                  </td>

                  {/* <td className="relative text-center border font-semibold">
                    {product.stock}
                    <div className="absolute top-0 right-1 z-10">
                      {product.stock === 0 ? (
                        <span className="bg-red-500 text-white text-xs px-2 rounded-full font-semibold">
                          ⚠️ Habis
                        </span>
                      ) : product.stock <= minimumStock ? (
                        <span className="bg-yellow-500 text-white text-xs px-2 rounded-full font-semibold">
                          ⚠️ Hampir habis
                        </span>
                      ) : null}
                    </div>
                  </td> */}

                  <td className="border px-4 py-2">{product.description}</td>
                  <td className="border px-2 py-2 text-center">
                    <div className="grid grid-cols-2 gap-2 justify-center items-center">
                      <Link
                        href={{
                          pathname: "/barang/tambahBarang",
                          query: { id: product.product_id },
                        }}
                        title="Edit"
                        className="bg-blue-500 hover:bg-blue-600 p-1 rounded text-white"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(product)}
                        className="bg-red-500 hover:bg-red-600 p-1 rounded text-white"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      <Link
                        href={{
                          pathname: "/barang/stock-history",
                          query: { id: product.product_id, name: product.name },
                        }}
                        title="Stok Histori"
                        className="bg-gray-300 hover:bg-gray-400 p-1 rounded text-gray-800"
                      >
                        <ArchiveBoxIcon className="w-4 h-4" />
                      </Link>

                      <Link
                        href={{
                          pathname: "/transaksi/transaction-history",
                          query: { id: product.product_id, name: product.name },
                        }}
                        title="Transaksi Histori"
                        className="bg-yellow-500 hover:bg-gray-400 p-1 rounded text-gray-800"
                      >
                        <ReceiptPercentIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
