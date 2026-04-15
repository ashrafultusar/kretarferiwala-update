import { Star, Trash2, Edit3, Plus, Quote } from "lucide-react";
import Link from "next/link";
import { Review } from "@/models/Review";
import { connectDB } from "@/db/dbConfig";
import { deleteReview } from "@/actions/review";

export default async function ReviewDashboard() {
  await connectDB();
  const reviews = await Review.find().sort({ createdAt: -1 });

  return (
    <div className="p-6 max-w-7xl mx-auto  min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Review Management</h1>
          <p className="text-gray-500 mt-1">Manage your {reviews.length} customer testimonials</p>
        </div>
        <Link 
          href="/dashboard/review/add-review" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} /> Add New Review
        </Link>
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((item) => (
          <div 
            key={item._id.toString()} 
            className="relative bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            {/* Top Section: Stars & Quote Icon */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1 text-[#FFB800]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      fill={i < item.rating ? "currentColor" : "none"} 
                      className={i < item.rating ? "text-[#FFB800]" : "text-gray-200"} 
                    />
                  ))}
                </div>
                <Quote size={40} className="text-gray-100 rotate-180" />
              </div>

              {/* Review Text */}
              <p className="text-gray-600 leading-relaxed text-lg mb-8 min-h-[80px]">
                {item.reviewText}
              </p>
            </div>

            {/* Bottom Section: Avatar & Info */}
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14">
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h4>
                  <p className="text-blue-400 text-sm font-medium">Verified Customer</p>
                </div>
              </div>

              {/* Admin Actions (Visible on Hover) */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg">
                <Link 
                  href={`/dashboard/review/edit/${item._id}`} 
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition"
                >
                  <Edit3 size={18} />
                </Link>
                <form action={async () => { "use server"; await deleteReview(item._id.toString()); }}>
                  <button type="submit" className="p-2 text-red-500 hover:bg-red-50 rounded-full transition">
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[40px] border border-dashed">
          <p className="text-gray-400 text-lg font-medium">No reviews yet. Start by adding one!</p>
        </div>
      )}
    </div>
  );
}