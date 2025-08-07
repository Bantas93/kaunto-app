// app/api/admin/tambah/route.js
import db from "@/app/lib/db";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Validasi form kosong
    if (!name || !email) {
      return new Response(
        JSON.stringify({ success: false, message: "Form tidak bisa kosong" }),
        { status: 400 }
      );
    }

    // Validasi spasi pada name
    if (name.includes(" ")) {
      return new Response(
        JSON.stringify({ success: false, message: "Spasi tidak dianjurkan" }),
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Format email tidak valid.",
        }),
        { status: 400 }
      );
    }

    // Cek apakah kombinasi name dan email sudah ada
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE name = ? AND email = ?",
      [name, email]
    );

    if (existing.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Akun user sudah pernah daftar",
        }),
        { status: 400 }
      );
    }

    // Cek jika hanya email saja yang sudah terpakai
    const [emailExists] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (emailExists.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Email sudah digunakan." }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    await db.execute(
      "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [name, email, hashedPassword, role]
    );

    return new Response(
      JSON.stringify({ success: true, message: "Penambahan berhasil!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Tambah error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Terjadi kesalahan server." }),
      { status: 500 }
    );
  }
}
