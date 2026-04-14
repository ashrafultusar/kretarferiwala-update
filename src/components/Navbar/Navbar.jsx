"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { IoMenuSharp } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { FaCartArrowDown, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useCategories from "../../hooks/useCategories";
import { LucideShoppingCart } from "lucide-react";

export default function Navbar() {
  const { categories } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsOpen(false); // Mobile search এর পর মেনু বন্ধ হবে
    }
  };

  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? "down" : "up");
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    }
  }, [lastScrollY]);

  useEffect(() => {
    const getCartCount = () => {
      const cartData = localStorage.getItem("checkoutCart");
      const cartItems = cartData ? JSON.parse(cartData) : [];
      setCartCount(cartItems.length);
    };

    getCartCount();
    window.addEventListener("cartUpdated", getCartCount);
    return () => window.removeEventListener("cartUpdated", getCartCount);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <nav
        className={`bg-white shadow-md px-4 py-3 fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* --- Mobile View Header --- */}
          <div className="flex items-center md:hidden w-full justify-between">
            <button onClick={() => setIsOpen(true)}>
              <IoMenuSharp className="text-2xl cursor-pointer text-black" />
            </button>
            <Link
              href="/"
              className="flex cursor-pointer items-center space-x-2"
            >
              <Image
                src="/logo_icon/logo.png"
                alt="Logo"
                width={40}
                height={40}
              />
            </Link>

            <Link href="/checkout" className="relative">
              <FaCartArrowDown className="text-2xl text-gray-700 hover:text-red-500" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* --- Desktop View Header --- */}
          <div className="hidden md:flex w-full items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Image
                src="/logo_icon/logo.png"
                alt="Logo"
                width={50}
                height={50}
              />
            </Link>

            {/* Desktop Search Bar (Styled like the image) */}
            <div className="flex-1 flex justify-center px-10">
              <div className="relative w-full max-w-lg flex items-center bg-gray-50 rounded-full border border-gray-200 shadow-sm transition-all focus-within:ring-2 focus-within:ring-orange-200">
                <input
                  type="text"
                  placeholder="Search for baby products, toys, accessories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-transparent py-2.5 pl-6 pr-12 text-gray-600 placeholder-gray-400 focus:outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-1.5 p-3 bg-[#ff7010] hover:bg-[#e6650d] text-white cursor-pointer rounded-full transition-colors flex items-center justify-center shadow-md"
                >
                  <FaSearch className="text-sm" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {token && (
                <Link
                  href={"/dashboard"}
                  className="uppercase px-4 py-1 border rounded bg-slate-200 text-black hover:bg-slate-300 transition"
                >
                  dashboard
                </Link>
              )}

              <Link
                href="/checkout"
                className="flex flex-col items-center group"
              >
                <div className="relative">
                  <LucideShoppingCart className="text-2xl text-[#fc8934]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#fc8934] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-gray-600 group-hover:text-[#fc8934] mt-0.5">
                  Cart
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:flex bg-gray-100 py-3 mt-2 justify-center space-x-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products-category/${encodeURIComponent(category.name)}`}
              className="text-black hover:text-[#fc8934] transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* --- Mobile Sidebar with Transition --- */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-[60] flex flex-col p-6 transition-all duration-500 ease-in-out transform ${
          isOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full w-0 overflow-hidden"
        }`}
      >
        <button onClick={() => setIsOpen(false)} className="self-end mb-6">
          <ImCross className="text-xl cursor-pointer text-black hover:text-red-500 transition-colors" />
        </button>

        {/* Mobile Search inside Sidebar */}
        <div className="px-2 mb-8">
          <div className="relative w-full flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-transparent py-2 pl-4 pr-12 text-sm text-gray-600 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 p-2.5 bg-[#ff7010] text-white rounded-full flex items-center justify-center"
            >
              <FaSearch className="text-xs" />
            </button>
          </div>
        </div>

        {token && (
          <Link
            href={"/dashboard"}
            className="uppercase text-center px-4 py-2 mb-4 border rounded bg-slate-200 text-black font-semibold"
            onClick={() => setIsOpen(false)}
          >
            dashboard
          </Link>
        )}

        <p className="text-gray-400 text-xs font-bold uppercase mb-4 tracking-wider">
          Categories
        </p>
        <div className="flex flex-col space-y-2 overflow-y-auto">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products-category/${encodeURIComponent(category.name)}`}
              className="text-black text-base hover:bg-[#fc8934] hover:text-white bg-gray-50 px-4 py-2 rounded-md transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Backdrop (Overlay) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
