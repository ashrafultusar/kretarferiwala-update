"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDeliveryCharge } from "@/lib/data/deliveryCharge";
import { updateDeliveryCharge } from "@/actions/deliveryCharge";

const DeliveryChargeForm = () => {
  const [insideDhaka, setInsideDhaka] = useState(70);
  const [subDhaka, setSubDhaka] = useState(100);
  const [subDhakaAreas, setSubDhakaAreas] = useState(""); // নতুন স্টেট
  const [outsideDhaka, setOutsideDhaka] = useState(150);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCharge = async () => {
      const res = await getDeliveryCharge();
      if (res.success && res.charge) {
        setInsideDhaka(res.charge.insideDhaka);
        setSubDhaka(res.charge.subDhaka || 0);
        setSubDhakaAreas(res.charge.subDhakaAreas || ""); // ডাটা ফেচ
        setOutsideDhaka(res.charge.outsideDhaka);
      }
    };
    fetchCharge();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await updateDeliveryCharge(
        insideDhaka,
        subDhaka,
        subDhakaAreas, 
        outsideDhaka
      );

      if (res.success) {
        toast.success('update successfully')
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Delivery Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-bold text-gray-600">
              ঢাকার ভিতরে চার্জ (৳)
            </label>
            <input
              type="number"
              value={insideDhaka}
              onChange={(e) => setInsideDhaka(Number(e.target.value))}
              className="w-full border-gray-200 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-600">
              ঢাকার বাইরে চার্জ (৳)
            </label>
            <input
              type="number"
              value={outsideDhaka}
              onChange={(e) => setOutsideDhaka(Number(e.target.value))}
              className="w-full border-gray-200 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>
        </div>

        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 space-y-4">
          <h3 className="text-orange-700 font-bold text-sm uppercase tracking-wider">
            Sub Dhaka Settings
          </h3>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-600">
              সাব ঢাকা চার্জ (৳)
            </label>
            <input
              type="number"
              value={subDhaka}
              onChange={(e) => setSubDhaka(Number(e.target.value))}
              className="w-full border-gray-200 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-600">
              এলাকা সমুহ (কমা দিয়ে লিখুন)
            </label>
            <input
              type="text"
              value={subDhakaAreas}
              onChange={(e) => setSubDhakaAreas(e.target.value)}
              className="w-full border-gray-200 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="গাজীপুর, নারায়ণগঞ্জ, সাভার..."
            />
            <p className="text-[10px] text-gray-400 mt-1 italic">
              * এই এলাকাগুলো চেকআউট পেজে ড্রপডাউনের সাথে দেখাবে।
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 ${
            isLoading ? "opacity-70" : "hover:bg-black"
          }`}
        >
          {isLoading ? "Saving Changes..." : "সব তথ্য আপডেট করুন"}
        </button>
      </form>
    </div>
  );
};

export default DeliveryChargeForm;
