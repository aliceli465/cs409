import React, { useState, useRef } from "react";

const getRandomPastelColor = () => {
  const r = Math.floor(Math.random() * 128) + 127; // Light red (127-255)
  const g = Math.floor(Math.random() * 128) + 127; // Light green (127-255)
  const b = Math.floor(Math.random() * 128) + 127; // Light blue (127-255)
  return `rgb(${r}, ${g}, ${b})`;
};

const FunctionBubble = ({ functionName, explanation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bubbleRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const randomPastelColor = getRandomPastelColor();

  //get bubble width
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && bubbleRef.current) {
      const bubbleWidth = bubbleRef.current.getBoundingClientRect().width;
      setDropdownWidth(bubbleWidth);
    }
  };

  return (
    <div>
      <div
        className="function-bubble"
        onClick={toggleDropdown}
        ref={bubbleRef}
        style={{ backgroundColor: randomPastelColor }}
      >
        {functionName}
        {isOpen && (
          <div
            className={`dropdown ${isOpen ? "show" : ""}`}
            style={{
              width: `${dropdownWidth}px`,
              position: "relative",
              top: "100%",
              zIndex: 1,
            }}
          >
            <p style={{ whiteSpace: "pre-wrap" }}>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionBubble;
