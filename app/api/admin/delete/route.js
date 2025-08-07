// api/admin/delete/route.js
import { deleteUser } from "@/app/lib/data-service";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const user_id = formData.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { message: "User ID tidak ditemukan" },
        { status: 400 }
      );
    }

    await deleteUser(user_id);

    return NextResponse.redirect(new URL("/admin", request.url));
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    return NextResponse.json(
      { message: "Gagal menghapus user" },
      { status: 500 }
    );
  }
}
