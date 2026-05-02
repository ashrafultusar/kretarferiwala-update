import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: [String], required: true },
    description: { type: String },
    regularPrice: { type: Number },
    discountPrice: { type: Number },
    images: { type: [String], default: [] },
    variants: { type: [String], default: [] },
}, {
    timestamps: true,
    collection: "products" // Default is products, ensuring exact match
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema, "products");
