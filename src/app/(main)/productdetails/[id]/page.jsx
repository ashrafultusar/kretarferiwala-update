import ProductDetailsClient from "@/components/main/ProductDetailsClient";
import { getFullProductData } from "@/lib/data/product";


const ProductPage = async ({ params }) => {
  const { id } = params;
  const data = await getFullProductData(id);

  if (!data || !data.product) {
    return <div className="text-center py-10">প্রোডাক্ট পাওয়া যায়নি</div>;
  }

  return (
    <ProductDetailsClient 
      initialProduct={data.product} 
      initialRelated={data.relatedProducts} 
      initialDelivery={data.deliveryCharge} 
    />
  );
};

export default ProductPage;