"use client";
import Image from "next/image";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-orange-500/10 blur-[60px] rounded-full animate-pulse"></div>

        <svg
          className="absolute top-0 left-0 w-full h-full animate-spin"
          viewBox="0 0 120 120"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="#e2e8f0"
            strokeWidth="4"
            fill="none"
          />

          {/* Animated spinner arc */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="url(#gradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray="80 150" 
            strokeLinecap="round"
            className="drop-shadow-md"
          />
        </svg>

        {/* Central Logo */}
        <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full border border-gray-100 shadow-xl animate-logo-pop">
          <Image
            src="/logo_icon/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes logo-pop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-logo-pop {
          animation: logo-pop 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;