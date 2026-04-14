"use server";

import { connectDB } from "@/db/dbConfig";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { headers } from "next/headers";

const sha256 = (str) => {
    if (!str) return "";
    return crypto.createHash("sha256").update(str.trim().toLowerCase()).digest("hex");
};

// Auto Track Purchase helper function
async function sendMetaCAPIPurchaseEvent(order, ip, userAgent) {
    try {
        const pixelId = process.env.META_PIXEL_ID;
        const accessToken = process.env.META_ACCESS_TOKEN;

        if (!pixelId || !accessToken) return; // Skip if no config

        const payload = {
            data: [
                {
                    event_name: "Purchase",
                    event_time: Math.floor(new Date(order.createdAt).getTime() / 1000),
                    action_source: "website",
                    event_source_url: "https://kretarferiwala.com.bd/checkout",

                    user_data: {
                        ph: [sha256(order.phone || "")],
                        fn: [sha256(order.name?.split(" ")[0] || "")],
                        ln: [sha256(order.name?.split(" ")[1] || "")],
                        client_ip_address: ip,
                        client_user_agent: userAgent,
                    },

                    custom_data: {
                        currency: "BDT",
                        value: order.totalAmount,
                        order_id: order.orderNumber || String(order._id),
                        contents: order.products.map((p) => ({
                            id: p.id,
                            quantity: p.quantity,
                            item_price: p.discountPrice,
                        })),
                        num_items: order.products.reduce((acc, p) => acc + p.quantity, 0),
                    },
                },
            ],
        };

        const response = await fetch(
            `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );
        const fbRes = await response.json();
        console.log("Meta CAPI auto-track response:", fbRes);
    } catch (err) {
        console.error("Meta CAPI auto-track error:", err);
    }
}

export async function createOrderAction(orderData) {
    try {
        await connectDB();

        if (!orderData?.products || orderData.products.length === 0) {
            return { success: false, error: "No products in order" };
        }

        const generateOrderNumber = () => {
            const randomNum = Math.floor(100000 + Math.random() * 900000);
            return `GB#${randomNum}`;
        };

        const orderWithDefaults = {
            ...orderData,
            status: "active",
            paymentMethod: "Cash on Delivery",
            orderNumber: generateOrderNumber(),
            createdAt: new Date(),
        };

        const createdOrder = await Order.create(orderWithDefaults);

        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "0.0.0.0";
        const userAgent = headersList.get("user-agent") || "";

        sendMetaCAPIPurchaseEvent(createdOrder, ip, userAgent);

        return {
            success: true,
            message: "Order placed successfully",
            orderNumber: createdOrder.orderNumber
        };
    } catch (error) {
        console.error("Error creating order:", error);
        return { success: false, error: "Failed to place order" };
    }
}

export async function trackPurchaseAction(orderId) {
    try {
        await connectDB();
        if (!orderId) {
            return { success: false, error: "orderId is required" };
        }

        const order = await Order.findById(orderId).lean();
        if (!order) {
            return { success: false, error: "Order not found" };
        }

        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for") || "0.0.0.0";
        const userAgent = headersList.get("user-agent") || "";

        await sendMetaCAPIPurchaseEvent(order, ip, userAgent);

        return { success: true, message: "Purchase event sent successfully" };
    } catch (error) {
        console.error("Error manual track-purchase:", error);
        return { success: false, error: error.message };
    }
}

export async function updateOrderStatus(id, status) {
    try {
        await connectDB();
        if (!status) return { success: false, message: "Status is required" };

        const updated = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updated) {
            return { success: false, message: "Order not found" };
        }

        revalidatePath("/dashboard/orders");
        revalidatePath(`/dashboard/orders/${id}`);

        return { success: true, message: "Order status updated successfully", status: updated.status };
    } catch (error) {
        console.error("Error updating order status:", error);
        return { success: false, message: "Failed to update order status" };
    }
}

export async function deleteOrder(id) {
    try {
        await connectDB();

        const result = await Order.findByIdAndDelete(id);
        if (!result) {
            return { success: false, message: "Order not found" };
        }

        revalidatePath("/dashboard/orders");

        return { success: true, message: "Order deleted successfully" };
    } catch (error) {
        console.error("Error deleting order:", error);
        return { success: false, message: "Failed to delete order" };
    }
}
