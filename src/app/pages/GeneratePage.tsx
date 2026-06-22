import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Download, LayoutGrid, RotateCcw } from "lucide-react";
import { motion, AnimatePresence, useSpring, useTransform } from "motion/react";
import { TiltCard } from "../components/TiltCard";
import { MagneticButton } from "../components/MagneticButton";

type AppState = "idle" | "generating" | "complete";
type Tone = "professional" | "executive" | "technical" | "casual";
interface LogLine { pct: number; msg: string; }

const STUB_LOGS = [
  { pct: 5,   msg: "Initializing generation pipeline",       delay: 400  },
  { pct: 12,  msg: "Parsing brief — extracting key themes",  delay: 900  },
  { pct: 24,  msg: "Building outline — 9 slides mapped",     delay: 1600 },
  { pct: 38,  msg: "Generating title slide content",         delay: 2400 },
  { pct: 47,  msg: "Composing section headers and bullets",  delay: 3200 },
  { pct: 58,  msg: "Rendering two-column layout",            delay: 4100 },
  { pct: 69,  msg: "Generating chart data and table rows",   delay: 5000 },
  { pct: 80,  msg: "Applying corporate template styles",     delay: 5900 },
  { pct: 91,  msg: "Finalizing closing slide",               delay: 6800 },
  { pct: 100, msg: "Export complete — ready to download",   delay: 7600 },
];

// ── Atoms ─────────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
      color: "#2E3A58", marginBottom: 14, fontFamily: "'JetBrains Mono', monospace",
    }}>{children}</p>
  );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#4B5680", marginBottom: 6, letterSpacing: "0.02em" }}>
      {children}
      {optional && <span style={{ color: "#2E3A58", marginLeft: 4, fontStyle: "italic" }}>optional</span>}
    </label>
  );
}

function MInput({ label, value, onChange, placeholder, optional }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; optional?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <motion.div animate={{ borderColor: focused ? "#7C85FF" : "#181E33" }}
        style={{ borderRadius: 5, border: "1px solid #181E33" }}>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: "100%", padding: "9px 12px", fontSize: 13, fontFamily: "'Inter', sans-serif",
            background: "transparent", border: "none", borderRadius: 5,
            color: "#C4CBEF", outline: "none", boxSizing: "border-box",
          }} />
      </motion.div>
    </div>
  );
}

function MSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", padding: "9px 28px 9px 12px", fontSize: 13, fontFamily: "'Inter', sans-serif",
            appearance: "none", background: "#080B14", border: "1px solid #181E33", borderRadius: 5,
            color: "#C4CBEF", outline: "none",
          }}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="#2E3A58" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 200, damping: 25 });
  const display = useTransform(spring, (v) => Math.round(v));
  useEffect(() => { spring.set(value); }, [value]);
  return (
    <motion.span style={{ fontVariantNumeric: "tabular-nums" }}>
      {display}
    </motion.span>
  );
}

function StatusBadge({ state }: { state: "running" | "complete" }) {
  const cfg = {
    running:  { color: "#FBBF24", label: "RUNNING",  pulse: true },
    complete: { color: "#34D399", label: "COMPLETE", pulse: false },
  }[state];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: 6, height: 6 }}>
        {cfg.pulse && (
          <motion.div
            animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, borderRadius: "50%", background: cfg.color }}
          />
        )}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: cfg.color }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: cfg.color, fontFamily: "'JetBrains Mono', monospace" }}>
        {cfg.label}
      </span>
    </div>
  );
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export function GeneratePage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [extraInstructions, setExtraInstructions] = useState("");
  const [audience, setAudience] = useState("");
  const [slideCount, setSlideCount] = useState(9);
  const [tone, setTone] = useState<Tone>("professional");
  const [language, setLanguage] = useState("English");
  const [appState, setAppState] = useState<AppState>("idle");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [topicFocused, setTopicFocused] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  function handleGenerate() {
    if (!topic.trim()) return;
    setAppState("generating");
    setProgress(0);
    setLogs([]);
    setStatusMsg("Initializing…");
    STUB_LOGS.forEach(({ pct, msg, delay }) => {
      setTimeout(() => {
        setProgress(pct);
        setStatusMsg(msg);
        setLogs((prev) => [...prev, { pct, msg }]);
        if (pct === 100) setTimeout(() => setAppState("complete"), 300);
      }, delay);
    });
  }

  const canGenerate = topic.trim().length > 0 && appState === "idle";
  const showProgress = appState === "generating" || appState === "complete";

  return (
    <div style={{ padding: "40px 44px", minHeight: "100%" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>

        {/* Page header */}
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          style={{ marginBottom: 36 }}
        >
          <motion.div variants={stagger.item}>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 600,
              color: "#E8EEFF", letterSpacing: "-0.04em", margin: 0, lineHeight: 1.05,
              background: "linear-gradient(135deg, #E8EEFF 40%, #7C85FF)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Generate Presentation
            </h1>
          </motion.div>
          <motion.p variants={stagger.item} style={{ fontSize: 13, color: "#4B5680", marginTop: 8, letterSpacing: "0.01em" }}>
            Define your brief and configure output parameters below.
          </motion.p>
        </motion.div>

        {/* Form grid */}
        <motion.div
          variants={stagger.container} initial="initial" animate="animate"
          style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}
        >
          {/* Brief card */}
          <motion.div variants={stagger.item}>
            <TiltCard style={{ background: "#0D1120", border: "1px solid #181E33", borderRadius: 8, padding: 20 }}>
              <SectionLabel>Presentation Brief</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <FieldLabel>Topic</FieldLabel>
                  <motion.div
                    animate={{ borderColor: topicFocused ? "#7C85FF" : "#181E33" }}
                    style={{ border: "1px solid #181E33", borderRadius: 5 }}
                  >
                    <textarea rows={5} value={topic} onChange={(e) => setTopic(e.target.value)}
                      onFocus={() => setTopicFocused(true)} onBlur={() => setTopicFocused(false)}
                      placeholder="e.g. Q3 2025 investor update — revenue performance, market expansion, and product roadmap…"
                      style={{
                        width: "100%", padding: "9px 12px", fontSize: 13,
                        fontFamily: "'Inter', sans-serif", lineHeight: 1.65,
                        background: "transparent", border: "none", borderRadius: 5,
                        color: "#C4CBEF", outline: "none", resize: "none", boxSizing: "border-box",
                      }} />
                  </motion.div>
                </div>
                <div>
                  <FieldLabel optional>Extra instructions</FieldLabel>
                  <textarea rows={3} value={extraInstructions} onChange={(e) => setExtraInstructions(e.target.value)}
                    placeholder="Additional guidance, constraints, or style notes…"
                    style={{
                      width: "100%", padding: "9px 12px", fontSize: 13,
                      fontFamily: "'Inter', sans-serif", lineHeight: 1.65,
                      background: "#080B14", border: "1px solid #181E33", borderRadius: 5,
                      color: "#C4CBEF", outline: "none", resize: "none", boxSizing: "border-box",
                    }} />
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Options card */}
          <motion.div variants={stagger.item}>
            <TiltCard style={{ background: "#0D1120", border: "1px solid #181E33", borderRadius: 8, padding: 20 }}>
              <SectionLabel>Parameters</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <MInput label="Audience" value={audience} onChange={setAudience} placeholder="e.g. Board of Directors" />

                {/* Slide count */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <FieldLabel>Slide count</FieldLabel>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#7C85FF", fontFamily: "'JetBrains Mono', monospace" }}>
                      <AnimatedNumber value={slideCount} />
                    </span>
                  </div>
                  <input type="range" min={3} max={30} value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#7C85FF" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: "#2E3A58", fontFamily: "'JetBrains Mono', monospace" }}>3</span>
                    <span style={{ fontSize: 10, color: "#2E3A58", fontFamily: "'JetBrains Mono', monospace" }}>30</span>
                  </div>
                </div>

                <MSelect label="Tone" value={tone} onChange={(v) => setTone(v as Tone)}
                  options={[
                    { value: "professional", label: "Professional" },
                    { value: "executive",    label: "Executive" },
                    { value: "technical",    label: "Technical" },
                    { value: "casual",       label: "Casual" },
                  ]} />

                <MSelect label="Language" value={language} onChange={setLanguage}
                  options={[
                    { value: "English",    label: "English" },
                    { value: "German",     label: "German" },
                    { value: "French",     label: "French" },
                    { value: "Spanish",    label: "Spanish" },
                    { value: "Italian",    label: "Italian" },
                    { value: "Portuguese", label: "Portuguese" },
                    { value: "Dutch",      label: "Dutch" },
                  ]} />
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>

        {/* Generate button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginTop: 18 }}
        >
          <MagneticButton
            onClick={handleGenerate}
            disabled={!canGenerate}
            style={{
              width: "100%", height: 46, borderRadius: 6, fontSize: 13, fontWeight: 600,
              fontFamily: "'Outfit', sans-serif", letterSpacing: "0.06em",
              border: "none", cursor: canGenerate ? "none" : "not-allowed",
              background: canGenerate ? "#7C85FF" : "#111626",
              color: canGenerate ? "#07080F" : "#2E3A58",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
            }}
          >
            {/* Shimmer on hover */}
            <motion.div
              style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.15) 50%, transparent 65%)",
                backgroundSize: "200% 100%",
              }}
              animate={canGenerate ? { backgroundPosition: ["200% 0", "-200% 0"] } : {}}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>
              {appState === "generating" ? "GENERATING…" : "GENERATE PRESENTATION"}
            </span>
          </MagneticButton>
        </motion.div>

        {/* Progress panel */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ marginTop: 18, background: "#0D1120", border: "1px solid #181E33", borderRadius: 8, overflow: "hidden" }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #181E33" }}>
                <StatusBadge state={appState === "complete" ? "complete" : "running"} />
                <motion.span
                  key={statusMsg}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: 11, color: "#2E3A58", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {statusMsg}
                </motion.span>
              </div>

              {/* Progress bar */}
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #181E33" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 2, background: "#111626", borderRadius: 1, overflow: "hidden" }}>
                    <motion.div
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      style={{ height: "100%", background: "#7C85FF", borderRadius: 1, position: "relative" }}
                    >
                      {appState === "generating" && (
                        <motion.div
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                          style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }}
                        />
                      )}
                    </motion.div>
                  </div>
                  <motion.span
                    style={{ fontSize: 11, color: "#4B5680", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, minWidth: 36 }}
                  >
                    <AnimatedNumber value={progress} />%
                  </motion.span>
                </div>
              </div>

              {/* Terminal */}
              <div ref={logRef} style={{
                maxHeight: 180, overflowY: "auto", padding: "12px 18px",
                background: "#03040A", fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: "#4B5680", lineHeight: 1.9,
              }}>
                {logs.length === 0
                  ? <span style={{ color: "#1A2036" }}>awaiting output…</span>
                  : logs.map((l, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                      <span style={{ color: "#2E3A58" }}>[{String(l.pct).padStart(3)}%]</span>
                      {" "}
                      <span style={{ color: i === logs.length - 1 ? "#C4CBEF" : "#4B5680" }}>{l.msg}</span>
                      {i === logs.length - 1 && appState === "generating" && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: "steps(1)" }}
                          style={{ marginLeft: 4, color: "#7C85FF" }}
                        >▊</motion.span>
                      )}
                    </motion.div>
                  ))
                }
              </div>

              {/* Actions */}
              <AnimatePresence>
                {appState === "complete" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ borderTop: "1px solid #181E33", overflow: "hidden" }}
                  >
                    <div style={{ display: "flex", gap: 10, padding: "14px 18px" }}>
                      <MagneticButton style={{
                        display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
                        fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em",
                        background: "#7C85FF", color: "#07080F", border: "none", borderRadius: 5, cursor: "none",
                      }}>
                        <Download size={13} />
                        DOWNLOAD .PPTX
                      </MagneticButton>
                      <MagneticButton onClick={() => navigate("/preview/latest", { state: { topic } })}
                        style={{
                          display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
                          fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em",
                          background: "transparent", color: "#7C85FF", border: "1px solid #181E33", borderRadius: 5, cursor: "none",
                        }}>
                        <LayoutGrid size={13} />
                        PREVIEW SLIDES
                      </MagneticButton>
                      <button onClick={() => { setAppState("idle"); setProgress(0); setLogs([]); }}
                        style={{
                          display: "flex", alignItems: "center", gap: 7, padding: "9px 14px",
                          fontSize: 12, fontWeight: 500, background: "transparent",
                          color: "#2E3A58", border: "1px solid #181E33", borderRadius: 5, cursor: "none",
                          marginLeft: "auto", fontFamily: "'Inter', sans-serif",
                        }}>
                        <RotateCcw size={13} />
                        Reset
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
