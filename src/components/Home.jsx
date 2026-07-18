import React, { useState, useEffect, useRef } from "react";
import { Flame, Check, StickyNote, BellRing, MapPin, Clock, Trash2, Settings as SettingsIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SUBJECT_PALETTES, ACCENT, ACCENT_TO } from "../lib/constants";
import { uid, isoDate, spawnRipple, bounceClick, sortTasksByUrgency, computeStreak, formatTime } from "../lib/helpers";

function Home({ subjects, tasks, setTasks, classes, notes, setNotes, reminders, setReminders, T, theme, setTheme, notifyPermission, requestNotifyPermission, openSettings }) {
  const now = new Date();
  const today = isoDate(now);
  const weekday = now.getDay();

  const todaysClasses = classes
    .filter((c) => c.day === weekday)
    .sort((a, b) => a.start.localeCompare(b.start));

  const upcomingTasks = sortTasksByUrgency(tasks.filter((t) => !t.done)).slice(0, 5);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const streak = computeStreak(tasks);

  const r = 30;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const [addingNote, setAddingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  const [addingReminder, setAddingReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderTime, setReminderTime] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return d.toISOString().slice(0, 16);
  });

  const saveNote = () => {
    if (!noteTitle.trim()) return;
    setNotes((n) => [{ id: uid(), title: noteTitle.trim(), body: noteBody.trim(), createdAt: today }, ...n]);
    setNoteTitle("");
    setNoteBody("");
    setAddingNote(false);
  };

  const saveReminder = () => {
    if (!reminderTitle.trim()) return;
    setReminders((r) => [...r, { id: uid(), title: reminderTitle.trim(), datetime: reminderTime, done: false }]);
    setReminderTitle("");
    setAddingReminder(false);
  };

  const sortedReminders = [...reminders].sort((a, b) => a.datetime.localeCompare(b.datetime));

  return (
    <div className="px-5 pt-7 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium" style={{ color: T.textMuted }}>{greeting}</p>
          <h1 className="display-font text-[22px] font-semibold truncate" style={{ color: T.text }}>
            Let's get studying
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => { bounceClick(e); openSettings(); }}
            onPointerDown={(e) => spawnRipple(e, "rgba(108,92,231,0.18)")}
            className="w-9 h-9 rounded-full flex items-center justify-center relative overflow-hidden pressable"
            style={{ background: T.card }}
          >
            <SettingsIcon size={16} color={T.textMuted} />
          </button>
          <ThemeToggle theme={theme} setTheme={setTheme} T={T} />
        </div>
      </div>
      <div
        className="rounded-3xl p-5 relative overflow-hidden flex items-center gap-4"
        style={{ background: `linear-gradient(135deg, ${T.heroFrom} 0%, ${T.heroTo} 100%)` }}
      >
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="7" />
          <circle
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke="url(#gradRing)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 36 36)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
          <defs>
            <linearGradient id="gradRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={ACCENT} />
              <stop offset="100%" stopColor={ACCENT_TO} />
            </linearGradient>
          </defs>
          <text x="36" y="41" textAnchor="middle" className="mono-font" fontSize="15" fontWeight="700" fill="#fff">
            {pct}%
          </text>
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[13.5px] font-medium leading-snug mb-1">
            {doneTasks} of {totalTasks} tasks done
          </p>
          <p className="text-white/70 text-[12px] leading-snug">
            {now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
          <Flame size={13} color="#FDB44B" fill="#FDB44B" />
          <span className="mono-font text-[12px] font-bold text-white">{streak}</span>
        </div>
      </div>

      {/* Today's classes */}
      <div className="rounded-2xl p-4" style={{ background: T.card }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="display-font text-[14.5px] font-semibold" style={{ color: T.text }}>Today's classes</h2>
          <span className="text-[11px]" style={{ color: T.textMuted }}>
            {now.toLocaleDateString("en-US", { weekday: "long" })}
          </span>
        </div>
        {todaysClasses.length === 0 ? (
          <p className="text-[12.5px] py-3 text-center" style={{ color: T.textMuted }}>No classes today. Enjoy the free time.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {todaysClasses.map((c) => {
              const subject = subjects.find((s) => s.id === c.subjectId);
              const p = SUBJECT_PALETTES[(subject?.palette ?? 0) % SUBJECT_PALETTES.length];
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-1.5 h-10 rounded-full shrink-0" style={{ background: `linear-gradient(${p.from}, ${p.to})` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: T.text }}>{subject?.name ?? "Class"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: T.textMuted }}>
                        <Clock size={11} /> {formatTime(c.start)}–{formatTime(c.end)}
                      </span>
                      <span className="flex items-center gap-1 text-[11px]" style={{ color: T.textMuted }}>
                        <MapPin size={11} /> {c.room}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming tasks */}
      <div className="rounded-2xl p-4" style={{ background: T.card }}>
        <h2 className="display-font text-[14.5px] font-semibold mb-3" style={{ color: T.text }}>Upcoming tasks</h2>
        {upcomingTasks.length === 0 ? (
          <p className="text-[12.5px] py-3 text-center" style={{ color: T.textMuted }}>You're all caught up.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {upcomingTasks.map((task) => {
              const subject = subjects.find((s) => s.id === task.subjectId);
              const p = SUBJECT_PALETTES[(subject?.palette ?? 0) % SUBJECT_PALETTES.length];
              const isToday = task.date === today;
              const isOverdue = task.date < today;
              return (
                <div key={task.id} className="flex items-center gap-3">
                  <button
                    onClick={(e) => { bounceClick(e); setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))); }}
                    className="rounded-full shrink-0 border-2 relative overflow-hidden pressable"
                    style={{ width: 20, height: 20, borderColor: isOverdue ? "#E84393" : T.border, background: "transparent" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: T.text }}>{task.title}</p>
                    <p className="text-[11px]" style={{ color: isOverdue ? "#E84393" : T.textMuted }}>
                      {subject?.name} · {isOverdue ? "Overdue" : isToday ? "Today" : task.date.slice(5)} · {formatTime(task.time)}
                    </p>
                  </div>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.to }} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <button
          onClick={() => { setAddingNote((a) => !a); setAddingReminder(false); }}
          onPointerDown={(e) => spawnRipple(e, addingNote ? "rgba(255,255,255,0.4)" : "rgba(108,92,231,0.18)")}
          className="flex-1 rounded-2xl py-3.5 flex flex-col items-center gap-1.5 relative overflow-hidden pressable"
          style={{ background: addingNote ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_TO})` : T.card }}
        >
          <StickyNote size={18} color={addingNote ? "#fff" : ACCENT} />
          <span className="text-[12px] font-semibold" style={{ color: addingNote ? "#fff" : T.text }}>Add note</span>
        </button>
        <button
          onClick={() => { setAddingReminder((a) => !a); setAddingNote(false); }}
          onPointerDown={(e) => spawnRipple(e, addingReminder ? "rgba(255,255,255,0.4)" : "rgba(108,92,231,0.18)")}
          className="flex-1 rounded-2xl py-3.5 flex flex-col items-center gap-1.5 relative overflow-hidden pressable"
          style={{ background: addingReminder ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT_TO})` : T.card }}
        >
          <BellRing size={18} color={addingReminder ? "#fff" : ACCENT} />
          <span className="text-[12px] font-semibold" style={{ color: addingReminder ? "#fff" : T.text }}>Add reminder</span>
        </button>
      </div>

      {notifyPermission === "default" && (
        <button
          onClick={requestNotifyPermission}
          onPointerDown={(e) => spawnRipple(e, "rgba(108,92,231,0.18)")}
          className="rounded-2xl px-4 py-3 flex items-center gap-3 relative overflow-hidden pressable"
          style={{ background: T.card }}
        >
          <BellRing size={16} color={ACCENT} className="shrink-0" />
          <span className="text-[12.5px] font-medium flex-1 text-left" style={{ color: T.text }}>
            Turn on notifications for reminders
          </span>
          <span className="text-[11px] font-semibold" style={{ color: ACCENT }}>Enable</span>
        </button>
      )}

      {addingNote && (
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: T.card }}>
          <input
            autoFocus
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Note title"
            className="rounded-xl px-3 py-2 text-[13px] outline-none"
            style={{ background: T.input, color: T.text }}
          />
          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Write your note…"
            rows={3}
            className="rounded-xl px-3 py-2 text-[13px] outline-none resize-none"
            style={{ background: T.input, color: T.text }}
          />
          <button
            onClick={saveNote}
            onPointerDown={(e) => spawnRipple(e, "rgba(255,255,255,0.3)")}
            className="rounded-xl py-2.5 text-[13px] font-semibold relative overflow-hidden pressable"
            style={{ background: T.text, color: T.bg }}
          >
            Save note
          </button>
        </div>
      )}

      {addingReminder && (
        <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: T.card }}>
          <input
            autoFocus
            value={reminderTitle}
            onChange={(e) => setReminderTitle(e.target.value)}
            placeholder="Reminder title"
            className="rounded-xl px-3 py-2 text-[13px] outline-none"
            style={{ background: T.input, color: T.text }}
          />
          <input
            type="datetime-local"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="rounded-xl px-3 py-2 text-[13px] outline-none"
            style={{ background: T.input, color: T.text }}
          />
          <button
            onClick={saveReminder}
            onPointerDown={(e) => spawnRipple(e, "rgba(255,255,255,0.3)")}
            className="rounded-xl py-2.5 text-[13px] font-semibold relative overflow-hidden pressable"
            style={{ background: T.text, color: T.bg }}
          >
            Save reminder
          </button>
        </div>
      )}

      {/* Notes list */}
      {notes.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: T.card }}>
          <h2 className="display-font text-[14.5px] font-semibold mb-3" style={{ color: T.text }}>Notes</h2>
          <div className="flex flex-col gap-3">
            {notes.map((n) => (
              <div key={n.id} className="flex items-start gap-3">
                <StickyNote size={15} color={ACCENT} className="mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: T.text }}>{n.title}</p>
                  {n.body && <p className="text-[11.5px] mt-0.5 line-clamp-2" style={{ color: T.textMuted }}>{n.body}</p>}
                </div>
                <button onClick={() => setNotes((ns) => ns.filter((x) => x.id !== n.id))} className="shrink-0 p-1">
                  <Trash2 size={13} color={T.textMuted} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminders list */}
      {sortedReminders.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: T.card }}>
          <h2 className="display-font text-[14.5px] font-semibold mb-3" style={{ color: T.text }}>Reminders</h2>
          <div className="flex flex-col gap-3">
            {sortedReminders.map((rem) => {
              const dt = new Date(rem.datetime);
              return (
                <div key={rem.id} className="flex items-center gap-3">
                  <button
                    onClick={(e) => { bounceClick(e); setReminders((rs) => rs.map((x) => (x.id === rem.id ? { ...x, done: !x.done } : x))); }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 relative overflow-hidden${rem.done ? " check-ring-pop" : ""}`}
                    style={{ borderColor: rem.done ? ACCENT : T.border, background: rem.done ? ACCENT : "transparent" }}
                  >
                    {rem.done && <Check className="check-pop" size={11} color="#fff" strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[13px] font-medium truncate"
                      style={{ color: rem.done ? T.textMuted : T.text, textDecoration: rem.done ? "line-through" : "none" }}
                    >
                      {rem.title}
                    </p>
                    <p className="text-[11px]" style={{ color: T.textMuted }}>
                      {dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </div>
                  <button onClick={() => setReminders((rs) => rs.filter((x) => x.id !== rem.id))} className="shrink-0 p-1">
                    <Trash2 size={13} color={T.textMuted} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
