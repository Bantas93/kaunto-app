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
    <div className="mt-4 text-center flex flex-row justify-center items-center gap-4">
      <p className="text-sm text-gray-600 mb-2 dark:text-white m-2">
        Ini dummy ... Dalam tahap pengembangan ...
      </p>
      <div className="border bg-white shadow rounded dark:bg-yellow-600 flex">
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
        <div className="text-sm mt-2 text-gray-700 text-start flex flex-col px-3">
          Bank: {namaBank} <br />
          No. Rek: {rekeningTujuan} <br />
          Total: Rp.{totalAmount.toLocaleString()}
          <button
            onClick={() => handlePayment(Math.round(totalAmount))}
            className="hover:cursor-pointer border rounded mx-1 mt-12 hover:bg-gray-600 hover:text-white transition-all duration-100"
          >
            Selesai Scan
          </button>
        </div>
      </div>
    </div>
  );
}
