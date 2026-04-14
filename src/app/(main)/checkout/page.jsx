"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  MdDeleteForever,
  MdOutlineLocalShipping,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingPage from "../../loading";
import { createOrderAction } from "@/actions/order";

const CheckoutPage = () => {
  const [products, setProducts] = useState([]);
  const [deliveryChargeData, setDeliveryChargeData] = useState(null);
  const [selectedArea, setSelectedArea] = useState("insideDhaka");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [finalOrderDetails, setFinalOrderDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("checkoutCart");
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/updatedeliverycharge`
        );
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setDeliveryChargeData(data);
      } catch (error) {
        setDeliveryChargeData({
          insideDhaka: 70,
          subDhaka: 100,
          outsideDhaka: 150,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveryCharge();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const currentDeliveryCharge = deliveryChargeData
    ? deliveryChargeData[selectedArea]
    : 0;
  const subTotal = products.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );
  const totalAmount = subTotal + currentDeliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.phone || !formData.address) {
      setError("সব ফিল্ড পূরণ করুন");
      return;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন");
      return;
    }

    try {
      const data = await createOrderAction({
        ...formData,
        products,
        subTotal,
        deliveryCharge: currentDeliveryCharge,
        totalAmount,
      });

      if (data.success) {
        // ডাটাবেস থেকে আসা ডাটা সেভ করা হচ্ছে (যেমন: orderNumber)
        setFinalOrderDetails(data);
        localStorage.removeItem("checkoutCart");
        window.dispatchEvent(new Event("cartUpdated"));

        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "Purchase", {
            value: totalAmount,
            currency: "BDT",
            contents: products.map((p) => ({
              id: p.id,
              quantity: p.quantity,
              item_price: p.discountPrice,
            })),
          });
        }
        setOrderSuccess(true);
      } else {
        setError(data.message || "অর্ডার সম্পন্ন হয়নি");
      }
    } catch (err) {
      toast.error("সার্ভারে সমস্যা হয়েছে");
    }
  };

  if (loading) return <LoadingPage />;

// কার্ট খালি থাকলে এই প্রিমিয়াম ডিজাইনটি দেখাবে
if (products.length === 0) {
  return (
    <div className="flex flex-col justify-center items-center min-h-[80vh] px-4 mt-16 bg-gray-50/50">
      <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center max-w-lg w-full text-center relative overflow-hidden">
        
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
        
        {/* Bag Icon Section */}
        <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mb-8 relative">
          <svg
            className="w-14 h-14 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
          {/* Small red dot for accent */}
          <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-4 uppercase tracking-tighter">
          আপনার কার্টটি খালি
        </h2>
        <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed px-4">
          মনে হচ্ছে আপনি এখনও কোনো প্রোডাক্ট পছন্দ করেননি। আমাদের শপে ঘুরে দেখুন আপনার পছন্দের সেরা পণ্যটি খুঁজে পেতে!
        </p>

        {/* Action Button - Relevant to your brand colors */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center justify-center gap-3 bg-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-sm md:text-base hover:bg-orange-600 transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] active:scale-95 w-full md:w-auto cursor-pointer"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          শপিং এ ফিরে যান
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="bg-gray-50 mt-10 md:mt-28 min-h-screen py-10 ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-8 border-b pb-4">
              <MdOutlineLocalShipping className="text-orange-500 text-2xl" />
              <h2 className="text-xl font-bold">শিপিং ইনফরমেশন</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                    placeholder="নাম লিখুন"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                    placeholder="০১৭XXXXXXXX"
                    maxLength={11}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  সম্পূর্ণ ঠিকানা *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  placeholder="জেলা, থানা, বাসা নং..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  ডেলিভারি এরিয়া *
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all bg-gray-50 cursor-pointer"
                >
                  <option value="insideDhaka">
                    ঢাকার ভিতরে - ৳{deliveryChargeData.insideDhaka}
                  </option>
                  <option value="subDhaka">
                    ঢাকার পার্শ্ববর্তী - ৳{deliveryChargeData.subDhaka}
                  </option>
                  <option value="outsideDhaka">
                    ঢাকার বাইরে - ৳{deliveryChargeData.outsideDhaka}
                  </option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  অর্ডার নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  placeholder="কালার বা সাইজ"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-semibold">{error}</p>
              )}

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-lg transition-all active:scale-95 uppercase tracking-widest"
              >
                অর্ডার কনফর্ম করুন
              </button>
            </form>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <MdOutlineShoppingCart className="text-orange-500 text-2xl" />
                <h2 className="text-xl font-bold">অর্ডার সামারি</h2>
              </div>

              <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-50"
                  >
                    <div className="relative h-16 w-16 shrink-0 shadow-sm">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover rounded-xl bg-white p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold line-clamp-1 text-gray-800">
                        {p.name}
                      </h3>
                      <p className="text-orange-600 font-black text-sm">
                        ৳{p.discountPrice}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const updated = products.filter(
                          (item) => item.id !== p.id
                        );
                        setProducts(updated);
                        localStorage.setItem(
                          "checkoutCart",
                          JSON.stringify(updated)
                        );
                        window.dispatchEvent(new Event("cartUpdated"));
                      }}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <MdDeleteForever size={24} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-5 space-y-3">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>সাবটোটাল</span>
                  <span>৳{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{currentDeliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-800 pt-3 border-t">
                  <span>সর্বমোট</span>
                  <span className="text-orange-600">
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Professional & Data Driven */}
      {orderSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[999] p-4">
          <div className="bg-white rounded-[35px] w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl mb-4">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                অর্ডার সফল হয়েছে!
              </h2>
              <p className="text-green-50 text-sm opacity-90">
                খুব শীঘ্রই আমাদের প্রতিনিধি কল করে কনফার্ম করবেন।
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                    অর্ডার নম্বর
                  </p>
                  <p className="text-sm font-black text-gray-800">
                    {finalOrderDetails?.orderNumber || "GB#123456"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                    পেমেন্ট মেথড
                  </p>
                  <p className="text-sm font-black text-gray-800">
                    Cash on Delivery
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b pb-3 border-gray-50">
                  <span className="text-gray-500 text-sm">কাস্টমার:</span>
                  <span className="text-gray-800 text-sm font-bold">
                    {formData.name}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-3 border-gray-50">
                  <span className="text-gray-500 text-sm">মোবাইল:</span>
                  <span className="text-gray-800 text-sm font-bold">
                    {formData.phone}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-3 border-gray-50">
                  <span className="text-gray-500 text-sm">ঠিকানা:</span>
                  <span className="text-gray-800 text-sm font-bold text-right max-w-[200px] leading-tight">
                    {formData.address}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-800 font-bold uppercase text-xs">
                    মোট বিল:
                  </span>
                  <span className="text-2xl font-black text-orange-600">
                    ৳{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setOrderSuccess(false);
                  router.push("/");
                }}
                className="w-full bg-black hover:bg-gray-800 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 uppercase text-sm tracking-widest"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
