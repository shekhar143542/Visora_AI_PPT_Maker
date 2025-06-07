import React from 'react'

const StrokeEarth = () => {
  return (
    <svg
      width="240"
      height="280"  // increased height to accommodate text below circle
      viewBox="0 0 240 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-vivid" // vivid color set in Tailwind CSS or your global styles
    >
      {/* Outer dashed circle with subtle white-blue glow */}
      <circle
        cx="120"
        cy="120"
        r="100"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="8 8"
        opacity="0.7"
        filter="drop-shadow(0 0 8px rgba(100, 150, 255, 0.6))"
      />

      {/* Smooth flowing inner paths with soft glow */}
      <path
        d="M120 30 C95 75, 145 75, 120 120
           C95 165, 145 165, 120 210"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        opacity="0.5"
        filter="drop-shadow(0 0 4px rgba(100, 150, 255, 0.4))"
      />
      <path
        d="M50 120 C85 105, 155 135, 190 120"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        opacity="0.5"
        filter="drop-shadow(0 0 4px rgba(100, 150, 255, 0.4))"
      />

      {/* Central circle with stronger glow */}
      <circle
        cx="120"
        cy="120"
        r="8"
        fill="currentColor"
        style={{
          filter: 'drop-shadow(0 0 12px currentColor)',
        }}
      />

      {/* Text below the circle */}
      <text
        x="120"
        y="260"  // comfortably below circle (circle bottom is at y=220)
        textAnchor="middle"
        fill="currentColor"
        fontSize="18"
        fontWeight="700"
        opacity="0.85"
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          letterSpacing: '0.1em',
          textShadow: '0 0 6px rgba(100, 150, 255, 0.7)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        No Projects Yet
      </text>
    </svg>
  )
}

export default StrokeEarth
