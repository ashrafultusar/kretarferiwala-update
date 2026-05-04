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

export async function getPagedOrders({ status = "all", search = "", page = 1, limit = 20 }) {
    try {
        await connectDB();

        let query = {};
        if (status && status !== "all") {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;

        const [orders, totalOrders, overallTotalOrders] = await Promise.all([
            Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Order.countDocuments(query),
            Order.countDocuments()
        ]);

        return {
            success: true,
            orders: JSON.parse(JSON.stringify(orders)),
            totalOrders,
            overallTotalOrders,
            totalPages: Math.ceil(totalOrders / limit)
        };
    } catch (error) {
        console.error("Error fetching paged orders:", error);
        return { success: false, orders: [], totalOrders: 0, overallTotalOrders: 0, totalPages: 0 };
    }
}

export async function getDashboardStats() {
    try {
        await connectDB();

        const [
            totalOrders,
            deliveredOrdersCount,
            salesResult,
            topProducts,
            recentActiveOrders
        ] = await Promise.all([
            Order.countDocuments(),
            Order.countDocuments({ status: "delivered" }),
            Order.aggregate([
                { $match: { status: "delivered" } },
                { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } }
            ]),
            Order.aggregate([
                { $match: { status: "delivered" } },
                { $unwind: "$products" },
                { $group: { _id: "$products.name", quantity: { $sum: "$products.quantity" } } },
                { $sort: { quantity: -1 } },
                { $limit: 10 }
            ]),
            Order.find({ status: { $nin: ["delivered", "cancelled"] } })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean()
        ]);

        const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;

        return {
            success: true,
            totalOrders,
            deliveredOrdersCount,
            totalSales,
            topProducts: JSON.parse(JSON.stringify(topProducts)),
            recentActiveOrders: JSON.parse(JSON.stringify(recentActiveOrders))
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return { success: false, totalOrders: 0, deliveredOrdersCount: 0, totalSales: 0, topProducts: [], recentActiveOrders: [] };
    }
}
