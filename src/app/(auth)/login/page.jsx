"use client";
import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { handleLogin } from "@/actions/auth"; // Exact path pathiyechi

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-orange-400 hover:bg-orange-500 cursor-pointer text-white w-full py-2 rounded flex justify-center items-center gap-2 disabled:opacity-70"
    >
      {pending ? (
        <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
      ) : (
        "Login"
      )}
    </button>
  );
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch] = useActionState(handleLogin, undefined);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        action={dispatch}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border p-2 w-full rounded focus:outline-none focus:ring-1 focus:ring-orange-400"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="border p-2 w-full rounded pr-10 focus:outline-none focus:ring-1 focus:ring-orange-400"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </span>
        </div>

        {/* Error message show hobe ekhane */}
        {state && (
          <p className="text-red-500 text-xs text-center animate-pulse">
            {state}
          </p>
        )}

        <SubmitButton />
      </form>
    </div>
  );
};

export default Login;