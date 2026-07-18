import React from "react";
import {
  Home as HomeIcon,
  Timer as TimerIcon,
  StickyNote,
  BookOpen,
  Calendar as CalendarIcon,
  BarChart3,
} from "lucide-react";
import { spawnRipple } from "../lib/helpers";
import { ACCENT } from "../lib/constants";

function BottomNav({ tab, setTab, T }) {
  const items = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "focus", label: "Focus", icon: TimerIcon },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "subjects", label: "Subjects", icon: BookOpen },
    { id: "planner", label: "Planner", icon: CalendarIcon },
    { id: "insights", label: "Insights", icon: BarChart3 },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 border-t px-1 pt-2 pb-3 flex justify-between"
      style={{ background: T.nav, borderColor: T.border }}
    >
      {items.map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => setTab(id)}
            onPointerDown={(e) => spawnRipple(e, "rgba(255,107,157,0.25)")}
            className="relative overflow-hidden pressable rounded-xl flex-1 flex flex-col items-center gap-1 py-1"
          >
            <Icon size={18} strokeWidth={active ? 2.4 : 1.8} color={active ? ACCENT : T.textMuted} />
            <span className="text-[9px] font-medium" style={{ color: active ? ACCENT : T.textMuted }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;
