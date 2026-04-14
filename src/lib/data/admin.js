"use server";
import { connectDB } from "@/db/dbConfig";
import Admin from "@/models/Admin";

export async function getAllAdmins() {
    try {
        await connectDB();
        const admins = await Admin.find({}).lean();
        return { success: true, admins: JSON.parse(JSON.stringify(admins)) };
    } catch (error) {
        console.error("Error fetching admins:", error);
        return { success: false, admins: [] };
    }
}
