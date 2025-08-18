// // api/product/stats/route.js
// import { NextResponse } from "next/server";
// import { getAllData } from "@/app/lib/data-service";

// export async function GET() {
//   try {
//     const data = await getAllData();
//     return NextResponse.json(data[0]);
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Gagal mengambil data statistik produk" },
//       { status: 500 }
//     );
//   }
// }

// api/product/stats/route.js
import { NextResponse } from "next/server";
import { getAllData } from "@/app/lib/data-service";

export async function GET(request) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const customStartDate = searchParams.get("startDate");
    const customEndDate = searchParams.get("endDate");

    console.log("API called with dates:", { customStartDate, customEndDate });

    const data = await getAllData(customStartDate, customEndDate);
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("Error in stats API:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data statistik produk" },
      { status: 500 }
    );
  }
}
