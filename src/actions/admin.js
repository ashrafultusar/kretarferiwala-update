"use server";
import { connectDB } from "@/db/dbConfig";
import Admin from "@/models/Admin";
import { revalidatePath } from "next/cache";

export async function deleteAdmin(id) {
    try {
        await connectDB();

        const result = await Admin.findByIdAndDelete(id);
        if (!result) return { success: false, message: "Admin not found" };

        revalidatePath("/dashboard/allAdmin");
        return { success: true, message: "Admin deleted successfully" };
    } catch (error) {
        console.error("Error deleting admin:", error);
        return { success: false, message: "Failed to delete admin" };
    }
}

export async function updateAdminRole(id, role) {
    try {
        await connectDB();
        if (!["admin", "superAdmin"].includes(role)) {
            return { success: false, message: "Invalid role" };
        }

        const updated = await Admin.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!updated) return { success: false, message: "Admin not found" };

        revalidatePath("/dashboard/allAdmin");
        return { success: true, message: "Role updated successfully" };
    } catch (error) {
        console.error("Error updating admin role:", error);
        return { success: false, message: "Failed to update role" };
    }
}
