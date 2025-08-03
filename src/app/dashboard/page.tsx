"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaDoorOpen,
  FaBed,
  FaRupeeSign,
  FaBell,
  FaExclamationCircle,
  FaFileInvoiceDollar,
  FaChevronRight,
  FaCalendarTimes,
  FaSignOutAlt,
  FaDownload,
  FaDoorClosed,
  FaBookOpen,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ExitSurvey from "@/components/ExitSurvey";

interface User {
  _id: string;
  name: string;
  email: string;
  pgId: string;
  phone: string;
  role?: "admin" | "user";
  roomId:
    | {
        _id: string;
        roomNumber: string;
        type: string;
        price: number;
      }
    | string
    | null;
  moveInDate: string;
  bedNumber?: number;
  guardianMobileNumber?: string;
  fathersName?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  validIdType?: string;
  companyName?: string;
  companyAddress?: string;
  validIdPhoto?: string;
  profileImage?: string;
  isOnNoticePeriod?: boolean;
  lastStayingDate?: string;
  isActive?: boolean;
  depositFees?: number;
  moveOutDate?: string;
}

interface Payment {
  _id: string;
  userId?: string;
  amount: number;
  month: string;
  months?: string[];
  paymentStatus: string;
  paymentDate: string;
  receiptNumber: string;
  dueDate?: string;
  paymentMethod?: string;
  transactionId?: string;
}

interface Complaint {
  _id: string;
  userId?: string;
  title: string;
  description: string;
  status: string;
  priority?: string;
  category?: string;
  adminResponse?: string;
  createdAt: string;
}

interface Notice {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
}

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [roomDetails, setRoomDetails] = useState<{
    _id: string;
    roomNumber: string;
    type: string;
    price: number;
  } | null>(null);
  const [isNoticePeriodDialogOpen, setIsNoticePeriodDialogOpen] =
    useState(false);
  const [lastStayingDate, setLastStayingDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticePeriodError, setNoticePeriodError] = useState("");
  const [noticePeriodSuccess, setNoticePeriodSuccess] = useState("");
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [isExitSurveyOpen, setIsExitSurveyOpen] = useState(false);
  const [isCompleteCheckout, setIsCompleteCheckout] = useState(false);

  useEffect(() => {
    // Fetch dashboard data
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch current user
        const userResponse = await axios.get("/api/auth/me");
        if (userResponse.data.success) {
          const userData = userResponse.data.user;
          console.log("User data:", userData);
          setUser(userData);

          // Fetch room details if roomId exists
          if (userData.roomId && typeof userData.roomId === "object") {
            console.log("Room ID is an object:", userData.roomId);
            setRoomDetails(userData.roomId);
          } else if (userData.roomId) {
            try {
              console.log("Fetching room details for roomId:", userData.roomId);
              const roomResponse = await axios.get(
                `/api/rooms/${userData.roomId}`
              );
              console.log("Room API response:", roomResponse.data);

              if (roomResponse.data.success && roomResponse.data.room) {
                // Extract relevant fields for our component
                const roomData = {
                  _id: roomResponse.data.room._id,
                  roomNumber: roomResponse.data.room.roomNumber,
                  type: roomResponse.data.room.type,
                  price: roomResponse.data.room.price,
                };
                console.log("Setting room details:", roomData);
                setRoomDetails(roomData);
              }
            } catch (err) {
              console.error("Error fetching room details:", err);
            }
          }
        }

        // Fetch payments
        const paymentsResponse = await axios.get("/api/payments");
        if (paymentsResponse.data.success) {
          setPayments(paymentsResponse.data.payments || []);
        }

        // Fetch complaints
        const complaintsResponse = await axios.get("/api/complaints");
        if (complaintsResponse.data.success) {
          setComplaints(complaintsResponse.data.complaints || []);
        }

        // Fetch notices
        const noticesResponse = await axios.get("/api/notices");
        if (noticesResponse.data.success) {
          setNotices(noticesResponse.data.notices || []);
        }

        setLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleNoticePeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset messages
    setNoticePeriodError("");
    setNoticePeriodSuccess("");

    if (!lastStayingDate) {
      setNoticePeriodError("Please select your last staying date");
      return;
    }

    // Calculate days between today and last staying date
    const today = new Date();
    const lastDate = new Date(lastStayingDate);
    const daysDifference = Math.ceil(
      (lastDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference < 15) {
      setNoticePeriodError("Notice period must be at least 15 days");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axios.post("/api/users/notice-period", {
        lastStayingDate: lastStayingDate,
        isEligibleForRefund: daysDifference > 15,
      });

      if (response.data.success) {
        setUser({
          ...user!,
          isOnNoticePeriod: true,
          lastStayingDate: lastStayingDate,
        });
        setNoticePeriodSuccess(
          response.data.message ||
            `Your notice period has been submitted successfully. ${daysDifference > 15 ? "You are eligible for a ₹1500 refund from your booking amount." : "No refund will be provided as notice period is less than 15 days."}`
        );
        // Close dialog after 2 seconds
        setTimeout(() => {
          setIsNoticePeriodDialogOpen(false);
          setNoticePeriodSuccess("");
        }, 2000);
      } else {
        setNoticePeriodError(
          response.data.message || "Failed to submit notice period"
        );
      }
    } catch (error: unknown) {
      console.error("Error submitting notice period:", error);
      if (axios.isAxiosError(error) && error.response) {
        setNoticePeriodError(
          error.response.data?.message || "Failed to submit notice period"
        );
      } else {
        setNoticePeriodError("Failed to submit notice period");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdrawNoticePeriod = async () => {
    // Reset messages
    setWithdrawError("");
    setWithdrawSuccess("");

    try {
      setIsSubmitting(true);

      const response = await axios.post("/api/users/notice-period", {
        isWithdrawal: true,
      });

      if (response.data.success) {
        setUser({
          ...user!,
          isOnNoticePeriod: false,
          lastStayingDate: undefined,
        });
        setWithdrawSuccess(
          response.data.message ||
            "Your notice period has been withdrawn successfully"
        );
        // Close dialog after 2 seconds
        setTimeout(() => {
          setIsWithdrawDialogOpen(false);
          setWithdrawSuccess("");
        }, 2000);
      } else {
        setWithdrawError(
          response.data.message || "Failed to withdraw notice period"
        );
      }
    } catch (error: unknown) {
      console.error("Error withdrawing notice period:", error);
      if (axios.isAxiosError(error) && error.response) {
        setWithdrawError(
          error.response.data?.message || "Failed to withdraw notice period"
        );
      } else {
        setWithdrawError("Failed to withdraw notice period");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle checkout request
  const handleCheckoutRequest = async () => {
    if (!user?._id) return;

    try {
      setIsSubmitting(true);

      // First we'll show the exit survey
      setIsCheckoutDialogOpen(false);
      setIsExitSurveyOpen(true);
    } catch (error: unknown) {
      console.error("Error starting checkout process:", error);

      setIsSubmitting(false);
    }
  };

  // Complete the checkout with survey data
  const handleCompleteSurvey = async (surveyData?: unknown) => {
    if (!user?._id) return;

    try {
      setIsSubmitting(true);

      const response = await axios.post(`/api/users/${user._id}/checkout`, {
        exitSurvey: surveyData,
        skipSurvey: !surveyData,
      });

      if (response.data.success) {
        toast.success("Checkout process completed. Thank you for your stay!");
        setIsExitSurveyOpen(false);
        setIsCompleteCheckout(true);

        // Refresh the page after a short delay
        setTimeout(() => {
          router.refresh();
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to complete checkout");
      }
    } catch (error: unknown) {
      console.error("Error completing checkout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle survey cancellation
  const handleCancelSurvey = () => {
    setIsExitSurveyOpen(false);
    // Option to skip survey
    if (
      confirm(
        "Are you sure you want to skip the exit survey? Your feedback helps us improve."
      )
    ) {
      handleCompleteSurvey();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg p-8 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Unable to load profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get current month for displaying payment status
  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Find payment for current month by checking both month field and months array
  const currentMonthPayment = payments.find(
    (payment) =>
      payment.month === currentMonth ||
      (payment.months &&
        Array.isArray(payment.months) &&
        payment.months.includes(currentMonth))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Profile Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-gradient-to-r from-pink-500/10 via-indigo-300/10 to-purple-600/10 dark:from-pink-500/10 dark:via-indigo-500/5 dark:to-purple-600/10 rounded-2xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-pink-200/20 dark:hover:shadow-pink-700/20 transition-all duration-300 p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Profile Image */}
          <motion.div
            className="mb-4 md:mb-0 md:mr-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-pink-500 via-pink-400 to-purple-600 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/80 dark:border-gray-800/80 shadow-lg">
              {user?.profileImage && user.profileImage.trim() !== "" ? (
                <Image
                  src={user.profileImage}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <Image
                  src="/default-avatar.png"
                  alt="Default Avatar"
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              )}
            </div>
          </motion.div>

          {/* User Info */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400">
              {user?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-3">
              <motion.div
                className="flex items-center px-3 py-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 shadow-sm"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
              >
                <FaIdCard className="mr-2 text-pink-500 dark:text-pink-400" />
                <span className="font-medium">{user?.pgId}</span>
              </motion.div>
              <motion.div
                className="flex items-center px-3 py-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 shadow-sm"
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
              >
                <FaDoorOpen className="mr-2 text-purple-500 dark:text-purple-400" />
                <span className="font-medium">
                  Room{" "}
                  {roomDetails
                    ? roomDetails.roomNumber
                    : typeof user?.roomId === "object" &&
                        user?.roomId?.roomNumber
                      ? user.roomId.roomNumber
                      : "Not Assigned"}
                </span>
              </motion.div>
              {user?.bedNumber && (
                <motion.div
                  className="flex items-center px-3 py-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700 shadow-sm"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(255,255,255,0.7)",
                  }}
                >
                  <FaBed className="mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span className="font-medium">Bed #{user.bedNumber}</span>
                </motion.div>
              )}
              {user?.isOnNoticePeriod && user?.lastStayingDate && (
                <motion.div
                  className="flex items-center px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/30 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <FaCalendarTimes className="mr-2" />
                  <span className="font-medium">
                    Leaving on{" "}
                    {new Date(user.lastStayingDate).toLocaleDateString("en-IN")}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <Link
                href="/rules-regulations"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FaBookOpen className="mr-2" />
                Rules & Regulations
              </Link>

              {!user?.isOnNoticePeriod && !user?.moveOutDate && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNoticePeriodDialogOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FaSignOutAlt className="mr-2" />
                  Submit Notice
                </motion.button>
              )}
              {user?.isOnNoticePeriod && !user?.moveOutDate && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsWithdrawDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <FaCalendarAlt className="mr-2" />
                    Withdraw Notice
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCheckoutDialogOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaDoorClosed className="mr-2" />
                    Checkout Now
                  </motion.button>
                </>
              )}
              {user?.moveOutDate && (
                <div className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  <FaDoorClosed className="mr-2" />
                  Checked out on{" "}
                  {new Date(user.moveOutDate).toLocaleDateString("en-IN")}
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment Status Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-6 md:mt-0 md:ml-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`rounded-xl p-5 shadow-lg ${
                currentMonthPayment
                  ? currentMonthPayment.paymentStatus === "Paid"
                    ? "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 border border-green-200 dark:border-green-800/50"
                    : currentMonthPayment.paymentStatus === "Partial"
                      ? "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800/50"
                      : "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border border-red-200 dark:border-red-800/50"
                  : "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 border border-red-200 dark:border-red-800/50"
              }`}
            >
              <div className="flex items-center mb-2">
                <FaRupeeSign
                  className={`mr-2 ${
                    currentMonthPayment
                      ? currentMonthPayment.paymentStatus === "Paid"
                        ? "text-green-600 dark:text-green-400"
                        : currentMonthPayment.paymentStatus === "Partial"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentMonth} Rent
                </h3>
              </div>
              <p
                className={`text-2xl font-bold ${
                  currentMonthPayment
                    ? currentMonthPayment.paymentStatus === "Paid"
                      ? "text-green-700 dark:text-green-400"
                      : currentMonthPayment.paymentStatus === "Partial"
                        ? "text-yellow-700 dark:text-yellow-400"
                        : "text-red-700 dark:text-red-400"
                    : "text-red-700 dark:text-red-400"
                }`}
              >
                {currentMonthPayment
                  ? currentMonthPayment.paymentStatus
                  : "Due"}
              </p>
              <p className="text-sm mt-1 font-medium">
                {currentMonthPayment
                  ? `Paid on ${new Date(currentMonthPayment.paymentDate).toLocaleDateString()}`
                  : roomDetails?.price
                    ? `₹${roomDetails.price.toLocaleString("en-IN")} due`
                    : typeof user?.roomId === "object" && user?.roomId?.price
                      ? `₹${user.roomId.price.toLocaleString("en-IN")} due`
                      : ""}
              </p>
              {!currentMonthPayment && (
                <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800/30">
                  <Link
                    href="/dashboard/payments/new"
                    className="text-xs text-red-700 dark:text-red-400 font-medium hover:underline flex items-center"
                  >
                    Pay Now <FaChevronRight className="ml-1 text-xs" />
                  </Link>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex overflow-x-auto mb-8 backdrop-blur-md bg-white/50 dark:bg-gray-800/50 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        {["overview", "payments", "complaints", "notices"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
              activeTab === tab
                ? "text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-gray-700/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Content based on active tab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === "overview" && (
          <>
            {/* Roommate Conflict Resolution Warning */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-3 mb-6"
            >
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaExclamationCircle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Important Notice: Roommate Conflict Resolution
                    </h3>
                    <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                      <p>
                        If you experience any issues with your roommate's
                        behavior, please:
                      </p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>
                          Do not engage in direct conflicts or confrontations
                        </li>
                        <li>Report the matter directly to the PG office</li>
                        <li>
                          Let the management handle the situation professionally
                        </li>
                        <li>
                          Remember: Getting involved in conflicts may make you
                          equally responsible
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div> */}

            {/* Notice Period Policy Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="lg:col-span-3 mb-6"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FaCalendarAlt className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Notice Period Policy
                    </h3>
                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                      <p className="mb-2">
                        When planning to leave the PG, please note our notice
                        period policy:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Minimum notice period required: 15 days</li>
                        <li>
                          If notice period is more than 15 days: ₹1500 refund
                          from booking amount
                        </li>
                        <li>
                          If notice period is less than 15 days: No refund will
                          be provided
                        </li>
                      </ul>
                      <p className="mt-2 text-blue-600 dark:text-blue-400">
                        Please plan your departure accordingly to ensure you
                        receive the refund.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Personal Information Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="backdrop-blur-lg bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-800/80 dark:to-gray-800/50 rounded-xl border border-white/30 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:col-span-1"
            >
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-6 flex items-center">
                <div className="p-2 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white mr-3">
                  <FaUser />
                </div>
                Personal Information
              </h2>

              <div className="space-y-5">
                <motion.div
                  whileHover={{ x: 5 }}
                  className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Full Name
                  </h3>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {user?.name}
                  </p>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-pink-500 dark:text-pink-400" />
                      Email Address
                    </div>
                  </h3>
                  <p className="text-gray-900 dark:text-white">{user?.email}</p>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <div className="flex items-center">
                      <FaPhone className="mr-2 text-purple-500 dark:text-purple-400" />
                      Phone Number
                    </div>
                  </h3>
                  <p className="text-gray-900 dark:text-white">{user?.phone}</p>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <div className="flex items-center">
                      <FaIdCard className="mr-2 text-indigo-500 dark:text-indigo-400" />
                      PG ID
                    </div>
                  </h3>
                  <p className="text-gray-900 dark:text-white">{user?.pgId}</p>
                </motion.div>

                <motion.div
                  whileHover={{ x: 5 }}
                  className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-2 text-pink-500 dark:text-pink-400" />
                      Move-in Date
                    </div>
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(user?.moveInDate || "").toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </motion.div>

                {user?.guardianMobileNumber && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <div className="flex items-center">
                        <FaPhone className="mr-2 text-indigo-500 dark:text-indigo-400" />
                        Emergency Contact
                      </div>
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {user.guardianMobileNumber}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Room Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="backdrop-blur-lg bg-gradient-to-br from-white/80 to-white/50 dark:from-gray-800/80 dark:to-gray-800/50 rounded-xl border border-white/30 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:col-span-1"
            >
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-6 flex items-center">
                <div className="p-2 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white mr-3">
                  <FaDoorOpen />
                </div>
                Room Information
              </h2>

              {roomDetails ? (
                <div className="space-y-5">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-r from-purple-500/10 to-indigo-600/10 dark:from-purple-500/5 dark:to-indigo-600/5 rounded-lg p-6 border border-purple-200 dark:border-purple-900/30 mb-6 text-center shadow-md"
                  >
                    <h3 className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 mb-2">
                      Room {roomDetails.roomNumber || "Not assigned"}
                    </h3>
                    <div className="flex justify-center mb-2 text-yellow-400">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/70 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 text-sm font-medium border border-purple-100 dark:border-purple-900/30 shadow-sm">
                      {roomDetails.type
                        ? `${roomDetails.type.charAt(0).toUpperCase() + roomDetails.type.slice(1)} Room`
                        : "Room"}
                      {user?.bedNumber ? ` • Bed #${user.bedNumber}` : ""}
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Room Type
                    </h3>
                    <p className="text-gray-900 dark:text-white capitalize flex items-center">
                      <FaDoorOpen className="mr-2 text-purple-500" />
                      {roomDetails.type || "Not specified"}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <div className="flex items-center">
                        <FaRupeeSign className="mr-2 text-indigo-500 dark:text-indigo-400" />
                        Monthly Rent
                      </div>
                    </h3>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {roomDetails.price
                        ? `₹${roomDetails.price.toLocaleString("en-IN")}`
                        : "₹"}
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <div className="flex items-center">
                        <FaBed className="mr-2 text-purple-500 dark:text-purple-400" />
                        Bed Number
                      </div>
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {user?.bedNumber || "Not assigned"}
                    </p>
                  </motion.div>
                </div>
              ) : (
                <div className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-6 mb-6 shadow-sm text-center"
                  >
                    <div className="bg-yellow-100 dark:bg-yellow-800/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaExclamationCircle className="text-yellow-600 dark:text-yellow-400 text-xl" />
                    </div>
                    <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      No Room Assigned
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      Please contact the administration to get a room assigned
                      to you.
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Room
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      Not assigned
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Room Type
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      Not specified
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <div className="flex items-center">
                        <FaRupeeSign className="mr-2 text-indigo-500 dark:text-indigo-400" />
                        Monthly Rent
                      </div>
                    </h3>
                    <p className="text-gray-900 dark:text-white font-medium">
                      ₹
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 5 }}
                    className="p-3 rounded-lg bg-white/70 dark:bg-gray-700/30 hover:bg-white/90 dark:hover:bg-gray-700/50 transition-all duration-200"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      <div className="flex items-center">
                        <FaBed className="mr-2 text-purple-500 dark:text-purple-400" />
                        Bed Number
                      </div>
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {user?.bedNumber || "Not assigned"}
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </>
        )}

        {activeTab === "payments" && (
          <div className="lg:col-span-3">
            <div className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <FaFileInvoiceDollar className="mr-3 text-pink-600" />
                  Payment History
                </h2>
              </div>

              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Payment Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white/30 dark:bg-gray-800/30">
                      {payments.map((payment) => (
                        <tr
                          key={payment._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {payment.month ||
                              (payment.months && payment.months.join(", "))}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            ₹{payment.amount.toLocaleString("en-IN")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                payment.paymentStatus === "Paid"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                  : payment.paymentStatus === "Partial"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                              }`}
                            >
                              {payment.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(payment.paymentDate).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Link
                              href={`/api/payments/${payment._id}/receipt`}
                              className="inline-flex items-center px-3 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded text-sm font-medium transition-all duration-200"
                            >
                              <FaDownload className="mr-1" />
                              Download
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFileInvoiceDollar className="text-gray-400 dark:text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No payment records
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                    You don&apos;t have any payment records yet. Once you make
                    payments, they will appear here.
                  </p>
                  <Link
                    href="/dashboard/payments/new"
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    Make Your First Payment
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "complaints" && (
          <div className="lg:col-span-3">
            <div className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                  <BiSolidMessageSquareDetail className="mr-3 text-pink-600" />
                  My Complaints
                </h2>

                <Link
                  href="/dashboard/complaints/new"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  New Complaint
                </Link>
              </div>

              {complaints.length > 0 ? (
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-3 md:mb-0">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {complaint.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {complaint.description}
                          </p>
                        </div>

                        <div className="flex flex-col md:items-end space-y-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                              complaint.status === "Open"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                                : complaint.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                            }`}
                          >
                            {complaint.status}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(complaint.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <Link
                          href={`/dashboard/complaints/${complaint._id}`}
                          className="text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400 text-sm font-medium flex items-center"
                        >
                          View Details
                          <FaChevronRight className="ml-1 text-xs" />
                        </Link>
                      </div> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BiSolidMessageSquareDetail className="text-gray-400 dark:text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No complaints yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                    You haven&apos;t filed any complaints yet. If you encounter
                    any issues with your accommodation, please let us know.
                  </p>
                  <Link
                    href="/dashboard/complaints/new"
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
                  >
                    Report an Issue
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "notices" && (
          <div className="lg:col-span-3">
            <div className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center mb-6">
                <FaBell className="mr-3 text-pink-600" />
                Notices & Announcements
              </h2>

              {notices.length > 0 ? (
                <div className="space-y-6">
                  {notices.map((notice) => (
                    <div
                      key={notice._id}
                      className="bg-white/70 dark:bg-gray-800/70 rounded-lg border-l-4 border-pink-500 border-t border-r border-b  dark:border-gray-700 p-5 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {notice.title}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                          {new Date(notice.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mt-3 mb-3">
                        {notice.description}
                      </p>

                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        Posted by:{" "}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {notice.createdBy.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBell className="text-gray-400 dark:text-gray-500 text-3xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No notices available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    There are no notices or announcements at the moment. Check
                    back later for updates.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notice Period Dialog */}
      {isNoticePeriodDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsNoticePeriodDialogOpen(false)}
            ></div>

            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user?.isOnNoticePeriod
                    ? "Update Notice Period"
                    : "Submit Notice Period"}
                </h3>
                <button
                  onClick={() => setIsNoticePeriodDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {user?.isOnNoticePeriod
                    ? "You can update your last staying date. Your notice period will be adjusted accordingly."
                    : "Please confirm your last staying date. Once submitted, your notice period will be activated."}
                </p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FaExclamationCircle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Notice Period Policy
                      </h3>
                      <div className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Minimum notice period required: 15 days</li>
                          <li>
                            If notice period is more than 15 days: ₹1500 refund
                            from booking amount
                          </li>
                          <li>
                            If notice period is less than 15 days: No refund
                            will be provided
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {noticePeriodError && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    {noticePeriodError}
                  </div>
                )}

                {noticePeriodSuccess && (
                  <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
                    {noticePeriodSuccess}
                  </div>
                )}

                <form onSubmit={handleNoticePeriodSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="lastStayingDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Last Staying Date
                    </label>
                    <input
                      type="date"
                      id="lastStayingDate"
                      value={lastStayingDate}
                      onChange={(e) => setLastStayingDate(e.target.value)}
                      min={
                        new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 15 days from today
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsNoticePeriodDialogOpen(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? "Submitting..."
                        : user?.isOnNoticePeriod
                          ? "Update Notice"
                          : "Submit Notice"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Notice Period Dialog */}
      {isWithdrawDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={() => setIsWithdrawDialogOpen(false)}
            ></div>

            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Withdraw Notice Period
                </h3>
                <button
                  onClick={() => setIsWithdrawDialogOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                {withdrawError && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    {withdrawError}
                  </div>
                )}

                {withdrawSuccess && (
                  <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
                    {withdrawSuccess}
                  </div>
                )}

                {!withdrawSuccess && (
                  <>
                    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 rounded-lg">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Are you sure?
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                            <p>
                              Withdrawing your notice period will cancel your
                              move-out process. You will continue to be a
                              resident without interruption.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsWithdrawDialogOpen(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleWithdrawNoticePeriod}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Confirmation Dialog */}
      {isCheckoutDialogOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <FaExclamationCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                      id="modal-title"
                    >
                      Confirm Checkout
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to checkout? This will mark your
                        stay as completed and you will need to return your key
                        and complete the exit process with management.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        You will also be asked to complete a short exit survey
                        to help us improve our services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCheckoutRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Proceed to Checkout"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={() => setIsCheckoutDialogOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exit Survey Dialog */}
      {isExitSurveyOpen && user && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <ExitSurvey
                userId={user._id}
                onComplete={handleCompleteSurvey}
                onCancel={handleCancelSurvey}
              />
            </div>
          </div>
        </div>
      )}

      {/* Checkout Complete Dialog */}
      {isCompleteCheckout && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-green-600 dark:text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                      id="modal-title"
                    >
                      Checkout Complete
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Thank you for your stay with us! Your checkout has been
                        processed successfully.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Please make sure to return your keys to the management
                        before leaving. We wish you all the best!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setIsCompleteCheckout(false);
                    router.refresh();
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
