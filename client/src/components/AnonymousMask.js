import React, { useState, useEffect } from "react";

const AnonymousMask = ({ isTalking }) => {
  const [mouthPosition, setMouthPosition] = useState(0);

  // Mouth animation when talking
  useEffect(() => {
    if (!isTalking) {
      setMouthPosition(0);
      return;
    }

    let animationFrame;
    let counter = 0;

    const animateMouth = () => {
      counter += 0.1;
      // Sine wave for natural mouth movement
      const newPosition = Math.sin(counter) * 3;
      setMouthPosition(newPosition);
      animationFrame = requestAnimationFrame(animateMouth);
    };

    animationFrame = requestAnimationFrame(animateMouth);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isTalking]);

  return (
    <div className="mask-container w-24 h-24 mx-auto mb-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* Face - black fill with green stroke for terminal aesthetic */}
        <path
          d="M50,10 C25,10 15,30 15,50 C15,75 30,90 50,90 C70,90 85,75 85,50 C85,30 75,10 50,10 Z"
          fill="black"
          stroke="#00FF00"
          strokeWidth="1.5"
        />

        {/* Eyes */}
        <ellipse cx="35" cy="40" rx="7" ry="9" fill="#00FF00" />
        <ellipse cx="65" cy="40" rx="7" ry="9" fill="#00FF00" />

        {/* Eyebrows */}
        <path
          d="M25,35 L42,31"
          stroke="#00FF00"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M58,31 L75,35"
          stroke="#00FF00"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Nose */}
        <path d="M50,45 L45,55 L55,55 Z" fill="#00FF00" />

        {/* Mouth - will be animated */}
        <path
          d={`M35,${65 + mouthPosition} C42,${70 - mouthPosition} 58,${
            70 - mouthPosition
          } 65,${65 + mouthPosition}`}
          stroke="#00FF00"
          strokeWidth="2"
          fill="none"
        />

        {/* Anonymous mask details */}
        <path
          d="M30,75 Q50,85 70,75"
          stroke="#00FF00"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M25,22 Q50,10 75,22"
          stroke="#00FF00"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M20,40 L15,35 L20,30"
          stroke="#00FF00"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M80,40 L85,35 L80,30"
          stroke="#00FF00"
          strokeWidth="1"
          fill="none"
        />

        {/* Glitch effect lines */}
        <line
          x1="20"
          y1="15"
          x2="25"
          y2="15"
          stroke="#00FF00"
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="70"
          y1="15"
          x2="80"
          y2="15"
          stroke="#00FF00"
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="30"
          y1="85"
          x2="40"
          y2="85"
          stroke="#00FF00"
          strokeWidth="1"
          opacity="0.7"
        />
        <line
          x1="60"
          y1="85"
          x2="70"
          y2="85"
          stroke="#00FF00"
          strokeWidth="1"
          opacity="0.7"
        />
      </svg>
    </div>
  );
};

export default AnonymousMask;
