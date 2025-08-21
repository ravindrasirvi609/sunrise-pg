"use client";

import React, { useState, useEffect } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useToast } from "@/hooks/useToast";

interface User {
  _id: string;
  name: string;
  pgId: string;
  roomId?:
    | {
        _id: string;
        roomNumber: string;
        price: number;
        type: string;
      }
    | string
    | null;
}

interface SettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  month: string;
  dueAmount: number;
  onSuccess: () => void;
}

const SETTLEMENT_REASONS = [
  "Mid-month entry",
  "Special discount",
  "Compensation",
  "Admin discretion",
  "Other",
] as const;

type SettlementReason = (typeof SETTLEMENT_REASONS)[number];

export default function SettlementModal({
  isOpen,
  onClose,
  user,
  month,
  dueAmount,
  onSuccess,
}: SettlementModalProps) {
  const { toast } = useToast();

  // Form state
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<SettlementReason | "">("");
  const [remarks, setRemarks] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setAmount(dueAmount);
      setReason("");
      setRemarks("");
      setSubmitting(false);
    }
  }, [isOpen, user, dueAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!user) {
      toast.error("No user selected");
      return;
    }

    if (amount <= 0) {
      toast.error("Settlement amount must be greater than 0");
      return;
    }

    if (amount > dueAmount) {
      toast.error("Settlement amount cannot exceed the due amount");
      return;
    }

    if (!reason) {
      toast.error("Please select a reason for settlement");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(`/api/users/${user._id}/settle-due`, {
        month,
        amount,
        reason,
        remarks: remarks.trim() || undefined,
      });

      if (response.data.success) {
        toast.success("Due amount settled successfully");
        onSuccess();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to settle due amount");
      }
    } catch (error: any) {
      console.error("Settlement error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to settle due amount";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  if (!isOpen || !user) {
    return null;
  }

  const roomNumber =
    typeof user.roomId === "object" && user.roomId?.roomNumber
      ? user.roomId.roomNumber
      : "Not Assigned";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settle Due Amount
          </h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  User:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  PG ID:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {user.pgId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Room:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {roomNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Month:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {month}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Due Amount:
                </span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  ₹{dueAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Settlement Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Settlement Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0}
              max={dueAmount}
              step={100}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
              required
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Maximum: ₹{dueAmount.toLocaleString()}
            </p>
          </div>

          {/* Reason */}
          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Reason for Settlement <span className="text-red-500">*</span>
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as SettlementReason)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
              required
              disabled={submitting}
            >
              <option value="">Select a reason</option>
              {SETTLEMENT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Additional Remarks
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Provide additional details about the settlement..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-pink-500 focus:border-pink-500 dark:bg-gray-700 dark:text-white"
              disabled={submitting}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {remarks.length}/500 characters
            </p>
          </div>

          {/* Summary */}
          {amount > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                Settlement Summary
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Original Due:
                  </span>
                  <span className="text-blue-700 dark:text-blue-300">
                    ₹{dueAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Settlement Amount:
                  </span>
                  <span className="text-blue-700 dark:text-blue-300">
                    ₹{amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-blue-800 dark:text-blue-200">
                    Remaining Due:
                  </span>
                  <span className="text-blue-800 dark:text-blue-200">
                    ₹{(dueAmount - amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || amount <= 0 || !reason}
              className="px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Settling...
                </>
              ) : (
                "Settle Due"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
