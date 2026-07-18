import React, { useState, useEffect, useRef } from "react";
import { BellRing, X } from "lucide-react";

import Splash from "./components/Splash";
import Spinner from "./components/Spinner";
import BottomNav from "./components/BottomNav";
import Home from "./components/Home";
import Focus from "./components/Focus";
import NotesScreen from "./components/NotesScreen";
import Subjects from "./components/Subjects";
import Planner from "./components/Planner";
import Insights from "./components/Insights";
import Settings from "./components/Settings";

import { THEMES, ACCENT, TAB_ORDER, CLASSES } from "./lib/constants";
import { uid } from "./lib/helpers";
import { seedSubjects, seedTasks, seedNotes, seedReminders } from "./lib/seedData";
import { useAuth } from "./hooks/useAuth";
import { loadState, saveState } from "./lib/cloudStorage";

export default function App() {
  const { user, authReady } = useAuth();

  const [tab, setTab] = useState("home");
  const [subjects, setSubjects] = useState(seedSubjects);
  const [tasks, setTasks] = useState(seedTasks());
  const [notes, setNotes] = useState(seedNotes());
  const [reminders, setReminders] = useState(seedReminders());
  const [theme, setTheme] = useState("light");
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifyPermission, setNotifyPermission] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const notifiedRef = useRef(new Set());

  const currentIndex = TAB_ORDER.indexOf(tab);
  const dirRef = useRef(currentIndex);
  const direction = currentIndex >= dirRef.current ? 1 : -1;
  dirRef.current = currentIndex;

  function pushToast(toast) {
    const id = uid();
    setToasts((t) => [...t, { id, ...toast }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }

  async function requestNotifyPermission() {
    if (typeof Notification === "undefined") return;
    try {
      const perm = await Notification.requestPermission();
      setNotifyPermission(perm);
    } catch (e) {
      setNotifyPermission("denied");
    }
  }

  function fireReminderAlert(reminder) {
    let sentNative = false;
    try {
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(reminder.title, { body: "Your reminder is due now" });
        sentNative = true;
      }
    } catch (e) {
      sentNative = false;
    }
    pushToast({
      title: reminder.title,
      message: sentNative ? "Sent as a system notification" : "Reminder due now",
    });
  }

  // Poll for reminders that have come due, and alert once per reminder
  useEffect(() => {
    if (!loaded) return;
    const check = () => {
      const now = Date.now();
      reminders.forEach((r) => {
        if (r.done || notifiedRef.current.has(r.id)) return;
        const t = new Date(r.datetime).getTime();
        if (!isNaN(t) && t <= now) {
          notifiedRef.current.add(r.id);
          fireReminderAlert(r);
        }
      });
    };
    check();
    const interval = setInterval(check, 20000);
    return () => clearInterval(interval);
  }, [reminders, loaded]);

  // Keep the splash on screen for a minimum beat so it never just flickers
  useEffect(() => {
    const t = setTimeout(() => setMinTimeDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Once data is loaded AND the minimum time has passed, fade the splash out
  useEffect(() => {
    if (loaded && minTimeDone && !splashFading) {
      setSplashFading(true);
      const t = setTimeout(() => setSplashVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [loaded, minTimeDone, splashFading]);

  // Load persisted data from Firestore once we have a signed-in (anonymous) user
  useEffect(() => {
    if (!authReady || !user) return;
    (async () => {
      try {
        const data = await loadState(user.uid);
        if (data) {
          if (data.subjects) setSubjects(data.subjects);
          if (data.tasks) setTasks(data.tasks);
          if (data.notes) setNotes(data.notes);
          if (data.reminders) setReminders(data.reminders);
          if (data.theme) setTheme(data.theme);
        }
      } catch (e) {
        // no saved data yet, or offline — keep defaults
      } finally {
        setLoaded(true);
      }
    })();
  }, [authReady, user]);

  // Persist to Firestore whenever data changes (after initial load)
  useEffect(() => {
    if (!loaded || !user) return;
    (async () => {
      try {
        await saveState(user.uid, { subjects, tasks, notes, reminders, theme });
        setSaveError(false);
      } catch (e) {
        setSaveError(true);
      }
    })();
  }, [subjects, tasks, notes, reminders, theme, loaded, user]);

  const resetData = async () => {
    const fresh = { subjects: seedSubjects, tasks: seedTasks(), notes: seedNotes(), reminders: seedReminders(), theme };
    setSubjects(fresh.subjects);
    setTasks(fresh.tasks);
    setNotes(fresh.notes);
    setReminders(fresh.reminders);
    if (!user) return;
    try {
      await saveState(user.uid, fresh);
    } catch (e) {
      setSaveError(true);
    }
  };

  const T = THEMES[theme];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen w-full flex justify-center">
      <div
        className="app-shell w-full max-w-md min-h-screen flex flex-col relative shadow-2xl overflow-hidden"
        style={{ background: T.bg }}
      >
        {splashVisible && <Splash fading={splashFading} />}

        {/* Toast notifications */}
        <div className="absolute top-3 left-3 right-3 z-40 flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className="toast-in pointer-events-auto rounded-2xl px-4 py-3 flex items-start gap-3 shadow-lg"
              style={{ background: T.card, border: `1px solid ${T.border}` }}
            >
              <BellRing size={16} color={ACCENT} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate" style={{ color: T.text }}>{t.title}</p>
                <p className="text-[11.5px]" style={{ color: T.textMuted }}>{t.message}</p>
              </div>
              <button onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}>
                <X size={14} color={T.textMuted} />
              </button>
            </div>
          ))}
        </div>

        {!loaded ? (
          <div className="flex-1 flex items-center justify-center">
            <Spinner color={T.text} />
          </div>
        ) : (
          <div
            key={tab}
            className="flex-1 overflow-y-auto overflow-x-hidden pb-24 screen-enter"
            style={{ "--dir": direction }}
          >
            {tab === "home" && (
              <Home
                subjects={subjects}
                tasks={tasks}
                setTasks={setTasks}
                classes={CLASSES}
                notes={notes}
                setNotes={setNotes}
                reminders={reminders}
                setReminders={setReminders}
                T={T}
                theme={theme}
                setTheme={setTheme}
                notifyPermission={notifyPermission}
                requestNotifyPermission={requestNotifyPermission}
                openSettings={() => setSettingsOpen(true)}
              />
            )}
            {tab === "focus" && <Focus subjects={subjects} T={T} theme={theme} setTheme={setTheme} />}
            {tab === "notes" && (
              <NotesScreen notes={notes} setNotes={setNotes} T={T} theme={theme} setTheme={setTheme} />
            )}
            {tab === "subjects" && (
              <Subjects
                subjects={subjects}
                setSubjects={setSubjects}
                tasks={tasks}
                setTasks={setTasks}
                T={T}
                theme={theme}
                setTheme={setTheme}
              />
            )}
            {tab === "planner" && (
              <Planner
                subjects={subjects}
                tasks={tasks}
                setTasks={setTasks}
                T={T}
                theme={theme}
                setTheme={setTheme}
              />
            )}
            {tab === "insights" && (
              <Insights subjects={subjects} tasks={tasks} T={T} theme={theme} setTheme={setTheme} />
            )}
          </div>
        )}

        {settingsOpen && (
          <Settings
            T={T}
            theme={theme}
            setTheme={setTheme}
            onClose={() => setSettingsOpen(false)}
            notifyPermission={notifyPermission}
            requestNotifyPermission={requestNotifyPermission}
            resetData={resetData}
            saveError={saveError}
          />
        )}

        <BottomNav tab={tab} setTab={setTab} T={T} />
      </div>
    </div>
  );
      }
