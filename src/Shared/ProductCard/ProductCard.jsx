"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";

export default function ProductCard({ id, name, regularPrice, discountPrice, image }) {
  const discountPercentage = Math.round(((regularPrice - discountPrice) / regularPrice) * 100);

  const addToCart = () => {
    const newProduct = {
      id, name, regularPrice, discountPrice, image, quantity: 1,
    };
    const existingCart = JSON.parse(localStorage.getItem("checkoutCart") || "[]");
    const existingIndex = existingCart.findIndex((item) => item.id === newProduct.id);

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(newProduct);
    }
    localStorage.setItem("checkoutCart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full border border-gray-100">
      
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/productdetails/${id}`}>
          <Image
            src={image || "/placeholder.png"}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>
        
        {/* Discount Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#E91E63] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discountPercentage}%
          </span>
        </div>
        
        {/* Hot Tag */}
        <div className="absolute top-3 right-3">
          <span className="bg-[#FFC107] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase">
            Hot
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <Link href={`/productdetails/${id}`}>
          <h2 className="text-gray-700 text-xs md:text-sm font-medium line-clamp-2 mb-2 hover:text-orange-500 transition-colors h-10">
            {name}
          </h2>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-[#FFC107]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill={i < 4 ? "currentColor" : "none"} strokeWidth={i < 4 ? 0 : 2} />
            ))}
          </div>
          <span className="text-gray-400 text-[9px]">(128)</span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#F44336] font-bold text-base md:text-lg">৳{discountPrice}</span>
          <span className="text-gray-400 line-through text-[10px] md:text-xs">৳{regularPrice}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          {/* Add to Cart Button */}
          <button
            onClick={addToCart}
            className="w-full bg-[#FFF3E0] hover:bg-[#FFE0B2] cursor-pointer text-[#FB8C00] font-semibold py-2 rounded-lg text-[11px] md:text-xs transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>

          {/* অর্ডার করুন (Direct Checkout) Button */}
          <Link
            href={`/checkout`}
            onClick={addToCart}
            className="w-full bg-[#FB8C00] hover:bg-[#E67E22] text-white font-bold py-2 rounded-lg text-[11px] md:text-xs transition-colors duration-300 text-center"
          >
            অর্ডার করুন
          </Link>
        </div>
      </div>
    </div>
  );
}