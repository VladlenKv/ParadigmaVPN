import React from "react";
import { cn } from "../../lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-10 h-10", className)}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#007AFF" />
        <stop offset="100%" stopColor="#6E56CF" />
      </linearGradient>
      <linearGradient id="logo-silver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#A1A1AA" />
      </linearGradient>
    </defs>

    {/* Outer Orbit / Shield */}
    <circle cx="50" cy="50" r="46" stroke="url(#logo-gradient)" strokeWidth="4" strokeDasharray="60 10" strokeLinecap="round" className="animate-[spin_20s_linear_infinite]" />

    {/* Inner P Shape representing Data Flow & Privacy */}
    <path
      d="M35 75V25C35 25 45 25 55 25C68 25 75 32 75 42.5C75 53 68 60 55 60H35"
      stroke="url(#logo-silver)"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Connection Dot */}
    <circle cx="55" cy="42.5" r="5" fill="url(#logo-gradient)" />
  </svg>
);
