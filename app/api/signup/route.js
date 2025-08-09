// app/api/signup/route.js
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Validasi input
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: "Form tidak boleh kosong." }),
        { status: 400 }
      );
    }

    if (name.includes(" ")) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Spasi tidak dianjurkan di username.",
        }),
        { status: 400 }
      );
    }

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

    // Cek apakah username sudah digunakan
    const { data: nameExists, error: nameError } = await supabase
      .from("users")
      .select("*")
      .eq("name", name);

    if (nameError) throw nameError;

    if (nameExists.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username sudah digunakan.",
        }),
        { status: 400 }
      );
    }

    // Cek apakah email sudah digunakan
    const { data: emailExists, error: emailError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (emailError) throw emailError;

    if (emailExists.length > 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Email sudah digunakan." }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        role,
        created_at: new Date(), // PostgreSQL timestamp
      },
    ]);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, message: "Pendaftaran berhasil!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Terjadi kesalahan server." }),
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { name, email, password, role } = body;

//     // Validasi input
//     if (!name || !email || !password) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Form tidak boleh kosong." }),
//         { status: 400 }
//       );
//     }

//     if (name.includes(" ")) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: "Spasi tidak dianjurkan di username.",
//         }),
//         { status: 400 }
//       );
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: "Format email tidak valid.",
//         }),
//         { status: 400 }
//       );
//     }

//     // Cek apakah username sudah digunakan
//     const [nameExists] = await db.execute(
//       "SELECT * FROM users WHERE name = ?",
//       [name]
//     );
//     if (nameExists.length > 0) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: "Username sudah digunakan.",
//         }),
//         { status: 400 }
//       );
//     }

//     // Cek apakah email sudah digunakan
//     const [emailExists] = await db.execute(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );
//     if (emailExists.length > 0) {
//       return new Response(
//         JSON.stringify({ success: false, message: "Email sudah digunakan." }),
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Simpan ke database
//     await db.execute(
//       "INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
//       [name, email, hashedPassword, role]
//     );

//     return new Response(
//       JSON.stringify({ success: true, message: "Pendaftaran berhasil!" }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Signup error:", error);
//     return new Response(
//       JSON.stringify({ success: false, message: "Terjadi kesalahan server." }),
//       { status: 500 }
//     );
//   }
// }
