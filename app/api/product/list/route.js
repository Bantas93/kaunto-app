import { NextResponse } from "next/server";
import { getProducts } from "@/app/lib/data-service";

export async function GET() {
  try {
    const data = await getProducts();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("API /product/list error:", error.message);
    return NextResponse.json([], { status: 200 }); // tetap kirim array kosong
  }
}
