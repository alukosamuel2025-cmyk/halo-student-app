import React, { useState } from "react";
import { Plus, X, Check, Trash2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SUBJECT_PALETTES, ACCENT } from "../lib/constants";
import { uid, spawnRipple, bounceClick, sortTasksByUrgency } from "../lib/helpers";

function Subjects({ subjects, setSubjects, tasks, setTasks, T, theme, setTheme }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [expanded, setExpanded] = useState(null);

  const addSubject = () => {
    if (!name.trim()) return;
    setSubjects((s) => [...s, { id: uid(), name: name.trim(), palette: s.length % SUBJECT_PALETTES.length }]);
    setName("");
    setAdding(false);
  };

  const removeSubject = (id) => {
    setSubjects((s) => s.filter((x) => x.id !== id));
    setTasks((t) => t.filter((x) => x.subjectId !== id));
  };

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.done).length;

  return (
    <div className="px-5 pt-7">
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="display-font text-[22px] font-semibold" style={{ color: T.text }}>Subjects</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} setTheme={setTheme} T={T} />
          <button
            onClick={() => setAdding((a) => !a)}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: T.text }}
          >
            {adding ? <X size={16} color={T.bg} /> : <Plus size={16} color={T.bg} />}
          </button>
        </div>
      </div>

      {adding && (
        <div className="flex gap-2 mb-5">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSubject()}
            placeholder="Subject name"
            className="flex-1 rounded-xl px-4 py-2.5 text-[13px] outline-none"
            style={{ background: T.card, border: `1px solid ${T.border}`, color: T.text }}
          />
          <button
            onClick={(e) => { bounceClick(e); addSubject(); }}
            className="px-4 rounded-xl text-white text-[13px] font-semibold relative overflow-hidden pressable"
            style={{ background: ACCENT }}
          >
            Add
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {subjects.map((s) => {
          const subjectTasks = tasks.filter((t) => t.subjectId === s.id);
          const done = subjectTasks.filter((t) => t.done).length;
          const total = subjectTasks.length;
          const pct = total ? Math.round((done / total) * 100) : 0;
          const p = SUBJECT_PALETTES[s.palette % SUBJECT_PALETTES.length];
          const isOpen = expanded === s.id;

          return (
            <div key={s.id} className="rounded-2xl overflow-hidden">
              <div
                onClick={() => setExpanded(isOpen ? null : s.id)}
                onPointerDown={(e) => spawnRipple(e, "rgba(255,255,255,0.35)")}
                className="p-4 cursor-pointer relative overflow-hidden pressable"
                style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="display-font text-white font-semibold text-[16px]">{s.name}</h3>
                    <p className="text-white/80 text-[12px] mt-0.5">{done}/{total} tasks</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSubject(s.id);
                    }}
                    className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0"
                  >
                    <Trash2 size={13} color="#fff" />
                  </button>
                </div>
                <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>

              {isOpen && (
                <div className="px-4 py-3 flex flex-col gap-2" style={{ background: T.card }}>
                  {subjectTasks.length === 0 && (
                    <p className="text-[12px] py-2" style={{ color: T.textMuted }}>No tasks yet for this subject.</p>
                  )}
                  {sortTasksByUrgency(subjectTasks).map((task) => (
                    <div key={task.id} className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          bounceClick(e);
                          setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
                        }}
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 relative overflow-hidden${task.done ? " check-ring-pop" : ""}`}
                        style={{ borderColor: task.done ? p.to : T.border, background: task.done ? p.to : "transparent" }}
                      >
                        {task.done && <Check className="check-pop" size={11} color="#fff" strokeWidth={3} />}
                      </button>
                      <span
                        className="text-[13px] flex-1"
                        style={{ color: task.done ? T.textMuted : T.text, textDecoration: task.done ? "line-through" : "none" }}
                      >
                        {task.title}
                      </span>
                      <span className="text-[11px]" style={{ color: T.textMuted }}>{task.date.slice(5)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl p-5 flex justify-between text-center" style={{ background: T.card }}>
        <div>
          <p className="mono-font text-[20px] font-bold" style={{ color: T.text }}>{subjects.length}</p>
          <p className="text-[11px]" style={{ color: T.textMuted }}>Subjects</p>
        </div>
        <div>
          <p className="mono-font text-[20px] font-bold" style={{ color: T.text }}>{totalTasks}</p>
          <p className="text-[11px]" style={{ color: T.textMuted }}>Total tasks</p>
        </div>
        <div>
          <p className="mono-font text-[20px] font-bold" style={{ color: T.text }}>{doneTasks}</p>
          <p className="text-[11px]" style={{ color: T.textMuted }}>Completed</p>
        </div>
      </div>
    </div>
  );
}

export default Subjects;
