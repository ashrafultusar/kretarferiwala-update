"use client";

import { useState, useEffect } from "react";
import ProductImageSlider from "@/components/ProductImageSlider/ProductImageSlider";
import Link from "next/link";
import TitleWithLine from "@/Shared/TitleWithLine/TitleWithLine";
import ProductCard from "@/Shared/ProductCard/ProductCard";
import Pagination from "@/components/Pagination/Pagination";

const ProductDetailsClient = ({
  initialProduct,
  initialRelated,
  initialDelivery,
}) => {
  const [isOrdering, setIsOrdering] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArea, setSelectedArea] = useState("outsideDhaka"); // Default Outside Dhaka
  const [selectedVariant, setSelectedVariant] = useState(
    initialProduct?.variants && initialProduct.variants.length > 0
      ? initialProduct.variants[0]
      : ""
  );
  const productsPerPage = 12;

  const product = initialProduct;
  const relatedProducts = initialRelated;
  const deliveryCharge = initialDelivery;

  const subDhakaAreasList = deliveryCharge?.subDhakaAreas
    ? deliveryCharge.subDhakaAreas
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a !== "")
    : [];

  // Pagination Logic
  const totalPages = Math.ceil(relatedProducts.length / productsPerPage);
  const paginatedProducts = relatedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // ViewContent tracking
  useEffect(() => {
    if (typeof window !== "undefined" && product) {
      if (typeof window.fbq === "function") {
        window.fbq("track", "ViewContent", {
          content_name: product.name,
          content_ids: [product._id],
          value: product.discountPrice,
          currency: "BDT",
        });
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_item",
        ecommerce: {
          items: [{
            item_name: product.name,
            item_id: product._id,
            price: product.discountPrice,
          }]
        }
      });
    }
  }, [product]);

  const handleAddToCart = () => {
    setIsOrdering(true);
    const cartItemId = selectedVariant ? `${product._id}-${selectedVariant}` : product._id;
    const newProduct = {
      id: cartItemId,
      productId: product._id,
      name: product.name,
      regularPrice: product.regularPrice,
      discountPrice: product.discountPrice,
      image: product.images?.[0] || "/placeholder.png",
      quantity: 1,
      variant: selectedVariant,
    };

    const existingCart = JSON.parse(
      localStorage.getItem("checkoutCart") || "[]"
    );
    const existingIndex = existingCart.findIndex(
      (item) => item.id === newProduct.id
    );

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(newProduct);
    }

    localStorage.setItem("checkoutCart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("cartUpdated"));
    setIsOrdering(false);

    // Tracking Events
    if (typeof window !== "undefined") {
      if (typeof window.fbq === "function") {
        window.fbq("track", "AddToCart", {
          content_name: product.name,
          content_ids: [product._id],
          value: product.discountPrice,
          currency: "BDT",
        });
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          items: [{
            item_name: product.name,
            item_id: product._id,
            price: product.discountPrice,
            quantity: 1
          }]
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-32">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 mt-0">
        <ProductImageSlider images={product.images} />

        <div className="flex flex-col justify-start space-y-4 mt-0 md:mt-1 lg:mt-6">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="flex items-center space-x-4">
            <p className="text-3xl font-bold">
              Price:{" "}
              <span className="text-red-600">৳ {product.discountPrice}</span>
            </p>
            <span className="line-through text-gray-500">
              ৳ {product.regularPrice}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 w-full bg-amber-400 rounded cursor-pointer font-semibold"
            >
              Add to cart
            </button>

            <Link
              href="/checkout"
              onClick={handleAddToCart}
              className="bg-orange-400 w-full hover:bg-orange-500 text-white font-semibold py-2 md:py-3 px-6 rounded cursor-pointer text-center"
            >
              {isOrdering ? "Loading..." : "অর্ডার করুন"}
            </Link>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="mt-4">

              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-3 py-1 border rounded-md font-medium transition-all cursor-pointer ${selectedVariant === variant
                      ? "bg-[#ffb900] text-white border-[#ffb900]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#ffb900]"
                      }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          )}

          <a
            href="https://wa.me/8801795072200"
            className="w-full text-center bg-blue-100 text-black py-3 rounded shadow font-medium"
          >
            কল করতে ক্লিক করুন: 01795072200
          </a>

          <p className="font-bold">
            Code : <span className="font-medium">{product.code || "N/A"}</span>
          </p>

          <p className="font-bold">
            Category:{" "}
            <span className="flex flex-wrap gap-2 mt-1">
              {(Array.isArray(product.category)
                ? product.category
                : [product.category]
              ).map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-gray-300 text-black px-2 py-1 rounded-full text-sm font-normal"
                >
                  {cat}
                </span>
              ))}
            </span>
          </p>

          {/* Delivery Charge Dropdown - Updated Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              ডেলিভারি এরিয়া নির্বাচন করুন:
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full p-2.5 border rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
            >
              <option value="outsideDhaka">ঢাকার বাইরে</option>
              <option value="insideDhaka">ঢাকার ভিতরে</option>
              <option value="subDhaka">ঢাকার পার্শ্ববর্তী (Sub Dhaka)</option>
            </select>

            {selectedArea === "subDhaka" && subDhakaAreasList.length > 0 && (
              <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  সাব-ঢাকা এরিয়া সমূহ:
                </label>
                <p className="text-sm text-gray-600 bg-white p-2.5 rounded-md border text-center">
                  {subDhakaAreasList.join(", ")}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-300">
              <span className="text-sm font-medium text-gray-600">ডেলিভারি খরচ:</span>
              <span className="text-lg font-bold text-green-600">
                ৳ {deliveryCharge?.[selectedArea] || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`py-2 px-4 transition-all ${activeTab === "description"
              ? "border-b-2 border-green-600 text-green-600 font-semibold"
              : "text-gray-500"
              }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("return")}
            className={`py-2 px-4 transition-all ${activeTab === "return"
              ? "border-b-2 border-green-600 text-green-600 font-semibold"
              : "text-gray-500"
              }`}
          >
            Return Policy
          </button>
        </div>
        <div className="mt-4 bg-white p-5 rounded border border-gray-100 shadow-sm text-sm leading-relaxed">
          {activeTab === "description" ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <div className="space-y-2">
              <p>১) উল্লিখিত ডেলিভারি চার্জ ১ কেজি পর্যন্ত ওজনের পণ্যের জন্য।</p>
              <p>
                ২) ছবি এবং বর্ণনার সাথে পণ্য মিলে থাকা সত্ত্বেও রিটার্ন করতে
                চাইলে কুরিয়ার চার্জ দিতে হবে।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <div className="my-10">
        <TitleWithLine title="Related Products" />
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            {paginatedProducts.map((item) => (
              <ProductCard
                key={item._id}
                id={item._id}
                name={item.name}
                regularPrice={item.regularPrice}
                discountPrice={item.discountPrice}
                image={item.images?.[0]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-red-500 py-10">
            No related products found
          </div>
        )}

        {relatedProducts.length > productsPerPage && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsClient;