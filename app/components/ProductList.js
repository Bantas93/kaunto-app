// app/components/ProductList.js
"use client";

import { useMemo, useState } from "react";
import { useTransaction } from "../context/TransactionContext";

export default function ProductList({ keyword }) {
  const { productList, addToTransaction } = useTransaction();
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = useMemo(
    () =>
      productList.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      ),
    [productList, keyword]
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page]);

  return (
    <div className="p-2 relative">
      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 z-10"
          >
            &lt;
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 z-10"
          >
            &gt;
          </button>
        </>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {paginatedProducts.length === 0 ? (
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-20 text-gray-500 text-lg font-medium">
            Tidak ada produk yang tersedia.
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <button
              onClick={() => addToTransaction(product)}
              key={product.product_id}
              className="rounded-xl overflow-hidden border shadow-sm bg-white hover:shadow-lg transform hover:scale-[1.03] transition duration-200 ease-in-out dark:border-yellow-500"
            >
              <div className="aspect-square w-full relative">
                {!product.image ? (
                  <div className="bg-gray-300 flex justify-center items-center w-full h-full object-cover">
                    <strong>Tidak ada Foto</strong>
                  </div>
                ) : (
                  <img
                    src={product.image}
                    alt={`Gambar ${product.name}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="p-2 text-left dark:bg-gray-900 dark:text-yellow-600">
                <h6 className="font-semibold truncate text-xs ">
                  {product.name}
                </h6>
                <p className="text-sm text-gray-600 dark:text-white">
                  Rp. {product.price.toLocaleString()}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Page indicator in center */}
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Halaman {page} dari {totalPages}
        </div>
      )}
    </div>
  );
}
