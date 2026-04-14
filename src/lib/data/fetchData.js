import { connectDB } from "@/db/dbConfig";
import mongoose from "mongoose";

// Model gulo define kora na thakle ekhne short-e define kore neya holo
// Jodi apnar models folder-e thake tobe import kore niben
const Product = mongoose.models.products || mongoose.model("products", new mongoose.Schema({}));
const Category = mongoose.models.categories || mongoose.model("categories", new mongoose.Schema({}));
const Slider = mongoose.models.sliderimages || mongoose.model("sliderimages", new mongoose.Schema({}));

export async function getHomeData() {
  try {
    await connectDB();

    // Parallel processing for speed
    const [sliders, categories, products] = await Promise.all([
      Slider.find({}).lean(),
      Category.find({}).lean(),
      Product.find({}).lean(),
    ]);

    // MongoDB data ke plain JavaScript object-e convert kora (Serialization)
    return {
      sliders: JSON.parse(JSON.stringify(sliders)),
      categories: JSON.parse(JSON.stringify(categories)),
      products: JSON.parse(JSON.stringify(products)),
    };
  } catch (error) {
    console.error("Database fetch error:", error);
    throw new Error("Failed to fetch data from database");
  }
}