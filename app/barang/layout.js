// app/barang/layout.js

import { ProductProvider } from "../context/ProductContext";

export const metadata = {
  title: {
    template: "%s | K App",
    default: "Daftar Produk",
  },
};

const Layout = ({ children }) => {
  return <ProductProvider>{children}</ProductProvider>;
};
export default Layout;
