import mongoose, { Schema } from "mongoose";

const DueSettlementSchema = new Schema(
  {
    // User relationship
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Settlement details
    month: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          // Validate month format: "Month Year" (e.g., "September 2025")
          return /^[A-Za-z]+ \d{4}$/.test(v);
        },
        message:
          "Month must be in format 'Month Year' (e.g., 'September 2025')",
      },
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Settlement amount cannot be negative"],
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Mid-month entry",
        "Special discount",
        "Compensation",
        "Admin discretion",
        "Other",
      ],
    },
    remarks: {
      type: String,
      maxlength: [500, "Remarks cannot exceed 500 characters"],
    },

    // Admin who settled the due
    settledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Settlement date
    settledAt: {
      type: Date,
      default: Date.now,
    },

    // Active status for soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to get user information
DueSettlementSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to get admin who settled
DueSettlementSchema.virtual("admin", {
  ref: "User",
  localField: "settledBy",
  foreignField: "_id",
  justOne: true,
});

// Database indexes for performance optimization
DueSettlementSchema.index({ userId: 1, month: 1, isActive: 1 });
DueSettlementSchema.index({ settledBy: 1 });
DueSettlementSchema.index({ settledAt: -1 });
DueSettlementSchema.index({ reason: 1 });

// Create model
const DueSettlement =
  mongoose.models.DueSettlement ||
  mongoose.model("DueSettlement", DueSettlementSchema);

export default DueSettlement;
