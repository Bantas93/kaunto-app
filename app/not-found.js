// app/not-found.js
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="max-w-screen max-h-screen mx-auto py-5">
      <div className="grid grid-rows-2 gap-4">
        <strong className="text-3xl text-red-700">Halaman Tidak ada</strong>
        <Link
          href="/"
          className="text-xl text-center border rounded hover:bg-gray-500 transition-all hover:text-white"
        >
          Ke Login
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
