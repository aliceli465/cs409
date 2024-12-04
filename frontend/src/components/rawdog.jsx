import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

const SimpleVscodeEditor = ({ code }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  //mount then dkeep reference to the editor
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#1E1E1E",
      }}
    >
      <Editor
        height="100%"
        defaultLanguage="plaintext"
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

export default SimpleVscodeEditor;
