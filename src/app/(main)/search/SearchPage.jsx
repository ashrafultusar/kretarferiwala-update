"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/Shared/ProductCard/ProductCard";
import Loading from "@/Shared/LoadingSpinner/Loading";
import { getSearchedProducts } from "@/lib/data/products";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getSearchedProducts(query);
        if (res?.success) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  return (
    <>
      <h1 className="text-2xl text-center bg-orange-400 py-6 font-bold mb-6 mt-16 md:mt-32">
        Found {products.length} results for “{query}”
      </h1>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <p className="text-center text-lg">কোন প্রোডাক্ট পাওয়া যায়নি</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
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
        )}
      </div>
    </>
  );
}
