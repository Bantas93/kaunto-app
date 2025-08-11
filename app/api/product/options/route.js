// api/product/option/route.js
import { NextResponse } from "next/server";
import { getProductsOption } from "@/app/lib/data-service";

export async function GET() {
  try {
    const data = await getProductsOption();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("API /product/options error:", error.message);
    return NextResponse.json([], { status: 200 }); // tetap kirim array kosong
  }
}
