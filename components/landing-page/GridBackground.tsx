"use client";
import { motion } from "framer-motion";

const GridBackground = () => {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      initial={{ backgroundPosition: "0px 0px" }}
      animate={{ backgroundPosition: ["0px 0px", "120px 120px"] }}
      transition={{
        duration: 10,
        ease: "linear",
        repeat: Infinity,
      }}
      style={{
        backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
                `,
        backgroundSize: "60px 60px",
        maskImage:
          "radial-gradient(circle at center, black 40%, transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(circle at center, black 40%, transparent 70%)",
      }}
    />
  );
};

export default GridBackground;
