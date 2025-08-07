// app/components/RandomSku.js
export default function randomSku() {
  // const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const chars = "0123456789";
  let sku = "SKU-";
  for (let i = 0; i < 8; i++) {
    sku += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return sku;
}
