// app/components/PaymentQRCode.js
"use client";

import { useQRCode } from "next-qrcode";

export default function PaymentQRCode({ totalAmount, handlePayment }) {
  const { Canvas } = useQRCode();

  const rekeningTujuan = "1234567890";
  const namaBank = "BCA";

  const qrContent = `BANK:${namaBank};NO_REK:${rekeningTujuan};TOTAL:${Math.round(
    totalAmount
  )}`;

  return (
    <div className="mt-4 text-center ">
      <p className="text-sm text-gray-600 mb-2 dark:text-white">
        Silakan scan QR untuk pembayaran ke rekening:
      </p>
      <div className="inline-block border p-3 bg-white shadow rounded dark:bg-yellow-600">
        <Canvas
          text={qrContent}
          options={{
            level: "M",
            margin: 2,
            scale: 4,
            width: 160,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          }}
        />
        <p className="text-sm mt-2 text-gray-700">
          Bank: {namaBank} <br />
          No. Rek: {rekeningTujuan} <br />
          Total: <strong>Rp.{totalAmount.toLocaleString()}</strong>
        </p>
        <button
          onClick={() => handlePayment(Math.round(totalAmount))}
          className="hover:font-bold"
        >
          Selesai Scan
        </button>
      </div>
    </div>
  );
}
