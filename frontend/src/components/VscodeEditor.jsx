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

  const visitedColors = new Set();

  const getRandomColor = () => {
    if (visitedColors.size >= colorPool.length) {
      //reset colors if they have all been used
      console.warn("All colors have been used. Resetting color pool.");
      visitedColors.clear();
    }

    let randomColor;
    do {
      const randomIndex = Math.floor(Math.random() * colorPool.length);
      randomColor = colorPool[randomIndex];
    } while (visitedColors.has(randomColor));

    visitedColors.add(randomColor);
    return randomColor;
  };

  const extractFunctionRanges = (functionData, monaco) => {
    const decorations = [];
    const functionDetails = [];

    const existingStyles = document.querySelectorAll(
      ".function-highlight-style"
    );
    if (existingStyles) {
      existingStyles.forEach((style) => style.remove());
    }

    functionData.forEach((func, index) => {
      const color = getRandomColor();
      const className = `highlight-code-${index}`;

      var bounds = findFunctionBounds(
        code,
        extractFunctionName(func.func_signature)
      );
      console.log("The name: " + extractFunctionName(func.func_signature));
      console.log("The bounds: " + bounds.start + " and " + bounds.end);

      decorations.push({
        range: new monaco.Range(bounds.start, 1, bounds.end + 1, 1),
        options: {
          inlineClassName: className,
          isWholeLine: true,
        },
      });

      const styleTag = document.createElement("style");
      styleTag.className = "function-highlight-style";
      styleTag.innerHTML = `
        .${className} { background-color: ${color}; color: #000000 !important; }
      `;
      document.head.appendChild(styleTag);

      functionDetails.push({
        name: func.func_signature,
        src: func.func_body_wo_brackets,
        color: color,
      });
    });

    return { decorations, functionDetails };
  };

  const highlightCode = (editor, monaco, functionData) => {
    const model = editor.getModel();

    editor.deltaDecorations([], []);

    const { decorations, functionDetails } = extractFunctionRanges(
      functionData,
      monaco
    );
    decorations.forEach((decoration) => {
      editor.deltaDecorations([], [decoration]);
    });

    onFunctionDetailsChange(functionDetails);
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      highlightCode(editorRef.current, monacoRef.current, functionData);
    }
  }, [code, functionData]);

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
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

//more weays to extarct functions from c file, tentative for now. don't necessarily need to keep highlgiht funcitonality

function findFunctionBounds(code, functionName) {
  const lines = code.split("\n");

  const pattern = new RegExp(`\\b${functionName}\\s*\\([^)]*\\)\\s*\\{`);

  let startLine = null;
  let endLine = null;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (startLine === null && pattern.test(line)) {
      startLine = i + 1;
      braceCount =
        (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
    } else if (startLine !== null) {
      braceCount += (line.match(/\{/g) || []).length;
      braceCount -= (line.match(/\}/g) || []).length;

      if (braceCount === 0) {
        endLine = i + 1;
        break;
      }
    }
  }

  if (startLine !== null && endLine !== null) {
    return {
      start: startLine,
      end: endLine,
    };
  }

  return null;
}

function extractFunctionName(signature) {
  const regex = /(?:[^\s*]*\s+)*([^\s(*]+)\s*\(/;
  const match = signature.match(regex);
  return match ? match[1] : null;
}

export default VscodeEditor;
