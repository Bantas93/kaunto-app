// app/components/Header.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import DarkModeToggle from "./DarkModeToggle";

export default function Header({ user = null }) {
  const { name, role } = user;
  const pathname = usePathname();
  const activeClassStyle = "font-extrabold dark:text-yellow-600";
  const navItems = [
    {
      label: "Data User",
      href: "/admin",
      activeMatch: (pathname) => pathname.startsWith("/admin"),
      activeClass: activeClassStyle,
      role: "admin",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      activeMatch: (pathname) => pathname.startsWith("/dashboard"),
      activeClass: activeClassStyle,
    },
    {
      label: "Transaksi",
      href: "/transaksi",
      activeMatch: (pathname) =>
        pathname.startsWith("/transaksi") &&
        !pathname.startsWith("/transaksi/transaction-history"),
      activeClass: activeClassStyle,
    },
    {
      label: "Produk",
      href: "/barang",
      activeMatch: (pathname) =>
        pathname.startsWith("/barang") &&
        !pathname.startsWith("/barang/stock-history"),
      activeClass: activeClassStyle,
    },
    {
      label: "Laporan Stok",
      href: "/barang/stock-history",
      activeMatch: (pathname) => pathname.startsWith("/barang/stock-history"),
      activeClass: activeClassStyle,
    },
    {
      label: "Histori Transaksi",
      href: "/transaksi/transaction-history",
      activeMatch: (pathname) =>
        pathname.startsWith("/transaksi/transaction-history"),
      activeClass: activeClassStyle,
    },
    {
      label: "Diskon",
      href: "/diskon",
      activeMatch: (pathname) => pathname.startsWith("/diskon"),
      activeClass: activeClassStyle,
    },
  ];

  return (
    <header className="dark:bg-gray-900 dark:text-white sticky top-0 z-40 drop-shadow-md dark:drop-shadow-white dark:drop-shadow-sm bg-white">
      <div className="max-w-7xl mx-auto lg:px-4 lg:py-4 md:px-2 md:py-2 flex items-center justify-between lg:text-shadow-2xs">
        <h1 className="text-xl font-semibold">K App</h1>
        <nav>
          <ul className="flex lg:space-x-6 md:space-x-1 items-center lg:text-sm md:text-xs font-medium">
            {navItems
              .filter((item) => !item.role || item.role === role)
              .map(({ label, href, activeMatch, activeClass }) => {
                const isActive = activeMatch(pathname);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`hover:text-gray-600 dark:hover:text-yellow-700 ${
                        isActive ? activeClass : ""
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}

            <li>
              <DarkModeToggle />
            </li>
            <li className="flex items-center justify-between gap-4">
              Welcome, {name}
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
