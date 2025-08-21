import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import { isAuthenticated, isAdmin } from "@/app/lib/auth";
import { calculateDuesForUsers } from "@/app/lib/dueCalculator";

// POST /api/users/calculate-dues - Calculate dues for all users
export async function POST(request: NextRequest) {
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

    const { users } = await request.json();

    if (!users || !Array.isArray(users)) {
      return NextResponse.json(
        { success: false, message: "Users array is required" },
        { status: 400 }
      );
    }

    // Calculate dues for all users
    const processedUsers = await calculateDuesForUsers(users);

    return NextResponse.json({
      success: true,
      users: processedUsers,
    });
  } catch (error) {
    console.error("Calculate dues error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
