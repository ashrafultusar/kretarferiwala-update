"use server";

import { connectDB } from "@/db/dbConfig";
import DeliveryCharge from "@/models/DeliveryCharge";

export async function getDeliveryCharge() {
    try {
        await connectDB();
        const charge = await DeliveryCharge.findOne().lean();
        if (!charge) return { success: false, charge: null };
        return { success: true, charge: JSON.parse(JSON.stringify(charge)) };
    } catch (error) {
        console.error("Error fetching delivery charge:", error);
        return { success: false, charge: null };
    }
}
