// middleware.js
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/transaksi",
  "/barang",
  "/laporan",
  "/diskon",
  "/admin",
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get("user");
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Cegah akses ke "/" jika sudah login
  if (pathname === "/" && userCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Cegah akses ke "/signup" jika sudah login
  if (pathname === "/signup" && userCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Cegah akses ke halaman yang dilindungi jika belum login
  if (isProtected && !userCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Validasi khusus role admin untuk akses /admin
  if (pathname.startsWith("/admin")) {
    try {
      const user = JSON.parse(userCookie.value);
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      // Jika parsing gagal atau cookie rusak, redirect ke login
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signup",
    "/dashboard/:path*",
    "/transaksi/:path*",
    "/barang/:path*",
    "/laporan/:path*",
    "/diskon/:path*",
    "/admin/:path*",
  ],
};
