import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MdEdit } from "react-icons/md";
import { getPagedProducts } from "@/lib/data/products";
import { CategorySelect, DeleteProductAction, PaginationControls } from "./ProductClientComponents";

export default async function AllCategoriesProducts({ searchParams }) {
  const params = await searchParams; // In Next.js 15
  const activeCategory = params?.category || "all";
  const currentPage = parseInt(params?.page || "1", 10);
  const limit = 20;

  const { success, products, totalProducts, overallTotalProducts, categories, totalPages } = await getPagedProducts({
    category: activeCategory,
    page: currentPage,
    limit,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Total Products: {overallTotalProducts || 0}</h2>
          {activeCategory !== "all" && (
            <p className="text-[#ff6900] font-semibold mt-1 text-lg">
              {activeCategory} Products: {totalProducts || 0}
            </p>
          )}
        </div>
        <Link href="/dashboard/createProduct">
          <button className="px-6 py-2.5 bg-[#ff6900] text-white rounded-lg shadow-md hover:bg-[#e65c00] transition-all font-semibold">
            + Create Product
          </button>
        </Link>
      </div>

      {/* Category Select */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-600 mb-2">Filter by Category:</label>
        <CategorySelect currentCategory={activeCategory} categories={categories || []} />
      </div>

      {/* Products List */}
      {!success || products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-start md:items-center justify-between bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5 w-full">
                <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.png"}
                    alt={product.name || "Product Image"}
                    sizes="(max-width: 96px) 100vw, 96px"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-[#ff6900] font-extrabold text-lg">
                      ${product.discountPrice ? product.discountPrice : product.regularPrice}
                    </p>
                    {product.discountPrice > 0 && product.discountPrice !== product.regularPrice && (
                      <p className="text-gray-400 text-sm line-through decoration-gray-400">
                        ${product.regularPrice}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold tracking-wider bg-orange-50 text-[#ff6900] px-2 py-1 rounded">
                      {Array.isArray(product.category)
                        ? product.category.join(", ")
                        : product.category}
                    </span>
                    <span className="text-gray-400 text-xs font-semibold bg-gray-100 px-2 py-1 rounded">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-3 items-center ml-4 mt-4 md:mt-0 shrink-0">
                <Link href={`/dashboard/allProducts/${product._id}`}>
                  <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors" title="Edit Product">
                    <MdEdit className="text-xl" />
                  </button>
                </Link>
                <DeleteProductAction productId={product._id} productName={product.name} />
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
