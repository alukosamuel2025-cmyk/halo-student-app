import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SUBJECT_PALETTES } from "../lib/constants";
import { spawnRipple } from "../lib/helpers";

const FOCUS_PRESETS = [15, 25, 45];

function Focus({ subjects, T, theme, setTheme }) {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (subjects.length && !subjects.find((s) => s.id === subjectId)) {
      setSubjectId(subjects[0].id);
    }
  }, [subjects, subjectId]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const total = minutes * 60;
  const pct = total ? ((total - secondsLeft) / total) * 100 : 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const setPreset = (m) => {
    setRunning(false);
    setMinutes(m);
    setSecondsLeft(m * 60);
  };

  const subject = subjects.find((s) => s.id === subjectId);
  const p = SUBJECT_PALETTES[(subject?.palette ?? 0) % SUBJECT_PALETTES.length];

  const r = 100;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="px-5 pt-7 flex flex-col items-center">
      <div className="w-full flex items-start justify-between mb-1">
        <div>
          <h1 className="display-font text-[22px] font-semibold" style={{ color: T.text }}>Focus session</h1>
          <p className="text-[13px] mb-6" style={{ color: T.textMuted }}>Stay on one subject, distraction-free</p>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} T={T} />
      </div>

      <div className="flex gap-2 mb-8 self-start flex-wrap">
        {subjects.map((s) => {
          const sp = SUBJECT_PALETTES[s.palette % SUBJECT_PALETTES.length];
          const active = s.id === subjectId;
          return (
            <button
              key={s.id}
              onClick={() => setSubjectId(s.id)}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium"
              style={{
                background: active ? `linear-gradient(135deg, ${sp.from}, ${sp.to})` : T.card,
                color: active ? "#fff" : T.textMuted,
                border: active ? "none" : `1px solid ${T.border}`,
              }}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <div className="relative mb-8">
        <svg width="240" height="240" viewBox="0 0 240 240">
          <circle cx="120" cy="120" r={r} fill="none" stroke={T.border} strokeWidth="14" />
          <circle
            cx="120"
            cy="120"
            r={r}
            fill="none"
            stroke="url(#focusGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 120 120)"
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          <defs>
            <linearGradient id="focusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={p.from} />
              <stop offset="100%" stopColor={p.to} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="mono-font text-[42px] font-bold" style={{ color: T.text }}>{mm}:{ss}</span>
          <span className="text-[12px] mt-1" style={{ color: T.textMuted }}>{subject?.name ?? "No subject"}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {FOCUS_PRESETS.map((m) => (
          <button
            key={m}
            onClick={() => setPreset(m)}
            className="px-4 py-1.5 rounded-full text-[12px] font-semibold"
            style={{
              background: minutes === m ? T.text : T.card,
              color: minutes === m ? T.bg : T.textMuted,
              border: minutes === m ? "none" : `1px solid ${T.border}`,
            }}
          >
            {m}m
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPreset(minutes)}
          onPointerDown={(e) => spawnRipple(e, "rgba(108,92,231,0.18)")}
          className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden pressable"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <RotateCcw size={18} color={T.textMuted} />
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          onPointerDown={(e) => spawnRipple(e, "rgba(255,255,255,0.4)")}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden pressable"
          style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
        >
          {running ? (
            <Pause size={24} color="#fff" fill="#fff" />
          ) : (
            <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
          )}
        </button>
        <div className="w-12 h-12" />
      </div>
    </div>
  );
}

export default Focus;
