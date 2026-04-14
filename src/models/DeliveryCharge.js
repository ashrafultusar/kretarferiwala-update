import mongoose from "mongoose";

const DeliveryChargeSchema = new mongoose.Schema({
    insideDhaka: { type: Number, required: true },
    subDhaka: { type: Number, required: true }, 
    subDhakaAreas: { type: String, default: "" }, 
    outsideDhaka: { type: Number, required: true },
}, {
    timestamps: true,
    collection: "deliverycharges"
});

export default mongoose.models.DeliveryCharge || mongoose.model("DeliveryCharge", DeliveryChargeSchema, "deliverycharges");