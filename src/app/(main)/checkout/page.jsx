"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  MdDeleteForever,
  MdOutlineLocalShipping,
  MdOutlineShoppingCart,
  MdAccountBalanceWallet,
  MdInfo, // নতুন আইকন যোগ করা হয়েছে
} from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getDeliveryCharge } from "@/lib/data/deliveryCharge";
import { createOrderAction } from "@/actions/order";

const CheckoutPage = () => {
  const [products, setProducts] = useState([]);
  const [deliveryChargeData, setDeliveryChargeData] = useState({
    insideDhaka: 70,
    subDhaka: 100,
    outsideDhaka: 150,
    subDhakaAreasList: [],
  });
  const [selectedArea, setSelectedArea] = useState("insideDhaka");
  const [selectedSubDhakaArea, setSelectedSubDhakaArea] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
    transactionId: "",
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [finalOrderDetails, setFinalOrderDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("checkoutCart");
    if (stored) setProducts(JSON.parse(stored));

    const loadData = async () => {
      try {
        const res = await getDeliveryCharge();
        if (res.success && res.charge) {
          setDeliveryChargeData({
            insideDhaka: res.charge.insideDhaka || 70,
            subDhaka: res.charge.subDhaka || 100,
            outsideDhaka: res.charge.outsideDhaka || 150,
            subDhakaAreasList: res.charge.subDhakaAreas
              ? res.charge.subDhakaAreas.split(",").map(a => a.trim()).filter(a => a !== "")
              : []
          });
        }
      } catch (err) {
        console.error("Delivery charge load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    if (typeof window !== "undefined") {
      if (typeof window.fbq === "function") {
        window.fbq("track", "InitiateCheckout");
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "begin_checkout" });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const currentDeliveryCharge = deliveryChargeData[selectedArea] || 0;
  const subTotal = products.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );
  const totalAmount = subTotal + currentDeliveryCharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      return toast.error("সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন");
    }
    if (paymentMethod === "bKash" && !formData.transactionId) {
      return toast.error("বিকাশ ট্রানজেকশন আইডি দিন");
    }

    setIsSubmitting(true);
    try {
      const result = await createOrderAction({
        ...formData,
        deliveryAreaType: selectedArea,
        subDhakaArea: selectedArea === "subDhaka" ? selectedSubDhakaArea : "",
        products,
        subTotal,
        deliveryCharge: currentDeliveryCharge,
        totalAmount,
        paymentMethod,
      });

      if (result.success) {
        setFinalOrderDetails(result);
        localStorage.removeItem("checkoutCart");
        window.dispatchEvent(new Event("cartUpdated"));
        setOrderSuccess(true);
        toast.success("অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!");

        const itemIds = products.map((p) => p.id);
        if (typeof window !== "undefined") {
          if (typeof window.fbq === "function") {
            window.fbq("track", "Purchase", {
              content_ids: itemIds,
              value: totalAmount,
              currency: "BDT",
            });
          }
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "purchase",
            ecommerce: {
              transaction_id:
                result.orderNumber || new Date().getTime().toString(),
              value: totalAmount,
              currency: "BDT",
              items: products.map((p) => ({
                item_name: p.name,
                item_id: p.id,
                price: p.discountPrice,
                quantity: p.quantity,
              })),
            },
          });
        }
      } else {
        toast.error(result.message || "অর্ডার সম্পন্ন হয়নি");
      }
    } catch (err) {
      toast.error("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        লোডিং হচ্ছে...
      </div>
    );

  if (products.length === 0 && !orderSuccess) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] bg-gray-50">
        <h2 className="text-2xl font-black mb-4">আপনার কার্টটি খালি</h2>
        <button
          onClick={() => router.push("/")}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold"
        >
          শপিং এ ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 mt-10 md:mt-24 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-8 border-b pb-4">
              <MdOutlineLocalShipping className="text-orange-500 text-2xl" />
              <h2 className="text-xl font-bold uppercase tracking-tight">
                শিপিং ও পেমেন্ট তথ্য
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* input fields start */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                    placeholder="পুরো নাম লিখুন"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    maxLength={11}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                    placeholder="০১৭XXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                  সম্পূর্ণ ঠিকানা *
                </label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  placeholder="বাসা নং, রোড নং, থানা, জেলা..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                  অর্ডার নোট (ঐচ্ছিক)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
                  placeholder="ডেলিভারি সম্পর্কে কোনো বিশেষ তথ্য থাকলে লিখুন..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                  ডেলিভারি এরিয়া *
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none bg-gray-50 cursor-pointer font-semibold"
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

              {selectedArea === "subDhaka" && deliveryChargeData.subDhakaAreasList?.length > 0 && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                    সাব-ঢাকা এরিয়া নির্বাচন করুন *
                  </label>
                  <select
                    value={selectedSubDhakaArea}
                    onChange={(e) => setSelectedSubDhakaArea(e.target.value)}
                    required
                    className="w-full border-gray-200 border rounded-2xl p-4 focus:ring-2 focus:ring-orange-400 outline-none bg-gray-50 cursor-pointer font-semibold"
                  >
                    <option value="">-- এরিয়া নির্বাচন করুন --</option>
                    {deliveryChargeData.subDhakaAreasList.map((area, idx) => (
                      <option key={idx} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-4 pt-4">
                <label className="text-[11px] font-black text-gray-500 uppercase flex items-center gap-2">
                  <MdAccountBalanceWallet /> পেমেন্ট মেথড সিলেক্ট করুন
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod("Cash on Delivery")}
                    className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === "Cash on Delivery"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-100 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "Cash on Delivery"
                          ? "border-orange-500"
                          : "border-gray-300"
                          }`}
                      >
                        {paymentMethod === "Cash on Delivery" && (
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                      <span className="font-bold text-sm">
                        Cash on Delivery
                      </span>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("bKash")}
                    className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === "bKash"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-100 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "bKash"
                          ? "border-pink-500"
                          : "border-gray-300"
                          }`}
                      >
                        {paymentMethod === "bKash" && (
                          <div className="w-2.5 h-2.5 bg-pink-500 rounded-full"></div>
                        )}
                      </div>
                      <span className="font-bold text-sm">bKash (Manual)</span>
                    </div>
                    <Image
                      src="/bkash.png"
                      width={25}
                      height={25}
                      alt="bKash"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                {/* bKash Section with Charge Warning */}
                {paymentMethod === "bKash" && (
                  <div className="p-5 bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-3xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-pink-200 shadow-sm">
                      <div>
                        <p className="text-[10px] font-bold text-pink-400 uppercase">
                          বিকাশ পার্সোনাল নম্বর
                        </p>
                        <p className="text-xl font-black text-gray-800 tracking-wider">
                          01934100004
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                          মোট প্রদেয়
                        </p>
                        <p className="text-lg font-black text-pink-600">
                          ৳{totalAmount}
                        </p>
                      </div>
                    </div>

                    {/* চার্জের বিশেষ দ্রষ্টব্য */}
                    <div className="flex gap-3 bg-white/60 p-3 rounded-xl border border-pink-100 items-start">
                      <MdInfo
                        className="text-pink-500 shrink-0 mt-0.5"
                        size={18}
                      />
                      <p className="text-[12px] text-gray-700 leading-tight">
                        <span className="font-bold text-pink-600 underline">
                          বিশেষ দ্রষ্টব্য:
                        </span>{" "}
                        বিকাশ পেমেন্ট করার ক্ষেত্রে অবশ্যই{" "}
                        <strong>ক্যাশ আউট চার্জসহ</strong> পেমেন্ট সম্পন্ন
                        করবেন।
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">
                        ট্রানজেকশন আইডি (TrxID) *
                      </label>
                      <input
                        type="text"
                        name="transactionId"
                        required
                        value={formData.transactionId}
                        onChange={handleChange}
                        placeholder="বিকাশ থেকে পাওয়া TrxID টি দিন"
                        className="w-full border-gray-200 border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-pink-400 transition-all shadow-inner"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-black py-5 rounded-2xl cursor-pointer shadow-lg transition-all active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2 ${isSubmitting
                  ? "bg-gray-400"
                  : "bg-orange-500 hover:bg-orange-600"
                  }`}
              >
                {isSubmitting ? "অর্ডার প্রসেস হচ্ছে..." : "অর্ডার কনফর্ম করুন"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <MdOutlineShoppingCart className="text-orange-500 text-2xl" />
                <h2 className="text-xl font-bold uppercase tracking-tight">
                  অর্ডার সামারি
                </h2>
              </div>

              <div className="space-y-4 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white p-1">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold line-clamp-1 text-gray-800">
                        {p.name}
                      </h3>
                      {p.variant && (
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                          Option: {p.variant}
                        </p>
                      )}
                      <p className="text-orange-600 font-black text-sm mt-1">
                        ৳{p.discountPrice} x {p.quantity}
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
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <MdDeleteForever size={22} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed pt-5 space-y-3">
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>সাবটোটাল</span>
                  <span>৳{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-sm font-medium">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{currentDeliveryCharge}</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-gray-800 pt-3 border-t">
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

      {orderSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-[999] p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-green-500 p-10 text-center text-white">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 text-3xl font-bold">
                ✓
              </div>
              <h2 className="text-2xl font-black uppercase">
                অর্ডার সফল হয়েছে!
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    অর্ডার নম্বর
                  </p>
                  <p className="text-sm font-black text-gray-800">
                    {finalOrderDetails?.orderNumber}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-400">
                    পেমেন্ট মেথড
                  </p>
                  <p className="text-sm font-black text-gray-800">
                    {paymentMethod}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/")}
                className="w-full cursor-pointer bg-black text-white font-black py-4 rounded-2xl uppercase text-sm tracking-widest"
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
