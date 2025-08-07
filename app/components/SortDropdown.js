// app/components/SortDropdown.js
"use client";

export default function SortDropdown({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center ">
      <div>
        <label className="mr-2 font-medium">Urut berdasarkan:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
        >
          <option value="tanggal">Tanggal</option>
          <option value="produk">Nama Produk</option>
        </select>
      </div>
      <div>
        <select
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value)}
          className="border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>
    </div>
  );
}
