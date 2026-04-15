import React from 'react';
import { Star, Quote } from 'lucide-react';
import { connectDB } from "@/db/dbConfig";
import { Review } from "@/models/Review";

const Testimonials = async () => {

  await connectDB();
  const reviews = await Review.find().sort({ createdAt: -1 }).limit(6);

  return (
    <div className="bg-[#F8F8F8] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            What Our <span className="text-orange-500">Customers</span> Say
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Real reviews from real parents
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((item) => (
            <div key={item._id.toString()} className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-50 flex flex-col justify-between hover:shadow-md transition-shadow">
              
              {/* Star Rating & Quote Icon */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < item.rating ? "fill-[#FFC107] text-[#FFC107]" : "fill-gray-200 text-gray-200"}
                    />
                  ))}
                </div>
                <Quote className="text-gray-100 rotate-180" size={40} strokeWidth={1}/>
              </div>

              {/* Review Text */}
              <p className="text-gray-600 text-base leading-relaxed mb-8">
                {item.reviewText}
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <img
                  src={item.avatar || "https://via.placeholder.com/40"}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                />
                <div className="flex flex-col">
                  <h4 className="text-gray-800 font-bold text-sm">
                    {item.name}
                  </h4>
                  <p className="text-blue-400 text-xs font-medium uppercase tracking-wider">
                    Verified Customer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (Optional) */}
        {reviews.length === 0 && (
          <p className="text-center text-gray-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default Testimonials;