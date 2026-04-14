"use server";

import { connectDB } from "@/db/dbConfig";
import Category from "@/models/Category";

export async function getAllCategories() {
    try {
        await connectDB();
        const categories = await Category.find({}).sort({ createdAt: -1 }).lean();
        return { success: true, categories: JSON.parse(JSON.stringify(categories)) };
    } catch (error) {
        console.error("Error fetching categories:", error);
        return { success: false, categories: [] };
    }
}

export async function getCategoryById(id) {
    try {
        await connectDB();
        const category = await Category.findById(id).lean();
        if (!category) return { success: false, category: null };
        return { success: true, category: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error("Error fetching category by ID:", error);
        return { success: false, category: null };
    }
}
