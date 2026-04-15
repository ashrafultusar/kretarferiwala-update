"use client"

import { createReview } from "@/actions/review";
import { useState } from "react";

const ReviewForm = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createReview(formData);
      
      if (result.success) {
        alert(result.message);
        e.target.reset();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Customer Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input name="name" type="text" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="Fatima Akter" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
            <input name="rating" type="number" min="1" max="5" defaultValue="5" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Photo</label>
            <input name="avatar" type="file" accept="image/*" className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
          <textarea name="reviewText" rows="4" required className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500" placeholder="Write experience..."></textarea>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition disabled:bg-gray-400">
          {loading ? "Processing..." : "Post Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;