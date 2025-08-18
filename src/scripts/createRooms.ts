// Load environment variables first
import { config } from "dotenv";
import * as path from "path";
import * as url from "url";

// Get the directory of the current module
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root .env.local.
// Previous path used ../../../ which pointed one level above project root.
const envPath = path.resolve(__dirname, "../../.env.local");
config({ path: envPath });
if (!process.env.MONGODB_URI) {
  // Fallback attempt using CWD if first attempt failed
  config({ path: path.resolve(process.cwd(), ".env.local") });
  if (!process.env.MONGODB_URI) {
    console.warn(
      `[createRooms] MONGODB_URI not found after loading env file at ${envPath}. Ensure .env.local exists at project root.`
    );
  }
}
console.log("[createRooms] Env file loaded from:", envPath);
console.log(
  "[createRooms] MONGODB_URI present?",
  process.env.MONGODB_URI ? "yes" : "no"
);

import mongoose from "mongoose";
import { connectToDatabase } from "../app/lib/db";
import Room from "../app/api/models/Room";

// -----------------------------------------------------------------------------
// New Configuration (Updated per latest requirements)
// Floors: 5 total
// Rooms per floor: Floors 1 & 5 have 13 rooms, Floors 2,3,4 have 14 rooms
// All rooms are 6-sharing with capacity 6
// -----------------------------------------------------------------------------
const FLOORS = 5;

// Helper to decide how many rooms on a given floor
const roomsOnFloor = (floor: number) => (floor === 1 || floor === 5 ? 7 : 8);

// Single room type now (extending schema to allow "6-sharing")
type RoomType = "6-sharing";

// Pricing: Assumption made (adjust if needed)
// NOTE: Change this value if a different price is required for 6-sharing rooms.
const PRICE_PER_6_SHARING = 7500;

// Amenities common for all rooms
const DEFAULT_AMENITIES = [
  "Wi-Fi",
  "Bed",
  "Study Table",
  "Chair",
  "Wardrobe",
  "Fan",
  "Electricity",
  "Water",
];

async function createRooms() {
  try {
    console.log("Connecting to database...");
    await connectToDatabase();
    console.log("Connected to database successfully");

    // Clear existing rooms first
    console.log("Clearing existing rooms...");
    await Room.deleteMany({});
    console.log("Existing rooms cleared");

    const roomsToCreate: any[] = [];

    for (let floor = 1; floor <= FLOORS; floor++) {
      const totalRooms = roomsOnFloor(floor);
      for (let roomSeq = 1; roomSeq <= totalRooms; roomSeq++) {
        const roomNumber = `${floor}${roomSeq.toString().padStart(2, "0")}`; // e.g., 101, 102...
        roomsToCreate.push({
          building: "A", // Assumption: All rooms belong to Building A
          roomNumber,
          floor,
          type: "6-sharing" as RoomType,
          price: PRICE_PER_6_SHARING,
          capacity: 6,
          currentOccupancy: 0,
          amenities: DEFAULT_AMENITIES,
          status: "available",
        });
      }
    }

    console.log(`Creating ${roomsToCreate.length} rooms...`);
    const result = await Room.insertMany(roomsToCreate);
    console.log(`Successfully created ${result.length} rooms`);

    // List some rooms as verification
    console.log("\nSample of created rooms:");
    const sampleRooms = await Room.find().limit(5);
    console.log(sampleRooms);

    console.log("\nRoom count summary:");
    const sixSharingCount = await Room.countDocuments({ type: "6-sharing" });
    console.log(`6-sharing rooms: ${sixSharingCount}`);
    console.log(`Total rooms: ${sixSharingCount}`);
  } catch (error) {
    console.error("Error creating rooms:", error);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
    console.log("Database connection closed");
    process.exit(0);
  }
}

// Run the function
createRooms();
