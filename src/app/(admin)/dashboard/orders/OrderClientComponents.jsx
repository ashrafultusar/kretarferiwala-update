"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaTrash, FaSearch } from "react-icons/fa";
import { updateOrderStatus, deleteOrder } from "@/actions/order";

export function OrderTabs({ currentTab, tabs }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleTabChange = (tab) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", tab);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${currentTab === tab
                        ? "bg-[#ff6900] text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    onClick={() => handleTabChange(tab)}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
}

export function OrderSearch({ initialQuery }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [query, setQuery] = useState(initialQuery);

    React.useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentQ = searchParams.get("q") || "";
            if (query === currentQ) return;

            const params = new URLSearchParams(searchParams);
            if (query) {
                params.set("q", query);
            } else {
                params.delete("q");
            }
            params.set("page", "1");
            router.push(`${pathname}?${params.toString()}`);
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query, pathname, router, searchParams]);

    return (
        <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
            <input
                type="text"
                placeholder="Search Order ID or Phone..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all"
            />
            {query && (
                <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 font-bold"
                    type="button"
                    title="Clear Search"
                >
                    ✕
                </button>
            )}
        </div>
    );
}

export function StatusSelect({ orderId, currentStatus, tabs }) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setIsUpdating(true);
        try {
            const res = await updateOrderStatus(orderId, newStatus);
            if (!res.success) throw new Error(res.message);
            router.refresh();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <select
            value={currentStatus}
            onChange={handleStatusChange}
            disabled={isUpdating}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-50 cursor-pointer ${currentStatus === "shipped"
                ? "bg-blue-100 text-blue-700 ring-blue-400 border-blue-200"
                : currentStatus === "delivered"
                    ? "bg-green-100 text-green-700 ring-green-400 border-green-200"
                    : currentStatus === "cancelled"
                        ? "bg-red-100 text-red-700 ring-red-400 border-red-200"
                        : "bg-yellow-100 text-yellow-700 ring-yellow-400 border-yellow-200"
                } border`}
        >
            {tabs.map((status) => (
                <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
            ))}
        </select>
    );
}

export function DeleteAction({ orderId }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this order?")) return;
        setIsDeleting(true);
        try {
            const res = await deleteOrder(orderId);
            if (!res.success) throw new Error(res.message);
            router.refresh();
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete order");
            setIsDeleting(false); // only reset on fail, as success navigates/refreshes
        }
    };

    return (
        <button
            disabled={isDeleting}
            className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors disabled:opacity-50"
            onClick={handleDelete}
            title="Delete Order"
        >
            <FaTrash size={16} />
        </button>
    );
}

export function PaginationControls({ currentPage, totalPages }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-center gap-4 mt-8 pb-8">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors shadow-sm"
            >
                Previous
            </button>
            <span className="text-gray-600 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                Page {currentPage} of {totalPages}
            </span>
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#ff6900] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e65c00] transition-colors shadow-sm"
            >
                Next
            </button>
        </div>
    );
}
