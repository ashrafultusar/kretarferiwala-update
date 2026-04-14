"use server";

import { connectDB } from "@/db/dbConfig";
import Slider from "@/models/Slider";

export async function getAllSliders() {
    try {
        await connectDB();
        const sliders = await Slider.find({}).sort({ createdAt: -1 }).lean();
        return { success: true, sliders: JSON.parse(JSON.stringify(sliders)) };
    } catch (error) {
        console.error("Error fetching sliders:", error);
        return { success: false, sliders: [] };
    }
}
