"use server";


import { connectDB } from "@/db/dbConfig";
import { Review } from "@/models/Review";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Cloudinary তে ইমেজ আপলোড করার জন্য
async function uploadImage(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "reviews" }, // Review দের জন্য আলাদা ফোল্ডার
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        ).end(buffer);
    });
}
export async function createReview(formData) {
    try {
        await connectDB();

        const name = formData.get("name");
        const rating = formData.get("rating");
        const reviewText = formData.get("reviewText");
        const imageFile = formData.get("avatar");

        let avatarUrl = "https://via.placeholder.com/40";

        if (imageFile && imageFile.size > 0) {
            avatarUrl = await uploadImage(imageFile);
        }

        await Review.create({
            name,
            rating: Number(rating),
            reviewText,
            avatar: avatarUrl,
        });

        revalidatePath("/dashboard/review");
        revalidatePath("/");

        return { success: true, message: "Review added successfully!" };
    } catch (error) {
        console.error("Server Error:", error);
        return { success: false, message: "Failed to add review." };
    }
}


export async function deleteReview(id) {
    try {
        await connectDB();
        await Review.findByIdAndDelete(id);

        revalidatePath("/dashboard/review");
        revalidatePath("/");

        return { success: true, message: "Review deleted!" };
    } catch (error) {
        console.error("Delete Error:", error);
        return { success: false, message: "Delete failed." };
    }
}