import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "motion/react";

export function Cursor() {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const mouseX = useSpring(0, { stiffness: 500, damping: 40 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 40 });
  const followerX = useSpring(0, { stiffness: 120, damping: 22 });
  const followerY = useSpring(0, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      followerX.set(e.clientX);
      followerY.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovered(!!el.closest("button, a, input, select, textarea, [data-cursor-hover]"));
    };
    const down = () => setClicked(true);
    const up = () => setClicked(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <motion.div
        style={{
          x: mouseX, y: mouseY,
          position: "fixed", top: 0, left: 0, zIndex: 9999,
          width: 4, height: 4, borderRadius: "50%",
          background: "#7C85FF", pointerEvents: "none",
          translate: "-50% -50%",
        }}
        animate={{ scale: clicked ? 0.5 : 1 }}
        transition={{ duration: 0.1 }}
      />
      {/* Follower ring */}
      <motion.div
        style={{
          x: followerX, y: followerY,
          position: "fixed", top: 0, left: 0, zIndex: 9998,
          pointerEvents: "none",
          translate: "-50% -50%",
        }}
        animate={{
          width: hovered ? 36 : 24,
          height: hovered ? 36 : 24,
          opacity: hovered ? 1 : 0.4,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%",
          border: "1px solid rgba(124, 133, 255, 0.6)",
          background: hovered ? "rgba(124, 133, 255, 0.08)" : "transparent",
          transition: "background 0.2s",
        }} />
      </motion.div>
    </>
  );
}
