"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
import useCategories from "@/hooks/useCategories";
import { addProduct } from "@/actions/product";
import { PackagePlus, Image as ImageIcon, Tags, Type, DollarSign, AlignLeft, ShieldCheck } from "lucide-react";

export default function ProductForm() {
  const router = useRouter();
  const { categories } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    category: [],
    description: "",
    regularPrice: "",
    discountPrice: "",
    images: [],
    variantsInput: "",
  });

  // toggle category selection
  const toggleCategory = (catName) => {
    setProduct((prev) => {
      if (prev.category.includes(catName)) {
        return {
          ...prev,
          category: prev.category.filter((c) => c !== catName),
        };
      } else {
        return { ...prev, category: [...prev.category, catName] };
      }
    });
  };

  const removeImage = (indexToRemove) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.category.length === 0) {
      return toast.error("Please select at least one category to proceed.");
    }
    if (product.images.length === 0) {
      return toast.error("A product must have at least one image.");
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", product.name);
    product.category.forEach((cat) => formData.append("category", cat));

    if (product.variantsInput) {
      const variantsArr = product.variantsInput.split(",").map(v => v.trim()).filter(v => v !== "");
      variantsArr.forEach((v) => formData.append("variants", v));
    }

    formData.append("description", product.description);
    formData.append("regularPrice", product.regularPrice);
    formData.append("discountPrice", product.discountPrice);
    product.images.forEach((file) => formData.append("images", file));

    try {
      const result = await addProduct(null, formData);

      if (result.success) {
        toast.success(result.message || "Product published successfully!");
        setProduct({
          name: "",
          category: [],
          description: "",
          regularPrice: "",
          discountPrice: "",
          images: [],
          variantsInput: "",
        });
        router.push("/dashboard/allProducts");
      } else {
        toast.error("Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong during product upload.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="bg-orange-50 p-2 rounded-lg text-[#ff6900]"><PackagePlus size={28} /></span>
              Add New Product
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Publish a new item to your catalog.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

          {/* Main Details Pane */}
          <div className="flex-1 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
                <Type className="text-gray-400 w-5 h-5" /> Basic Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Product Title</label>
                  <input
                    type="text"
                    placeholder="E.g. Premium Cotton T-Shirt"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] transition-all bg-gray-50 hover:bg-white focus:bg-white text-gray-900 font-medium placeholder-gray-400"
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Description</label>
                  <textarea
                    placeholder="Describe the product details, material, fit, etc."
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] transition-all bg-gray-50 hover:bg-white focus:bg-white text-gray-900 font-medium placeholder-gray-400 min-h-[120px]"
                    rows={4}
                    value={product.description}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
                <Tags className="text-gray-400 w-5 h-5" /> Taxonomy & Variations
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Select Categories</label>
                  {categories && categories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <div
                          key={cat._id}
                          onClick={() => toggleCategory(cat.name)}
                          className={`cursor-pointer border-2 px-3 py-2.5 rounded-xl text-center text-sm font-bold transition-all ${product.category.includes(cat.name)
                              ? "bg-orange-50 text-[#ff6900] border-[#ff6900] shadow-sm transform scale-[1.02]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                        >
                          {cat.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">No categories found. Please add categories first.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Variants (Sizes / Colors)</label>
                  <input
                    type="text"
                    placeholder="E.g. XL, L, Red, Blue (comma separated)"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] transition-all bg-gray-50 hover:bg-white focus:bg-white text-gray-900 font-medium placeholder-gray-400"
                    value={product.variantsInput}
                    onChange={(e) => setProduct({ ...product, variantsInput: e.target.value })}
                  />
                  <p className="text-xs text-gray-400 mt-2 ml-1">Leave blank if this product has no specific variations.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-5">
                <DollarSign className="text-gray-400 w-5 h-5" /> Pricing Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Regular Price (৳)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">৳</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] transition-all bg-gray-50 hover:bg-white focus:bg-white text-gray-900 font-bold placeholder-gray-400"
                      value={product.regularPrice}
                      onChange={(e) => setProduct({ ...product, regularPrice: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Discount Price (৳)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff6900] font-bold">৳</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] transition-all bg-gray-50 hover:bg-white focus:bg-white text-gray-900 font-bold placeholder-gray-400"
                      value={product.discountPrice}
                      onChange={(e) => setProduct({ ...product, discountPrice: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Sidebar - Media and Submission */}
          <div className="w-full lg:w-[380px] flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                <ImageIcon className="text-gray-400 w-5 h-5" /> Product Media
              </h2>

              <div className="border-2 border-dashed border-gray-300 hover:border-[#ff6900] transition-colors rounded-xl p-6 text-center text-gray-500 bg-gray-50 hover:bg-orange-50/50 mb-4 group">
                <label
                  htmlFor="imageUpload"
                  className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                >
                  <MdCloudUpload className="text-4xl mb-2 text-gray-400 group-hover:text-[#ff6900] transition-colors" />
                  <span className="font-bold text-gray-700 group-hover:text-gray-900">Click to upload</span>
                  <span className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</span>
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const newFiles = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    setProduct((prev) => ({
                      ...prev,
                      images: [...prev.images, ...newFiles],
                    }));
                  }}
                />
              </div>

              {/* Image Preview List */}
              {product.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
                  {product.images.map((file, index) => (
                    <div
                      key={index}
                      className="w-full aspect-square relative border border-gray-200 rounded-lg overflow-hidden group/img shadow-sm"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white/90 text-red-500 rounded-full p-1 opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-sm cursor-pointer"
                      >
                        <MdClose size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-gray-100 rounded-xl bg-gray-50 mb-6">
                  <p className="text-xs text-gray-400 font-medium">No images uploaded yet.</p>
                </div>
              )}

              <hr className="border-gray-100 mb-6" />

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#ff6900] cursor-pointer text-white py-3.5 rounded-xl w-full font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#e65c00] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Publish Product
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
