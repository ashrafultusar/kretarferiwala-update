"use client";

import LoadingPage from "@/app/loading";
import { UserIcon, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { getAllAdmins } from "@/lib/data/admin";
import { deleteAdmin, updateAdminRole } from "@/actions/admin";
import Link from 'next/link';

const Page = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true);
      try {
        const res = await getAllAdmins();
        if (!res.success) throw new Error("Failed to fetch");

        // Sort so superAdmin(s) come first
        const sorted = [...res.admins].sort((a, b) =>
          a.role === "superAdmin" ? -1 : b.role === "superAdmin" ? 1 : 0
        );
        setAdmins(sorted);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id, index) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await deleteAdmin(id);
      if (!res.success) throw new Error(res.message);

      setAdmins((prev) => prev.filter((_, i) => i !== index));
      toast.success("Admin deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete admin");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await updateAdminRole(id, newRole);

      if (!res.success) throw new Error(res.message);
      setAdmins((prev) => {
        const updated = prev.map((admin) =>
          admin._id === id ? { ...admin, role: newRole } : admin
        );
        // Re-sort to keep superAdmin on top
        return [...updated].sort((a, b) =>
          a.role === "superAdmin" ? -1 : b.role === "superAdmin" ? 1 : 0
        );
      });
      toast.success("Role updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="bg-orange-50 p-2 rounded-lg text-[#ff6900]"><ShieldCheck size={28} /></span>
              Admin Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-gray-100 text-[#ff6900] font-bold px-4 py-1.5 rounded-lg text-sm border border-gray-200 shadow-sm hidden md:block">
              {admins.length} Total Registered Users
            </span>
            <Link href="/dashboard/register">
              <button className="bg-[#ff6900] text-white px-5 py-2 rounded-xl font-bold hover:bg-[#e65c00] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
                + Add New Admin
              </button>
            </Link>
          </div>
        </div>

        {admins.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No admins found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {admins.map((admin, index) => (
              <div
                key={admin._id}
                className="flex flex-col justify-between p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white relative overflow-hidden group"
              >
                {/* Super Admin Badge Decoration */}
                {admin.role === "superAdmin" && (
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                    <div className="absolute top-4 -right-6 w-24 bg-[#ff6900] text-white text-[10px] font-bold py-1 text-center transform rotate-45 shadow-sm uppercase tracking-widest">
                      SUPER
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3.5 rounded-full ${admin.role === "superAdmin" ? "bg-orange-50 text-[#ff6900]" : "bg-gray-100 text-gray-500"}`}>
                    <UserIcon size={24} />
                  </div>
                  <div className="overflow-hidden pr-8">
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Admin Email</p>
                    <p className="text-gray-800 font-bold text-base truncate">
                      {admin.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-500">Role:</span>
                    <select
                      value={admin.role}
                      onChange={(e) => handleRoleChange(admin._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-colors
                      ${admin.role === "superAdmin"
                          ? "bg-orange-50 border-orange-200 text-[#ff6900] focus:ring-2 focus:ring-[#ff6900]"
                          : admin.role === "admin"
                            ? "bg-blue-50 border-blue-200 text-blue-800 focus:ring-2 focus:ring-blue-400"
                            : "bg-gray-50 border-gray-200 text-gray-700 focus:ring-2"
                        }`}
                    >
                      <option value="admin">Admin</option>
                      <option value="superAdmin">SuperAdmin</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDelete(admin._id, index)}
                    disabled={admin.role === "superAdmin"}
                    className={`p-2.5 rounded-lg transition-colors flex items-center justify-center
                      ${admin.role === "superAdmin"
                        ? "text-gray-300 bg-gray-50 border border-transparent cursor-not-allowed"
                        : "text-red-500 bg-red-50 border border-red-100 hover:bg-red-500 hover:text-white cursor-pointer shadow-sm"
                      }`}
                    title={
                      admin.role === "superAdmin"
                        ? "Cannot delete Super Admin"
                        : "Delete Admin"
                    }
                  >
                    <MdDeleteOutline className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
