"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { formatDate } from "@/utils/formatDate";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Pencil,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  ArrowLeft,
  Trash2,
  Home,
  Building,
  FileText,
  CreditCard,
  UserCheck,
  MapPin as Location,
  Briefcase,
  CheckCircle,
  Bed,
} from "lucide-react";
import AdminRoomChange from "@/components/AdminRoomChange";
import DeleteUserDialog from "@/components/DeleteUserDialog";

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  isAdmin?: boolean;
  role?: string;
  registrationStatus?: string;
  fathersName?: string;
  permanentAddress?: string;
  city?: string;
  state?: string;
  guardianMobileNumber?: string;
  validIdType?: string;
  companyName?: string;
  companyAddress?: string;
  employeeId?: string;
  validIdPhoto?: string;
  profileImage?: string;
  documents?: string[];
  bedNumber?: string | null;
  isActive?: boolean;
  approvalDate?: string;
  moveInDate?: string;
  pgId?: string;
  depositFees?: number;
  keyIssued?: boolean;
  depositReturn?: {
    amount: number;
    date?: string;
  };
  roomId?:
    | {
        _id: string;
        roomNumber: string;
        type: string;
        price: number;
      }
    | string
    | null;
  payments?: {
    _id: string;
    amount: number;
    months: string[];
    paymentDate: string;
    paymentStatus: "Paid" | "Due" | "Overdue" | "Partial" | "Pending";
    receiptNumber?: string;
    paymentMethod: "Cash" | "UPI" | "Bank Transfer" | "Card" | "Other";
    transactionId?: string;
    remarks?: string;
    isDepositPayment: boolean;
  }[];
}

interface ErrorResponse {
  success: boolean;
  message: string;
}

export default function UserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${id}`);
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          setError(null);
        } else {
          setError("Failed to load user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, refreshTrigger]);

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteUser = async (
    keyInfo: { keyIssued: boolean },
    depositInfo: {
      isReturning: boolean;
      amount: number;
    }
  ) => {
    try {
      setIsDeleting(true);

      const payload = {
        keyIssued: keyInfo.keyIssued,
        depositReturn: depositInfo.isReturning
          ? {
              amount: depositInfo.amount,
              date: new Date(),
            }
          : undefined,
      };

      const response = await axios.delete(`/api/users/${id}`, {
        data: payload,
      });

      if (response.data.success) {
        toast.success("User deactivated successfully");
        router.push("/admin/users");
      } else {
        toast.error(response.data.message || "Failed to deactivate user");
      }
    } catch (err) {
      console.error("Error deactivating user:", err);
      const axiosError = err as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || "Failed to deactivate user"
      );
    } finally {
      setIsDeleting(false);
      closeDeleteDialog();
    }
  };

  const handleRoomChanged = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !user) {
    return <NotFound message="User not found" />;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Breadcrumb and Actions */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span>Back to Users</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/admin/users/${id}/edit`}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow-sm"
            >
              <Pencil size={18} className="mr-2" />
              Edit User
            </Link>
            <button
              onClick={openDeleteDialog}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm"
              disabled={isDeleting}
            >
              <Trash2 size={18} className="mr-2" />
              Deactivate User
            </button>
          </div>
        </div>
      </div>

      {/* Delete User Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
        userName={user?.name || ""}
        currentDepositFees={user?.depositFees || 0}
      />

      {/* User Profile Card */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden mb-8">
        <div className="md:flex">
          {/* Profile Image / Initial Section */}
          <div className="md:w-1/3 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-800 dark:to-purple-900/30">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                width={128}
                height={128}
                className="rounded-full object-cover w-32 h-32 shadow-lg border-4 border-white dark:border-gray-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white dark:border-gray-700">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white text-center">
              {user.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {user.email}
            </p>
            <div className="mt-2 flex items-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  user.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
              <span
                className={`inline-flex items-center ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                }`}
              >
                <Shield size={14} className="mr-1" />
                {user.role || "User"}
              </span>
            </div>
          </div>

          {/* User Details Section */}
          <div className="md:w-2/3 p-6">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                User Information
              </h1>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Guardian Mobile
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.guardianMobileNumber || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <UserCheck className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Father&apos;s Name
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.fathersName || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Permanent Address
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.permanentAddress || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Location className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      City & State
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.city && user.state
                        ? `${user.city}, ${user.state}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Company Name
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.companyName || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Employee ID
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.employeeId || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Company Address
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.companyAddress || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      ID Type
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.validIdType || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Move-in Date
                    </p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {user.moveInDate
                        ? formatDate(user.moveInDate)
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Room Information
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-start">
              <Home className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Room Number
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {typeof user.roomId === "object" && user.roomId?.roomNumber
                    ? user.roomId.roomNumber
                    : "Not allocated"}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Bed className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bed Number
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {user.bedNumber || "Not allocated"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Dates & Status
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Registration Date
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            {user.approvalDate && (
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Approval Date
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(user.approvalDate)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Last Updated
                </p>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Room Change Component if user has a room assigned */}
      {user.isActive && (
        <div className="mb-8">
          <AdminRoomChange
            userId={user._id}
            currentRoomId={
              user.roomId
                ? typeof user.roomId === "object"
                  ? user.roomId._id
                  : (user.roomId as string)
                : undefined
            }
            onRoomChanged={handleRoomChanged}
          />
        </div>
      )}

      {/* Documents Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Documents
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Document */}
            {user.validIdPhoto && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID Document ({user.validIdType})
                  </h3>
                </div>
                <div className="p-4">
                  <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                    <Image
                      src={user.validIdPhoto}
                      alt="Valid ID"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <a
                      href={user.validIdPhoto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Passport Photo */}
            {user.profileImage && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Passport Photo
                  </h3>
                </div>
                <div className="p-4">
                  <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                    <Image
                      src={user.profileImage}
                      alt="Passport Photo"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <a
                      href={user.profileImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Documents */}
          {user.documents && user.documents.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Additional Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {user.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="p-3">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Document {index + 1}
                        </span>
                      </div>
                      <div className="mt-2">
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View Document
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p>No additional documents uploaded</p>
            </div>
          )}
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Payment History
          </h2>
        </div>
        <div className="p-6">
          {user.payments && user.payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Receipt No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Months
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {user.payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {payment.receiptNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {payment.months.join(", ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : payment.paymentStatus === "Partial"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {payment.isDepositPayment ? "Deposit" : "Rent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <CreditCard className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p>No payment history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
