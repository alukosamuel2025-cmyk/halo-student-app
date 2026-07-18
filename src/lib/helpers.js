// Small pure/DOM-utility helpers used across components

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function spawnRipple(e, color = "rgba(255,255,255,0.45)") {
  const el = e.currentTarget;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.4;
  const clientX = typeof e.clientX === "number" && e.clientX !== 0 ? e.clientX : rect.left + rect.width / 2;
  const clientY = typeof e.clientY === "number" && e.clientY !== 0 ? e.clientY : rect.top + rect.height / 2;
  const span = document.createElement("span");
  span.className = "ripple-el";
  span.style.width = span.style.height = `${size}px`;
  span.style.left = `${clientX - rect.left - size / 2}px`;
  span.style.top = `${clientY - rect.top - size / 2}px`;
  span.style.background = color;
  el.appendChild(span);
  span.addEventListener("animationend", () => span.remove());
}

// Restarts a CSS bounce animation on click/release — vanilla DOM, no state needed
function bounceClick(e) {
  const el = e.currentTarget;
  if (!el) return;
  el.classList.remove("btn-bounce");
  void el.offsetWidth; // force reflow so the animation can restart
  el.classList.add("btn-bounce");
}

// Incomplete tasks first (overdue, then today, then future — earliest due first), done tasks sink to the bottom
function sortTasksByUrgency(list) {
  return [...list].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const ad = `${a.date} ${a.time}`;
    const bd = `${b.date} ${b.time}`;
    return ad.localeCompare(bd);
  });
}

function computeStreak(tasks) {
  let streak = 0;
  const d = new Date();
  for (let i = 0; i < 60; i++) {
    const iso = isoDate(d);
    const dayTasks = tasks.filter((t) => t.date === iso);
    const anyDone = dayTasks.some((t) => t.done);
    if (anyDone) {
      streak++;
    } else if (i > 0) {
      break;
    } else {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function formatTime(t) {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export { uid, isoDate, spawnRipple, bounceClick, sortTasksByUrgency, computeStreak, formatTime };
