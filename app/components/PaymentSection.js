// app/components/PaymentSection.js
export default function PaymentSection({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="mt-4 flex gap-4 items-center dark:text-white ">
      <label className="font-medium text-gray-700 text-sm dark:text-white">
        Metode Pembayaran:
      </label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 dark:bg-gray-900 dark:focus:ring-yellow-600"
      >
        <option value="cash">Tunai</option>
        <option value="qris">QRIS</option>
      </select>
    </div>
  );
}
