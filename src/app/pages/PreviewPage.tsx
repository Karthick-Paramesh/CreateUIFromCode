import { useLocation, useNavigate } from "react-router";
import { Download, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MagneticButton } from "../components/MagneticButton";

const SLIDE_TYPE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  title_slide:    { bg: "#13103A", text: "#A5B4FC", dot: "#7C85FF" },
  section_header: { bg: "#0D1C3A", text: "#7DD3FC", dot: "#38BDF8" },
  bullets:        { bg: "#0B2014", text: "#6EE7B7", dot: "#34D399" },
  two_column:     { bg: "#1F1607", text: "#FCD34D", dot: "#FBBF24" },
  table:          { bg: "#1A0A14", text: "#F9A8D4", dot: "#F472B6" },
  chart:          { bg: "#061524", text: "#7DD3FC", dot: "#38BDF8" },
  closing:        { bg: "#0F1014", text: "#9CA3AF", dot: "#6B7280" },
  content:        { bg: "#061410", text: "#6EE7B7", dot: "#34D399" },
};

const STUB_SLIDES = [
  { index: 1, type: "title_slide",    title: "Enterprise Strategy Overview 2025",
    bullets: ["Setting the stage for Q3 performance", "Market position and competitive landscape", "Vision for the next 12 months"] },
  { index: 2, type: "section_header", title: "Market Landscape", bullets: [] },
  { index: 3, type: "bullets",        title: "Key Market Drivers",
    bullets: ["Accelerating digital transformation", "Rising demand for AI-native productivity tools", "Regulatory tailwinds in key geographies", "Supply chain stabilization driving capex recovery"] },
  { index: 4, type: "two_column",     title: "Competitive Analysis",
    bullets: ["Proprietary data moat, enterprise relationships", "APAC expansion, SMB segment penetration"] },
  { index: 5, type: "chart",          title: "Revenue Projections Q1–Q4",
    bullets: ["Q1: $4.2M", "Q2: $5.1M", "Q3: $6.8M", "Q4: $8.4M"] },
  { index: 6, type: "table",          title: "Budget Allocation Summary",
    bullets: ["R&D: 38%", "Sales & Marketing: 29%", "G&A: 14%", "Infrastructure: 19%"] },
  { index: 7, type: "bullets",        title: "Strategic Priorities",
    bullets: ["Launch enterprise self-serve tier by Q4", "Grow NRR above 120%", "Reduce CAC payback to < 14 months"] },
  { index: 8, type: "content",        title: "Implementation Roadmap",
    bullets: ["M1–2: Foundation — pipelines & infra", "M3–4: Enablement — training, playbooks", "M5–6: Scale — automated onboarding"] },
  { index: 9, type: "closing",        title: "Next Steps & Contact",
    bullets: ["Schedule exec alignment workshop", "Finalize Q4 OKR cascade", "strategy@enterprise.io"] },
];

// ── Slide renderers ────────────────────────────────────────────────────────────

function TitleSlide({ slide }: { slide: typeof STUB_SLIDES[0] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", padding: "14px 16px", background: "#09091A" }}>
      <div style={{ width: 20, height: 2, background: "#7C85FF", borderRadius: 1, marginBottom: 8 }} />
      <div style={{ fontSize: 11, fontWeight: 600, color: "#E8EEFF", lineHeight: 1.35, fontFamily: "'Outfit', sans-serif" }}>{slide.title}</div>
      <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
        {slide.bullets.map((b, i) => <div key={i} style={{ fontSize: 7.5, color: "#4B5680", lineHeight: 1.4 }}>{b}</div>)}
      </div>
    </div>
  );
}

function SectionHeaderSlide({ slide }: { slide: typeof STUB_SLIDES[0] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", background: "#080B14" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 9, fontWeight: 600, color: "#2E3A58", letterSpacing: "0.12em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, textTransform: "uppercase" }}>Section</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#C4CBEF", fontFamily: "'Outfit', sans-serif" }}>{slide.title}</div>
        <div style={{ width: 24, height: 1, background: "#38BDF8", margin: "8px auto 0", opacity: 0.6 }} />
      </div>
    </div>
  );
}

function BulletsSlide({ slide }: { slide: typeof STUB_SLIDES[0] }) {
  return (
    <div style={{ padding: "12px 14px", height: "100%", background: "#080B14", boxSizing: "border-box" }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: "#C4CBEF", marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{slide.title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {slide.bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#34D399", flexShrink: 0, marginTop: 3 }} />
            <span style={{ fontSize: 7.5, color: "#4B5680", lineHeight: 1.5 }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TwoColumnSlide({ slide }: { slide: typeof STUB_SLIDES[0] }) {
  return (
    <div style={{ height: "100%", background: "#080B14", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 14px 6px", borderBottom: "1px solid #181E33" }}>
        <span style={{ fontSize: 9, fontWeight: 600, color: "#C4CBEF", fontFamily: "'Outfit', sans-serif" }}>{slide.title}</span>
      </div>
      <div style={{ flex: 1, display: "flex" }}>
        {["Strengths", "Opportunities"].map((col, i) => (
          <div key={i} style={{ flex: 1, padding: "8px 10px", borderRight: i === 0 ? "1px solid #181E33" : "none" }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: "#2E3A58", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>{col}</div>
            <div style={{ fontSize: 7.5, color: "#4B5680", lineHeight: 1.55 }}>{slide.bullets[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSlide({ slide }: { slide: typeof STUB_SLIDES[0] }) {
  const vals = [42, 51, 68, 84];
  return (
    <div style={{ padding: "10px 14px", height: "100%", background: "#080B14", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: "#C4CBEF", marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>{slide.title}</div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 5, paddingBottom: 14, position: "relative" }}>
        {vals.map((v, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", borderRadius: "2px 2px 0 0", height: `${(v / 84) * 70}%`, background: `rgba(124,133,255,${0.4 + i * 0.18})` }} />
            <span style={{ fontSize: 7, color: "#2E3A58", fontFamily: "'JetBrains Mono', monospace" }}>{["Q1","Q2","Q3","Q4"][i]}</span>
          </div>
        ))}
        <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, height: 1, background: "#181E33" }} />
      </div>
    </div>
  );
}

function TableSlide({ slide }: { slide: typeof STUB_SLIDES[0] }) {
  return (
    <div style={{ padding: "10px 14px", height: "100%", background: "#080B14", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: "#C4CBEF", marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{slide.title}</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {slide.bullets.map((row, i) => {
          const [label, val] = row.split(": ");
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 7px", background: i % 2 === 0 ? "#0D1120" : "transparent", borderRadius: 2 }}>
              <span style={{ fontSize: 7.5, color: "#4B5680" }}>{label}</span>
              <span style={{ fontSize: 7.5, fontWeight: 600, color: "#C4CBEF", fontFamily: "'JetBrains Mono', monospace" }}>{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClosingSlide({ slide }: { slide: typeof STUB_SLIDES[0] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", padding: "14px", background: "#080B14", textAlign: "center" }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: "#C4CBEF", fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}>{slide.title}</div>
      {slide.bullets.map((b, i) => <div key={i} style={{ fontSize: 7.5, color: "#2E3A58", lineHeight: 1.8 }}>{b}</div>)}
    </div>
  );
}

const RENDERERS: Record<string, React.FC<{ slide: typeof STUB_SLIDES[0] }>> = {
  title_slide: TitleSlide, section_header: SectionHeaderSlide, bullets: BulletsSlide,
  two_column: TwoColumnSlide, chart: ChartSlide, table: TableSlide, closing: ClosingSlide, content: BulletsSlide,
};

// ── Slide thumbnail with hover overlay ────────────────────────────────────────

function SlideCard({ slide, index }: { slide: typeof STUB_SLIDES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Renderer = RENDERERS[slide.type] ?? BulletsSlide;
  const c = SLIDE_TYPE_COLORS[slide.type] ?? { bg: "#0F1014", text: "#6B7280", dot: "#6B7280" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ cursor: "none" }}
      >
        {/* Thumbnail */}
        <div style={{
          aspectRatio: "16/9", borderRadius: 6, overflow: "hidden",
          border: `1px solid ${hovered ? "#7C85FF44" : "#181E33"}`,
          position: "relative",
          transition: "border-color 0.2s",
        }}>
          <Renderer slide={slide} />

          {/* Hover overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(5, 7, 14, 0.82)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: 8, padding: 14,
                }}
              >
                <motion.div
                  initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
                  style={{ textAlign: "center" }}
                >
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#E8EEFF", fontFamily: "'Outfit', sans-serif", lineHeight: 1.3, marginBottom: 6 }}>
                    {slide.title}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.dot }} />
                    <span style={{ fontSize: 8.5, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
                      {slide.type.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                </motion.div>
                <motion.button
                  initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  style={{
                    padding: "5px 14px", fontSize: 9, fontWeight: 600, letterSpacing: "0.06em",
                    fontFamily: "'Outfit', sans-serif", background: "#7C85FF", color: "#07080F",
                    border: "none", borderRadius: 4, cursor: "none",
                  }}
                >
                  OPEN SLIDE
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Index badge */}
          <div style={{
            position: "absolute", bottom: 6, right: 7,
            fontSize: 9, fontWeight: 600, color: "#2E3A58",
            fontFamily: "'JetBrains Mono', monospace",
            opacity: hovered ? 0 : 1, transition: "opacity 0.15s",
          }}>
            {String(slide.index).padStart(2, "0")}
          </div>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 8px", background: c.bg, borderRadius: 3, flexShrink: 0 }}>
            <motion.div
              animate={{ scale: hovered ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
              style={{ width: 4, height: 4, borderRadius: "50%", background: c.dot }}
            />
            <span style={{ fontSize: 9, fontWeight: 600, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
              {slide.type.replace(/_/g, " ").toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: 11, color: "#4B5680", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {slide.title}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const title = (location.state as any)?.topic ?? "Enterprise Strategy Overview 2025";

  return (
    <div style={{ padding: "40px 44px", minHeight: "100%" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "none", color: "#2E3A58", fontSize: 11, marginBottom: 10, padding: 0, fontFamily: "'Inter', sans-serif" }}
            >
              <ArrowLeft size={12} />
              Back
            </motion.button>
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 600,
                letterSpacing: "-0.04em", margin: 0, lineHeight: 1.05,
                background: "linear-gradient(135deg, #E8EEFF 40%, #7C85FF)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              Slide Preview
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              style={{ fontSize: 13, color: "#4B5680", marginTop: 7 }}
            >
              {title} — {STUB_SLIDES.length} slides
            </motion.p>
          </div>
          <MagneticButton style={{
            display: "flex", alignItems: "center", gap: 7, padding: "10px 20px",
            fontSize: 12, fontWeight: 600, fontFamily: "'Outfit', sans-serif", letterSpacing: "0.04em",
            background: "#7C85FF", color: "#07080F", border: "none", borderRadius: 5, cursor: "none", marginTop: 26,
          }}>
            <Download size={13} />
            DOWNLOAD .PPTX
          </MagneticButton>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 40 }}>
          {STUB_SLIDES.map((slide, i) => (
            <SlideCard key={slide.index} slide={slide} index={i} />
          ))}
        </div>

        {/* Plan table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: "#0D1120", border: "1px solid #181E33", borderRadius: 8, overflow: "hidden" }}
        >
          <div style={{ padding: "12px 18px", borderBottom: "1px solid #181E33", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "#2E3A58", fontFamily: "'JetBrains Mono', monospace" }}>SLIDE PLAN</span>
            <span style={{ fontSize: 9, color: "#2E3A58", fontFamily: "'JetBrains Mono', monospace" }}>{STUB_SLIDES.length} SLIDES</span>
          </div>
          {STUB_SLIDES.map((slide, idx) => {
            const c = SLIDE_TYPE_COLORS[slide.type] ?? { dot: "#6B7280", text: "#6B7280", bg: "#0F1014" };
            return (
              <motion.div key={slide.index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + idx * 0.03, duration: 0.3, ease: "easeOut" }}
                whileHover={{ backgroundColor: "#111626" }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 18px", borderBottom: idx < STUB_SLIDES.length - 1 ? "1px solid #181E33" : "none", transition: "background 0.15s" }}
              >
                <span style={{ width: 24, fontSize: 10, color: "#2E3A58", fontFamily: "'JetBrains Mono', monospace", textAlign: "right", flexShrink: 0 }}>
                  {String(slide.index).padStart(2, "0")}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 8px", background: c.bg, borderRadius: 3, flexShrink: 0 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.dot }} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: c.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
                    {slide.type.replace(/_/g, " ").toUpperCase()}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "#8892B0", flex: 1 }}>{slide.title}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
