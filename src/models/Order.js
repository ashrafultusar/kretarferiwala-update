import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    orderNumber: String,
    name: String,
    phone: String,
    address: String,
    note: String,
    status: { type: String, default: "active" },
    paymentMethod: String, 
    transactionId: String,  
    subTotal: Number,
    deliveryCharge: Number,
    totalAmount: Number,
    products: Array,
}, {
    strict: false,
    timestamps: true,
    collection: "orders"
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema, "orders"); 