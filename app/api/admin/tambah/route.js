// app/api/admin/tambah/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();

    // Validasi form kosong
    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Form tidak bisa kosong" },
        { status: 400 }
      );
    }

    // Validasi spasi pada name
    if (name.includes(" ")) {
      return NextResponse.json(
        { success: false, message: "Spasi tidak dianjurkan" },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // Cek apakah kombinasi name dan email sudah ada
    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .eq("email", email);

    if (existingError) throw existingError;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: "Akun user sudah pernah daftar" },
        { status: 400 }
      );
    }

    // Cek jika hanya email saja yang sudah terpakai
    const { data: emailExists, error: emailError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (emailError) throw emailError;

    if (emailExists.length > 0) {
      return NextResponse.json(
        { success: false, message: "Email sudah digunakan." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role,
        created_at: new Date(),
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json(
      { success: true, message: "Penambahan berhasil!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Tambah error:", error.message);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
