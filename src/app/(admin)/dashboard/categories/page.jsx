"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { Upload, Image as ImageIcon } from "lucide-react";
import { addCategory, deleteCategory } from "@/actions/category";
import { getAllCategories } from "@/lib/data/category";

const CategoryPage = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        if (res.success) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load categories");
      } finally {
        setIsFetching(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim() || !categoryImage) return;

    const formData = new FormData();
    formData.append("name", category);
    formData.append("image", categoryImage);

    setIsLoading(true);
    try {
      const res = await addCategory(null, formData);
      if (res.success) {
        setCategories((prev) => [...prev, res.category]);
        setCategory("");
        setCategoryImage(null);
        setImagePreview("");
        toast.success(res.message || "Category added");
      } else {
        toast.error(res.message || "Failed to add category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id, index) => {
    if (!confirm("Delete this category?")) return;
    try {
      const res = await deleteCategory(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        toast.success(res.message || "Category deleted");
      } else {
        toast.error(res.message || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4">Category Management</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Add New Category Panel */}
          <div className="bg-white w-full lg:w-1/3 shadow-sm border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              <span className="bg-orange-100 p-2 rounded-lg text-[#ff6900]"><Upload size={20} /></span>
              Add Category
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Clothing"
                  className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Category Image</label>
                <div className="relative">
                  <label
                    htmlFor="categoryImage"
                    className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed p-6 rounded-xl cursor-pointer transition-all ${imagePreview ? "border-[#ff6900] bg-orange-50" : "border-gray-300 hover:border-[#ff6900] hover:bg-orange-50"
                      }`}
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden shadow-sm">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500 font-medium">Click to upload image</span>
                      </>
                    )}
                  </label>
                  <input
                    id="categoryImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !category.trim() || !categoryImage}
                className="mt-2 bg-[#ff6900] text-white px-4 py-3 rounded-xl font-bold cursor-pointer hover:bg-[#e65c00] transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
                ) : (
                  "Create Category"
                )}
              </button>
            </form>
          </div>

          {/* Display Categories */}
          <div className="bg-white w-full lg:w-2/3 shadow-sm border border-gray-100 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center justify-between">
              <div>All Categories</div>
              <span className="text-sm font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg">{categories.length} items</span>
            </h3>

            {isFetching ? (
              <div className="flex justify-center items-center h-40">
                <AiOutlineLoading3Quarters className="animate-spin h-8 w-8 text-[#ff6900]" />
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No categories added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((cat, index) => (
                  <div
                    key={cat._id || index}
                    className="flex justify-between items-center p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all bg-white group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          sizes="64px"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-gray-800 font-bold text-lg">
                        {cat.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(cat._id, index)}
                      className="text-gray-400 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <MdDeleteOutline className="text-2xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
