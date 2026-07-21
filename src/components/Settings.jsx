import React from "react";
import { ChevronLeft, GraduationCap, LogOut, UserRound } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { ACCENT, ACCENT_TO } from "../lib/constants";
import { spawnRipple, bounceClick } from "../lib/helpers";

function Settings({ T, theme, setTheme, onClose, notifyPermission, requestNotifyPermission, resetData, saveError, userEmail, onSignOut }) {
  const notifyLabel =
    notifyPermission === "granted" ? "Enabled" : notifyPermission === "denied" ? "Blocked in browser" : "Not enabled";

  return (
    <div
      className="settings-slide-in absolute inset-0 z-30 flex flex-col"
      style={{ background: T.bg }}
    >
      <div className="px-5 pt-7 pb-4 flex items-center gap-3">
        <button
          onClick={onClose}
          onPointerDown={(e) => spawnRipple(e, "rgba(108,92,231,0.18)")}
          className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden pressable"
          style={{ background: T.card }}
        >
          <ChevronLeft size={18} color={T.text} />
        </button>
        <h1 className="display-font text-[20px] font-semibold" style={{ color: T.text }}>Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10 flex flex-col gap-5">
        {/* Account */}
        <div className="rounded-2xl p-4" style={{ background: T.card }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: T.input }}>
              <UserRound size={16} color={T.textMuted} />
            </div>
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium truncate" style={{ color: T.text }}>
                {userEmail || "Guest account"}
              </p>
              <p className="text-[11.5px]" style={{ color: T.textMuted }}>
                {userEmail ? "Signed in with email" : "Data stays on this device only"}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => { bounceClick(e); onSignOut(); }}
            onPointerDown={(e) => spawnRipple(e, "rgba(108,92,231,0.18)")}
            className="rounded-xl py-2.5 text-[13px] font-semibold w-full flex items-center justify-center gap-2 relative overflow-hidden pressable"
            style={{ background: T.input, color: T.text }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: T.card }}>
          <div>
            <p className="text-[13.5px] font-medium" style={{ color: T.text }}>Dark mode</p>
            <p className="text-[11.5px]" style={{ color: T.textMuted }}>Switch between light and dark themes</p>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} T={T} />
        </div>

        {/* Notifications */}
        <div className="rounded-2xl p-4" style={{ background: T.card }}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[13.5px] font-medium" style={{ color: T.text }}>Reminder notifications</p>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: notifyPermission === "granted" ? "#00B894" : T.textMuted,
                background: notifyPermission === "granted" ? "rgba(0,217,192,0.12)" : T.input,
              }}
            >
              {notifyLabel}
            </span>
          </div>
          <p className="text-[11.5px] mb-3" style={{ color: T.textMuted }}>
            Get an alert when a reminder becomes due. Falls back to an in-app banner if your browser blocks system notifications.
          </p>
          {notifyPermission === "default" && (
            <button
              onClick={(e) => { bounceClick(e); requestNotifyPermission(); }}
              onPointerDown={(e) => spawnRipple(e, "rgba(255,255,255,0.3)")}
              className="rounded-xl py-2.5 text-[13px] font-semibold w-full relative overflow-hidden pressable"
              style={{ background: ACCENT, color: "#fff" }}
            >
              Enable notifications
            </button>
          )}
        </div>

        {/* Data */}
        <div className="rounded-2xl p-4" style={{ background: T.card }}>
          <p className="text-[13.5px] font-medium mb-1" style={{ color: T.text }}>Data</p>
          <p className="text-[11.5px] mb-3" style={{ color: T.textMuted }}>
            Your subjects, tasks, notes, and reminders are saved automatically as you go.
          </p>
          <button
            onClick={(e) => {
              bounceClick(e);
              if (window.confirm("Reset all subjects, tasks, notes, and reminders back to the starter data?")) resetData();
            }}
            onPointerDown={(e) => spawnRipple(e, "rgba(232,67,147,0.18)")}
            className="rounded-xl py-2.5 text-[13px] font-semibold w-full relative overflow-hidden pressable"
            style={{ background: "rgba(232,67,147,0.12)", color: "#E84393" }}
          >
            Reset all data
          </button>
          {saveError && (
            <p className="text-[11px] mt-3" style={{ color: "#E84393" }}>
              Couldn't save your latest changes — they may not persist.
            </p>
          )}
        </div>

        {/* About */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: T.card }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_TO})` }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <div>
            <p className="text-[13.5px] font-medium" style={{ color: T.text }}>Halo</p>
            <p className="text-[11.5px]" style={{ color: T.textMuted }}>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
