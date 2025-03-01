import React, { useEffect, useRef } from "react";

const MatrixCodeRain = ({ width = "100%", height = "100px" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (typeof width === "string" && width.includes("%")) {
        canvas.width = canvas.parentElement.clientWidth;
      } else {
        canvas.width = parseInt(width, 10);
      }

      if (typeof height === "string" && height.includes("%")) {
        canvas.height = canvas.parentElement.clientHeight;
      } else {
        canvas.height = parseInt(height, 10);
      }
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Matrix code characters
    const chars =
      "01010101アイウエオカキクケコサシスセソタチツテトナニヌネノ10100110".split(
        ""
      );

    // Setup columns
    const fontSize = 10;
    const columns = canvas.width / fontSize;

    // Array to track drops
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor((Math.random() * canvas.height) / fontSize);
    }

    // Drawing function
    const draw = () => {
      // Black with alpha for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text color and font
      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const text = chars[Math.floor(Math.random() * chars.length)];

        // Draw character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Make some drops faster for variation
        const speed = Math.random() > 0.95 ? 2 : 1;

        // Increment y coordinate for drop
        drops[i] += speed;

        // Reset drop to top when it reaches bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }

        // Randomly brighten some characters
        if (Math.random() > 0.95) {
          ctx.fillStyle = "#AFA";
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          ctx.fillStyle = "#0F0";
        }
      }
    };

    // Animation loop
    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-code border border-green-500"
      style={{
        width: width,
        height: height,
        opacity: 0.7,
        position: "relative",
        zIndex: 0,
      }}
    />
  );
};

export default MatrixCodeRain;
