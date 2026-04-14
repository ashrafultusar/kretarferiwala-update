"use client";

import React, { useState, useMemo } from "react"; // useMemo যোগ করা হয়েছে পারফরম্যান্সের জন্য
import Loading from "../../../../Shared/LoadingSpinner/Loading";
import Pagination from "../../../Pagination/Pagination";
import TitleWithLine from "../../../../Shared/TitleWithLine/TitleWithLine";
import ProductCard from "../../../../Shared/ProductCard/ProductCard";

const PRODUCTS_PER_PAGE = 40;

const AllProducts = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);

 
  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].reverse(); 
  }, [data]);

  if (!data || data.length === 0) {
    return <Loading />;
  }

  const totalPages = Math.ceil(sortedData.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedData.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  return (
    <section className="container mx-auto my-6 px-4">
     <h2 className="text-3xl mb-2 font-bold text-gray-800">
            All  <span className="text-orange-500">Products</span>
          </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {paginatedProducts.map((product) => (
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

      {/* Only show pagination if more than 40 products */}
      {sortedData.length > PRODUCTS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" }); // পেজ চেঞ্জ করলে উপরে নিয়ে যাবে
          }}
        />
      )}
    </section>
  );
};

export default AllProducts;
