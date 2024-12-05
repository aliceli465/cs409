import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Editor from "@monaco-editor/react";

import "../App.css";

const HomeComponent = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(""); // State to store the code from the uploaded file
  const [results, setResults] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".c")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
      setResults(true);
    } else {
      alert("Please upload a valid .c file!");
    }
  };

  const goProfile = () => {
    navigate("/profile"); // Navigate to the login page
  };

  return (
    <div className="App">
      <h1 className="greeting">Welcome!</h1>
      <img
        src="/profile.png"
        alt="Small"
        className="small-image"
        onClick={goProfile}
      />
      <div className="center-content">
        <label className="upload-button">
          Upload a file
          <input
            type="file"
            accept=".c"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </label>
      </div>
      <div className="mt-6 w-1/2 flex justify-center items-center mx-auto">
        <Editor
          height="800px"
          defaultLanguage="c"
          theme="vs-dark"
          value={code}
          onChange={(newCode) => setCode(newCode)} // Update code state as user edits
        />
      </div>

      {results && (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start py-8">
          {/* Title and Subtitle */}
          <h1 className="text-3xl font-bold mb-2">Results</h1>
          <p className="text-lg">Click each tab for more info</p>

          {/* Buttons */}
          <div className="flex space-x-4 mb-8">
            <button className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              Documentation
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              Dependency Graph
            </button>
            <button className="bg-pink-500 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              Optimization
            </button>
          </div>

          {/* Content Box */}
          <div className="bg-white text-black w-3/4 h-96 rounded-lg shadow-md p-4">
            <p className="text-lg text-gray-500">
              Select a tab to view content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
