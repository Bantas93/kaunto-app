// app/page.js
"use client";

import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import bg from "@/public/bg.png";
import Image from "next/image";

export default function Page() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
        credentials: "include",
      });

      let result = {};
      try {
        result = await res.json();
      } catch {
        throw new Error("Respons tidak valid dari server.");
      }

      if (!res.ok) {
        throw new Error(result.message || "Gagal login.");
      }

      Swal.fire({
        icon: "success",
        title: "Login berhasil",
        text: `Selamat datang, ${result.user.name}`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/dashboard");
        router.refresh();
      });
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Login gagal",
        text: err.message || "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Login | Aplikasi Kasir</title>
        <meta
          name="description"
          content="Silakan login untuk mengakses aplikasi kasir."
        />
      </Head>

      {/* <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
            Login Aplikasi Kasir
          </h1>

          <form onSubmit={handleLogin}>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              placeholder="Masukkan username/email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // required
            />

            <div className="relative w-full">
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                // required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute px-2 border-l-[0.5px] border-gray-400  right-0 top-0 bottom-4 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Belum punya akun?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-500 hover:underline"
            >
              Daftar sekarang
            </button>
          </p>
          <p className="text-center mt-4 text-xs text-gray-600">
            Powered by{" "}
            <a
              href="https://www.instagram.com/bantassyarif/?hl=id"
              // href="https://wa.me/6287780310045?text=Halo%2C%20saya%20baru%20lihat%20aplikasimu!"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:pointer hover:text-blue-600"
            >
              Bantas Syarif HI
            </a>
          </p>
        </div>
      </div> */}

      <div className="min-h-screen flex flex-col md:flex-row">
        {/* FORM KIRI */}

        <div className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-8 py-12 bg-white dark:bg-gray-900">
          <div className="w-full max-w-md p-6 rounded-xl drop-shadow-lg bg-white space-y-4 dark:bg-gray-900 dark:drop-shadow-white dark:text-white">
            <h1 className="text-2xl font-bold text-center text-gray-700 dark:text-white">
              Login Aplikasi Kasir
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Masukkan username/email"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="relative w-full">
                <input
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute px-2 border-l border-gray-400 right-0 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition dark:text-black dark:bg-yellow-600 dark:hover:bg-yellow-900"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-white">
              Belum punya akun?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-blue-500 hover:underline dark:text-yellow-600"
              >
                Daftar sekarang
              </button>
            </p>

            <p className="text-center text-xs text-gray-400">
              Powered by{" "}
              <a
                href="https://www.instagram.com/bantassyarif/?hl=id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-yellow-600"
              >
                Bantas Syarif HI
              </a>
            </p>
          </div>
        </div>

        {/* BACKGROUND GAMBAR KANAN */}
        <div className="hidden md:flex w-full md:w-1/2 relative">
          <Image
            src={bg}
            alt="Login Background"
            width="auto"
            height={720}
            className="object-contain dark:opacity-10"
            priority
          />
        </div>
      </div>
    </>
  );
}
