// app/utils/formatDate.js
export function formatDateTime(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  const tanggal = date.getDate().toString().padStart(2, "0");
  const bulan = date.toLocaleString("id-ID", { month: "long" });
  const tahun = date.getFullYear();
  const jam = date.getHours().toString().padStart(2, "0");
  const menit = date.getMinutes().toString().padStart(2, "0");

  return `${tanggal} ${bulan} ${tahun} ${jam}.${menit}`;
}
