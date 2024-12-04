import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import MouseTracker from "./MouseTracker";

const VscodeEditor = ({ code, onFunctionDetailsChange, functionData }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // This function is called when the editor mounts
  const handleEditorDidMount = (editor, monaco, functionData) => {
    editorRef.current = editor; // Keep a reference to the editor
    monacoRef.current = monaco; // Keep a reference to monaco
    //highlightCode(editor, monaco); // Highlight the code initially
    console.log("function data is: ");
    console.log(functionData);
  };

  const colorPool = [
    "#FFE3D0", // light peach
    "#FFCCCC", // light coral
    "#FFD9C1", // light apricot
    "#FFB3C1", // light rose
    "#E5B2B2", // light muted red
    "#BFB0DB", // light violet
    "#99D5D6", // teal
    "#A4E1E0", // soft turquoise
    "#C6B6A6", // light brown
    "#F3E3B6", // light beige
    "#FFF3A6", // light lemon
    "#A56BDB", // light violet
    "#E7B2C2", // light mauve
    "#F7EBF9", // lavender
    "#FFB3A1", // light salmon
    "#AFA3D9", // light purple
    "#D7E9E7", // pale teal
    "#F7E6E6", // soft pink
    "#B7D8E5", // light blue
    "#B37777", // light maroon
    "#FFE7D3", // light orange
  ];

  // Set to keep track of visited colors
  const visitedColors = new Set();

  // Function to get a random color from the color pool that hasn't been used
  const getRandomColor = () => {
    if (visitedColors.size >= colorPool.length) {
      // If all colors have been used, you might want to reset or handle it
      console.warn("All colors have been used. Resetting color pool.");
      visitedColors.clear(); // Reset the visited set if all colors are used
    }

    let randomColor;
    do {
      const randomIndex = Math.floor(Math.random() * colorPool.length);
      randomColor = colorPool[randomIndex];
    } while (visitedColors.has(randomColor)); // Ensure the color hasn't been used

    // Mark the color as visited
    visitedColors.add(randomColor);
    return randomColor;
  };

  const extractFunctionRanges = (functionData, monaco) => {
    const decorations = [];
    const functionDetails = []; // Array to hold function details

    // Remove existing styles for previous highlights
    const existingStyles = document.querySelectorAll(
      ".function-highlight-style"
    );
    if (existingStyles) {
      existingStyles.forEach((style) => style.remove());
    }

    // Iterate over functionData to create decorations
    functionData.forEach((func, index) => {
      const color = getRandomColor(); // Get a random color for this function
      const className = `highlight-code-${index}`; // Unique class for this function

      var bounds = findFunctionBounds(code, extractFunctionName(func.func_signature))
      console.log("The name: " + extractFunctionName(func.func_signature))
      console.log("The bounds: " + bounds.start + " and " + bounds.end)

      // Create the decoration for the function
      decorations.push({
        range: new monaco.Range(
          bounds.start,
          1,
          bounds.end + 1,
          1
        ),
        options: {
          inlineClassName: className, // Apply a unique class for this function
          isWholeLine: true,
        },
      });

      // Add a dynamic style for function highlighting
      const styleTag = document.createElement("style");
      styleTag.className = "function-highlight-style"; // To identify these styles later
      styleTag.innerHTML = `
        .${className} { background-color: ${color}; color: #000000 !important; }
      `;
      document.head.appendChild(styleTag);

      // Push the function details into the array
      functionDetails.push({
        name: func.func_signature, // Extract function name from signature
        src: func.func_body_wo_brackets, // Assuming this is the source code without brackets
        color: color,
      });
    });

    return { decorations, functionDetails }; // Return both decorations and function details
  };

  // Function to apply highlights and return function details
  const highlightCode = (editor, monaco, functionData) => {
    const model = editor.getModel(); // Get the model from the editor

    // Clear existing decorations
    editor.deltaDecorations([], []);

    // Extract function ranges and apply highlights
    const { decorations, functionDetails } = extractFunctionRanges(
      functionData,
      monaco
    );
    decorations.forEach((decoration) => {
      // Add the decoration for the function
      editor.deltaDecorations([], [decoration]);
    });

    onFunctionDetailsChange(functionDetails);
  };

  useEffect(() => {
    // Apply highlights whenever code changes
    if (editorRef.current && monacoRef.current) {
      highlightCode(editorRef.current, monacoRef.current, functionData);
    }
  }, [code, functionData]); // Listen to changes in code

  return (
    <div style={{ height: "90vh", width: "100%", backgroundColor: "#1E1E1E" }}>
      <Editor
        height="100%"
        defaultLanguage="c"
        value={code}
        theme="vs-dark"
        options={{
          readOnly: true,
          fontFamily: "Fira Code, monospace",
          fontSize: 14,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          lineNumbers: "on",
        }}
        onMount={handleEditorDidMount} // Mount the editor and pass references
      />
    </div>
  );
};

function findFunctionBounds(code, functionName) {
    // Split the code into an array of lines
    const lines = code.split('\n');

    // Regex pattern to match the function signature
    const pattern = new RegExp(`\\b${functionName}\\s*\\([^)]*\\)\\s*\\{`);

    let startLine = null;
    let endLine = null;
    let braceCount = 0;

    // Iterate over each line to find the start and end lines
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if the line contains the function declaration
        if (startLine === null && pattern.test(line)) {
            startLine = i + 1;  // Line numbers are 1-based, so add 1
            braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
        } else if (startLine !== null) {
            // If we've already found the function start, track braces
            braceCount += (line.match(/\{/g) || []).length;
            braceCount -= (line.match(/\}/g) || []).length;

            // If brace count reaches 0, we've found the end of the function
            if (braceCount === 0) {
                endLine = i + 1;  // Line numbers are 1-based, so add 1
                break;
            }
        }
    }

    // If the function is found, return the start and end line numbers
    if (startLine !== null && endLine !== null) {
        return {
            start: startLine,
            end: endLine
        };
    }

    return null;  // Function not found
}

function extractFunctionName(signature) {
    // Regular expression to match the function name, ignoring pointer symbols
    const regex = /(?:[^\s*]*\s+)*([^\s(*]+)\s*\(/; // Matches return type and captures the function name without pointer symbols
    const match = signature.match(regex);
    return match ? match[1] : null; // Return the function name or null if not found
}

export default VscodeEditor;
