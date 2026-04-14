import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const reviews = [
    {
      name: "Fatima Akter",
      avatar: "https://via.placeholder.com/40/FFC107/FFFFFF?text=F", // কাস্টমার ছবি (ইমেজের মতো গোল ইমোজি ব্যবহার করতে পারেন)
      rating: 5,
      reviewText: "Amazing quality baby products! My baby loves the rocker chair. Delivery was super fast too."
    },
    {
      name: "Rahim Uddin",
      avatar: "https://via.placeholder.com/40/4CAF50/FFFFFF?text=R",
      rating: 5,
      reviewText: "Best prices in Bangladesh for baby essentials. The customer service is excellent!"
    },
    {
      name: "Nusrat Jahan",
      avatar: "https://via.placeholder.com/40/2196F3/FFFFFF?text=N",
      rating: 4,
      reviewText: "I've been shopping here for 2 years. Never disappointed with the product quality."
    }
  ];

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
          {reviews.map((item, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              
              {/* Star Rating & Quote Icon */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < item.rating ? "fill-[#FFC107] text-[#FFC107]" : "fill-gray-200 text-gray-200"}
                    />
                  ))}
                </div>
                <Quote className="text-gray-100" size={36} strokeWidth={1}/>
              </div>

              {/* Review Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {item.reviewText}
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
                <div className="flex flex-col">
                  <h4 className="text-gray-800 font-semibold text-sm">
                    {item.name}
                  </h4>
                  <p className="text-gray-400 text-xs">
                    Verified Customer
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;