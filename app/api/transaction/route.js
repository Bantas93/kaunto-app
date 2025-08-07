// app/api/transaction/route.js
import { NextResponse } from "next/server";
import { saveTransaction } from "@/app/lib/data-service";

export async function POST(req) {
  try {
    const body = await req.json();

    if (
      !body.user_id ||
      !body.transaction_number ||
      !body.total_amount ||
      !body.payment_method ||
      !Array.isArray(body.items) ||
      !body.user_id
    ) {
      return NextResponse.json(
        { error: "Invalid transaction payload." },
        { status: 400 }
      );
    }

    const result = await saveTransaction(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to save transaction.", detail: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
      createdDate: result.createdDate,
    });
  } catch (error) {
    console.error("POST /api/transaction error:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
