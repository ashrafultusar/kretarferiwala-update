import React from 'react';
import { Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const Features = () => {
  const featureData = [
    {
      icon: <Truck className="text-orange-600" size={28} />,
      title: "Fast Delivery",
      desc: "Orders over ৳999",
    },
    {
      icon: <ShieldCheck className="text-orange-600" size={28} />,
      title: "Secure Payment",
      desc: "100% safe checkout",
    },
    {
      icon: <RotateCcw className="text-orange-600" size={28} />,
      title: "Easy Returns",
      desc: "7-day return policy",
    },
    {
      icon: <Headphones className="text-orange-600" size={28} />,
      title: "24/7 Support",
      desc: "Always here to help",
    },
  ];

  return (
    <div className="bg-[#F8F8F8] pt-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10">
        {featureData.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Icon Container */}
            <div className="bg-[#FDEBD0] p-4 rounded-2xl flex items-center justify-center min-w-[65px] h-[65px]">
              {item.icon}
            </div>
            
            {/* Text Content */}
            <div className="flex flex-col">
              <h3 className="text-[#0A1D37] font-bold text-base leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Underline / Divider */}
      <div className="max-w-7xl mx-auto border-b border-gray-200"></div>
    </div>
  );
};

export default Features;