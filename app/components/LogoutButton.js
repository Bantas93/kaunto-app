// app/components/LogoutButton.js
"use client";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Yakin ingin logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ya, logout",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil logout",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/");
        router.refresh();
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded hover:bg-gray-600 transition hover:text-white"
      title="Logout"
    >
      <ArrowRightStartOnRectangleIcon className="h-6 w-6" />
    </button>
  );
}
