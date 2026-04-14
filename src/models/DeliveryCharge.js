import mongoose from "mongoose";

const DeliveryChargeSchema = new mongoose.Schema({
    insideDhaka: { type: Number, required: true },
    outsideDhaka: { type: Number, required: true },
}, {
    timestamps: true,
    collection: "deliverycharges"
});

export default mongoose.models.DeliveryCharge || mongoose.model("DeliveryCharge", DeliveryChargeSchema, "deliverycharges");
