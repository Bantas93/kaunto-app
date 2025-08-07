// app/components/AuthLayout.js
import { cookies } from "next/headers";
import Header from "@/app/components/Header";

export default async function AuthLayout({ children }) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  let user = null;
  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie.value)); // semua properti tersedia
    } catch (e) {
      console.error("Gagal parse cookie:", e);
    }
  }

  return (
    <>
      {user && <Header user={user} />}
      {children}
    </>
  );
}
