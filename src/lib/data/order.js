"use server";

import { connectDB } from "@/db/dbConfig";
import Order from "@/models/Order";

export async function getAllOrders() {
    try {
        await connectDB();
        const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
        return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return { success: false, orders: [] };
    }
}

export async function getOrderById(id) {
    try {
        await connectDB();
        const order = await Order.findById(id).lean();
        if (!order) return { success: false, order: null };
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error("Error fetching order:", error);
        return { success: false, order: null };
    }
}
