import React from "react";
import { GraduationCap } from "lucide-react";

function Splash({ fading }) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{
        background: "linear-gradient(160deg, #2B4FE0 0%, #6C3CE0 55%, #9B4FE8 100%)",
        backgroundSize: "200% 200%",
        animation: "floatGradient 6s ease-in-out infinite",
        opacity: fading ? 0 : 1,
        transform: fading ? "scale(1.04)" : "scale(1)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div
        className="relative w-24 h-24 flex items-center justify-center mb-6"
        style={{ animation: "logoPop 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        <svg width="96" height="96" viewBox="0 0 96 96" className="absolute inset-0" style={{ animation: "spinSlow 2s linear infinite" }}>
          <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="#ffffff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="55 210"
          />
        </svg>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.35)" }}
        >
          <GraduationCap size={26} color="#ffffff" strokeWidth={2} />
        </div>
      </div>

      <h1 className="display-font text-white text-[26px] font-bold tracking-tight mb-1">Halo</h1>
      <p className="text-white/70 text-[12.5px] mb-10">study smarter, every day</p>

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-white"
            style={{ animation: `bounceDot 1.1s ${i * 0.15}s infinite ease-in-out` }}
          />
        ))}
      </div>
    </div>
  );
}

export default Splash;
