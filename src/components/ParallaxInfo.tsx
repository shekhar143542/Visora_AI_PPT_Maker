
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ParallaxInfo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  const infoItems = [
    "AI-Powered Presentations",
    "Mind-Style Animations",
    "Integrated Art Generation",
    "Instant Creation",
    "Professional Templates",
    "Smart Content Organization"
  ];

  return (
    <div ref={ref} className="relative h-32 overflow-hidden bg-black/20 border-y border-orange-400/10">
      <motion.div
        style={{ x }}
        className="flex items-center h-full whitespace-nowrap"
      >
        {[...Array(3)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex items-center">
            {infoItems.map((item, index) => (
              <div key={`${groupIndex}-${index}`} className="flex items-center mx-8">
                <div className="w-2 h-2 bg-orange-400/30 rounded-full mr-4"></div>
                <span className="text-gray-300 text-lg font-medium">{item}</span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
