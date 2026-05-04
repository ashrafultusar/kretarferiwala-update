'use client';
import React, { useEffect, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { addSlider, deleteSlider } from "@/actions/slider";
import { getAllSliders } from "@/lib/data/slider";

const AdminSliderUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sliderImages, setSliderImages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchSliderImages();
  }, []);

  const fetchSliderImages = async () => {
    try {
      const res = await getAllSliders();
      if (res.success) {
        setSliderImages(res.sliders);
      } else {
        toast.error("Failed to fetch slider images");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch slider images");
    } finally {
      setIsFetching(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("image", imageFile);
    setIsLoading(true);

    try {
      const res = await addSlider(null, formData);

      if (res.success) {
        setSliderImages([res.slider, ...sliderImages]);
        setImageFile(null);
        setImagePreview("");
        toast.success(res.message || "Slider image uploaded");
      } else {
        toast.error(res.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await deleteSlider(id);
      if (res.success) {
        setSliderImages(sliderImages.filter((img) => img._id !== id));
        toast.success(res.message || "Deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete image");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-200 pb-4">Carousel Slider Management</h1>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="bg-orange-100 p-2 rounded-lg text-[#ff6900]"><Upload size={20} /></span>
            Upload New Banner
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full relative">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Banner Image Component</label>
              <label
                htmlFor="sliderImage"
                className={`flex flex-col md:flex-row items-center gap-4 border-2 border-dashed p-6 rounded-xl cursor-pointer transition-all ${imagePreview ? "border-[#ff6900] bg-orange-50 justify-center md:justify-start" : "border-gray-300 hover:border-[#ff6900] hover:bg-orange-50 justify-center"
                  }`}
              >
                {imagePreview ? (
                  <div className="relative w-full md:w-64 h-32 rounded-lg overflow-hidden shadow-sm border border-orange-200">
                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="block text-gray-700 font-bold mb-1">Click here to upload</span>
                    <span className="text-sm text-gray-400 text-center">Supports JPG, PNG formats. Best aspect ratio: 2.4:1 (1920x800)</span>
                  </div>
                )}
              </label>
              <input
                id="sliderImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !imageFile}
              className="w-full md:w-[200px] bg-[#ff6900] cursor-pointer text-white px-8 py-4 rounded-xl font-bold hover:bg-[#e65c00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center min-h-[58px]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <AiOutlineLoading3Quarters className="animate-spin" /> Uploading...
                </span>
              ) : (
                "Publish Banner"
              )}
            </button>
          </form>
        </div>

        {/* Existing Sliders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Active Banners</h3>
            <span className="bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full text-sm">
              {sliderImages.length} items
            </span>
          </div>

          {isFetching ? (
            <div className="flex justify-center py-12">
              <AiOutlineLoading3Quarters className="animate-spin h-8 w-8 text-[#ff6900]" />
            </div>
          ) : sliderImages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 font-medium">No banner images currently active.</p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sliderImages?.map((img) => (
                <li
                  key={img._id}
                  className="group relative bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-[21/9]">
                    <Image
                      src={img.imageUrl}
                      alt="Slider"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handleDelete(img._id)}
                        className="bg-red-500 cursor-pointer text-white p-3 rounded-full opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 hover:bg-red-600 transition-all duration-300 shadow-lg"
                        title="Delete this banner"
                      >
                        <MdDeleteOutline size={28} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSliderUpload;
