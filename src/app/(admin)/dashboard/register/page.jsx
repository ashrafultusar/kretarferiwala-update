'use client';
import React, { useState, useActionState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { handleRegister } from '@/actions/auth';

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
    <div className="flex items-center justify-center mt-32">
      <form action={formAction} onSubmit={validatePassword} className="bg-white shadow-md p-6 rounded-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-semibold text-center capitalize">Create New Admin</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="••••••••"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-gray-500"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 text-white py-2 rounded bg-orange-400 cursor-pointer hover:bg-orange-500 transition disabled:opacity-50"
          disabled={pending}
        >
          {pending ? (
            <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
          ) : (
            'Create Admin'
          )}
        </button>
      </form>
    </div>
  );
};

export default Page;
