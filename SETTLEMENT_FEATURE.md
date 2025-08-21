# Due Settlement Feature

## Overview

The Due Settlement feature allows administrators to settle (waive/forgive) due amounts for users without creating new payment entries. This is particularly useful for cases like users joining mid-month where you want to waive the remaining due amount.

## Features

### 1. Separate Settlement Tracking

- Uses a dedicated `DueSettlement` model to track settlements separately from payments
- Maintains audit trail with admin who settled, reason, and timestamp
- Does not create fake payment entries

### 2. User Interface

- **Settle Due Button**: Appears in the users list for users with due amounts
- **Settlement Modal**: Clean, user-friendly form with validation
- **Real-time Updates**: Users list refreshes automatically after settlement

### 3. Validation & Security

- Only admins can settle dues
- Validates settlement amount cannot exceed due amount
- Requires reason selection (Mid-month entry, Special discount, Compensation, Admin discretion, Other)
- Optional remarks for additional details

## Database Schema

### DueSettlement Model

```typescript
{
  userId: ObjectId,           // Reference to User
  month: String,              // "Month Year" format (e.g., "September 2025")
  amount: Number,             // Settlement amount
  reason: String,             // Predefined reasons
  remarks: String,            // Optional additional details
  settledBy: ObjectId,        // Admin who settled
  settledAt: Date,            // Settlement timestamp
  isActive: Boolean           // Soft delete support
}
```

## API Endpoints

### POST /api/users/[id]/settle-due

Settles a user's due amount for a specific month.

**Request Body:**

```json
{
  "month": "September 2025",
  "amount": 1500,
  "reason": "Mid-month entry",
  "remarks": "User joined on 15th September"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Due amount settled successfully",
  "settlement": {
    /* settlement object */
  },
  "remainingDue": 0
}
```

### GET /api/users/[id]/settle-due

Gets settlement history for a user.

## Due Calculation Logic

The system calculates due amounts considering both payments and settlements:

```typescript
effectiveDue = roomPrice - totalPaid - totalSettled;
```

Where:

- `roomPrice`: Monthly rent amount
- `totalPaid`: Sum of all "Paid" payments for the month
- `totalSettled`: Sum of all settlements for the month

## Usage Flow

1. **Admin views users list** - Users with dues show "Settle Due" button
2. **Clicks "Settle Due"** - Opens settlement modal
3. **Fills form** - Selects amount, reason, and optional remarks
4. **Submits** - System validates and creates settlement record
5. **List refreshes** - Due amount disappears or reduces

## Benefits

1. **Clean Data**: No fake payment entries
2. **Audit Trail**: Complete history of who settled what and why
3. **Flexible**: Can handle partial settlements
4. **Reporting**: Easy to generate settlement reports
5. **User Friendly**: Simple UI for admins

## Files Modified/Created

### New Files

- `src/app/api/models/DueSettlement.ts` - Settlement model
- `src/app/api/users/[id]/settle-due/route.ts` - Settlement API
- `src/components/SettlementModal.tsx` - Settlement UI
- `src/app/lib/dueCalculator.ts` - Due calculation utilities

### Modified Files

- `src/app/api/models/index.ts` - Added DueSettlement export
- `src/app/api/interfaces/models.ts` - Added IDueSettlement interface
- `src/app/admin/users/page.tsx` - Added settlement functionality

## Validation Rules

- Settlement amount must be > 0 and ≤ calculated due amount
- Month must be in "Month Year" format
- Reason is required and must be from predefined list
- Only admins can settle dues
- Cannot settle already fully paid months

## Future Enhancements

1. **Settlement History Page**: View all settlements across users
2. **Bulk Settlement**: Settle multiple users at once
3. **Settlement Reports**: Generate settlement analytics
4. **Email Notifications**: Notify users when dues are settled
5. **Approval Workflow**: Require approval for large settlements
