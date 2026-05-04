"use server"

import { connectDB } from "@/db/dbConfig";
import { Review } from "@/models/Review";



export async function getReviews() {
  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 }); 
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}