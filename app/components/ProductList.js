// app/components/ProductList.js
"use client";

import { useMemo } from "react";
import { useTransaction } from "../context/TransactionContext";
import LoadingSpinner from "./LoadingSpinner";
import Swal from "sweetalert2";
import { CubeIcon } from "@heroicons/react/24/outline";

export default function ProductList({ keyword }) {
  const { productList, addToTransaction, checkStock, isLoading } =
    useTransaction();

  const filteredProducts = useMemo(
    () =>
      productList.filter((product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
      ),
    [productList, keyword]
  );

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
    <div className="p-2">
      {isLoading ? (
        <div className="text-center py-20 text-gray-500 text-lg font-medium">
          <LoadingSpinner params="Sedang ambil data ..." />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-lg font-medium">
          Tidak ada produk yang tersedia.
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-rows-2 gap-2 xl:auto-cols-[150px] lg:auto-cols-[130px] md:auto-cols-[110px] grid-flow-col">
            {filteredProducts.map((product) => {
              const stockInfo = checkStock(product.product_id);
              const isOutOfStock = !stockInfo.available;

              return (
                <button
                  onClick={() => handleAddToTransaction(product)}
                  key={product.product_id}
                  disabled={isOutOfStock}
                  className={`
                    cursor-pointer rounded-xl overflow-hidden border shadow-md shadow-gray-600 dark:shadow-md bg-white transition-all duration-200 ease-in-out dark:border-yellow-500 dark:shadow-yellow-500 relative w-full h-auto
                    ${
                      isOutOfStock
                        ? "opacity-60"
                        : "hover:shadow-none hover:transform hover:top-1 hover:duration-200"
                    }
                  `}
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

                    {/* Overlay untuk produk habis */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 backdrop-blur-[2px] bg-opacity-40 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          HABIS
                        </span>
                      </div>
                    )}
                  </div>
                  {/* cube stock */}
                  <div className="absolute flex justify-end items-center gap-0.5 -right-0.5 pe-2 pt-1 text-[12px]">
                    <CubeIcon className="h-4 w-4" />
                    {product.stock - stockInfo.currentQuantity}
                  </div>
                  <div className="p-1.5 text-left dark:bg-gray-900 dark:text-yellow-600">
                    <h6
                      className={`font-semibold truncate text-[10px] ${
                        isOutOfStock ? "text-gray-500" : ""
                      }`}
                    >
                      {product.name}
                    </h6>
                    <p
                      className={`text-[11px] ${
                        isOutOfStock ? "text-gray-400" : "text-gray-600"
                      } dark:text-white`}
                    >
                      Rp. {product.price.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
