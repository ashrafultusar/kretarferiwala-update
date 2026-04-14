"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { Upload } from "lucide-react";
import { addCategory, deleteCategory } from "@/actions/category";
import { getAllCategories } from "@/lib/data/category";

const CategoryPage = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <div>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Add New Category */}
          <div className="bg-[#f3f4f6] w-full lg:w-1/2 shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Add New Category
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter category name"
                className="border p-2 rounded"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <div className="relative">
                <label
                  htmlFor="categoryImage"
                  className="flex items-center gap-2 border p-2 rounded cursor-pointer text-gray-700 hover:bg-orange-50"
                >
                  <Upload className="w-5 h-5 text-black" />
                  <span>Select Category Image</span>
                </label>
                <input
                  id="categoryImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={80}
                  height={80}
                  className="rounded"
                />
              )}
              <button
                type="submit"
                className="bg-[#0f766e] text-white px-4 py-2 rounded cursor-pointer flex justify-center items-center"
              >
                {isLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 text-white" />
                ) : (
                  "Add"
                )}
              </button>
            </form>
          </div>

          {/* Display Categories */}
          <div className="bg-[#f3f4f6] w-full lg:w-1/2 shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              All Categories
            </h3>
            {categories.length === 0 ? (
              <p className="text-gray-600 text-center">
                No categories added yet.
              </p>
            ) : (
              <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {categories.map((cat, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center px-4 py-2 rounded bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <span className="text-gray-800 font-medium">
                        {cat.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(cat._id, index)}
                      className="text-red-500 px-3 rounded-md py-2 text-sm font-semibold cursor-pointer"
                    >
                      <MdDeleteOutline className="text-2xl" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
