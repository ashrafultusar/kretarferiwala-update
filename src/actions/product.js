"use server";

import { connectDB } from "@/db/dbConfig";
import Product from "@/models/Product";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload File to Cloudinary from arrayBuffer
async function uploadImage(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        ).end(buffer);
    });
}

/**
 * Add a New Product Server Action
 * Replaces: POST /products equivalent from Express
 */
export async function addProduct(prevState, formData) {
    try {
        await connectDB();

        const name = formData.get("name");
        const description = formData.get("description");
        const regularPrice = formData.get("regularPrice");
        const discountPrice = formData.get("discountPrice");

        // category can be multiple
        let category = formData.getAll("category");
        if (!category || category.length === 0) {
            const catVal = formData.get("category");
            if (catVal) category = [catVal];
        }

        // Process images
        const imageFiles = formData.getAll("images");
        let imageUrls = [];

        for (const file of imageFiles) {
            if (file && file.size > 0 && typeof file === "object") {
                const url = await uploadImage(file);
                imageUrls.push(url);
            }
        }

        if (imageUrls.length === 0) {
            return { success: false, message: "No images uploaded" };
        }

        const newProduct = await Product.create({
            name,
            category,
            description,
            regularPrice: regularPrice ? Number(regularPrice) : 0,
            discountPrice: discountPrice ? Number(discountPrice) : 0,
            images: imageUrls,
        });

        revalidatePath("/dashboard/allProducts"); // Update dashboard table
        revalidatePath("/"); // Update frontend

        return {
            success: true,
            message: "Product added successfully",
            product: JSON.parse(JSON.stringify(newProduct))
        };
    } catch (error) {
        console.error("Error adding product:", error);
        return { success: false, message: "Failed to add product", error: error.message };
    }
}

/**
 * Edit a Product Server Action
 * Replaces: PATCH /products/:id equivalent from Express
 */
export async function editProduct(id, prevState, formData) {
    try {
        await connectDB();

        const name = formData.get("name");
        const description = formData.get("description");
        const regularPrice = formData.get("regularPrice");
        const discountPrice = formData.get("discountPrice");

        let category = formData.getAll("category");
        if (!category || category.length === 0) {
            const catVal = formData.get("category");
            if (catVal) category = [catVal];
        }

        // Preserve existing images
        let existingImages = formData.getAll("existingImages");
        if (existingImages.length === 1 && existingImages[0].includes(',')) {
            existingImages = existingImages[0].split(',');
        }
        if (!existingImages || (existingImages.length === 1 && !existingImages[0])) {
            existingImages = [];
        }

        // Handle new uploaded images
        const imageFiles = formData.getAll("images");
        let newImageUrls = [];
        for (const file of imageFiles) {
            if (file && file.size > 0 && typeof file === "object") {
                const url = await uploadImage(file);
                newImageUrls.push(url);
            }
        }

        // Merge image arrays (Old retained + New uploaded)
        const finalImages = [...existingImages, ...newImageUrls];

        const updated = await Product.findByIdAndUpdate(
            id,
            {
                name,
                category,
                description,
                regularPrice: regularPrice ? Number(regularPrice) : 0,
                discountPrice: discountPrice ? Number(discountPrice) : 0,
                images: finalImages,
            },
            { new: true }
        );

        if (!updated) {
            return { success: false, message: "Product not found" };
        }

        revalidatePath("/dashboard/allProducts");
        revalidatePath("/");

        return { success: true, message: "Product updated successfully" };
    } catch (error) {
        console.error("Error updating product:", error);
        return { success: false, message: "Failed to update product", error: error.message };
    }
}

/**
 * Delete a Product Server Action
 * Replaces: DELETE /product/:id equivalent from Express
 */
export async function deleteProduct(id) {
    try {
        await connectDB();

        const result = await Product.findByIdAndDelete(id);

        if (!result) {
            return { success: false, message: "Product not found" };
        }

        revalidatePath("/dashboard/allProducts");
        revalidatePath("/");

        return { success: true, message: "Product deleted successfully" };
    } catch (error) {
        console.error("Error deleting product:", error);
        return { success: false, message: "Failed to delete product" };
    }
}
