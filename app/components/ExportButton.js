// app/components/ExportButton.js.js
"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportButtons({
  data = [],
  filename = "export",
  columns = [],
  totalPenjualan = null,
}) {
  const handleExportExcel = () => {
    // Buat salinan data TANPA kolom "Gambar"
    const exportData = data.map(({ Gambar, ...rest }) => rest);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `${filename}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.text(filename.toUpperCase(), 14, 15);

    const hasImageColumn = columns.includes("Gambar");
    const imageColIndex = columns.indexOf("Gambar");

    const tableHead = [columns];

    const tableRows = data.map((item) =>
      columns.map((col) => {
        const value = item[col];

        if (col === "Gambar") {
          return { content: "", image: value };
        }

        return value !== undefined && value !== null ? String(value) : "";
      })
    );

    autoTable(doc, {
      head: tableHead,
      body: tableRows,
      startY: 20,
      didDrawCell: (data) => {
        if (
          hasImageColumn &&
          data.column.index === imageColIndex &&
          data.cell.raw?.image
        ) {
          try {
            doc.addImage(
              data.cell.raw.image,
              "JPEG",
              data.cell.x + 2,
              data.cell.y + 2,
              16,
              16
            );
          } catch (err) {
            console.error("❌ Gagal render gambar:", err);
          }
        }
      },
      didParseCell: (data) => {
        if (
          hasImageColumn &&
          data.column.index === imageColIndex &&
          data.cell.raw?.image
        ) {
          data.cell.styles.minCellHeight = 20;
        }
      },
      columnStyles: Object.fromEntries(
        columns.map((col, i) => [
          i,
          col === "Gambar"
            ? { cellWidth: 22 }
            : { cellWidth: Math.max(28, col.length * 4) },
        ])
      ),
      columnStyles: {
        cellWidth: "auto",
      },
      styles: {
        valign: "middle",
        fontSize: 9,
        overflow: "linebreak",
        cellPadding: 2,
      },
      tableWidth: "auto",
    });

    if (totalPenjualan !== null) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Total Penjualan: Rp. ${totalPenjualan.toLocaleString("id-ID")}`,
        14,
        doc.lastAutoTable.finalY + 10
      );
    }

    doc.save(`${filename}.pdf`);
  };

  if (data.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-2 my-1">
      <button
        onClick={handleExportExcel}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
      >
        Export ke Excel
      </button>
      <button
        onClick={handleExportPDF}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
      >
        Export ke PDF
      </button>
    </div>
  );
}
