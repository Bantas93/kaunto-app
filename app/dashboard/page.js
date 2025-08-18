// // app/dashboard/page.js
// "use client";

// import {
//   ClipboardDocumentCheckIcon,
//   ClipboardDocumentListIcon,
//   CubeIcon,
//   CubeTransparentIcon,
//   TruckIcon,
// } from "@heroicons/react/24/solid";
// import Link from "next/link";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { useProducts } from "../context/ProductContext";
// import DateTimeDisplay from "../components/DateTimeDisplay";

// export default function DashboardPage() {
//   const { stats } = useProducts();

//   const cards = [
//     {
//       title: "Total Produk Tersedia",
//       icon: <CubeIcon className="w-5 h-5 mr-2" />,
//       value: stats?.stock_available || 0,
//       link: "/barang",
//       linkLabel: "Tabel Produk",
//     },
//     {
//       title: "Total Barang Masuk",
//       icon: <TruckIcon className="w-5 h-5 mr-2" />,
//       value: stats?.imported_stock_total || 0,
//       link: "/barang/stock-history",
//       linkLabel: "Tabel Laporan",
//     },
//     {
//       title: "Produk Diskon",
//       icon: <CubeTransparentIcon className="w-5 h-5 mr-2" />,
//       value: stats?.product_discount || 0,
//       link: "/diskon",
//       linkLabel: "Tabel Diskon",
//     },
//     {
//       title: "Total Omset",
//       icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
//       value: stats?.turnover_transaction || 0,
//       link: "/transaksi/transaction-history",
//       linkLabel: "Tabel Histori Transaksi",
//     },
//     {
//       title: "Omset Hari Ini",
//       icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
//       value: stats?.turnover_transaction_today || 0,
//       link: "/transaksi/transaction-history",
//       linkLabel: "Tabel Histori Transaksi",
//     },
//     {
//       title: "Omset Kemarin",
//       icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
//       value: stats?.turnover_transaction_before || 0,
//       link: "/transaksi/transaction-history",
//       linkLabel: "Tabel Histori Transaksi",
//     },
//     {
//       title: "Total Transaksi",
//       icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
//       value: stats?.transaction_total || 0,
//       link: "/transaksi/transaction-history",
//       linkLabel: "Tabel Histori Transaksi",
//     },
//     {
//       title: "Transaksi Hari Ini",
//       icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
//       value: stats?.transaction_today || 0,
//       link: "/transaksi/transaction-history",
//       linkLabel: "Tabel Histori Transaksi",
//     },
//     {
//       title: "Transaksi Kemarin",
//       icon: <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />,
//       value: stats?.transaction_before || 0,
//       link: "/transaksi/transaction-history",
//       linkLabel: "Tabel Histori Transaksi",
//     },
//   ];

//   if (!stats) {
//     return (
//       <div className="p-6">
//         <LoadingSpinner params="Mengambil data dashboard ..." />
//       </div>
//     );
//   }

//   const categories = [
//     { title: "Statistik Omset", cards: cards.slice(3, 6) },
//     { title: "Statistik Transaksi", cards: cards.slice(6, 9) },
//     { title: "Statistik Produk", cards: cards.slice(0, 3) },
//   ];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900 dark:text-white">
//       {/* Header */}
//       <div className="grid grid-cols-7">
//         <div className="col-start-6 col-span-2 text-right">
//           <DateTimeDisplay />
//         </div>
//       </div>

//       {/* Kartu Statistik */}
//       {categories.map((group, groupIdx) => (
//         <div key={groupIdx} className="mb-6">
//           <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">
//             {group.title}
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {group.cards.map((card, idx) => (
//               <div
//                 key={idx}
//                 className="bg-white rounded-lg drop-shadow-md border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-yellow-600"
//               >
//                 <div className="bg-gray-600 text-white p-3 flex items-center dark:bg-yellow-600 dark:text-black">
//                   {card.icon}
//                   <span className="font-medium">{card.title}</span>
//                 </div>
//                 <div className="text-center py-6 text-3xl text-gray-600 font-bold dark:text-white">
//                   {card.value}
//                 </div>
//                 <div className="bg-gray-50 p-3 border-t text-sm text-gray-600 text-center hover:underline dark:bg-gray-900 dark:text-white dark:border-yellow-600">
//                   <Link href={card.link}>{card.linkLabel} &raquo;</Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// app/dashboard/page.js
"use client";

import {
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  CubeTransparentIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import LoadingSpinner from "../components/LoadingSpinner";
import { useProducts } from "../context/ProductContext";
import DateTimeDisplay from "../components/DateTimeDisplay";
import { useState, useEffect, useRef } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { stats, refreshStats } = useProducts(); // Pastikan refreshStats tersedia di context

  // State untuk filter hanya 3 card tertentu
  const [filters, setFilters] = useState({
    "produk-tersedia": "total",
    "total-omset": "total",
    "total-transaksi": "total",
  });

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [isLoadingCustomData, setIsLoadingCustomData] = useState(false);

  const dropdownRef = useRef(null);

  // Handle click outside untuk menutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ADDED: Function untuk handle custom date range
  const handleCustomDateRangeChange = async (cardId) => {
    if (customDateRange.start && customDateRange.end) {
      setIsLoadingCustomData(true);
      try {
        // Panggil API dengan custom date range
        await refreshStats(customDateRange.start, customDateRange.end);
      } catch (error) {
        console.error("Error loading custom data:", error);
      } finally {
        setIsLoadingCustomData(false);
      }
    }
  };

  // ADDED: Effect untuk handle custom date range changes
  useEffect(() => {
    const hasCustomFilter = Object.values(filters).some(
      (filter) => filter === "custom"
    );
    if (hasCustomFilter && customDateRange.start && customDateRange.end) {
      handleCustomDateRangeChange();
    }
  }, [customDateRange, filters]);

  // Fungsi untuk mendapatkan value berdasarkan filter (hanya untuk card yang punya filter)
  const getCardValue = (cardId, defaultValue) => {
    // Jika card tidak punya filter, return default value
    if (!filters.hasOwnProperty(cardId)) {
      return defaultValue;
    }

    const filter = filters[cardId];

    switch (filter) {
      case "today":
        if (cardId === "total-omset") {
          return stats?.turnover_transaction_today || 0;
        } else if (cardId === "total-transaksi") {
          return stats?.transaction_today || 0;
        } else if (cardId === "produk-tersedia") {
          return stats?.stock_available_today || 0;
        }
        return defaultValue;
      case "yesterday":
        if (cardId === "total-omset") {
          return stats?.turnover_transaction_before || 0;
        } else if (cardId === "total-transaksi") {
          return stats?.transaction_before || 0;
        } else if (cardId === "produk-tersedia") {
          return stats?.stock_available_yesterday || 0;
        }
        return defaultValue;
      case "weekly":
        if (cardId === "total-omset") {
          return stats?.turnover_transaction_weekly || 0;
        } else if (cardId === "total-transaksi") {
          return stats?.transaction_weekly || 0;
        } else if (cardId === "produk-tersedia") {
          return stats?.stock_available_weekly || 0;
        }
        return defaultValue;
      case "monthly":
        if (cardId === "total-omset") {
          return stats?.turnover_transaction_monthly || 0;
        } else if (cardId === "total-transaksi") {
          return stats?.transaction_monthly || 0;
        } else if (cardId === "produk-tersedia") {
          return stats?.stock_available_monthly || 0;
        }
        return defaultValue;
      case "custom":
        if (cardId === "total-omset") {
          return stats?.turnover_transaction_custom || 0;
        } else if (cardId === "total-transaksi") {
          return stats?.transaction_custom || 0;
        } else if (cardId === "produk-tersedia") {
          return stats?.stock_available_custom || 0;
        }
        return defaultValue;
      case "total":
      default:
        return defaultValue;
    }
  };

  // Fungsi untuk mendapatkan title berdasarkan filter (hanya untuk card yang punya filter)
  const getCardTitle = (cardId, defaultTitle) => {
    // Jika card tidak punya filter, return default title
    if (!filters.hasOwnProperty(cardId)) {
      return defaultTitle;
    }

    const filter = filters[cardId];

    if (filter === "total") return defaultTitle;

    const baseTitle =
      cardId === "total-omset"
        ? "Omset"
        : cardId === "total-transaksi"
        ? "Transaksi"
        : cardId === "produk-tersedia"
        ? "Produk Tersedia"
        : defaultTitle.split(" ")[1];

    switch (filter) {
      case "today":
        return `${baseTitle} Hari Ini`;
      case "yesterday":
        return `${baseTitle} Kemarin`;
      case "weekly":
        return `${baseTitle} Mingguan`;
      case "monthly":
        return `${baseTitle} Bulanan`;
      case "custom":
        if (customDateRange.start && customDateRange.end) {
          return `${baseTitle} (${customDateRange.start} - ${customDateRange.end})`;
        }
        return `${baseTitle} Custom`;
      default:
        return defaultTitle;
    }
  };

  const cards = [
    {
      id: "produk-tersedia",
      title: "Total Produk Tersedia",
      icon: <CubeIcon className="w-5 h-5 mr-2" />,
      value: getCardValue("produk-tersedia", stats?.stock_available || 0),
      displayTitle: getCardTitle("produk-tersedia", "Total Produk Tersedia"),
      link: "/barang",
      linkLabel: "Tabel Produk",
      hasFilter: true,
    },
    {
      id: "barang-masuk",
      title: "Total Barang Masuk",
      icon: <TruckIcon className="w-5 h-5 mr-2" />,
      value: stats?.imported_stock_total || 0,
      displayTitle: "Total Barang Masuk",
      link: "/barang/stock-history",
      linkLabel: "Tabel Laporan",
      hasFilter: false,
    },
    {
      id: "produk-diskon",
      title: "Produk Diskon",
      icon: <CubeTransparentIcon className="w-5 h-5 mr-2" />,
      value: stats?.product_discount || 0,
      displayTitle: "Produk Diskon",
      link: "/diskon",
      linkLabel: "Tabel Diskon",
      hasFilter: false,
    },
    {
      id: "total-omset",
      title: "Total Omset",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: getCardValue("total-omset", stats?.turnover_transaction || 0),
      displayTitle: getCardTitle("total-omset", "Total Omset"),
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
      hasFilter: true,
    },
    {
      id: "omset-hari-ini",
      title: "Omset Hari Ini",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: stats?.turnover_transaction_today || 0,
      displayTitle: "Omset Hari Ini",
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
      hasFilter: false,
    },
    {
      id: "omset-kemarin",
      title: "Omset Kemarin",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: stats?.turnover_transaction_before || 0,
      displayTitle: "Omset Kemarin",
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
      hasFilter: false,
    },
    {
      id: "total-transaksi",
      title: "Total Transaksi",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: getCardValue("total-transaksi", stats?.transaction_total || 0),
      displayTitle: getCardTitle("total-transaksi", "Total Transaksi"),
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
      hasFilter: true,
    },
    {
      id: "transaksi-hari-ini",
      title: "Transaksi Hari Ini",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" />,
      value: stats?.transaction_today || 0,
      displayTitle: "Transaksi Hari Ini",
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
      hasFilter: false,
    },
    {
      id: "transaksi-kemarin",
      title: "Transaksi Kemarin",
      icon: <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />,
      value: stats?.transaction_before || 0,
      displayTitle: "Transaksi Kemarin",
      link: "/transaksi/transaction-history",
      linkLabel: "Tabel Histori Transaksi",
      hasFilter: false,
    },
  ];

  const FilterDropdown = ({ cardId }) => (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left text-black z-[9999]"
    >
      <button
        onClick={() =>
          setActiveDropdown(activeDropdown === cardId ? null : cardId)
        }
        className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        disabled={isLoadingCustomData}
      >
        <ChevronUpDownIcon className="w-3 h-3 ml-1" />
        {isLoadingCustomData && filters[cardId] === "custom" && (
          <div className="ml-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {activeDropdown === cardId && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 dark:bg-gray-800 dark:border-gray-600">
          <div className="py-1">
            {[
              { value: "total", label: "Total Semua" },
              { value: "today", label: "Hari Ini" },
              { value: "yesterday", label: "Kemarin" },
              { value: "weekly", label: "Mingguan" },
              { value: "monthly", label: "Bulanan" },
              { value: "custom", label: "Custom Range" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    [cardId]: option.value,
                  }));
                  if (option.value !== "custom") {
                    setActiveDropdown(null);
                  }
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white ${
                  filters[cardId] === option.value
                    ? "bg-blue-50 dark:bg-blue-900"
                    : ""
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {filters[cardId] === "custom" && (
            <div className="border-t p-3 dark:border-gray-600">
              <div className="space-y-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      start: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Tanggal Mulai"
                />
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) =>
                    setCustomDateRange({
                      ...customDateRange,
                      end: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 text-xs border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Tanggal Selesai"
                />
                <button
                  onClick={() => {
                    if (customDateRange.start && customDateRange.end) {
                      handleCustomDateRangeChange(cardId);
                      setActiveDropdown(null);
                    }
                  }}
                  disabled={
                    !customDateRange.start ||
                    !customDateRange.end ||
                    isLoadingCustomData
                  }
                  className="w-full px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoadingCustomData ? "Loading..." : "Apply"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!stats) {
    return (
      <div className="p-6">
        <LoadingSpinner params="Mengambil data dashboard ..." />
      </div>
    );
  }

  const categories = [
    { title: "Statistik Omset", cards: cards.slice(3, 6) },
    { title: "Statistik Transaksi", cards: cards.slice(6, 9) },
    { title: "Statistik Produk", cards: cards.slice(0, 3) },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <div className="grid grid-cols-7">
        <div className="col-start-6 col-span-2 text-right">
          <DateTimeDisplay />
        </div>
      </div>

      {/* Kartu Statistik */}
      {categories.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">
            {group.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {group.cards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg drop-shadow-md border border-gray-200 dark:bg-gray-900 dark:border-yellow-600"
              >
                <div className="bg-gray-600 text-white p-3 flex items-center justify-between dark:bg-yellow-600 dark:text-black">
                  <div className="flex items-center">
                    {card.icon}
                    <span className="font-medium">{card.displayTitle}</span>
                  </div>
                  {card.hasFilter && <FilterDropdown cardId={card.id} />}
                </div>
                <div className="text-center py-6 text-3xl text-gray-600 font-bold dark:text-white">
                  {isLoadingCustomData && filters[card.id] === "custom" ? (
                    <div className="animate-pulse">Loading...</div>
                  ) : (
                    card.value
                  )}
                </div>
                <div className="bg-gray-50 p-3 border-t text-sm text-gray-600 text-center hover:underline dark:bg-gray-900 dark:text-white dark:border-yellow-600">
                  <Link href={card.link}>{card.linkLabel} &raquo;</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
