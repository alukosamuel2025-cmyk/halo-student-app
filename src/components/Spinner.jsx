import React from "react";

function Spinner({ color = "#fff", size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" className="spinner-rotate">
      <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeOpacity="0.15" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r="18"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="28 85"
      />
    </svg>
  );
}

export default Spinner;
