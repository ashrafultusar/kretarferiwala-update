import React from "react";
import { getDashboardStats } from "@/lib/data/order";
import {
  TrendingUp,
  PackageCheck,
  ShoppingCart,
  Activity,
  Trophy,
  ArrowRight,
  Clock
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT' }).format(amount).replace('BDT', '৳');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Overview Dashboard</h1>
            <p className="text-gray-500 mt-2 font-medium">Here's what's happening with your store today.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/orders">
              <button className="bg-white border border-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-xl shadow-sm hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-2">
                <ShoppingCart size={18} /> Manage Orders
              </button>
            </Link>
            <Link href="/dashboard/createProduct">
              <button className="bg-[#ff6900] text-white font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer hover:bg-[#e65c00] transition-colors flex items-center gap-2">
                + New Product
              </button>
            </Link>
          </div>
        </div>

        {/* 3 Main Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -right-6 -top-6 bg-green-50 w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total Verified Revenue</p>
                <h3 className="text-3xl font-black text-gray-800">{formatCurrency(stats.totalSales || 0)}</h3>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
            </div>
            <div className="mt-5 relative z-10 flex items-center gap-2">
              <span className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-1 rounded-md border border-green-100">
                Delivered Only
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -right-6 -top-6 bg-blue-50 w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Items Delivered</p>
                <h3 className="text-3xl font-black text-gray-800">{stats.deliveredOrdersCount?.toLocaleString() || 0}</h3>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <PackageCheck size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute -right-6 -top-6 bg-orange-50 w-32 h-32 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-bold text-orange-600 uppercase tracking-widest mb-1">All Orders Generated</p>
                <h3 className="text-3xl font-black text-[#ff6900]">{stats.totalOrders?.toLocaleString() || 0}</h3>
              </div>
              <div className="p-3 bg-[#ff6900] text-white rounded-xl shadow-sm">
                <ShoppingCart size={24} />
              </div>
            </div>
          </div>

        </div>

        {/* 2-Column Tables Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Trophy className="text-yellow-500 w-5 h-5" /> Best Selling Products
              </h3>
              <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded text-gray-500 shadow-sm">Top 10</span>
            </div>

            <div className="p-0 overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Product Breakdown</th>
                    <th className="px-6 py-4 text-right">Units Sold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.topProducts?.length > 0 ? (
                    stats.topProducts.map((prod, index) => (
                      <tr key={index} className="hover:bg-orange-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${index < 3 ? 'bg-orange-100 text-[#ff6900]' : 'bg-gray-100 text-gray-600'}`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800 line-clamp-1">{prod._id || "Unknown Product"}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-black text-gray-900 border border-gray-200 px-3 py-1 rounded-lg bg-gray-50 inline-block shadow-sm">
                            {prod.quantity?.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-gray-500">No sales data available yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Activity className="text-blue-500 w-5 h-5" /> Recent Active Orders
              </h3>
              <Link href="/dashboard/orders" className="text-[#ff6900] text-sm font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="p-0 overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                    <th className="px-6 py-4">Order ID & Date</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentActiveOrders?.length > 0 ? (
                    stats.recentActiveOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <Link href={`/dashboard/orders/${order._id}`} className="font-bold text-[#ff6900] hover:underline block mb-1">
                            #{order.orderNumber}
                          </Link>
                          <div className="flex items-center gap-1 text-xs font-semibold text-gray-400">
                            <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800 text-sm max-w-[150px] truncate" title={order.name}>{order.name}</p>
                          <p className="text-xs font-bold text-gray-500 mt-0.5">{formatCurrency(order.totalAmount)}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-10 text-center text-gray-500">No active orders pending. Great job!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
