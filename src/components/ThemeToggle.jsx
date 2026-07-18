import React from "react";
import { Sun, Moon } from "lucide-react";

function ThemeToggle({ theme, setTheme, T }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
      className="w-14 h-8 rounded-full relative flex items-center px-1 shrink-0"
      style={{ background: T.trackOff, transition: "background-color 0.55s ease" }}
    >
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center shadow-md"
        style={{
          background: T.knob,
          transform: isDark ? "translateX(0px)" : "translateX(24px)",
          transition: "transform 0.45s cubic-bezier(0.65,0,0.35,1), background-color 0.55s ease",
        }}
      >
        {isDark ? (
          <Moon size={12} color={T.knobIconColor} />
        ) : (
          <Sun size={12} color={T.knobIconColor} />
        )}
      </div>
    </button>
  );
}

export default ThemeToggle;
