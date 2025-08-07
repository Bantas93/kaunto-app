// app/components/LoadingSpinner.js
"use client";
import { useEffect, useState } from "react";

export default function LoadingSpinner({ delay = 0, params }) {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [delay]);

  if (!visible) return null;

  return (
    <>
      <div className="inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-t-transparent border-black rounded-full animate-spin dark:border-yellow-600"></div>
      </div>
      <div className="flex items-center justify-center mt-5 dark:text-white">
        {params || "Loading..."}
      </div>
    </>
  );
}
