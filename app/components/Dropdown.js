// app/components/Dropdown.js
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dropdown({ product }) {
  const { productId, productName } = product;
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          Pilih...
          <svg
            className="-mr-1 size-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
            <div className="py-1" role="none">
              <Link
                href={{
                  pathname: "/barang/edit",
                  query: { id: productId },
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Edit
              </Link>

              <form action="/api/product/delete" method="POST">
                <input type="hidden" name="product_id" value={productId} />
                <button
                  type="submit"
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Hapus
                </button>
              </form>
            </div>

            <div className="py-1" role="none">
              <Link
                href={{
                  pathname: "/barang/stock-history",
                  query: { id: productId, name: productName },
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Show Stock History
              </Link>
              <Link
                href={{
                  pathname: `/transaksi/transaction-history`,
                  query: { id: productId, name: productName },
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                Show Transaction History
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
