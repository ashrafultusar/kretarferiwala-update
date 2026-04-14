"use server";

import { connectDB } from "@/db/dbConfig";
import Category from "@/models/Category";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file, folder = "categories") {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        ).end(buffer);
    });
}

/**
 * Extract public_id from Cloudinary URL and delete from Cloudinary
 */
async function deleteCloudinaryImage(url) {
    if (!url) return;
    try {
        const parts = url.split("/");
        const filename = parts.pop(); // e.g file.jpg
        const folder = parts.pop();   // e.g categories
        const publicId = `${folder}/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error("Cloudinary delete error:", err);
    }
}

export async function addCategory(prevState, formData) {
    try {
        await connectDB();

        const name = formData.get("name");
        const imageFile = formData.get("image");

        if (!name || !imageFile || imageFile.size === 0) {
            return { success: false, message: "Category name and image are required" };
        }

        const imageUrl = await uploadImage(imageFile);

        const newCategory = await Category.create({
            name,
            image: imageUrl,
        });

        revalidatePath("/dashboard/categories");
        revalidatePath("/");

        return {
            success: true,
            message: "Category added successfully",
            category: JSON.parse(JSON.stringify(newCategory))
        };
    } catch (error) {
        console.error("Error adding category:", error);
        return { success: false, message: "Failed to add category", error: error.message };
    }
}

export async function editCategory(id, prevState, formData) {
    try {
        await connectDB();

        const name = formData.get("name");
        const imageFile = formData.get("image");

        const updateData = { name };

        if (imageFile && imageFile.size > 0 && typeof imageFile === "object") {
            const existingDoc = await Category.findById(id);
            if (existingDoc && existingDoc.image) {
                await deleteCloudinaryImage(existingDoc.image);
            }
            updateData.image = await uploadImage(imageFile);
        }

        const updated = await Category.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) {
            return { success: false, message: "Category not found" };
        }

        revalidatePath("/dashboard/categories");
        revalidatePath("/");

        return { success: true, message: "Category updated successfully" };
    } catch (error) {
        console.error("Error updating category:", error);
        return { success: false, message: "Failed to update category", error: error.message };
    }
}

export async function deleteCategory(id) {
    try {
        await connectDB();

        const category = await Category.findById(id);
        if (!category) {
            return { success: false, message: "Category not found" };
        }

        // Delete image from cloudinary based on the provided backend logic structure
        if (category.image) {
            // The user used `const public_id = category.image.split("/").pop().split(".")[0];`
            // Cloudinary nested folders usually require the folder name too, but if their old logic 
            // used just the final hash, we'll try to replicate.
            const public_id = category.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`categories/${public_id}`);
        }

        await Category.findByIdAndDelete(id);

        revalidatePath("/dashboard/categories");
        revalidatePath("/");

        return { success: true, message: "Category deleted successfully" };
    } catch (error) {
        console.error("Error deleting category:", error);
        return { success: false, message: "Failed to delete category" };
    }
}
