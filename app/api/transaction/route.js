// app/api/transaction/route.js
import { NextResponse } from "next/server";
import { saveTransaction } from "@/app/lib/data-service";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      user_id,
      transaction_number,
      total_amount,
      payment_method,
      items,
      tax,
    } = body;

    // Validasi basic
    if (
      !user_id ||
      !transaction_number ||
      typeof total_amount !== "number" ||
      !payment_method ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid transaction payload." },
        { status: 400 }
      );
    }

    const result = await saveTransaction({
      user_id,
      transaction_number,
      total_amount,
      payment_method,
      tax: tax || 0,
      items,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to save transaction.",
          detail:
            process.env.NODE_ENV === "development" ? result.error : undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      createdDate: result.createdDate || new Date(),
    });
  } catch (error) {
    console.error("POST /api/transaction error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
