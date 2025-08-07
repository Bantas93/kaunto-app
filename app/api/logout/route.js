import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("user", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // Hapus cookie
  });

  return response;
}
