import { connectDB } from "@/db/dbConfig";
import mongoose from "mongoose";

// Model references
const Product = mongoose.models.products || mongoose.model("products", new mongoose.Schema({}));
const Delivery = mongoose.models.deliverycharges || mongoose.model("deliverycharges", new mongoose.Schema({}));

export async function getFullProductData(id) {
  try {
    await connectDB();

    // 1. Main Product Fetch
    const product = await Product.findById(id).lean();
    if (!product) return null;

    // 2. Related Products Fetch (Same category, excluding current product)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: id }
    }).limit(12).lean();

    // 3. Delivery Charges Fetch
    const delivery = await Delivery.findOne({}).lean();

    return {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      deliveryCharge: JSON.parse(JSON.stringify(delivery)) || { insideDhaka: 0, outsideDhaka: 0 }
    };
  } catch (error) {
    console.error("Database fetch error:", error);
    return null;
  }
}