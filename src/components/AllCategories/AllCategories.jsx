"use client";

import React, { useRef, useEffect, useState } from "react";
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
    <div className="container mx-auto my-12 px-4 text-center">
      {/* Title Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Shop By <span className="text-orange-500">Categories</span>
        </h2>
        <p className="text-gray-500 text-sm mt-2">Find exactly what you need</p>
      </div>

      {navigationReady && (
        <Swiper
          slidesPerView={6}
          spaceBetween={20}
          grabCursor={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          breakpoints={{
            0: { slidesPerView: 2 },
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          /* স্লাইডার হাইট অটো ঠিক করার জন্য নিচের এই ক্লাসটি জরুরি */
          className="pb-10 !h-auto" 
        >
          {data?.map((category) => (
            /* SwiperSlide কে অবশ্যই h-auto দিতে হবে যাতে সে তার কন্টেন্টের ফুল হাইট নেয় */
            <SwiperSlide key={category._id} className="!h-auto">
              <Link
                href={`/products-category/${encodeURIComponent(category.name)}`}
                className="group h-full block"
              >
                {/* h-full ব্যবহারের ফলে সব কার্ড এখন বড় কার্ডটির সমান হাইট নিবে */}
                <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 hover:shadow-xl border border-transparent hover:border-gray-100 h-full min-h-[180px]">
                  
                  {/* Icon Box - Boro Kora Holo (w-16/h-16 theke w-24/h-24) */}
                  <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 overflow-hidden shrink-0">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={60} // Width barano holo
                        height={60} // Height barano holo
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-orange-100 rounded-full" /> // Placeholder o boro kora holo
                    )}
                  </div>

                  {/* Text Section */}
                  <div className="text-center mt-auto"> {/* mt-auto টেক্সটকে সবসময় নিচে পুশ করবে */}
                    <h3 className="text-sm font-bold text-gray-800 mb-1 leading-tight">
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