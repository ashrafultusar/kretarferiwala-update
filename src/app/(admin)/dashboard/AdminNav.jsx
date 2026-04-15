"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  HomeIcon,
  CarIcon,
  User2Icon,
  ChevronRight,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/actions/auth";

export default function AdminNav({ children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    await logout();
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
    { href: "/dashboard/allProducts", label: "Products", icon: Package },
    { href: "/dashboard/categories", label: "Categories", icon: Layers },
    { href: "/dashboard/review", label: "Review", icon: Layers },
    { href: "/dashboard/slider", label: "Home Slider", icon: HomeIcon },
    { href: "/dashboard/deliveryform", label: "Delivery Charges", icon: CarIcon },
    { href: "/dashboard/register", label: "Register", icon: User2Icon },
    { href: "/dashboard/allAdmin", label: "All Admin", icon: User2Icon },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* ===== Mobile Header ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-[#0f172a] text-white shadow-md">
        <Link href="/" className="text-xl font-black tracking-tighter text-orange-500 uppercase">
          ADMIN
        </Link>
        <button
          className="p-2 bg-white/10 rounded-lg transition-colors"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ===== Sidebar ===== */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          bg-[#0f172a] text-gray-400
          transition-all duration-300 border-r border-white/5
          ${isOpen ? "w-72" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="relative flex items-center gap-3 px-5 py-8 border-b border-white/5">
            <Link 
                href="/" 
                className={`transition-all duration-300 whitespace-nowrap font-black text-xl text-white ${!isOpen && "lg:opacity-0 lg:invisible lg:w-0"}`}
            >
                BACK <span className="text-orange-500">HOME</span>
            </Link>

            {/* Toggle Button for Desktop */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden lg:flex absolute -right-3 top-10
                bg-orange-500 text-white shadow-xl
                rounded-full p-1 hover:scale-110 transition-transform cursor-pointer z-50"
            >
              {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 mt-6">
            <p className={`text-[10px] uppercase tracking-[3px] text-gray-500 mb-6 px-2 font-black ${!isOpen && "lg:hidden"}`}>
              Management
            </p>

            <nav className="space-y-2">
              {links.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    onClick={() => setIsMobileOpen(false)}
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-4
                      px-3 py-3
                      text-[13px] font-bold uppercase tracking-widest
                      rounded-xl
                      transition-all duration-300
                      ${isActive 
                        ? "bg-white text-black shadow-lg shadow-white/5" 
                        : "hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <item.icon
                      size={20}
                      className={`shrink-0 ${isActive ? "text-orange-600" : "text-gray-500"}`}
                    />
                    <span className={`${!isOpen && "lg:hidden opacity-0"} transition-opacity duration-200 whitespace-nowrap`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sign Out Section */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 group transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                <LogOut size={18} />
              </div>
              <span className={`text-xs font-bold text-red-500 uppercase tracking-widest ${!isOpen && "lg:hidden"}`}>
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Overlay for Mobile ===== */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-md"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ===== Main Content Area ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 mt-16 lg:mt-0">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}