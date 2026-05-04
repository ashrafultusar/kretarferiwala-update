"use client";
import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineLoading3Quarters, AiOutlineLock, AiOutlineMail } from "react-icons/ai";
import { handleLogin } from "@/actions/auth";
import { LayoutDashboard } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#ff6900] hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-[0_8px_20px_rgba(255,105,0,0.3)] hover:shadow-[0_12px_25px_rgba(255,105,0,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" /> Authenticating...
        </span>
      ) : (
        "Sign In to Dashboard"
      )}
    </button>
  );
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch] = useActionState(handleLogin, undefined);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Pane - Visual/Branding (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-[#0f172a] items-center justify-center">
        {/* Dynamic Abstract Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#ff6900] rounded-full mix-blend-screen filter blur-[120px] opacity-25"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-25"></div>

        {/* Glass Content inside */}
        <div className="relative z-10 w-full max-w-lg px-12">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/20 shadow-xl mb-8">
            <LayoutDashboard className="w-8 h-8 text-[#ff6900]" />
          </div>
          <h1 className="text-5xl font-black text-white leading-tight mb-6 tracking-tight">
            Manage your <br />
            commerce <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-orange-400">masterpiece.</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            Welcome back to the Admin Portal. Ensure secure access to your operations, oversee incoming orders, modify products, and control your enterprise entirely from one sleek dashboard.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0f172a] bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg">
                  <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i + 5}&backgroundColor=ff6900`} alt="avatar" />
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-gray-300">
              Secured enterprise platform
            </p>
          </div>
        </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 sm:p-20 relative bg-[#f8fafc]">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 relative z-10">
          <div className="mb-10 text-center lg:text-left">
            <div className="lg:hidden w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-100 shadow-sm">
              <LayoutDashboard className="w-8 h-8 text-[#ff6900]" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 mt-2 font-medium">Please enter your credentials to sign in.</p>
          </div>

          <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 block">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff6900] transition-colors">
                  <AiOutlineMail className="text-xl" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="admin@kretarferiwala.com"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] transition-all bg-white hover:bg-gray-50 focus:bg-white sm:text-sm font-medium shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#ff6900] transition-colors">
                  <AiOutlineLock className="text-xl" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6900]/20 focus:border-[#ff6900] transition-all bg-white hover:bg-gray-50 focus:bg-white sm:text-sm font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-[#ff6900] transition-colors focus:outline-none"
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {state && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 p-4 rounded-xl flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800 text-sm font-bold">
                    {state}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}