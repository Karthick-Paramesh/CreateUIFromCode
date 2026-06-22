import { useRef, useState } from "react";
import { motion } from "motion/react";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  intensity?: number;
}

export function TiltCard({ children, style, intensity = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - 0.5) * -intensity, y: (px - 0.5) * intensity });
    setGlow({ x: px * 100, y: py * 100, opacity: 0.06 });
  }

  function handleLeave() {
    setTilt({ x: 0, y: 0 });
    setGlow((g) => ({ ...g, opacity: 0 }));
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ ...style, transformStyle: "preserve-3d", perspective: 800, position: "relative" }}
    >
      {/* Glare */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 1,
        background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(124,133,255,${glow.opacity}), transparent 60%)`,
        transition: "background 0.15s",
      }} />
      {children}
    </motion.div>
  );
}
