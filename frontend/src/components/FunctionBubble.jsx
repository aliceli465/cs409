import React, { useState, useRef } from "react";

const FunctionBubble = ({ functionName, explanation, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bubbleRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

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
        style={{ backgroundColor: color }}
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
