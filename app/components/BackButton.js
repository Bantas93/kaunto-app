// app/components/BackButton.js
"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ label = "Kembali", className = "" }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={`px-4 py-2 mb-2 bg-gray-200 rounded hover:bg-gray-300 text-sm dark:bg-gray-900 dark:text-white
        dark:border-yellow-600 dark:hover:bg-yellow-600 dark:border ${className}`}
    >
      {label}
    </button>
  );
}
