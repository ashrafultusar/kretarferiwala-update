"use client"

import { createReview, updateReview } from "@/actions/review";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ReviewForm = ({ initialData = null }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isEditing = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      let result;
      if (isEditing) {
        result = await updateReview(initialData._id, formData);
      } else {
        result = await createReview(formData);
      }

      if (result.success) {
        toast.success(result.message);
        if (!isEditing) {
          e.target.reset();
        } else {
          router.push("/dashboard/review");
        }
      } else {
        alert(result.message);
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800">
        {isEditing ? "Edit Customer Review" : "Add New Customer Review"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input name="name" type="text" defaultValue={initialData?.name || ""} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="Fatima Akter" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <input name="rating" type="number" min="1" max="5" defaultValue={initialData?.rating || "5"} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Photo</label>
            <input name="avatar" type="file" accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" />
            {isEditing && (
              <div className="mt-2 text-xs text-gray-500">Leave empty to keep existing photo</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
          <textarea name="reviewText" rows="4" defaultValue={initialData?.reviewText || ""} required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="Write experience..."></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-400">
          {loading ? "Processing..." : (isEditing ? "Update Review" : "Post Review")}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;