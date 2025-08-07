// app/admin/page.js
"use client";
import React, { useEffect, useState } from "react";
import { getAllUsers } from "../lib/data-service";
import Link from "next/link";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { formatDateTime } from "../utils/formatDate";
import BackButton from "../components/BackButton";
import Swal from "sweetalert2";

const Page = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.log(err);
        throw new Error("Gagal mengambildata", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto dark:bg-gray-900 dark:text-white">
      <BackButton />
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold">Data User</h1>
      </header>
      <div className="mb-4">
        <Link
          href="/admin/tambahUser"
          className="inline-block px-4 py-2 text-sm border rounded hover:bg-gray-500 hover:text-white transition-all"
        >
          Tambah User
        </Link>
      </div>

      <div className="overflow-auto border border-gray-300 rounded">
        <table className="min-w-[700px] table-auto border-collapse border border-gray-400 text-sm">
          <thead>
            <tr className="uppercase bg-gray-100 dark:bg-gray-900">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Created Date</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Tidak ada data users.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.user_id}>
                  <td className="border px-4 py-2 uppercase">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2 uppercase">{user.role}</td>
                  <td className="border px-4 py-2">
                    {formatDateTime(user.created_at)}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <div className="flex justify-center items-center">
                      <form
                        action="/api/admin/delete"
                        method="POST"
                        className="inline"
                        onSubmit={async (e) => {
                          e.preventDefault(); // cegah submit default

                          const result = await Swal.fire({
                            title: `Hapus ${user.name}?`,
                            text: "Data yang dihapus tidak bisa dikembalikan!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#3085d6",
                            confirmButtonText: "Ya, hapus!",
                            cancelButtonText: "Batal",
                          });

                          if (result.isConfirmed) {
                            e.target.submit(); // lanjut submit form
                          }
                        }}
                        title="Hapus"
                      >
                        <input
                          type="hidden"
                          name="user_id"
                          value={user.user_id}
                        />
                        <button
                          type="submit"
                          className="bg-red-500 hover:bg-red-600 p-1 rounded text-white"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
