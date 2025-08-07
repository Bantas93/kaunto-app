// app/api/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getUsers } from "@/app/lib/data-service";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, password } = body;

    if (!password || !name) {
      return NextResponse.json(
        { success: false, message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const users = await getUsers();

    const userByName = users.find(
      (user) => user.name || user.email === name || email
    );
    const userMatch = users.find(
      (user) => user.name === name || user.email === name
    );

    if (!userMatch) {
      if (!userByName) {
        return NextResponse.json(
          {
            success: false,
            message: "Username atau Email tidak cocok dengan data",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Anda belum terdaftar" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, userMatch.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Password salah" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login Berhasil",
      user: {
        user_id: userMatch.user_id,
        name: userMatch.name,
        role: userMatch.role || "kasir",
      },
    });
    response.cookies.set(
      "user",
      JSON.stringify({
        user_id: userMatch.user_id,
        name: userMatch.name,
        email: userMatch.email,
        role: userMatch.role || "kasir",
      }),
      {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }
    );

    return response;
  } catch (err) {
    console.error("LOGIN API ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
