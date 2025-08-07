// app/transaksi/layout.js
import React from "react";
import { TransactionProvider } from "../context/TransactionContext";
import { UserProvider } from "../context/UserContext";
import { cookies } from "next/headers";

export const metadata = {
  title: {
    template: "%s | K App",
    default: "Transaksi",
  },
};

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie.value));
    } catch (e) {
      console.error("Gagal parse cookie:", e);
    }
  }

  return (
    <>
      <TransactionProvider>
        <UserProvider user={user}> {children}</UserProvider>
      </TransactionProvider>
    </>
  );
}
