// app/diskon/page.js
"use client";
import { TrashIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Link from "next/link";
import Swal from "sweetalert2";
import BackButton from "../components/BackButton";
import ExportButtons from "../components/ExportButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { useDiscount } from "../context/DiscountContext";
import { formatDateTime } from "../utils/formatDate";

const Page = () => {
  const { items, isLoading, refreshProductDiscount } = useDiscount();

  const handleDelete = async (item) => {
    const confirm = await Swal.fire({
      title: `Hapus diskon ${item.name}?`,
      text: "Kamu tidak dapat mengembalikannya!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Tidak",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/diskon/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: item.product_id }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        return Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.message,
        });
      }

      await Swal.fire({
        title: "Berhasil!",
        text: "Produk diskon telah terhapus!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      refreshProductDiscount();
    } catch (error) {
      console.error("Error hapus produk diskon:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menghapus data", "error");
    }
  };

  return (
    <main className="p-4 max-w-7xl mx-auto dark:bg-gray-900 dark:text-white">
      <BackButton />
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
          Data Diskon
        </h1>
      </header>

      <div className="my-1">
        <Link
          href="/diskon/tambahDiskon"
          className="inline-block px-4 py-2 text-sm border rounded hover:bg-gray-500 hover:text-white transition-all"
        >
          Tambah Data
        </Link>
      </div>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="overflow-auto ">
          <ExportButtons
            data={items.map((p) => ({
              Sku: p.sku,
              Nama: p.name,
              Mulai: formatDateTime(p.start_date),
              Selesai: formatDateTime(p.end_date),
              Diskon: p.discount_amount,
              Harga: p.price,
            }))}
            columns={["Sku", "Nama", "Mulai", "Selesai", "Diskon", "Harga"]}
            filename="Data Diskon"
          />
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-semibold dark:bg-gray-900 dark:text-white">
              <tr>
                <th className="border px-4 py-2">SKU </th>
                <th className="border px-4 py-2">Produk</th>
                <th className="border px-4 py-2">Mulai</th>
                <th className="border px-4 py-2">Akhir</th>
                <th className="border px-4 py-2">Jumlah diskon</th>
                <th className="border px-4 py-2">Harga original</th>
                <th className="border px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="border text-center py-4 text-gray-500"
                  >
                    {<LoadingSpinner params="Mengambil data diskon..." />}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="border text-center py-4 text-gray-500"
                  >
                    Tidak ada data diskon.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr className="text-center text-sm" key={item.product_id}>
                    <td className="border px-4 py-2">{item.sku}</td>
                    <td className="border px-4 py-2 uppercase">{item.name}</td>
                    <td className="border px-4 py-2">
                      {formatDateTime(item.start_date)}
                    </td>
                    <td className="border px-4 py-2">
                      {formatDateTime(item.end_date)}
                    </td>
                    <td className="border px-4 py-2">{item.discount_amount}</td>
                    <td className="border px-4 py-2">{item.price}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-red-500 hover:bg-red-600 p-1 rounded text-white"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </main>
  );
};

export default Page;
