"use server";

import { connectDB } from "@/db/dbConfig";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { headers } from "next/headers";
import { sendAdminOrderEmail } from "@/lib/mail";


const sha256 = (str) => {
    if (!str) return "";
    return crypto.createHash("sha256").update(str.trim().toLowerCase()).digest("hex");
};

// Meta Conversion API (CAPI) Integration
async function sendMetaCAPIPurchaseEvent(order, ip, userAgent) {
    try {
        const pixelId = process.env.META_PIXEL_ID;
        const accessToken = process.env.META_ACCESS_TOKEN;
        if (!pixelId || !accessToken) return;

        const payload = {
            data: [{
                event_name: "Purchase",
                event_time: Math.floor(Date.now() / 1000),
                action_source: "website",
                user_data: {
                    ph: [sha256(order.phone || "")],
                    fn: [sha256(order.name?.split(" ")[0] || "")],
                    client_ip_address: ip,
                    client_user_agent: userAgent,
                },
                custom_data: {
                    currency: "BDT",
                    value: order.totalAmount,
                    order_id: order.orderNumber,
                    contents: order.products.map((p) => ({
                        id: p.id,
                        quantity: p.quantity,
                        item_price: p.discountPrice,
                    })),
                },
            }],
        };

        await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (err) {
        console.error("Meta CAPI Error:", err);
    }
}

export async function createOrderAction(orderData) {
    try {
        await connectDB();

        // ভ্যালিডেশন: যদি বিকাশ হয় তবে TrxID থাকতেই হবে
        if (orderData.paymentMethod === "bKash" && !orderData.transactionId) {
            return { success: false, message: "বিকাশ ট্রানজেকশন আইডি প্রয়োজন" };
        }

        const generateOrderNumber = () => `GB#${Math.floor(100000 + Math.random() * 900000)}`;

        const finalOrderData = {
            ...orderData,
            orderNumber: generateOrderNumber(),
        };

        const createdOrder = await Order.create(finalOrderData);

        // ক্লায়েন্ট ইনফো সংগ্রহ (CAPI এর জন্য)
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for")?.split(',')[0] || "0.0.0.0";
        const userAgent = headersList.get("user-agent") || "";

        // ব্যাকগ্রাউন্ডে ইভেন্ট পাঠানো (অর্ডার প্রসেস আটকাবে না)
        sendMetaCAPIPurchaseEvent(createdOrder, ip, userAgent);

        // অ্যাডমিনকে নোটিফিকেশন ইমেইল পাঠানো (ব্যাকগ্রাউন্ডে)
        sendAdminOrderEmail(createdOrder).catch((err) => console.error("Email Error:", err));

        revalidatePath("/dashboard/orders");

        return {
            success: true,
            message: "Order placed successfully",
            orderNumber: createdOrder.orderNumber
        };
    } catch (error) {
        console.error("Order Error:", error);
        return { success: false, message: "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে" };
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
