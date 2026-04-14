import AllCategories from "@/components/AllCategories/AllCategories";
import AllProducts from "@/components/HomePage/AllProducts/AllProducts";
import Features from "@/components/main/Home/Features";
import NewArrivals from "@/components/main/Home/NewArrivals";
import Testimonials from "@/components/main/Home/Testimonials/Testimonials";
import Slider from "@/components/Slider/Slider";
import { getHomeData } from "@/lib/data/fetchData";



export default async function Home() {
  const { sliders, categories, products } = await getHomeData();
  return (
    <div className="flex flex-col min-h-screen mt-16 md:mt-40 lg:mt-32">
      <div className="w-full">
        <Slider data={sliders} />
      </div>
      <Features/>
      <AllCategories data={categories} /><NewArrivals data={products} />
      <AllProducts data={products} />
      <Testimonials/>
    </div>
  );
}
