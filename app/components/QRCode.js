// app/components/QRCode.js
"use client";

import { useRef } from "react";
import { useQRCode } from "next-qrcode";

export default function QRCode({ value, size = 200 }) {
  const { Canvas } = useQRCode();
  const canvasRef = useRef(null);

  return (
    <Canvas
      text={value}
      options={{
        errorCorrectionLevel: "M",
        margin: 3,
        scale: 4,
        width: size,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      }}
      ref={canvasRef}
    />
  );
}
