import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
}, {
    timestamps: true,
    collection: "categories"
});

export default mongoose.models.Category || mongoose.model("Category", CategorySchema, "categories");
