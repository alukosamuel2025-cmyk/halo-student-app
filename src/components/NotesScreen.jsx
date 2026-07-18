import React, { useState } from "react";
import { Plus, X, Search, StickyNote, Trash2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { uid, isoDate, spawnRipple, bounceClick } from "../lib/helpers";

function NotesScreen({ notes, setNotes, T, theme, setTheme }) {
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const filtered = notes.filter((n) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
  });

  const saveNote = () => {
    if (!title.trim()) return;
    setNotes((n) => [{ id: uid(), title: title.trim(), body: body.trim(), createdAt: isoDate(new Date()) }, ...n]);
    setTitle("");
    setBody("");
    setAdding(false);
  };

  return (
    <div className="px-5 pt-7">
      <div className="flex items-center justify-between mb-1 gap-3">
        <h1 className="display-font text-[22px] font-semibold" style={{ color: T.text }}>Notes</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} setTheme={setTheme} T={T} />
          <button
            onClick={(e) => { bounceClick(e); setAdding((a) => !a); }}
            onPointerDown={(e) => spawnRipple(e, "rgba(255,255,255,0.4)")}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 relative overflow-hidden pressable"
            style={{ background: T.text }}
          >
            {adding ? <X size={16} color={T.bg} /> : <Plus size={16} color={T.bg} />}
          </button>
        </div>
      </div>
      <p className="text-[13px] mb-5" style={{ color: T.textMuted }}>{notes.length} saved</p>

      <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5 mb-5" style={{ background: T.card }}>
        <Search size={15} color={T.textMuted} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes"
          className="flex-1 bg-transparent text-[13px] outline-none"
          style={{ color: T.text }}
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <X size={13} color={T.textMuted} />
          </button>
        )}
      </div>

      {adding && (
        <div className="rounded-2xl p-4 mb-5 flex flex-col gap-3" style={{ background: T.card }}>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="rounded-xl px-3 py-2 text-[13px] outline-none"
            style={{ background: T.input, color: T.text }}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your note…"
            rows={4}
            className="rounded-xl px-3 py-2 text-[13px] outline-none resize-none"
            style={{ background: T.input, color: T.text }}
          />
          <button
            onClick={(e) => { bounceClick(e); saveNote(); }}
            className="rounded-xl py-2.5 text-[13px] font-semibold relative overflow-hidden pressable"
            style={{ background: T.text, color: T.bg }}
          >
            Save note
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: T.card }}
          >
            <StickyNote size={22} color={T.textMuted} />
          </div>
          <p className="text-[13px]" style={{ color: T.textMuted }}>
            {notes.length === 0 ? "No notes yet. Tap + to add one." : "No notes match your search."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((n) => (
            <div key={n.id} className="rounded-2xl p-4" style={{ background: T.card }}>
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <p className="text-[14px] font-semibold flex-1 min-w-0" style={{ color: T.text }}>{n.title}</p>
                <button onClick={() => setNotes((ns) => ns.filter((x) => x.id !== n.id))} className="shrink-0 p-0.5">
                  <Trash2 size={14} color={T.textMuted} />
                </button>
              </div>
              {n.body && <p className="text-[12.5px] leading-relaxed" style={{ color: T.textMuted }}>{n.body}</p>}
              <p className="text-[10.5px] mt-2" style={{ color: T.textMuted, opacity: 0.7 }}>{n.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotesScreen;
