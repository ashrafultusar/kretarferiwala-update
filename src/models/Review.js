import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true }, 
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
}, { timestamps: true });

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);