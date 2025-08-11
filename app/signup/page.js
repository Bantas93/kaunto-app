// app/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Head from "next/head";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("kasir");

  const [isSubmit, setIsSbumit] = useState(false);
  const handleSignup = async (e) => {
    e.preventDefault();

    if (isSubmit) return;

    setIsSbumit(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const result = await res.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil Daftar",
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => router.push("/"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Daftar",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Silakan coba lagi.",
      });
    } finally {
      setIsSbumit(false);
    }
  };

  return (
    <>
      <Head>
        <title>Daftar | Aplikasi Kasir</title>
        <meta
          name="description"
          content="Buat akun baru untuk mulai menggunakan aplikasi kasir."
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white">
        <div className="bg-white drop-shadow-md rounded-lg p-8 w-full max-w-md dark:bg-gray-900 dark:drop-shadow-white">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-700 dark:text-white">
            Daftar Akun Baru
          </h1>

          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Masukkan username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              required
            />
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              required
            />
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 dark:bg-gray-900"
              required
            >
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={isSubmit}
              className={`w-full py-2 rounded-md transition ${
                isSubmit
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isSubmit ? "Mendaftar..." : "Daftar"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Sudah punya akun?{" "}
            <button
              onClick={() => router.push("/")}
              className="text-blue-500 hover:cursor-pointer dark:text-yellow-600"
            >
              Login di sini
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
