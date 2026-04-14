"use server";

import { connectDB } from "@/db/dbConfig";
import DeliveryCharge from "@/models/DeliveryCharge";
import { revalidatePath } from "next/cache";

export async function updateDeliveryCharge(insideDhaka, subDhaka, subDhakaAreas, outsideDhaka) {
    try {
        await connectDB();

        let charge = await DeliveryCharge.findOne();
        if (charge) {
            charge.insideDhaka = Number(insideDhaka);
            charge.subDhaka = Number(subDhaka);
            charge.subDhakaAreas = subDhakaAreas; // আপডেট এলাকা
            charge.outsideDhaka = Number(outsideDhaka);
            await charge.save();
        } else {
            charge = await DeliveryCharge.create({
                insideDhaka: Number(insideDhaka),
                subDhaka: Number(subDhaka),
                subDhakaAreas: subDhakaAreas, // নতুন তৈরি
                outsideDhaka: Number(outsideDhaka)
            });
        }

        revalidatePath("/dashboard/deliveryform");
        revalidatePath("/checkout");
        return { success: true, message: "Delivery charges and areas updated!" };
    } catch (error) {
        console.log(error)
        return { success: false, message: "Failed to update" };
    }
}