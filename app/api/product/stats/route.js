// api/product/stats/route.js
import { NextResponse } from "next/server";
import { getAllData } from "@/app/lib/data-service";

export async function GET() {
  try {
    const data = await getAllData();
    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data statistik produk" },
      { status: 500 }
    );
  }
}
