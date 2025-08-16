// app/components/Header.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";
import DarkModeToggle from "./DarkModeToggle";

export default function Header({ user = null }) {
  const { name, role } = user;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeClassStyle = "font-extrabold text-green-600 dark:text-yellow-600";

  const navItems = [
    {
      label: "Data User",
      href: "/admin",
      activeMatch: (p) => p.startsWith("/admin"),
      activeClass: activeClassStyle,
      role: "admin",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      activeMatch: (p) => p.startsWith("/dashboard"),
      activeClass: activeClassStyle,
    },
    {
      label: "Transaksi",
      href: "/transaksi",
      activeMatch: (p) =>
        p.startsWith("/transaksi") &&
        !p.startsWith("/transaksi/transaction-history"),
      activeClass: activeClassStyle,
    },
    {
      label: "Produk",
      href: "/barang",
      activeMatch: (p) =>
        p.startsWith("/barang") && !p.startsWith("/barang/stock-history"),
      activeClass: activeClassStyle,
    },
    {
      label: "Laporan Stok",
      href: "/barang/stock-history",
      activeMatch: (p) => p.startsWith("/barang/stock-history"),
      activeClass: activeClassStyle,
    },
    {
      label: "Histori Transaksi",
      href: "/transaksi/transaction-history",
      activeMatch: (p) => p.startsWith("/transaksi/transaction-history"),
      activeClass: activeClassStyle,
    },
    {
      label: "Diskon",
      href: "/diskon",
      activeMatch: (p) => p.startsWith("/diskon"),
      activeClass: activeClassStyle,
    },
  ];

  return (
    <header className="dark:bg-gray-900 dark:text-white sticky top-0 z-40 drop-shadow-md bg-white">
      <div className="max-w-screen mx-auto xl:px-2 xl:py-2 lg:px-2 lg:py-2 md:px-2 md:py-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold lg:w-lg sm:ps-4 md:ps-2 ps-5">
          K-App
        </h1>

        {/* Burger button (hanya muncul di layar kecil) */}
        <button
          className="lg:hidden p-2 rounded-md focus:outline-none focus:ring"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Menu */}
        <nav
          className={`${
            menuOpen ? "block" : "hidden"
          } absolute top-full left-0 w-full bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent lg:static lg:block`}
        >
          <ul className="flex flex-col  md:justify-between md:p-0 lg:flex-row lg:space-x-6 items-center lg:text-sm md:text-xs font-medium p-4 lg:p-0 lg:gap-2">
            {navItems
              .filter((item) => !item.role || item.role === role)
              .map(({ label, href, activeMatch, activeClass }) => {
                const isActive = activeMatch(pathname);
                return (
                  <li
                    key={href}
                    className="my-2 lg:my-0 lg:mx-auto md:hover:text-gray-600"
                  >
                    <Link
                      href={href}
                      className={`hover:text-green-700 dark:hover:text-yellow-800 ${
                        isActive ? activeClass : ""
                      }`}
                      onClick={() => setMenuOpen(false)} // Tutup menu setelah klik
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}

            <li className="my-2 lg:my-0">
              <DarkModeToggle />
            </li>
            <li className="flex items-center gap-4 my-2 lg:my-0">
              Welcome, {name}
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
