"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";
import Link from "next/link";

const AllCategories = ({ data }) => {
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    setNavigationReady(true);
  }, []);

  return (
    <div className="container mx-auto my-8 md:my-12 px-4 text-center">
      {/* Title Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Shop By <span className="text-orange-500">Categories</span>
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mt-1">Find exactly what you need</p>
      </div>

      {navigationReady && (
        <Swiper
          slidesPerView={3} 
          spaceBetween={12} 
          grabCursor={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          breakpoints={{
            // মোবাইল (০ থেকে ৪৮০ পিক্সেল) - ২টা স্লাইড
            0: { 
              slidesPerView: 2,
              spaceBetween: 10
            },
            // ট্যাবলেট - ৪টা স্লাইড
            640: { 
              slidesPerView: 4,
              spaceBetween: 15
            },
            // ডেস্কটপ - ৬টা স্লাইড
            1024: { 
              slidesPerView: 6,
              spaceBetween: 20
            },
          }}
          className="pb-8 !h-auto" 
        >
          {data?.map((category) => (
            <SwiperSlide key={category._id} className="!h-auto">
              <Link
                href={`/products-category/${encodeURIComponent(category.name)}`}
                className="group h-full block"
              >
                {/* কার্ডের প্যাডিং মোবাইলে কমানো হয়েছে (p-4 vs md:p-6) */}
                <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-lg border border-gray-50 hover:border-orange-100 h-full min-h-[140px] md:min-h-[180px]">
                  
                  {/* ইমেজের সাইজ মোবাইলে ছোট করা হয়েছে (w-16 vs md:w-24) */}
                  <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-gray-50 rounded-xl md:rounded-2xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden shrink-0">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={45} // মোবাইলের জন্য ছোট উইডথ
                        height={45} 
                        className="object-contain md:hidden" // শুধু মোবাইলের জন্য ছোট সাইজ
                      />
                    ) : (
                      <div className="w-10 h-10 bg-orange-50 rounded-full" />
                    )}
                    
                    {/* ডেস্কটপের জন্য আগের সাইজ বজায় রাখা হয়েছে */}
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={65}
                        height={65}
                        className="object-contain hidden md:block" 
                      />
                    )}
                  </div>

                  {/* টেক্সট সেকশন */}
                  <div className="text-center mt-auto">
                    <h3 className="text-[12px] md:text-sm font-bold text-gray-800 leading-tight">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default AllCategories;