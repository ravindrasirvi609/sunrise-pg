import Notification from "@/app/api/models/Notification";
import User from "@/app/api/models/User";

interface AdminNotificationPayload {
  title: string;
  message: string;
  type?: string;
  relatedId?: any;
  relatedModel?: string;
}

// Create the same notification for every admin user.
export async function notifyAllAdmins(payload: AdminNotificationPayload) {
  const admins = await User.find({ role: "admin" }, "_id");
  if (!admins.length) return;
  const docs = admins.map((a: any) => ({
    userId: a._id,
    title: payload.title,
    message: payload.message,
    type: payload.type || "System",
    relatedId: payload.relatedId,
    relatedModel: payload.relatedModel,
    isRead: false,
    isActive: true,
  }));
  await Notification.insertMany(docs);
}

// Create a notification for a specific user (helper wrapper)
export async function notifyUser(
  userId: any,
  payload: AdminNotificationPayload
) {
  await Notification.create({
    userId,
    title: payload.title,
    message: payload.message,
    type: payload.type || "System",
    relatedId: payload.relatedId,
    relatedModel: payload.relatedModel,
    isRead: false,
    isActive: true,
  });
}
