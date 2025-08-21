import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { isAuthenticated, isAdmin } from "@/app/lib/auth";
import User from "@/app/api/models/User";
import Payment from "@/app/api/models/Payment";
import DueSettlement from "@/app/api/models/DueSettlement";

// POST /api/users/[id]/settle-due - Settle a user's due amount for a specific month
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    // Check if user is authenticated and is an admin
    const { isAuth, user } = await isAuthenticated();

    if (!isAuth || !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    if (!isAdmin(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin privileges required.",
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { id: userId } = params;
    const { month, amount, reason, remarks } = await request.json();

    // Validate required fields
    if (!month || !amount || !reason) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide month, amount, and reason",
        },
        { status: 400 }
      );
    }

    // Validate month format
    const monthRegex = /^[A-Za-z]+ \d{4}$/;
    if (!monthRegex.test(month)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid month format. Use 'Month Year' format (e.g., 'September 2025')",
        },
        { status: 400 }
      );
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Amount must be a positive number",
        },
        { status: 400 }
      );
    }

    // Validate reason
    const validReasons = [
      "Mid-month entry",
      "Special discount",
      "Compensation",
      "Admin discretion",
      "Other",
    ];

    if (!validReasons.includes(reason)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid reason. Please select a valid reason from the list.",
        },
        { status: 400 }
      );
    }

    // Find the user with room details
    const userToSettle = await User.findById(userId).populate("roomId");

    if (!userToSettle) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has a room assigned
    if (!userToSettle.roomId || typeof userToSettle.roomId !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "User does not have a room assigned",
        },
        { status: 400 }
      );
    }

    const roomPrice = userToSettle.roomId.price;
    if (!roomPrice || roomPrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User's room does not have a valid price",
        },
        { status: 400 }
      );
    }

    // Calculate current due amount for the specified month
    const userPaymentsForMonth = await Payment.find({
      userId,
      months: { $in: [month] },
      isActive: true,
      isDepositPayment: false,
    });

    let totalAmountPaidForMonth = 0;
    for (const payment of userPaymentsForMonth) {
      if (payment.paymentStatus === "Paid") {
        totalAmountPaidForMonth += payment.amount;
      }
    }

    // Check for existing settlements for this month
    const existingSettlements = await DueSettlement.find({
      userId,
      month,
      isActive: true,
    });

    const totalSettledAmount = existingSettlements.reduce(
      (sum, settlement) => sum + settlement.amount,
      0
    );

    // Calculate effective due amount
    const effectiveDue =
      roomPrice - totalAmountPaidForMonth - totalSettledAmount;

    // Validate settlement amount
    if (amount > effectiveDue) {
      return NextResponse.json(
        {
          success: false,
          message: `Settlement amount (₹${amount}) cannot exceed the due amount (₹${effectiveDue})`,
        },
        { status: 400 }
      );
    }

    if (effectiveDue <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No due amount exists for this month",
        },
        { status: 400 }
      );
    }

    // Check if there's already a settlement for this exact amount and month
    const existingSettlement = await DueSettlement.findOne({
      userId,
      month,
      amount,
      reason,
      isActive: true,
    });

    if (existingSettlement) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A settlement with the same details already exists for this month",
        },
        { status: 400 }
      );
    }

    // Create the settlement record
    const newSettlement = new DueSettlement({
      userId,
      month,
      amount,
      reason,
      remarks: remarks || undefined,
      settledBy: user._id,
      settledAt: new Date(),
      isActive: true,
    });

    await newSettlement.save();

    // Populate the settlement with user and admin details for response
    await newSettlement.populate([
      { path: "user", select: "name email pgId" },
      { path: "admin", select: "name" },
    ]);

    return NextResponse.json({
      success: true,
      message: "Due amount settled successfully",
      settlement: newSettlement,
      remainingDue: effectiveDue - amount,
    });
  } catch (error) {
    console.error("Settle due error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/users/[id]/settle-due - Get settlement history for a user
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  try {
    // Check if user is authenticated
    const { isAuth, user } = await isAuthenticated();

    if (!isAuth || !user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Only admins can view settlement history
    if (!isAdmin(user)) {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied. Admin privileges required.",
        },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { id: userId } = params;

    // Get settlement history for the user
    const settlements = await DueSettlement.find({
      userId,
      isActive: true,
    })
      .populate("admin", "name")
      .sort({ settledAt: -1 });

    return NextResponse.json({
      success: true,
      settlements,
    });
  } catch (error) {
    console.error("Get settlement history error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
