"use client";

import React, { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { deleteProduct } from "@/actions/product";

export function CategorySelect({ currentCategory, categories }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        const params = new URLSearchParams(searchParams);
        params.set("category", category);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            value={currentCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border cursor-pointer border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#ff6900] focus:border-[#ff6900] focus:outline-none w-full md:w-1/3 bg-white text-gray-700"
        >
            <option value="all">All Categories</option>
            {categories.map((category) => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
        </select>
    );
}

export function DeleteProductAction({ productId, productName }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteProduct(productId);
            if (res.success) {
                toast.success(res.message || "Product deleted successfully!");
                setIsModalOpen(false);
                router.refresh();
            } else {
                toast.error(res.message || "Failed to delete the product");
                setIsDeleting(false);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("An error occurred while deleting the product");
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
                aria-label={`Delete ${productName}`}
                title="Delete Product"
            >
                <MdDeleteOutline className="text-xl" />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Product</h3>
                        <p className="text-gray-500 mb-4">
                            Are you sure you want to delete <span className="font-semibold text-gray-700">"{productName}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                            >
                                {isDeleting ? "..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
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

    if (totalPages <= 1) return null;

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
