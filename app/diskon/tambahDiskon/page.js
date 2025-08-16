// app/diskon/tambahDiskon/page.js
"use client";

import { useDiscount } from "@/app/context/DiscountContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import BackButton from "../../components/BackButton";

export default function Page() {
  const router = useRouter();
  const { products, refreshProductDiscount } = useDiscount();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    discount_amount: "",
    original_price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "product_id") {
      setSelectedProductId(value);
      const selected = products.find((p) => p.product_id == value);
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          original_price: selected.price,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // === VALIDASI ===
    if (!selectedProductId) {
      Swal.fire("Validasi Gagal", "Pilih produk terlebih dahulu", "warning");
      return;
    }

    if (!formData.start_date || !formData.end_date) {
      Swal.fire(
        "Validasi Gagal",
        "Tanggal mulai dan akhir wajib diisi",
        "warning"
      );
      return;
    }

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    if (end <= start) {
      Swal.fire(
        "Validasi Gagal",
        "Tanggal akhir harus lebih besar dari tanggal mulai",
        "warning"
      );
      return;
    }

    if (!formData.discount_amount || parseInt(formData.discount_amount) <= 0) {
      Swal.fire("Validasi Gagal", "Diskon harus lebih dari 0", "warning");
      return;
    }

    if (!formData.original_price || parseInt(formData.original_price) <= 0) {
      Swal.fire("Validasi Gagal", "Harga asli harus valid", "warning");
      return;
    }

    // === SIMPAN ===
    const payload = {
      product_id: parseInt(selectedProductId),
      ...formData,
    };

    try {
      const res = await fetch("/api/diskon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire("Sukses", "Diskon berhasil ditambahkan!", "success").then(
          () => {
            refreshProductDiscount();
            router.push("/diskon");
          }
        );
      } else {
        Swal.fire("Gagal", result.message, "error");
      }
    } catch (error) {
      console.error("Gagal menyimpan:", error);
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan diskon", "error");
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="bg-white border rounded-lg shadow relative dark:bg-gray-900 dark:text-white">
        <BackButton className="m-2" />
        <div className="flex items-start justify-between p-2 rounded-t">
          <h3 className="text-xl font-semibold">Tambah Diskon</h3>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3 ">
                <label
                  htmlFor="product-id"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Nama Produk
                </label>
                <select
                  name="product_id"
                  value={selectedProductId}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="start_date"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Tanggal mulai
                </label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  id="start_date"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="end_date"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Tanggal berakhir
                </label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  id="end_date"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="discount_amount"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Jumlah Diskon
                </label>
                <input
                  type="text"
                  name="discount_amount"
                  value={formData.discount_amount}
                  onChange={handleChange}
                  id="discount_amount"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                  placeholder="Contoh: 5000"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="original_price"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Harga Original
                </label>
                <input
                  type="number"
                  name="original_price"
                  value={formData.original_price}
                  onChange={handleChange}
                  id="original_price"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                  placeholder="Harga Asli (Rp)"
                />
              </div>
            </div>
            <div className="mt-6 text-center p-6 rounded-b">
              <button
                className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:text-black dark:hover:bg-yellow-700"
                type="submit"
              >
                Tambah Diskon
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
