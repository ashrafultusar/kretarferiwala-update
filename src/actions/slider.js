"use server";

import { connectDB } from "@/db/dbConfig";
import Slider from "@/models/Slider";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        // We omit nested folders assuming the original Express implementation used the root upload structure.
        cloudinary.uploader.upload_stream(
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        ).end(buffer);
    });
}

export async function addSlider(prevState, formData) {
    try {
        await connectDB();
        const imageFile = formData.get("image");

        if (!imageFile || imageFile.size === 0) {
            return { success: false, message: "Image is required" };
        }

        const imageUrl = await uploadImage(imageFile);

        const newSlider = await Slider.create({ imageUrl });

        revalidatePath("/dashboard/slider");
        revalidatePath("/");

        return {
            success: true,
            message: "Slider image uploaded",
            slider: JSON.parse(JSON.stringify(newSlider))
        };
    } catch (error) {
        console.error("Error adding slider:", error);
        return { success: false, message: "Failed to upload slider image", error: error.message };
    }
}

export async function deleteSlider(id) {
    try {
        await connectDB();

        const slider = await Slider.findById(id);
        if (!slider) {
            return { success: false, message: "Image not found" };
        }

        if (slider.imageUrl) {
            // Retaining the exact Cloudinary deletion split logic mapping from the original API. 
            const public_id = slider.imageUrl.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(public_id);
        }

        await Slider.findByIdAndDelete(id);

        revalidatePath("/dashboard/slider");
        revalidatePath("/");

        return { success: true, message: "Deleted successfully" };
    } catch (error) {
        console.error("Error deleting slider:", error);
        return { success: false, message: "Failed to delete image" };
    }
}
