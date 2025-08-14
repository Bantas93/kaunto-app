// app/components/TransactionItem.js

import { motion } from "framer-motion";
import { useTransaction } from "../context/TransactionContext";

export default function TransactionItem({
  item,
  updateQuantity,
  removeTransactionByName,
}) {
  const { setQuantity } = useTransaction();

  return (
    <motion.div
      key={item.product_id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0 }}
      className="grid grid-cols-8 gap-1 items-center border border-gray-200 rounded-md p-2 shadow-sm bg-white dark:bg-gray-900 dark:text-white"
    >
      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-800  ">
        <button
          onClick={() => removeTransactionByName(item.name)}
          className="hover:pointer text-red-600 hover:text-red-800 font-bold text-lg px-2"
          aria-label="Hapus Produk"
          title="Hapus Produk"
        >
          &times;
        </button>
        <span className="dark:text-white select-none">{item.name}</span>
      </div>

      <div className="text-center text-sm select-none">
        {item.original_price ? item.original_price : item.price}
      </div>
      <div className="text-center text-sm select-none">
        {item.discount_amount}
      </div>

      {/* QTY Input */}
      <input
        type="number"
        min="1"
        className="text-center text-sm w-14 border xl:ps-5 border-none focus:outline-none"
        value={item.quantity}
        onChange={(e) => {
          const qty = parseInt(e.target.value, 10);
          if (!isNaN(qty) && qty > 0) {
            setQuantity(item.product_id, qty);
          }
        }}
        id={item.product_id}
      />

      <div className="flex justify-center gap-2 ">
        <button
          onClick={() => updateQuantity(item.product_id, -1)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-150 ease-in-out active:scale-95"
          aria-label="Kurangi"
        >
          -
        </button>
        <button
          onClick={() => updateQuantity(item.product_id, 1)}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-150 ease-in-out active:scale-95"
          aria-label="Tambah"
        >
          +
        </button>
      </div>
      <div className="col-start-7 col-span-2 text-right font-medium text-sm text-gray-700 dark:text-white">
        Rp.{(item.price * item.quantity).toLocaleString()}
      </div>
    </motion.div>
  );
}
