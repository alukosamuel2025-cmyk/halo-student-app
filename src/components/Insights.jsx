import React from "react";
import { Flame } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SUBJECT_PALETTES, ACCENT, ACCENT_TO } from "../lib/constants";
import { isoDate, computeStreak } from "../lib/helpers";

function Insights({ subjects, tasks, T, theme, setTheme }) {
  const days = [];
  const d = new Date();
  d.setDate(d.getDate() - 6);
  for (let i = 0; i < 7; i++) {
    const iso = isoDate(d);
    const dayTasks = tasks.filter((t) => t.date === iso);
    const done = dayTasks.filter((t) => t.done).length;
    days.push({ iso, label: d.toLocaleDateString("en-US", { weekday: "short" })[0], done, total: dayTasks.length });
    d.setDate(d.getDate() + 1);
  }
  const maxDone = Math.max(1, ...days.map((d) => d.done));

  const bySubject = subjects.map((s) => {
    const st = tasks.filter((t) => t.subjectId === s.id);
    const done = st.filter((t) => t.done).length;
    return { ...s, done, total: st.length, pct: st.length ? Math.round((done / st.length) * 100) : 0 };
  });

  const streak = computeStreak(tasks);
  const totalDone = tasks.filter((t) => t.done).length;

  return (
    <div className="px-5 pt-7">
      <div className="flex items-center justify-between mb-1 gap-3">
        <h1 className="display-font text-[22px] font-semibold" style={{ color: T.text }}>Insights</h1>
        <ThemeToggle theme={theme} setTheme={setTheme} T={T} />
      </div>
      <p className="text-[13px] mb-6" style={{ color: T.textMuted }}>Your study patterns this week</p>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 rounded-2xl p-4" style={{ background: T.card }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Flame size={14} color="#FDB44B" fill="#FDB44B" />
            <span className="mono-font text-[20px] font-bold" style={{ color: T.text }}>{streak}</span>
          </div>
          <p className="text-[11px]" style={{ color: T.textMuted }}>Day streak</p>
        </div>
        <div className="flex-1 rounded-2xl p-4" style={{ background: T.card }}>
          <span className="mono-font text-[20px] font-bold block mb-1" style={{ color: T.text }}>{totalDone}</span>
          <p className="text-[11px]" style={{ color: T.textMuted }}>Total completed</p>
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-6" style={{ background: T.card }}>
        <h2 className="display-font text-[14px] font-semibold mb-4" style={{ color: T.text }}>Tasks completed</h2>
        <div className="flex items-end justify-between h-28">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full flex items-end justify-center h-20">
                <div
                  className="w-5 rounded-full"
                  style={{
                    height: `${(d.done / maxDone) * 100}%`,
                    minHeight: d.done > 0 ? 6 : 2,
                    background: d.done > 0 ? `linear-gradient(180deg, ${ACCENT}, ${ACCENT_TO})` : T.border,
                  }}
                />
              </div>
              <span className="text-[10px] font-medium" style={{ color: T.textMuted }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="display-font text-[14px] font-semibold mb-3" style={{ color: T.text }}>Progress by subject</h2>
      <div className="flex flex-col gap-3 mb-6">
        {bySubject.map((s) => {
          const p = SUBJECT_PALETTES[s.palette % SUBJECT_PALETTES.length];
          return (
            <div key={s.id} className="rounded-2xl p-4" style={{ background: T.card }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-medium" style={{ color: T.text }}>{s.name}</span>
                <span className="mono-font text-[12px] font-bold" style={{ color: p.to }}>{s.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: T.border }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${p.from}, ${p.to})` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Insights;
