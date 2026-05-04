"use server";

import { connectDB } from "@/db/dbConfig";
import Product from "@/models/Product";

/**
 * Fetch All Products 
 * Returns all products sorted by latest first
 */
export async function getAllProducts() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ createdAt: -1 }).lean();
        return { success: true, products: JSON.parse(JSON.stringify(products)) };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { success: false, products: [] };
    }
}

/**
 * Fetch Single Product By ID
 */
export async function getProductById(id) {
    try {
        await connectDB();
        const product = await Product.findById(id).lean();
        if (!product) return { success: false, product: null };
        return { success: true, product: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return { success: false, product: null };
    }
}

/**
 * Fetch Products By Search Query
 */
export async function getSearchedProducts(queryStr) {
    try {
        await connectDB();
        const query = queryStr || "";
        if (!query.trim()) {
            return { success: true, products: [] };
        }

        const regex = new RegExp(query, "i");
        const products = await Product.find({ name: { $regex: regex } }).lean();

        return { success: true, products: JSON.parse(JSON.stringify(products)) };
    } catch (error) {
        console.error("Error searching products:", error);
        return { success: false, products: [] };
    }
}

export async function getPagedProducts({ category = "all", page = 1, limit = 20 }) {
    try {
        await connectDB();

        let query = {};
        if (category && category !== "all") {
            // Check array of categories or exact string
            query.category = { $in: [category] };
        }

        const skip = (page - 1) * limit;

        const [products, totalCategoryProducts, overallTotalProducts, distinctCategories] = await Promise.all([
            Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Product.countDocuments(query),
            Product.countDocuments(),
            Product.distinct("category")
        ]);

        let uniqueCategories = Array.from(new Set(distinctCategories.flat())).filter(Boolean);

        return {
            success: true,
            products: JSON.parse(JSON.stringify(products)),
            totalProducts: totalCategoryProducts,
            overallTotalProducts,
            categories: uniqueCategories,
            totalPages: Math.ceil(totalCategoryProducts / limit)
        };
    } catch (error) {
        console.error("Error fetching paged products:", error);
        return { success: false, products: [], totalProducts: 0, overallTotalProducts: 0, categories: [], totalPages: 0 };
    }
}
