import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Check } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SUBJECT_PALETTES, ACCENT, dayNames, monthNames } from "../lib/constants";
import { uid, isoDate, spawnRipple, bounceClick, sortTasksByUrgency, formatTime } from "../lib/helpers";

function Planner({ subjects, tasks, setTasks, T, theme, setTheme }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selected, setSelected] = useState(isoDate(new Date()));
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");

  useEffect(() => {
    if (subjects.length && !subjects.find((s) => s.id === subjectId)) {
      setSubjectId(subjects[0].id);
    }
  }, [subjects, subjectId]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const changeMonth = (delta) => setViewDate(new Date(year, month + delta, 1));

  const dayTasks = sortTasksByUrgency(tasks.filter((t) => t.date === selected));
  const datesWithTasks = new Set(tasks.map((t) => t.date));

  const addTask = () => {
    if (!title.trim() || !subjectId) return;
    setTasks((ts) => [...ts, { id: uid(), subjectId, title: title.trim(), date: selected, time, done: false }]);
    setTitle("");
    setAdding(false);
  };

  return (
    <div className="px-5 pt-7">
      <div className="flex items-center justify-between mb-1 gap-3">
        <h1 className="display-font text-[22px] font-semibold" style={{ color: T.text }}>Study Planner</h1>
        <ThemeToggle theme={theme} setTheme={setTheme} T={T} />
      </div>
      <p className="text-[13px] mb-5" style={{ color: T.textMuted }}>Plan your study sessions</p>

      <div className="rounded-2xl p-4 mb-5" style={{ background: T.card }}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="p-1">
            <ChevronLeft size={18} color={T.textMuted} />
          </button>
          <span className="display-font text-[14px] font-semibold" style={{ color: T.text }}>
            {monthNames[month]} {year}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1">
            <ChevronRight size={18} color={T.textMuted} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center">
          {dayNames.map((d, i) => (
            <span key={i} className="text-[10px] font-semibold" style={{ color: T.textMuted }}>{d}</span>
          ))}
          {cells.map((d, i) => {
            if (!d) return <span key={i} />;
            const iso = isoDate(new Date(year, month, d));
            const isSelected = iso === selected;
            const hasTasks = datesWithTasks.has(iso);
            const isToday = iso === isoDate(new Date());
            return (
              <button
                key={i}
                onClick={() => setSelected(iso)}
                className="relative flex items-center justify-center mx-auto w-8 h-8 rounded-full text-[12.5px] font-medium"
                style={{
                  background: isSelected ? ACCENT : "transparent",
                  color: isSelected ? "#fff" : isToday ? ACCENT : T.text,
                }}
              >
                {d}
                {hasTasks && !isSelected && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full" style={{ background: ACCENT }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="display-font text-[15px] font-semibold" style={{ color: T.text }}>
          Tasks for {monthNames[month]} {selected.slice(-2)}
        </h2>
        <button onClick={() => setAdding((a) => !a)}>
          {adding ? <X size={18} color={T.textMuted} /> : <Plus size={18} color={T.textMuted} />}
        </button>
      </div>

      {adding && (
        <div className="rounded-2xl p-4 mb-4 flex flex-col gap-3" style={{ background: T.card }}>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="rounded-xl px-3 py-2 text-[13px] outline-none"
            style={{ background: T.input, color: T.text }}
          />
          <div className="flex gap-2">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="flex-1 rounded-xl px-3 py-2 text-[13px] outline-none"
              style={{ background: T.input, color: T.text }}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-xl px-3 py-2 text-[13px] outline-none"
              style={{ background: T.input, color: T.text }}
            />
          </div>
          <button
            onClick={(e) => { bounceClick(e); addTask(); }}
            className="rounded-xl py-2.5 text-[13px] font-semibold relative overflow-hidden pressable"
            style={{ background: T.text, color: T.bg }}
          >
            Add task
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 mb-4">
        {dayTasks.length === 0 && !adding && (
          <div className="text-center py-8 text-[13px] rounded-2xl" style={{ color: T.textMuted, background: T.card }}>
            No tasks for this day yet.
          </div>
        )}
        {dayTasks.map((task) => {
          const subject = subjects.find((s) => s.id === task.subjectId);
          const p = SUBJECT_PALETTES[(subject?.palette ?? 0) % SUBJECT_PALETTES.length];
          return (
            <div key={task.id} className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: T.card }}>
              <span className="w-1.5 h-9 rounded-full shrink-0" style={{ background: `linear-gradient(${p.from}, ${p.to})` }} />
              <div className="flex-1 min-w-0">
                <p
                  className="text-[13.5px] font-medium truncate"
                  style={{ color: task.done ? T.textMuted : T.text, textDecoration: task.done ? "line-through" : "none" }}
                >
                  {task.title}
                </p>
                <p className="text-[11px]" style={{ color: T.textMuted }}>{subject?.name} · {formatTime(task.time)}</p>
              </div>
              <button
                onClick={(e) => { bounceClick(e); setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))); }}
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 relative overflow-hidden${task.done ? " check-ring-pop" : ""}`}
                style={{ borderColor: task.done ? p.to : T.border, background: task.done ? p.to : "transparent" }}
              >
                {task.done && <Check className="check-pop" size={13} color="#fff" strokeWidth={3} />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Planner;
