import { connectDB } from "@/db/dbConfig";
import { Review } from "@/models/Review";
import ReviewForm from "@/components/admin/ReviewForm/ReviewForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditReviewPage({ params }) {
    await connectDB();
    const { id: reviewId } = await params;
    const review = await Review.findById(reviewId);

    if (!review) {
        return <div className="p-6">Review not found</div>;
    }

    const initialData = {
        _id: review._id.toString(),
        name: review.name,
        rating: review.rating,
        avatar: review.avatar,
        reviewText: review.reviewText
    };

    return (
        <div className="p-6">
            <Link
                href="/dashboard/review"
                className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 transition"
            >
                <ArrowLeft size={18} /> Back to List
            </Link>

            <ReviewForm initialData={initialData} />
        </div>
    );
}
