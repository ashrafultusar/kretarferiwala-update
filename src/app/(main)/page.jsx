import AllCategories from "@/components/AllCategories/AllCategories";
import AllProducts from "@/components/HomePage/AllProducts/AllProducts";
import Slider from "@/components/Slider/Slider";
import { getHomeData } from "@/lib/data/fetchData";



export default async function Home() {
  const { sliders, categories, products } = await getHomeData();
  return (
    <div className="flex flex-col min-h-screen mt-16 md:mt-40 lg:mt-32">
      <div className="w-full">
        <Slider data={sliders} />
      </div>
      <AllCategories data={categories} />
      <AllProducts data={products} />
    </div>
  );
}
