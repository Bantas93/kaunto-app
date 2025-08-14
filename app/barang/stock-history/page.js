// app/barang/stock-history/page.js
"use client";

import BackButton from "@/app/components/BackButton";
import ExportButtons from "@/app/components/ExportButton";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import SortDropdown from "@/app/components/SortDropdown";
import { getAllStockHistory } from "@/app/lib/data-service";
import { formatDateTime } from "@/app/utils/formatDate";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
        const stored = await getAllStockHistory();

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
        setLoading(false);
        setHistory(filtered);
      } catch (err) {
        console.error("Gagal mengambil history:", err);
      }
      // finally {
      //   setLoading(false);
      // }
    };

    fetchData();
  }, [name, filterMode, customStart, customEnd]);

  return (
    <main className="p-4 max-w-7xl mx-auto dark:bg-gray-900 dark:text-white">
      <BackButton />

      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold">
          Laporan Stok {name && <span className="uppercase">: {name}</span>}
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
            data={history.map((p) => ({
              Nama: p.produk,
              Sku: p.sku,
              Tanggal: formatDateTime(p.tanggal),
              Keterangan: p.flag,
              subTotal: p.subTotal,
              totalStock: p.totalStock,
            }))}
            filename="Laporan Stok"
            columns={[
              "Nama",
              "Sku",
              "Tanggal",
              "Keterangan",
              "subTotal",
              "totalStock",
            ]}
          />
          <table className="min-w-full text-sm text-center border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-semibold dark:bg-gray-900 dark:text-white">
              <tr>
                <th className="border px-4 py-2">Nama Produk</th>
                <th className="border px-4 py-2">SKU</th>
                <th className="border px-4 py-2">Tanggal</th>
                <th className="border px-4 py-2">Flag</th>
                <th className="border px-4 py-2">Sub Total</th>
                <th className="border px-4 py-2">Total Stock</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="border text-center py-4 text-gray-500"
                  >
                    <LoadingSpinner params="Mengambil data histori..." />
                  </td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="border text-center py-4 text-gray-500"
                  >
                    Tidak ada data riwayat.
                  </td>
                </tr>
              ) : (
                Array.from(
                  sortedHistory.reduce((map, item) => {
                    const key = `${item.produk}-${item.sku}`;
                    if (!map.has(key)) map.set(key, []);
                    map.get(key).push(item);
                    return map;
                  }, new Map())
                ).flatMap(([key, items]) =>
                  items.map((item, index) => (
                    <tr
                      key={`${key}-${index}`}
                      className="uppercase text-center text-sm"
                    >
                      {index === 0 && (
                        <>
                          <td
                            className="border px-4 py-2"
                            rowSpan={items.length}
                          >
                            {item.produk}
                          </td>
                          <td
                            className="border px-4 py-2"
                            rowSpan={items.length}
                          >
                            {item.sku}
                          </td>
                        </>
                      )}
                      <td className="border px-4 py-2">
                        {formatDateTime(item.tanggal)}
                      </td>
                      <td className="border px-4 py-2">{item.flag}</td>
                      <td className="border px-4 py-2">{item.subTotal}</td>
                      <td className="border px-4 py-2">{item.totalStock}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </motion.section>
    </main>
  );
}
