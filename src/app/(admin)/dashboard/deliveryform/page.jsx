"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDeliveryCharge } from "@/lib/data/deliveryCharge";
import { updateDeliveryCharge } from "@/actions/deliveryCharge";

const DeliveryChargeForm = () => {
  const [insideDhaka, setInsideDhaka] = useState(70);
  const [subDhaka, setSubDhaka] = useState(100); // নতুন স্টেট
  const [outsideDhaka, setOutsideDhaka] = useState(150);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCharge = async () => {
      const res = await getDeliveryCharge();
      if (res.success && res.charge) {
        setInsideDhaka(res.charge.insideDhaka);
        setSubDhaka(res.charge.subDhaka || 0); // ডাটা ফেচ করা
        setOutsideDhaka(res.charge.outsideDhaka);
      }
    };
    fetchCharge();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ৩টি ভ্যালু পাঠানো হচ্ছে
      const res = await updateDeliveryCharge(
        insideDhaka,
        subDhaka,
        outsideDhaka
      );

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-semibold">ঢাকার ভিতরে চার্জ *</label>
        <input
          type="number"
          min={0}
          value={insideDhaka}
          onChange={(e) => setInsideDhaka(Number(e.target.value))}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      {/* সাব ঢাকা ইনপুট ফিল্ড */}
      <div>
        <label className="block mb-1 font-semibold">
          ঢাকার পার্শ্ববর্তী এলাকা (Sub Dhaka) *
        </label>
        <input
          type="number"
          min={0}
          value={subDhaka}
          onChange={(e) => setSubDhaka(Number(e.target.value))}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">ঢাকার বাইরে চার্জ *</label>
        <input
          type="number"
          min={0}
          value={outsideDhaka}
          onChange={(e) => setOutsideDhaka(Number(e.target.value))}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`bg-blue-500 text-white font-semibold py-3 rounded-md w-full ${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Updating..." : "আপডেট করুন"}
      </button>
    </form>
  );
};

export default DeliveryChargeForm;
