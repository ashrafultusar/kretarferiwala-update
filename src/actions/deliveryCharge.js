"use server";

import { connectDB } from "@/db/dbConfig";
import DeliveryCharge from "@/models/DeliveryCharge";
import { revalidatePath } from "next/cache";

export async function updateDeliveryCharge(insideDhaka, outsideDhaka) {
    try {
        await connectDB();

        let charge = await DeliveryCharge.findOne();
        if (charge) {
            charge.insideDhaka = Number(insideDhaka);
            charge.outsideDhaka = Number(outsideDhaka);
            await charge.save();
        } else {
            charge = await DeliveryCharge.create({
                insideDhaka: Number(insideDhaka),
                outsideDhaka: Number(outsideDhaka)
            });
        }

        revalidatePath("/dashboard/deliveryform");
        revalidatePath("/checkout");
        revalidatePath("/");

        return { success: true, message: "Delivery charges updated successfully" };
    } catch (error) {
        console.error("Error updating delivery charge:", error);
        return { success: false, message: "Failed to update delivery charges" };
    }
}
