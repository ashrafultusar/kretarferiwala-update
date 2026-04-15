"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import Footer from "./Footer/Footer";
import Navbar from "./Navbar/Navbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/dashboard");

  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        {children}
        <ToastContainer />
      </main>

      {!isAdmin && (
        <div className="fixed bottom-8 right-8 z-50 group">
          <details className="relative">
            <summary className="cursor-pointer list-none outline-none">
              {/* Tooltip / Hover Text */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 hidden group-hover:block bg-gray-800 text-white text-[12px] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                যোগাযোগ করুন
                {/* Tooltip Arrow */}
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-8 border-transparent border-l-gray-800"></div>
              </div>

              {/* Main Button with Wave effect */}
              <div className="relative">
                {/* Wave Animation Layers */}
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40 delay-300"></div>

                {/* The Actual Icon */}
                <div className="relative bg-gradient-to-br from-green-500 to-green-700 hover:scale-110 transition-transform duration-300 shadow-2xl p-4 rounded-full flex items-center justify-center text-white z-10">
                  <MdCall className="text-2xl animate-bounce" />
                </div>
              </div>
            </summary>

            {/* Sub Menu */}
            <ul className="absolute bottom-20 right-0 backdrop-blur-md bg-white/90 border border-gray-100 rounded-2xl shadow-2xl p-2 space-y-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
              <li>
                <a
                  href="https://wa.me/01516759678"
                  target="_blank"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-green-600 hover:bg-green-50 transition-all border border-transparent hover:border-green-100"
                >
                  <FaWhatsapp className="text-2xl" />
                  <span className="text-sm font-bold">WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href="https://m.me/kretarferiwala"
                  target="_blank"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100"
                >
                  <FaFacebookMessenger className="text-2xl" />
                  <span className="text-sm font-bold">Messenger</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:01516759678"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-orange-600 hover:bg-orange-50 transition-all border border-transparent hover:border-orange-100"
                >
                  <MdCall className="text-2xl" />
                  <span className="text-sm font-bold">Direct Call</span>
                </a>
              </li>
            </ul>
          </details>
        </div>
      )}
      {!isAdmin && <Footer />}
    </>
  );
}
