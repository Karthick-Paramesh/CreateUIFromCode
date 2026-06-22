import { Outlet, NavLink, useLocation, useNavigate } from "react-router";
import { useState, useRef } from "react";
import { Upload, ChevronDown, X, FileText, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SidebarContext, defaultSidebarState } from "./context/SidebarContext";
import { Cursor } from "./components/Cursor";

function Cap({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "block", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "#2E3A58", marginBottom: 10,
      fontFamily: "'JetBrains Mono', monospace",
    }}>{children}</span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#4B5680", marginBottom: 5, letterSpacing: "0.02em" }}>
      {children}
    </span>
  );
}

function SInput({ label, placeholder, type = "text", value, onChange }: {
  label: string; placeholder?: string; type?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <FieldLabel>{label}</FieldLabel>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%", padding: "7px 10px", fontSize: 12, fontFamily: "'Inter', sans-serif",
          background: "#080B14", border: "1px solid #181E33", borderRadius: 4,
          color: "#C4CBEF", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = "#7C85FF"; }}
        onBlur={(e) => { e.target.style.borderColor = "#181E33"; }}
      />
    </div>
  );
}

function SSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div style={{ marginBottom: 10 }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", padding: "7px 28px 7px 10px", fontSize: 12,
            fontFamily: "'Inter', sans-serif", appearance: "none",
            background: "#080B14", border: "1px solid #181E33", borderRadius: 4,
            color: "#C4CBEF", outline: "none",
          }}>
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={11} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: "#2E3A58", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function Toggle({ on, onChange, label, hint }: { on: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => onChange(!on)}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <motion.div
          animate={{ background: on ? "#7C85FF" : "#181E33" }}
          style={{ width: 32, height: 17, borderRadius: 9, position: "relative", flexShrink: 0 }}
        >
          <motion.span
            animate={{ left: on ? 16 : 2, background: on ? "#fff" : "#2E3A58" }}
            style={{ position: "absolute", top: 2, width: 13, height: 13, borderRadius: "50%" }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        </motion.div>
        <span style={{ fontSize: 12, color: "#8892B0", fontWeight: 500 }}>{label}</span>
      </div>
      {hint && <p style={{ fontSize: 10, color: "#2E3A58", marginTop: 4, marginLeft: 40 }}>{hint}</p>}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#0F1422", margin: "14px 0" }} />;
}

function NavItem({ to, label, icon: Icon, end }: { to: string; label: string; icon: React.FC<any>; end?: boolean }) {
  return (
    <NavLink to={to} end={end}
      style={({ isActive }) => ({
        display: "flex", alignItems: "center", gap: 9, padding: "8px 10px",
        borderRadius: 5, marginBottom: 2, textDecoration: "none",
        fontSize: 12, fontWeight: 500, letterSpacing: "0.01em",
        color: isActive ? "#E8EEFF" : "#4B5680",
        background: isActive ? "#111626" : "transparent",
        borderLeft: isActive ? "2px solid #7C85FF" : "2px solid transparent",
        transition: "all 0.2s",
        position: "relative",
      })}>
      <Icon size={13} strokeWidth={1.8} />
      {label}
    </NavLink>
  );
}

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{ minHeight: "100%" }}
    >
      {children}
    </motion.div>
  );
}

export { AnimatedPage };

export function Root() {
  const [state, setState] = useState(defaultSidebarState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const set = (patch: Partial<typeof state>) => setState((s) => ({ ...s, ...patch }));
  const aiEnabled = state.provider !== "disabled";

  return (
    <SidebarContext.Provider value={{ state, set }}>
      <Cursor />
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", fontFamily: "'Inter', sans-serif", background: "#080B14", cursor: "none" }}>

        {/* Sidebar */}
        <aside style={{
          width: 256, flexShrink: 0, background: "#05070E",
          borderRight: "1px solid #0F1422", display: "flex", flexDirection: "column", overflowY: "auto",
        }}>
          <div style={{ flex: 1, padding: "24px 20px 20px", display: "flex", flexDirection: "column" }}>

            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ marginBottom: 28 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, background: "#7C85FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={13} color="#07080F" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#E8EEFF", fontFamily: "'Outfit', sans-serif", letterSpacing: "0.01em" }}>
                  PPTX Agent
                </span>
              </div>
              <span style={{ fontSize: 10, color: "#2E3A58", letterSpacing: "0.06em", fontFamily: "'JetBrains Mono', monospace", marginLeft: 32 }}>
                ENTERPRISE
              </span>
            </motion.div>

            {/* Nav */}
            <nav style={{ marginBottom: 24 }}>
              <NavItem to="/" label="Generate" icon={FileText} end />
              <NavItem to="/preview/latest" label="Preview" icon={LayoutGrid} />
            </nav>

            <Divider />

            {/* Provider */}
            <Cap>LLM Provider</Cap>
            <SSelect label="Provider" value={state.provider} onChange={(v) => set({ provider: v as any })}
              options={[
                { value: "disabled",   label: "Disabled (stub mode)" },
                { value: "openai",     label: "OpenAI" },
                { value: "azure",      label: "Azure OpenAI" },
                { value: "compatible", label: "Compatible endpoint" },
              ]} />

            <AnimatePresence>
              {aiEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <SInput label="API Key" type="password" placeholder="sk-…" value={state.apiKey} onChange={(v) => set({ apiKey: v })} />
                  <SInput label="Model" placeholder="gpt-4o" value={state.model} onChange={(v) => set({ model: v })} />
                  {(state.provider === "azure" || state.provider === "compatible") && (
                    <SInput label="Endpoint URL" placeholder="https://…" value={state.endpoint} onChange={(v) => set({ endpoint: v })} />
                  )}
                  {state.provider === "azure" && (
                    <SInput label="API Version" placeholder="2024-02-01" value={state.apiVersion} onChange={(v) => set({ apiVersion: v })} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Divider />

            {/* Template */}
            <Cap>Template</Cap>
            <input ref={fileInputRef} type="file" accept=".pptx" style={{ display: "none" }} onChange={(e) => {
              const f = e.target.files?.[0]; if (f) set({ templateFile: f.name });
            }} />
            <AnimatePresence mode="wait">
              {state.templateFile ? (
                <motion.div key="file" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ marginBottom: 10 }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "7px 10px", background: "#080B14", border: "1px solid #181E33",
                    borderRadius: 4, fontSize: 11,
                  }}>
                    <span style={{ color: "#34D399", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {state.templateFile}
                    </span>
                    <button onClick={() => set({ templateFile: null })} style={{ background: "none", border: "none", cursor: "none", color: "#2E3A58", flexShrink: 0, marginLeft: 6, padding: 0 }}>
                      <X size={11} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => fileInputRef.current?.click()}
                  whileHover={{ borderColor: "#7C85FF", color: "#C4CBEF" }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "7px 10px",
                    fontSize: 11, color: "#4B5680", background: "#080B14", border: "1px solid #181E33",
                    borderRadius: 4, cursor: "none", marginBottom: 10, fontFamily: "'Inter', sans-serif",
                  }}>
                  <Upload size={11} />
                  Upload corporate .pptx
                </motion.button>
              )}
            </AnimatePresence>

            <Divider />

            {/* Advanced */}
            <Cap>Advanced</Cap>
            <Toggle on={state.enrichment} onChange={(v) => set({ enrichment: v })}
              label="Per-slide enrichment" hint="Second LLM pass per slide. Slower." />
            <SInput label="Output directory" value={state.outputDir} onChange={(v) => set({ outputDir: v })} />

            {/* Status */}
            <div style={{ marginTop: "auto", paddingTop: 24 }}>
              <AnimatePresence mode="wait">
                <motion.div key={aiEnabled ? "ai" : "stub"}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: aiEnabled ? "#34D399" : "#4B5680" }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace", color: aiEnabled ? "#34D399" : "#4B5680" }}>
                    {aiEnabled ? "AI ACTIVE" : "STUB MODE"}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          <AnimatePresence mode="wait">
            <AnimatedPage key={location.pathname}>
              <Outlet />
            </AnimatedPage>
          </AnimatePresence>
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
