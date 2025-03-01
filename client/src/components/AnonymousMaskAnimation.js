import React, { useState, useEffect } from "react";

const AnonymousMaskAnimation = ({ isTalking }) => {
  const [mouthFrame, setMouthFrame] = useState(0);

  // Animation effect when isTalking changes
  useEffect(() => {
    let animationFrame;
    let frameCount = 0;

    const animateMouth = () => {
      if (isTalking) {
        // Cycle through 4 different mouth positions when talking
        frameCount = (frameCount + 1) % 16;
        setMouthFrame(Math.floor(frameCount / 4));
        animationFrame = requestAnimationFrame(animateMouth);
      } else {
        // Reset to closed mouth when not talking
        setMouthFrame(0);
      }
    };

    if (isTalking) {
      animationFrame = requestAnimationFrame(animateMouth);
    } else {
      setMouthFrame(0);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isTalking]);

  // SVG paths for different mouth positions
  const mouthPaths = [
    "M85 105 H115", // Closed mouth
    "M85 103 Q100 110 115 103", // Slightly open
    "M85 102 Q100 115 115 102", // Medium open
    "M85 100 Q100 120 115 100", // Widely open
  ];

  return (
    <div
      className="mask-container"
      style={{
        width: "150px",
        height: "150px",
        margin: "0 auto",
        opacity: "0.8",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          backgroundColor: "transparent",
          filter: "drop-shadow(0 0 5px rgba(0, 255, 0, 0.3))",
        }}
      >
        {/* Face mask */}
        <path
          d="M60 60 Q100 40 140 60 L155 140 Q100 170 45 140 Z"
          fill="black"
          stroke="#0f0"
          strokeWidth="2"
        />

        {/* Eyes */}
        <path
          d="M70 85 Q80 75 90 85 Q80 95 70 85"
          fill="#0f0"
          stroke="#0f0"
          strokeWidth="1"
        />
        <path
          d="M110 85 Q120 75 130 85 Q120 95 110 85"
          fill="#0f0"
          stroke="#0f0"
          strokeWidth="1"
        />

        {/* Eyebrows */}
        <path
          d="M65 75 Q80 65 95 75"
          fill="none"
          stroke="#0f0"
          strokeWidth="2"
        />
        <path
          d="M105 75 Q120 65 135 75"
          fill="none"
          stroke="#0f0"
          strokeWidth="2"
        />

        {/* Mouth - animated */}
        <path
          d={mouthPaths[mouthFrame]}
          fill="none"
          stroke="#0f0"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Additional face details - circuit-like patterns */}
        <path
          d="M60 110 L50 115 L55 125"
          fill="none"
          stroke="#0f0"
          strokeWidth="1"
        />
        <path
          d="M140 110 L150 115 L145 125"
          fill="none"
          stroke="#0f0"
          strokeWidth="1"
        />
        <path
          d="M100 130 L100 140 L110 145"
          fill="none"
          stroke="#0f0"
          strokeWidth="1"
        />
        <path d="M80 140 L70 145" fill="none" stroke="#0f0" strokeWidth="1" />
        <path d="M120 140 L130 145" fill="none" stroke="#0f0" strokeWidth="1" />

        {/* Small dots/nodes */}
        <circle cx="50" cy="115" r="2" fill="#0f0" />
        <circle cx="55" cy="125" r="2" fill="#0f0" />
        <circle cx="150" cy="115" r="2" fill="#0f0" />
        <circle cx="145" cy="125" r="2" fill="#0f0" />
        <circle cx="110" cy="145" r="2" fill="#0f0" />
        <circle cx="70" cy="145" r="2" fill="#0f0" />
        <circle cx="130" cy="145" r="2" fill="#0f0" />
      </svg>
    </div>
  );
};

export default AnonymousMaskAnimation;
