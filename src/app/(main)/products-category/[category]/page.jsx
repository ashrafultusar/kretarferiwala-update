import ProductCard from "@/Shared/ProductCard/ProductCard";
import { getProductsByCategory } from "@/lib/data/product";

export default async function CategoryPage({ params }) {
  const { category } = await params;

  if (!category) {
    return (
      <div className="text-center text-red-500 p-10">
        Category not found!
      </div>
    );
  }

  const decodedCategory = decodeURIComponent(category).trim();

  // Fetch directly from DB via Mongoose avoiding external fetch errors
  const filteredProducts = await getProductsByCategory(category);

  return (
    <div className="max-w-7xl mx-auto p-6 mt-32">
      <h1 className="text-center text-lg md:text-3xl lg:text-4xl font-bold mb-4">
        Category / <span className="font-medium">{decodedCategory}</span>
      </h1>

      {filteredProducts && filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              regularPrice={product.regularPrice}
              discountPrice={product.discountPrice}
              image={product.images && product.images.length > 0 ? product.images[0] : ""}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          No products found for this category.
        </p>
      )}
    </div>
  );
}
