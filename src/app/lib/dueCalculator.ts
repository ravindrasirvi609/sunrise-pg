import Payment from "@/app/api/models/Payment";
import DueSettlement from "@/app/api/models/DueSettlement";

export interface DueCalculationResult {
  roomPrice: number;
  totalPaid: number;
  totalSettled: number;
  effectiveDue: number;
  isFullyPaid: boolean;
  isPartiallyPaid: boolean;
  status: "Paid" | "Unpaid" | "N/A";
}

/**
 * Calculate due amount for a user for a specific month
 * @param userId - User ID
 * @param month - Month in "Month Year" format (e.g., "September 2025")
 * @param roomPrice - Room price/rent amount
 * @returns DueCalculationResult object with detailed breakdown
 */
export async function calculateDueForMonth(
  userId: string,
  month: string,
  roomPrice: number
): Promise<DueCalculationResult> {
  if (!roomPrice || roomPrice <= 0) {
    return {
      roomPrice: 0,
      totalPaid: 0,
      totalSettled: 0,
      effectiveDue: 0,
      isFullyPaid: false,
      isPartiallyPaid: false,
      status: "N/A",
    };
  }

  // Get all payments for the user for the specified month
  const userPaymentsForMonth = await Payment.find({
    userId,
    months: { $in: [month] },
    isActive: true,
    isDepositPayment: false,
  });

  // Calculate total amount paid
  let totalPaid = 0;
  for (const payment of userPaymentsForMonth) {
    if (payment.paymentStatus === "Paid") {
      totalPaid += payment.amount;
    }
  }

  // Get all settlements for the user for the specified month
  const settlements = await DueSettlement.find({
    userId,
    month,
    isActive: true,
  });

  // Calculate total settled amount
  const totalSettled = settlements.reduce(
    (sum, settlement) => sum + settlement.amount,
    0
  );

  // Calculate effective due amount
  const effectiveDue = Math.max(0, roomPrice - totalPaid - totalSettled);

  // Determine payment status
  const totalCovered = totalPaid + totalSettled;
  const isFullyPaid = totalCovered >= roomPrice;
  const isPartiallyPaid = totalCovered > 0 && totalCovered < roomPrice;

  let status: "Paid" | "Unpaid" | "N/A" = "N/A";
  if (isFullyPaid) {
    status = "Paid";
  } else if (totalCovered === 0) {
    status = "Unpaid";
  } else {
    status = "Unpaid"; // Partially paid is still considered unpaid
  }

  return {
    roomPrice,
    totalPaid,
    totalSettled,
    effectiveDue,
    isFullyPaid,
    isPartiallyPaid,
    status,
  };
}

/**
 * Calculate due amounts for multiple users for the current month
 * @param users - Array of users with room information
 * @returns Array of users with due calculations
 */
export async function calculateDuesForUsers(users: any[]): Promise<any[]> {
  const currentDate = new Date();
  const currentMonthYear = `${currentDate.toLocaleString("default", { month: "long" })} ${currentDate.getFullYear()}`;

  const processedUsers = await Promise.all(
    users.map(async (user) => {
      const roomPrice =
        typeof user.roomId === "object" && user.roomId?.price
          ? user.roomId.price
          : 0;

      if (roomPrice <= 0) {
        return {
          ...user,
          currentMonthRentStatus: "N/A" as const,
          dueAmount: 0,
        };
      }

      const dueCalculation = await calculateDueForMonth(
        user._id,
        currentMonthYear,
        roomPrice
      );

      return {
        ...user,
        currentMonthRentStatus: dueCalculation.status,
        dueAmount: dueCalculation.effectiveDue,
      };
    })
  );

  return processedUsers;
}

/**
 * Get settlement history for a user
 * @param userId - User ID
 * @returns Array of settlements
 */
export async function getSettlementHistory(userId: string) {
  return await DueSettlement.find({
    userId,
    isActive: true,
  })
    .populate("admin", "name")
    .sort({ settledAt: -1 });
}
