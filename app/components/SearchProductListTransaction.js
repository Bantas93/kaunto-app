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
          className="w-full border rounded-lg lg:px-4 lg:py-2 md:px-2 md:py-1 focus:outline-none lg:focus:ring-2 md:focus:ring-1 md:text-xs focus:ring-black dark:focus:ring-yellow-600 dark:border-white dark:text-white"
          id="cari_produk"
        />
      </div>
      <ProductList keyword={keyword} />
    </>
  );
}
