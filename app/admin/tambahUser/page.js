// app/admin/tambahUser/page.js
"use client";

import BackButton from "@/app/components/BackButton";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("kasir");

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/tambah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil Menambahkan",
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => router.push("/admin"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Menambahkan",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Tambah user error:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="p-4 mx-[150px]">
      <div className="bg-white border rounded-lg shadow relative dark:bg-gray-900 dark:text-white">
        <BackButton className="m-1" />
        <div className="flex items-start justify-between p-2 rounded-t">
          <h3 className="text-xl font-semibold">Tambah User</h3>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleAddUser}>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Nama User
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                  placeholder="Conto: Jukix..."
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                  placeholder="Contoh: juki@gmail.com.."
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                  placeholder="Contoh: juki1234..."
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Role
                </label>
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5 dark:bg-gray-900 dark:text-white"
                >
                  <option value="kasir">Kasir</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="mt-6 text-center p-6 rounded-b">
              <button
                className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-black"
                type="submit"
              >
                Tambah User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
