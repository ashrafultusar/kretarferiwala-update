"use client";

import { useEffect, useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { getOrderById } from "@/lib/data/order";
import {
  MdArrowBack,
  MdCalendarToday,
  MdLocalShipping,
  MdPayment,
  MdReceipt,
  MdPrint,
  MdOutlineNoteAlt,
  MdVpnKey,
} from "react-icons/md";
import OrderInvoicePrint from "@/components/print/orderInvoicePrint";

const OrderDetailsPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        if (!res.success || !res.order) {
          setError("Order not found");
          return;
        }
        setOrder(res.order);
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-orange-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-current"></div>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-6 text-center text-red-500 font-bold">{error}</div>
    );
  if (!order) return notFound();

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 mt-10 md:mt-16 bg-gray-50/50">
      <OrderInvoicePrint order={order} />

      <div className="max-w-5xl mx-auto print:hidden">
        {/* ফিরে যান বাটন */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-6 font-semibold group"
        >
          <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />{" "}
          ফিরে যান
        </button>

        {/* হেডার */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3">
              <MdReceipt className="text-orange-500" /> অর্ডার আইডি: #
              {order.orderNumber}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <p className="text-gray-500 flex items-center gap-2 font-medium">
                <MdCalendarToday size={14} /> অর্ডার করার তারিখ:{" "}
                {new Date(order.createdAt).toLocaleDateString("bn-BD")}
              </p>
              <span className="text-gray-300">|</span>
              <p className="text-gray-500 font-medium">
                সময়: {new Date(order.createdAt).toLocaleTimeString("bn-BD")}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${order.status === "pending" || order.status === "active"
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-green-50 text-green-600 border-green-100"
                }`}
            >
              {order.status}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-bold uppercase tracking-wider shadow-sm">
              {order.paymentMethod}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* শিপিং ও কাস্টমার তথ্য */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MdLocalShipping className="text-orange-500" /> শিপিং তথ্য
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                    গ্রাহকের নাম
                  </p>
                  <p className="text-gray-800 font-bold">{order.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                    মোবাইল নম্বর
                  </p>
                  <p className="text-gray-800 font-bold">{order.phone}</p>
                </div>
                <div className="md:col-span-2 border-t pt-4 mt-2 border-gray-50">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                    ডেলিভারি এরিয়া
                  </p>
                  <p className="text-gray-800 font-bold text-sm mb-4">
                    {order.deliveryAreaType === 'insideDhaka' && 'ঢাকার ভিতরে'}
                    {order.deliveryAreaType === 'outsideDhaka' && 'ঢাকার বাইরে'}
                    {order.deliveryAreaType === 'subDhaka' && `ঢাকার পার্শ্ববর্তী${order.subDhakaArea ? ` - ${order.subDhakaArea}` : ''}`}
                    {!order.deliveryAreaType && 'উল্লেখ নেই'}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                    ডেলিভারি ঠিকানা
                  </p>
                  <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-line">
                    {order.address}
                  </p>
                </div>
              </div>
            </div>

            {/* অর্ডার নোট (যদি থাকে) */}
            {order.note && (
              <div className="bg-orange-50/50 rounded-[24px] p-6 border border-orange-100/50">
                <h3 className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
                  <MdOutlineNoteAlt /> কাস্টমার নোট:
                </h3>
                <p className="text-gray-700 italic text-sm">"{order.note}"</p>
              </div>
            )}

            {/* পণ্যসমূহ */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                পণ্যসমূহ ({order.products.length})
              </h3>
              <div className="space-y-4">
                {order.products.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-2xl border border-gray-50 hover:border-gray-100 transition-colors"
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-50 border shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-800 truncate">
                        {item.name}
                      </h4>
                      {item.variant && (
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">
                          Option: {item.variant}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1 font-medium italic">
                        পরিমাণ: {item.quantity} টি
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-orange-600 font-black">
                        ৳{item.discountPrice * item.quantity}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        ৳{item.discountPrice} / প্রতিটি
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* পেমেন্ট সামারি */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[24px] p-6 shadow-md border border-gray-100 sticky top-28">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MdPayment className="text-orange-500" /> পেমেন্ট সামারি
              </h3>

              <div className="space-y-4">
                {/* ট্রানজেকশন আইডি (বিকাশ হলে) */}
                {order.transactionId && (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mb-4">
                    <p className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1 mb-1">
                      <MdVpnKey size={12} /> Transaction ID
                    </p>
                    <p className="text-xs font-mono font-bold text-gray-700 break-all">
                      {order.transactionId}
                    </p>
                  </div>
                )}

                <div className="flex justify-between text-gray-500 font-medium">
                  <span>সাবটোটাল</span>
                  <span>৳{order.subTotal}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{order.deliveryCharge}</span>
                </div>
                <div className="pt-4 border-t border-dashed">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800 font-black">মোট পরিমাণ</span>
                    <span className="text-2xl font-black text-orange-600">
                      ৳{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* প্রিন্ট বাটন */}
                <button
                  onClick={() => window.print()}
                  className="w-full mt-6 bg-gray-800 text-white font-bold py-4 rounded-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 text-sm uppercase tracking-widest shadow-lg shadow-gray-200"
                >
                  <MdPrint size={20} /> ইনভয়েস প্রিন্ট করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;