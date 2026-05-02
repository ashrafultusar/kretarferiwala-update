"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const LoadingSpinner = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Speed optimized: 30ms interval for faster completion
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onFinish) onFinish();
          return 100;
        }
        return prev + 2.5; // Slightly higher increment for smoothness
      });
    }, 30); 

    return () => clearInterval(timer);
  }, [onFinish]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center h-screen bg-[#0f172a]"> 
      {/* Dark background for premium look */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* Decorative Glow */}
        <div className="absolute inset-0 bg-orange-500/20 blur-[60px] rounded-full animate-pulse"></div>

        <svg
          className="absolute top-0 left-0 w-full h-full transform -rotate-90"
          viewBox="0 0 120 120"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>

          {/* Background circle (Glass effect) */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#1e293b"
            strokeWidth="4"
            fill="none"
          />

          {/* Animated progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
            style={{
              transition: "stroke-dashoffset 0.05s linear",
            }}
          />
        </svg>

        {/* Central Logo with Pulse */}
        <div className="relative w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl animate-logo-pop">
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