import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { isAuthenticated, isAdmin } from "@/app/lib/auth";
import Payment from "@/app/api/models/Payment";

// Get a single payment
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

    await connectToDatabase();

    // Find payment by ID
    const payment = await Payment.findById(params.id).populate(
      "userId",
      "name email pgId"
    );

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    // Normal users can only see their own payments
    if (!isAdmin(user) && payment.userId.toString() !== user._id) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a payment (admin only)
export async function PUT(
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

    const {
      amount,
      months,
      paymentDate,
      dueDate,
      paymentStatus,
      paymentMethod,
      transactionId,
      remarks,
      isDepositPayment,
    } = await request.json();

    // Find the payment
    const paymentToUpdate = await Payment.findById(params.id);

    if (!paymentToUpdate) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    // If months are being updated, validate that there are no conflicts
    if (months !== undefined) {
      const selectedMonths = Array.isArray(months) ? months : [months];

      // Check for existing payments for the same user and months (excluding current payment and deposit payments)
      const existingPayments = await Payment.find({
        _id: { $ne: params.id }, // Exclude current payment
        userId: paymentToUpdate.userId,
        months: { $in: selectedMonths },
        isActive: true,
        isDepositPayment: false, // Exclude deposit payments from this validation
      });

      if (existingPayments.length > 0) {
        // Find which months already have payments
        const existingMonths = existingPayments.flatMap(
          (payment) => payment.months
        );
        const conflictingMonths = selectedMonths.filter((month) =>
          existingMonths.includes(month)
        );

        return NextResponse.json(
          {
            success: false,
            message: `Payment already exists for the following month(s): ${conflictingMonths.join(", ")}. Each user can only have one payment entry per month.`,
          },
          { status: 400 }
        );
      }
    }

    // Update fields if provided
    if (amount !== undefined) paymentToUpdate.amount = amount;
    if (months !== undefined) paymentToUpdate.months = months;
    if (paymentDate !== undefined) paymentToUpdate.paymentDate = paymentDate;
    if (dueDate !== undefined) paymentToUpdate.dueDate = dueDate;
    if (paymentStatus !== undefined)
      paymentToUpdate.paymentStatus = paymentStatus;
    if (paymentMethod !== undefined)
      paymentToUpdate.paymentMethod = paymentMethod;
    if (transactionId !== undefined)
      paymentToUpdate.transactionId = transactionId;
    if (remarks !== undefined) paymentToUpdate.remarks = remarks;
    if (isDepositPayment !== undefined)
      paymentToUpdate.isDepositPayment = isDepositPayment;

    // Save the updated payment
    await paymentToUpdate.save();

    return NextResponse.json({
      success: true,
      message: "Payment updated successfully",
      payment: paymentToUpdate,
    });
  } catch (error) {
    console.error("Update payment error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a payment (admin only)
export async function DELETE(
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

    // Find the payment
    const paymentToDelete = await Payment.findById(params.id);

    if (!paymentToDelete) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    // Soft delete the payment
    paymentToDelete.isActive = false;
    await paymentToDelete.save();

    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Delete payment error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
