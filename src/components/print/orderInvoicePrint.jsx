import React from 'react';

const OrderInvoicePrint = ({ order }) => {
  if (!order) return null;

  return (
    <div className="hidden print:block p-10 bg-white text-black min-h-screen">
      {/* ইনভয়েস হেডার */}
      <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-black mb-2 leading-none">INVOICE</h1>
          <p className="text-sm font-bold mt-2">অর্ডার আইডি: #{order.orderNumber}</p>
          <p className="text-sm text-gray-600 font-medium">
            তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD')}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl text-gray-600 font-black uppercase tracking-tight">Kretarferiwala</h2>
          <p className="text-sm">ঢাকা, বাংলাদেশ</p>
          <p className="text-sm font-medium">পেমেন্ট মেথড: {order.paymentMethod}</p>
        </div>
      </div>

      {/* গ্রাহক ও শিপিং তথ্য */}
      <div className="grid grid-cols-2 gap-12 mb-10 text-sm">
        <div>
          <h3 className="text-[10px] uppercase font-bold text-gray-400 mb-2 border-b pb-1">শিপিং ঠিকানা</h3>
          <p className="font-bold text-lg">{order.name}</p>
          <p className="leading-relaxed text-gray-700">{order.address}</p>
          <p className="font-bold mt-1">ফোন: {order.phone}</p>
        </div>
       
      </div>

      {/* প্রোডাক্ট টেবিল */}
      <table className="w-full mb-10 border-collapse">
        <thead>
          <tr className="bg-gray-100 border-y-2 border-gray-800 text-left">
            <th className="py-3 px-3 text-sm font-bold uppercase">পণ্য</th>
            <th className="py-3 px-3 text-sm font-bold text-center uppercase">পরিমাণ</th>
            <th className="py-3 px-3 text-sm font-bold text-right uppercase">মূল্য</th>
            <th className="py-3 px-3 text-sm font-bold text-right uppercase">মোট</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-4 px-3">
                <p className="font-bold text-sm">{item.name}</p>
              </td>
              <td className="py-4 px-3 text-sm text-center font-medium">{item.quantity} টি</td>
              <td className="py-4 px-3 text-sm text-right font-medium">৳{item.discountPrice}</td>
              <td className="py-4 px-3 text-sm text-right font-bold">৳{item.discountPrice * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* টোটাল ক্যালকুলেশন */}
      <div className="flex justify-end">
        <div className="w-1/3 space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>সাবটোটাল</span>
            <span className="font-bold">৳{order.subTotal}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>ডেলিভারি চার্জ</span>
            <span className="font-bold">৳{order.deliveryCharge}</span>
          </div>
          <div className="flex justify-between text-xl font-black border-t-2 border-gray-800 pt-3">
            <span>সর্বমোট</span>
            <span className="text-orange-600 leading-none">৳{order.totalAmount}</span>
          </div>
        </div>
      </div>

      {/* ফুটার */}
      <div className="fixed bottom-10 left-10 right-10 text-center border-t border-gray-100 pt-6">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Thank you for shopping with us!</p>
      </div>
    </div>
  );
};

export default OrderInvoicePrint;