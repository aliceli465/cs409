import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Editor from "@monaco-editor/react";
import FunctionBubble from "./FunctionBubble";
import DependencyGraph from "./dependencyGraph";

import "../App.css";

//sample format for openai calls for documentaiton
const functionNames = [
  "initApp",
  "handleClick",
  "fetchData",
  "processData",
  "renderUI",
];

const explanations = [
  "Initializes the application and sets up necessary states.",
  "Handles the click event by calling specific handlers.",
  "Fetches data from the API and updates the state with the response.",
  "Processes the fetched data and prepares it for rendering.",
  "Renders the UI by mapping over data and applying appropriate components.",
];

const feedback = Array(5).fill(
  `This function works as intended but could use better error handling. Consider refactoring to reduce cyclomatic complexity.`
);

//IMPORTANT
//COMBINE ALL THREE
//TO MAKE OPTIMIZATION TAB
const combinedArray = functionNames.map((functionName, index) => ({
  function: functionName,
  explanation: explanations[index],
  feedback: feedback[index],
}));

const HomeComponent = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(""); // State to store the code from the uploaded file
  const [results, setResults] = useState(false);
  const [activeTab, setActiveTab] = useState("documentation"); // Default to 'documentation' tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => handleTabClick("documentation")}
            >
              Documentation
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => handleTabClick("dependencyGraph")}
            >
              Dependency Graph
            </button>
            <button
              className="bg-pink-500 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              onClick={() => handleTabClick("optimization")}
            >
              Optimization
            </button>
          </div>

          {/* Content Box */}
          <div className="bg-white text-black w-fit min-h-[200px] rounded-lg shadow-md p-4 flex flex-col items-center justify-center space-y-4">
            {activeTab === "documentation" && (
              <>
                {functionNames.map((functionName, index) => (
                  <FunctionBubble
                    key={index}
                    functionName={functionName}
                    explanation={explanations[index]}
                    className="w-64"
                  />
                ))}
              </>
            )}

            {activeTab === "dependencyGraph" && (
              <div className="text-center">
                <DependencyGraph />
              </div>
            )}

            {activeTab === "optimization" && (
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                }}
              >
                <div
                  style={{
                    width: "40%",
                    padding: "1rem",
                    overflowY: "scroll",
                    marginRight: "50px",
                  }}
                >
                  {combinedArray.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "1rem",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <h2 className="font-bold">{item.function}</h2>
                      <ul>
                        <li>{item.feedback}</li>
                      </ul>
                    </div>
                  ))}
                </div>
                <Editor
                  height="100%"
                  width="850px"
                  defaultLanguage="c"
                  theme="vs-dark"
                  value={code}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
