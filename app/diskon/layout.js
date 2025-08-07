// app/diskon/layout.js

import { DiscountProvider } from "../context/DiscountContext";

export const metadata = {
  title: "Daftar Diskon",
};

const Layout = ({ children }) => {
  return <DiscountProvider>{children}</DiscountProvider>;
};
export default Layout;
