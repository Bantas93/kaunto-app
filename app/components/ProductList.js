// app/components/ProductList.js
"use client";

import { useMemo, useState } from "react";
import { useTransaction } from "../context/TransactionContext";
import LoadingSpinner from "./LoadingSpinner";
import Swal from "sweetalert2";
// import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function ProductList({ keyword }) {
  const { productList, addToTransaction, checkStock, isLoading } =
    useTransaction();
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

  const handleAddToTransaction = (product) => {
    const stockInfo = checkStock(product.product_id);

    if (!stockInfo.available) {
      Swal.fire({
        title: "⚠️ Stock Habis",
        text: stockInfo.message,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const success = addToTransaction(product);
    if (!success) {
      Swal.fire({
        title: "⚠️ Stock Tidak Mencukupi",
        text: `Stock ${product.name} tidak mencukupi`,
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-2 relative">
      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 z-10 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            &lt;
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 z-10 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            &gt;
          </button>
        </>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 md:gap-2">
        {isLoading ? (
          // Kalau loading
          <div className="col-span-1 md:col-span-3 lg:col-span-4 text-center py-20 text-gray-500 text-lg font-medium">
            <LoadingSpinner params="Sedang ambil data ..." />
          </div>
        ) : paginatedProducts.length === 0 ? (
          // Kalau tidak ada produk
          <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-20 text-gray-500 text-lg font-medium">
            Tidak ada produk yang tersedia.
          </div>
        ) : (
          // Kalau ada produk
          paginatedProducts.map((product) => {
            const stockInfo = checkStock(product.product_id);
            const isOutOfStock = !stockInfo.available;

            return (
              <button
                onClick={() => handleAddToTransaction(product)}
                key={product.product_id}
                disabled={isOutOfStock}
                className={`
                  cursor-pointer rounded-xl overflow-hidden border shadow-sm bg-white transition duration-200 ease-in-out dark:border-yellow-500 relative
                  ${
                    isOutOfStock
                      ? "opacity-60 "
                      : "hover:shadow-lg transform hover:scale-[1.03]"
                  }
                `}
              >
                {/* Stock Badge */}
                {/* <div className="absolute top-1 right-1 z-10">
                  {isOutOfStock ? (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Habis
                    </span>
                  ) : stockInfo.availableStock <= 10 ? (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {stockInfo.availableStock}
                      Hampir habis
                    </span>
                  ) : (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {stockInfo.availableStock}
                      Tersedia
                    </span>
                  )}
                </div> */}

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

                  {/* Overlay untuk produk habis */}
                  {isOutOfStock && (
                    <div className="absolute inset-0 backdrop-blur-[1px] bg-opacity-40 flex items-center justify-center">
                      {/* <span className="text-white font-bold text-lg">
                        HABIS
                      </span> */}
                    </div>
                  )}
                </div>

                <div className="p-2 text-left dark:bg-gray-900 dark:text-yellow-600">
                  <h6
                    className={`font-semibold truncate text-xs ${
                      isOutOfStock ? "text-gray-500" : ""
                    }`}
                  >
                    {product.name}
                  </h6>
                  <p
                    className={`text-sm ${
                      isOutOfStock ? "text-gray-400" : "text-gray-600"
                    } dark:text-white`}
                  >
                    Rp. {product.price.toLocaleString()}
                  </p>

                  {/* Informasi stock detail */}
                  {/* <div className="mt-1 text-xs">
                    {stockInfo.currentQuantity > 0 && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {stockInfo.currentQuantity}{" "}
                        <ShoppingCartIcon className="h-3 w-3" />
                      </span>
                    )}
                  </div> */}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Page indicator in center */}
      {totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-300">
          Halaman {page} dari {totalPages}
        </div>
      )}
    </div>
  );
}
