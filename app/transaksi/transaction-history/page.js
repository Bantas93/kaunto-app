// app/transaksi/transaction-history.js
"use client";

import BackButton from "@/app/components/BackButton";
import ExportButtons from "@/app/components/ExportButton";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SortDropdown from "@/app/components/SortDropdown";
import { getAllTransactionHistory } from "@/app/lib/data-service";
import { formatDateTime } from "@/app/utils/formatDate";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const [history, setHistory] = useState([]);
  const [sortBy, setSortBy] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("semua");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const sortedHistory = [...history].sort((a, b) => {
    let valA, valB;

    if (sortBy === "tanggal") {
      valA = new Date(a.tanggal);
      valB = new Date(b.tanggal);
    } else if (sortBy === "produk") {
      valA = a.produk.toLowerCase();
      valB = b.produk.toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = await getAllTransactionHistory();

        let filtered = name
          ? stored.filter((item) =>
              item.produk.toLowerCase().includes(name.toLowerCase())
            )
          : stored;

        const now = new Date();
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.tanggal);

          if (filterMode === "harian") {
            return itemDate.toDateString() === now.toDateString();
          }

          if (filterMode === "mingguan") {
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 7);
            return itemDate >= oneWeekAgo && itemDate <= now;
          }

          if (filterMode === "bulanan") {
            return (
              itemDate.getMonth() === now.getMonth() &&
              itemDate.getFullYear() === now.getFullYear()
            );
          }

          if (filterMode === "custom" && customStart && customEnd) {
            const start = new Date(customStart);
            start.setHours(0, 0, 0, 0);
            const end = new Date(customEnd);
            end.setHours(23, 59, 59, 999);
            return itemDate >= start && itemDate <= end;
          }

          return true;
        });

        setHistory(filtered);
      } catch (err) {
        console.error("Gagal mengambil history:", err);
        Swal.fire("Error", "Gagal mengambil data riwayat.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name, filterMode, customStart, customEnd]);

  const totalPenjualan = sortedHistory.reduce((sum, item) => {
    return sum + Number(item.total || 0);
  }, 0);

  return (
    <main className="p-4 max-w-7xl mx-auto dark:bg-gray-900 dark:text-white">
      <BackButton />

      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
          Histori Transaksi
          {name && <strong className="uppercase">: {name}</strong>}
        </h1>
      </header>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {!name && (
          <section className="my-1">
            <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
              <SortDropdown
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
              />

              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-500" />
                <label className="font-medium" htmlFor="filter_waktu">
                  Filter Waktu:
                </label>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="border px-2 py-1 rounded text-sm dark:bg-gray-900 dark:text-white"
                  id="filter_waktu"
                >
                  <option value="semua">Semua</option>
                  <option value="harian">Harian (Hari ini)</option>
                  <option value="mingguan">Mingguan</option>
                  <option value="bulanan">Bulanan</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {filterMode === "custom" && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                    id="custom_start"
                  />
                  <span>-</span>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                    id="custom_end"
                  />
                </div>
              )}
            </div>
          </section>
        )}

        <div className="overflow-auto ">
          <ExportButtons
            data={sortedHistory.map((p) => ({
              NoTransaksi: p.transaction_number,
              Tanggal: formatDateTime(p.tanggal),
              Nama: p.produk,
              user: p.user,
              Role: p.role,
              Qty: p.quantity,
              Metode: p.metode,
              HarggaPerItem: p.pricePerItem,
              Total: p.total,
            }))}
            columns={[
              "NoTransaksi",
              "Tanggal",
              "Nama",
              "user",
              "Role",
              "Qty",
              "Metode",
              "HarggaPerItem",
              "Total",
            ]}
            filename="Histori Transaksi"
            totalPenjualan={totalPenjualan}
          />
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-semibold dark:bg-gray-900 dark:text-white">
              <tr>
                <th className="border px-4 py-2">No. Transaksi</th>
                <th className="border px-4 py-2">Tanggal</th>
                <th className="border px-4 py-2">Produk</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Qty</th>
                <th className="border px-4 py-2">Metode</th>
                <th className="border px-4 py-2">Harga/item</th>
                <th className="border px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="border text-center py-4 text-gray-500"
                  >
                    <LoadingSpinner params="Mengambil data histori tansaksi..." />
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="border text-center py-4 text-gray-500"
                  >
                    Tidak ada data riwayat.
                  </td>
                </tr>
              ) : (
                Array.from(
                  sortedHistory.reduce((map, item) => {
                    const key = item.transaction_number;
                    if (!map.has(key)) map.set(key, []);
                    map.get(key).push(item);
                    return map;
                  }, new Map())
                ).flatMap(([transactionNumber, items]) =>
                  items.map((item, index) => (
                    <tr
                      key={`${transactionNumber}-${index}`}
                      className="text-center text-sm"
                    >
                      {index === 0 && (
                        <>
                          <td
                            className="border px-4 py-2 font-medium"
                            rowSpan={items.length}
                          >
                            {transactionNumber}
                          </td>
                          <td
                            className="border px-4 py-2"
                            rowSpan={items.length}
                          >
                            {formatDateTime(item.tanggal)}
                          </td>
                        </>
                      )}
                      <td className="border px-4 py-2">{item.produk}</td>
                      <td className="border px-4 py-2">{item.user}</td>
                      <td className="border px-4 py-2">{item.role}</td>
                      <td className="border px-4 py-2">{item.quantity}</td>
                      <td className="border px-4 py-2">{item.metode}</td>
                      <td className="border px-4 py-2">{item.pricePerItem}</td>
                      <td className="border px-4 py-2">{item.total}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>

        <footer className="mt-6 text-right font-bold text-lg">
          Total Penjualan:{" "}
          <span className="text-green-600 dark:text-yellow-600">
            Rp. {totalPenjualan}
          </span>
        </footer>
      </motion.section>
    </main>
  );
}
