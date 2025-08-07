// app/dashboard/layout.js
"use client";
import { ProductProvider } from "../context/ProductContext";

const Layout = ({ children }) => {
  return <ProductProvider>{children}</ProductProvider>;
};
export default Layout;
