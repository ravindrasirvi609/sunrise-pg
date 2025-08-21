import { Schema } from "mongoose";

/**
 * User model interface
 */
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "user";
  password?: string;
  pgId?: string;
  registrationStatus: "Pending" | "Approved" | "Rejected";
  fathersName: string;
  permanentAddress: string;
  city: string;
  state: string;
  guardianMobileNumber: string;
  validIdType: "Aadhar Card" | "Passport" | "Driving License" | "Voter Card";
  companyName: string;
  companyAddress: string;
  employeeId: string;
  validIdPhoto: string;
  profileImage: string;
  documents?: string[];
  roomId?: Schema.Types.ObjectId | IRoom;
  bedNumber?: number;
  rejectionReason?: string;
  moveInDate?: Date;
  moveOutDate?: Date;
  approvalDate?: Date;
  rejectionDate?: Date;
  isActive: boolean;
  depositFees?: number;
  isOnNoticePeriod?: boolean;
  lastStayingDate?: Date;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  keyIssued?: boolean;
  pillowIssued?: boolean;
  pillowCoverIssued?: boolean;
  agreeToTerms?: boolean;
  depositReturn?: {
    amount: number;
    date?: Date;
  };
}

/**
 * User Archive model interface
 */
export interface IUserArchive extends IUser {
  originalUserId?: string;
  checkoutDate?: Date;
  checkoutReason?: string;
  checkoutRemarks?: string;
  checkoutBy?: string;
  finalPayment?: {
    amount: number;
    date: Date;
  };
}

/**
 * Room model interface
 */
export interface IRoom {
  _id?: string;
  building: "A" | "B";
  roomNumber: string;
  floor: number;
  type: "2-sharing" | "3-sharing" | "4-sharing" | "5-sharing" | "6-sharing";
  price: number;
  capacity: number;
  currentOccupancy: number;
  amenities: string[];
  status: "available" | "occupied" | "maintenance";
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Complaint model interface
 */
export interface IComplaint {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  category:
    | "Maintenance"
    | "Housekeeping"
    | "Food"
    | "Security"
    | "Billing"
    | "Other";
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Payment model interface
 */
export interface Payment {
  _id: string;
  userId: string;
  amount: number;
  months: string[];
  paymentDate: Date;
  dueDate?: Date;
  paymentStatus: "Paid" | "Due" | "Overdue" | "Partial" | "Pending";
  receiptNumber?: string;
  paymentMethod: "Cash" | "UPI" | "Bank Transfer" | "Card" | "Other";
  transactionId?: string;
  remarks?: string;
  isActive: boolean;
  isDepositPayment: boolean;
  depositAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Due Settlement model interface
 */
export interface IDueSettlement {
  _id?: string;
  userId: string;
  month: string;
  amount: number;
  reason:
    | "Mid-month entry"
    | "Special discount"
    | "Compensation"
    | "Admin discretion"
    | "Other";
  remarks?: string;
  settledBy: string;
  settledAt?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Room Change Request interface
 */
export interface IRoomChangeRequest {
  _id?: string;
  userId: string;
  oldRoomId: string;
  newRoomId: string;
  oldBedNumber: number;
  newBedNumber: number;
  status: "Completed" | "Cancelled";
  requestedAt?: Date;
  completedAt?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Notification model interface
 */
export interface INotification {
  _id?: string;
  userId: string;
  title: string;
  message: string;
  type:
    | "Payment"
    | "Complaint"
    | "RoomChange"
    | "System"
    | "Email"
    | "Other"
    | "NoticePeriod"
    | "Notice"
    | "Contact"
    | "Checkout";
  relatedId?: string;
  relatedModel?:
    | "Payment"
    | "Complaint"
    | "RoomChangeRequest"
    | "User"
    | "Room"
    | "Notice"
    | "ContactInquiry";
  isRead: boolean;
  isEmailSent: boolean;
  emailDetails?: {
    to: string;
    subject: string;
    sentAt: Date;
    success: boolean;
  };
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Contact Inquiry model interface
 */
export interface IContactInquiry {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "New" | "In Progress" | "Resolved" | "Closed";
  adminRemarks?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Visit Request model interface
 */
export interface IVisitRequest {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  message?: string;
  status: "Pending" | "Approved" | "Rejected" | "Completed";
  adminRemarks?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Subscriber model interface
 */
export interface ISubscriber {
  _id?: string;
  email: string;
  isActive: boolean;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
}

/**
 * Expense model interface
 */
export interface IExpense {
  _id?: string;
  amount: number;
  category: "Food" | "Maintenance" | "Utilities" | "Other";
  description: string;
  date: Date;
  createdBy: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt?: Date;
  updatedAt?: Date;
}
