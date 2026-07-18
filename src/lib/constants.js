// Design tokens, theme palettes, and static schedule data shared across the app

// ---------- Design tokens ----------
const SUBJECT_PALETTES = [
  { from: "#6C5CE7", to: "#4834D4" }, // indigo
  { from: "#FF6B9D", to: "#E84393" }, // rose
  { from: "#00D9C0", to: "#00B894" }, // teal
  { from: "#FDB44B", to: "#F7931E" }, // amber
  { from: "#4FACFE", to: "#3A86FF" }, // sky
];

const ACCENT = "#FF6B9D";
const ACCENT_TO = "#6C5CE7";

const THEMES = {
  light: {
    bg: "#F5F5FA",
    card: "#FFFFFF",
    text: "#1A1825",
    textMuted: "#9691AC",
    border: "#EDEBF7",
    input: "#F5F5FA",
    nav: "#FFFFFF",
    ring: "rgba(0,0,0,0.06)",
    heroFrom: "#241B3E",
    heroTo: "#4834D4",
    knob: "#FFFFFF",
    knobIconColor: "#FDB44B",
    trackOff: "#E8E5F5",
  },
  dark: {
    bg: "#0A0A0F",
    card: "#16141F",
    text: "#F5F3FF",
    textMuted: "#716C88",
    border: "#242235",
    input: "#1F1D2B",
    nav: "#121018",
    ring: "rgba(255,255,255,0.06)",
    heroFrom: "#000000",
    heroTo: "#3D2E85",
    knob: "#000000",
    knobIconColor: "#F5F3FF",
    trackOff: "#1A1825",
  },
};

const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const TAB_ORDER = ["home", "focus", "notes", "subjects", "planner", "insights"];
// Weekly class schedule — day: 0 = Sunday ... 6 = Saturday
const CLASSES = [
  { id: "c1", subjectId: "s1", day: 1, start: "09:00", end: "09:50", room: "Room 204" },
  { id: "c2", subjectId: "s2", day: 1, start: "11:00", end: "11:50", room: "Room 118" },
  { id: "c3", subjectId: "s3", day: 2, start: "10:00", end: "10:50", room: "Lab 3" },
  { id: "c4", subjectId: "s1", day: 3, start: "09:00", end: "09:50", room: "Room 204" },
  { id: "c5", subjectId: "s2", day: 3, start: "13:00", end: "13:50", room: "Room 118" },
  { id: "c6", subjectId: "s3", day: 4, start: "10:00", end: "10:50", room: "Lab 3" },
  { id: "c7", subjectId: "s1", day: 5, start: "09:00", end: "09:50", room: "Room 204" },
  { id: "c8", subjectId: "s2", day: 5, start: "11:00", end: "11:50", room: "Room 118" },
];

export { SUBJECT_PALETTES, ACCENT, ACCENT_TO, THEMES, dayNames, monthNames, TAB_ORDER, CLASSES };
