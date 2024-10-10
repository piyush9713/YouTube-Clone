import React from "react";

const DotSpinner = () => {
  const spinnerStyle = {
    "--uib-size": "1.1rem", // Spinner size
    "--uib-speed": ".9s",
    "--uib-color": "#ffff",
    position: "relative",
    display: "inline-block",
    height: "var(--uib-size)",
    width: "var(--uib-size)",
    padding: "0.5rem", // Add padding to avoid cutting
    overflow: "visible", // Ensure dots aren't cut off
  };

  const dotStyle = {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "start", // Center the dots
  };

  const beforeStyle = {
    content: '""',
    display: "block",
    height: "20%", // Dot size
    width: "20%",
    borderRadius: "50%",
    backgroundColor: "var(--uib-color)",
    transform: "scale(0)",
    opacity: 0.5,
    animation: "pulse0112 calc(var(--uib-speed) * 1.111) ease-in-out infinite",
    boxShadow: "0 0 20px rgba(18, 31, 53, 0.3)",
  };

  const keyframes = `
    @keyframes pulse0112 {
      0%, 100% {
        transform: scale(0);
        opacity: 0.5;
      }
      50% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;

  const dotSpinnerDots = Array.from({ length: 8 }, (_, i) => {
    const rotation = 45 * i;
    const animationDelay = `calc(var(--uib-speed) * -${0.125 * (8 - i)})`;

    return (
      <div
        key={i}
        className="dot-spinner__dot"
        style={{ ...dotStyle, transform: `rotate(${rotation}deg)` }}>
        <span style={{ ...beforeStyle, animationDelay }}></span>
      </div>
    );
  });

  return (
    <>
      <style>{keyframes}</style>
      <div className="dot-spinner" style={spinnerStyle}>
        {dotSpinnerDots}
      </div>
    </>
  );
};

export default DotSpinner;
