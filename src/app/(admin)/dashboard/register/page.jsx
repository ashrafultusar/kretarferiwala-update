'use client';
import React, { useState, useActionState, useEffect } from 'react';
import { AiOutlineLoading3Quarters, AiOutlineUser, AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { ShieldPlus } from "lucide-react";
import { toast } from 'react-toastify';
import { handleRegister } from '@/actions/auth';
import Link from 'next/link';

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(handleRegister, undefined);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const validatePassword = (e) => {
    const password = e.target.password.value;
    const requirements = {
      minLength: 8,
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /[0-9]/,
      specialChar: /[!@#$%^&*(),.?":{}|<>]/,
    };

    if (password.length < requirements.minLength ||
      !requirements.uppercase.test(password) ||
      !requirements.lowercase.test(password) ||
      !requirements.number.test(password) ||
      !requirements.specialChar.test(password)) {
      e.preventDefault();
      toast.error("Password must include at least 8 characters, uppercase, lowercase, number, and special character.");
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="bg-white shadow-sm border border-gray-100 p-8 md:p-10 rounded-2xl w-full max-w-md relative overflow-hidden">
        {/* Soft Orange Header Accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-[#ff6900]"></div>

        <div className="text-center mb-8">
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-sm rotate-3 hover:rotate-0 transition-all">
            <ShieldPlus className="w-8 h-8 text-[#ff6900]" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">Register New Admin</h2>
          <p className="text-sm text-gray-500 mt-2 font-medium">Fill in the details to authorize a new user.</p>
        </div>

        <form action={formAction} onSubmit={validatePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <AiOutlineMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                name="email"
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                placeholder="admin@kretarferiwala.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Secure Password</label>
            <div className="relative">
              <AiOutlineLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff6900] focus:border-transparent transition-all bg-gray-50 focus:bg-white text-gray-800"
                placeholder="••••••••"
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-400 hover:text-[#ff6900] transition-colors"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">Must be at least 8 chars with uppercase, lowercase, numbers, and symbols.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl bg-[#ff6900] cursor-pointer hover:bg-[#e65c00] transition-all font-bold shadow-md active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
              disabled={pending}
            >
              {pending ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                  <span>Registering...</span>
                </>
              ) : (
                'Create Administrator'
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <Link href="/dashboard/allAdmin" className="text-sm font-bold text-gray-500 hover:text-[#ff6900] transition-colors underline underline-offset-4">
              Return to Admin Management
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
