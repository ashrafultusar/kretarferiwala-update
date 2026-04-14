"use client";

import React from "react";
import ProductCard from "../../../Shared/ProductCard/ProductCard";
import Link from "next/link";

const NewArrivals = ({ data }) => {
  // ১. ডাটা সর্ট করে লেটেস্ট ৫টি প্রোডাক্ট নেওয়া
  // (ধরে নিচ্ছি আপনার ডাটাতে createdAt ফিল্ড আছে, না থাকলে slice(0, 5) সরাসরি ব্যবহার করুন)
  const recentProducts = [...data]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <section className="container mx-auto my-12 px-4">
      {/* হেডার সেকশন ইমেজের মতো */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            New <span className="text-orange-500">Arrivals</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">Just landed — fresh picks for your little one</p>
        </div>
        <Link 
          href="/shop" 
          className="text-orange-500 hover:text-orange-600 font-semibold text-sm flex items-center gap-1"
        >
          View All →
        </Link>
      </div>

      {/* গ্রিড লেআউট - ডেক্সটপে ৫টি কলাম */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {recentProducts.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name={product.name}
            regularPrice={product.regularPrice}
            discountPrice={product.discountPrice}
            image={product.images[0]}
          />
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;