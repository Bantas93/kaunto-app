// app/barang/tambaBarang/page.js
"use client";

import BackButton from "@/app/components/BackButton";
import randomSku from "@/app/components/RandomSku";
import { useProducts } from "@/app/context/ProductContext";
import { getProductById } from "@/app/lib/data-service";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { refreshProducts } = useProducts();
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const data = await getProductById(id);
          setFormData({
            name: data.name,
            sku: data.sku,
            price: data.price,
            stock: data.stock,
            description: data.description,
            image: null,
          });
        } catch (err) {
          console.log(err);
          throw new Error("Gagal ambil detail produk", err);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Validasi input wajib
    if (!formData.name || !formData.sku || !formData.price || !formData.stock) {
      Swal.fire("Peringatan", "Harap lengkapi semua field wajib", "warning");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("sku", formData.sku);
    form.append("price", formData.price);
    form.append("stock", formData.stock);
    form.append("description", formData.description);

    // Hanya tambahkan gambar jika ada
    if (formData.image) {
      form.append("image", formData.image);
    }

    // Tambahkan ID jika edit
    if (id) {
      form.append("product_id", id);
    }

    const endpoint = id ? "/api/product/edit" : "/api/product";

    try {
      let res = await fetch(endpoint, {
        method: "POST",
        body: form,
      });

      let result = await res.json();

      // Konfirmasi jika produk sudah ada
      if (result.confirmUpdate) {
        const confirm = await Swal.fire({
          title: "Produk Sudah Ada",
          text: result.message,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya, update",
          cancelButtonText: "Batal",
        });

        if (confirm.isConfirmed) {
          form.append("forceUpdate", "true");
          res = await fetch(endpoint, {
            method: "POST",
            body: form,
          });
          result = await res.json();
        } else {
          return;
        }
      }

      // Konfirmasi jika tidak ada gambar
      if (result.confirmWithoutImage) {
        const confirm = await Swal.fire({
          title: "Tanpa Gambar?",
          text: result.message,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ya, lanjutkan",
          cancelButtonText: "Batal",
        });

        if (confirm.isConfirmed) {
          form.append("allowWithoutImage", "true");
          res = await fetch(endpoint, {
            method: "POST",
            body: form,
          });
          result = await res.json();
        } else {
          return;
        }
      }

      // Sukses
      if (result.success) {
        Swal.fire("Sukses", result.message, "success").then(() => {
          refreshProducts();
          router.push("/barang");
        });
      } else {
        Swal.fire("Gagal", result.message, "error");
      }
    } catch (err) {
      Swal.fire("Error", "Terjadi kesalahan pada server.", "error");
      console.error(err);
    }
  };

  return (
    <div className="p-4 mx-[150px]">
      <div className="bg-white border rounded-lg shadow relative dark:bg-gray-900 dark:text-white">
        <BackButton className="m-1" />
        <div className="flex items-start justify-between p-2 rounded-t">
          <h3 className="text-xl font-semibold">
            {id ? "Edit produk" : "Tambah produk"}
          </h3>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleAddProduct}>
            <div className="grid grid-cols-6 gap-6">
              {id ? (
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="sku"
                    className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                  >
                    Sku
                  </label>
                  <input
                    disabled
                    type="text"
                    name="sku"
                    value={formData.sku}
                    // onChange={handleChange}
                    id="sku"
                    className="shadow-sm bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                    placeholder="SKU-123xxx...."
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        sku: randomSku(),
                      }))
                    }
                    className="border bg-gray-200 px-3 py-1 rounded text-sm w-fit dark:bg-yellow-600 dark:text-black dark:border-yellow-600 hover:cursor-pointer"
                    hidden
                  >
                    Random SKU
                  </button>
                </div>
              ) : (
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="sku"
                    className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                  >
                    Sku
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    id="sku"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                    placeholder="SKU-123xxx...."
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        sku: randomSku(),
                      }))
                    }
                    className="border bg-gray-200 px-3 py-1 rounded text-sm w-fit dark:bg-yellow-600 dark:text-black dark:border-yellow-600 hover:cursor-pointer"
                  >
                    Random SKU
                  </button>
                </div>
              )}

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Nama produk
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  id="name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                  placeholder="Contoh: Ayam penyet..."
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Harga
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  id="price"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                  placeholder="Contoh: 1000xxx"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="stock"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Stok
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  id="stock"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                  placeholder="Contoh: 50xxx..."
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="image"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Gambar
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  id="image"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover border rounded"
                  />
                )}
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-900 block mb-2 dark:text-white"
                >
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4 dark:bg-gray-900 dark:text-white"
                  placeholder="Contoh: Dengan tepung panir..."
                />
              </div>
            </div>
            <div className="text-center p-6 border-t border-gray-200 rounded-b">
              <button
                className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:text-black dark:hover:bg-yellow-700"
                type="submit"
              >
                {id ? "Simpan Perubahan" : "Tambah Produk"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
