import React, { useState } from "react";
import { Mail, Lock, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { ACCENT, ACCENT_TO } from "../lib/constants";
import { bounceClick, spawnRipple } from "../lib/helpers";

function friendlyError(code) {
  if (code.includes("email-already-in-use")) return "That email is already registered — try signing in instead.";
  if (code.includes("invalid-email")) return "That email address doesn't look right.";
  if (code.includes("weak-password")) return "Password should be at least 6 characters.";
  if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential"))
    return "Incorrect email or password.";
  if (code.includes("too-many-requests")) return "Too many attempts — please wait a moment and try again.";
  return "Something went wrong. Please try again.";
}

function AuthScreen({ signIn, signUp, signInGuest }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const submit = async () => {
    setError("");
    setResetSent(false);
    if (!email.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
    } catch (e) {
      setError(friendlyError(e.code || ""));
    } finally {
      setLoading(false);
    }
  };

  const guest = async () => {
    setError("");
    setLoading(true);
    try {
      await signInGuest();
    } catch (e) {
      setError("Couldn't continue as guest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    setError("");
    setResetSent(false);
    if (!email.trim()) {
      setError("Enter your email above first, then tap this again.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSent(true);
    } catch (e) {
      setError(friendlyError(e.code || ""));
    }
  };

  return (
    <div
      className="flex-1 flex flex-col overflow-y-auto"
      style={{
        background: "linear-gradient(160deg, #2B4FE0 0%, #6C3CE0 55%, #9B4FE8 100%)",
        backgroundSize: "200% 200%",
        animation: "floatGradient 8s ease-in-out infinite",
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-[-40px] z-10 shrink-0"
          style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(6px)" }}
        >
          <GraduationCap size={32} color="#fff" strokeWidth={2} />
        </div>

        <div className="w-full rounded-[28px] bg-white pt-12 pb-6 px-6 shadow-2xl">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Sparkles size={12} color={ACCENT} />
            <span className="text-[11px] font-semibold" style={{ color: ACCENT }}>
              {mode === "login" ? "Welcome back" : "Get started free"}
            </span>
          </div>
          <h1 className="display-font text-[24px] font-bold text-center mb-1" style={{ color: "#1A1825" }}>
            {mode === "login" ? "Student Login" : "Create Account"}
          </h1>
          <p className="text-[12.5px] text-center mb-6" style={{ color: "#9691AC" }}>
            {mode === "login" ? "Enter your email and password below" : "Set up Halo in a few seconds"}
          </p>

          <div className="flex flex-col gap-3 mb-1">
            <div className="flex items-center gap-2.5 rounded-xl px-4 py-3" style={{ border: "1px solid #E5E1F5" }}>
              <Mail size={16} color="#B4ACC9" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                autoCapitalize="none"
                autoCorrect="off"
                inputMode="email"
                className="flex-1 bg-transparent text-[14px] outline-none"
                style={{ color: "#1A1825" }}
              />
            </div>
            <div className="flex items-center gap-2.5 rounded-xl px-4 py-3" style={{ border: "1px solid #E5E1F5" }}>
              <Lock size={16} color="#B4ACC9" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="flex-1 bg-transparent text-[14px] outline-none"
                style={{ color: "#1A1825" }}
              />
            </div>
          </div>

          {error && <p className="text-[12px] mt-3" style={{ color: "#E84393" }}>{error}</p>}
          {resetSent && !error && (
            <p className="text-[12px] mt-3" style={{ color: "#00B894" }}>
              Check your inbox for a password reset link.
            </p>
          )}

          <button
            onClick={(e) => { bounceClick(e); submit(); }}
            onPointerDown={(e) => spawnRipple(e, "rgba(255,255,255,0.3)")}
            disabled={loading}
            className="w-full rounded-xl py-3.5 mt-5 flex items-center justify-center gap-2.5 text-[14.5px] font-semibold relative overflow-hidden pressable"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_TO})`, color: "#fff", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Login Now" : "Create Account"}
            {!loading && (
              <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.25)" }}>
                <ArrowRight size={13} color="#fff" />
              </span>
            )}
          </button>

          {mode === "login" && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <span className="text-[12.5px]" style={{ color: "#9691AC" }}>Forgot your password?</span>
              <button onClick={forgotPassword} className="text-[12.5px] font-semibold" style={{ color: ACCENT }}>
                Get it here
              </button>
            </div>
          )}

          <div className="h-px my-4" style={{ background: "#EDEBF7" }} />

          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setResetSent(false); }}
            className="text-[13px] font-medium w-full text-center mb-3"
            style={{ color: ACCENT }}
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>

          <button
            onClick={(e) => { bounceClick(e); guest(); }}
            onPointerDown={(e) => spawnRipple(e, "rgba(108,92,231,0.1)")}
            disabled={loading}
            className="w-full text-[12px] font-medium text-center py-1"
            style={{ color: "#B4ACC9" }}
          >
            Continue as guest instead
          </button>
        </div>

        <p className="text-white/60 text-[11px] text-center mt-6 leading-relaxed">
          © 2026 Halo — study smarter, every day
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;
