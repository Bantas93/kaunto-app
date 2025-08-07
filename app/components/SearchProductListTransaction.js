// app/components/SearchProductListTransaction.js
"use client";

import { useState } from "react";
import ProductList from "./ProductList";

export default function SearchProductListTransaction() {
  const [keyword, setKeyword] = useState("");

  return (
    <>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-yellow-600 dark:border-white dark:text-white"
        />
      </div>
      <ProductList keyword={keyword} />
    </>
  );
}
