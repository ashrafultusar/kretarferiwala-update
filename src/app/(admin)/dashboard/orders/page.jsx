import React from "react";
import Link from "next/link";
import { GrFormView } from "react-icons/gr";
import { getPagedOrders } from "@/lib/data/order";
import { OrderTabs, OrderSearch, StatusSelect, DeleteAction, PaginationControls } from "./OrderClientComponents";

const statusTabs = ["active", "shipped", "delivered", "cancelled"];

export default async function OrdersPage({ searchParams }) {
  const params = await searchParams; // In Next.js 15, searchParams is a promise
  const activeTab = params?.tab || "all";
  const searchQuery = params?.q || "";
  const currentPage = parseInt(params?.page || "1", 10);
  const limit = 20;

  const { success, orders, totalOrders, overallTotalOrders, totalPages } = await getPagedOrders({
    status: activeTab,
    search: searchQuery,
    page: currentPage,
    limit,
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold">Total Orders: {overallTotalOrders || 0}</h2>
          {activeTab !== "all" && (
            <p className="text-[#ff6900] font-semibold mt-1 text-lg">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Orders: {totalOrders || 0}
            </p>
          )}
        </div>
        <OrderSearch initialQuery={searchQuery} />
      </div>

      <div className="mb-4">
        <OrderTabs currentTab={activeTab} tabs={["all", ...statusTabs]} />
      </div>

      {!success || orders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#ff6900] text-white uppercase ">
              <tr>
                <th className="px-6 py-3">Order No</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-orange-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-800">{order?.orderNumber}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{order?.name}</p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">{order?.phone || "N/A"}</p>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 capitalize">{order?.paymentMethod || "N/A"}</td>
                  <td className="px-6 py-4">
                    <StatusSelect
                      orderId={order?._id}
                      currentStatus={order?.status}
                      tabs={statusTabs}
                    />
                  </td>
                  <td className="px-6 py-4 font-bold">{order?.totalAmount}৳</td>
                  <td className="px-6 py-4 flex gap-3 items-center">
                    <Link
                      href={`/dashboard/orders/${order?._id}`}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      <GrFormView className="text-green-600 hover:text-green-800 text-2xl" />
                    </Link>
                    <DeleteAction orderId={order?._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
