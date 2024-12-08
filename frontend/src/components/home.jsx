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
  const [names, setNames] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);

  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  //will call hebe's upload-c-file route
  //and then call all openai routes
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".c")) {
      const formData = new FormData();
      formData.append("file", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
      setResults(true);

      //loading!!!!!
      setLoading(true);

      //call to routes
      try {
        const response = await fetch("http://127.0.0.1:5000/upload-c-file", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData.error);
          alert("Failed to upload file: " + errorData.error);
          setLoading(false);
          return;
        } else {
          //SUCCESS!
          const data = await response.json();
          console.log("Response from backend:", data);
          const funcNames = data.Functions.map((func) => func.Header);
          setNames(funcNames);

          //make call to /get-summaries
          const summariesResponse = await fetch(
            "http://127.0.0.1:5000/get-summaries",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          if (!summariesResponse.ok) {
            const errorData = await summariesResponse.json();
            console.error("Error fetching summaries:", errorData.error);
            alert("Failed to fetch summaries: " + errorData.error);
            setLoading(false);
            return;
          }

          const summariesData = await summariesResponse.json();
          setSummaries(summariesData.summaries);
          console.log("Response from /get-summaries:", summariesData.summaries);

          //make call to /get-feedback
          const feedbackResponse = await fetch(
            "http://127.0.0.1:5000/get-feedback",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          if (!feedbackResponse.ok) {
            const errorData = await feedbackResponse.json();
            console.error("Error fetching feedback:", errorData.error);
            alert("Failed to fetch feedback: " + errorData.error);
            setLoading(false);
            return;
          }

          const feedbackData = await feedbackResponse.json();
          setFeedbacks(feedbackData.feedbacks);
          console.log("Response from /get-feedback:", feedbackData.feedbacks);

          //success, show results now by seting loading to FALSE
          setLoading(false);
          scrollToResults();
        }
      } catch (error) {
        console.error("Error while uploading file:", error);
      }
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

      {loading && (
        <div className="loading-screen">
          <p className="loading-text">Loading...</p>
        </div>
      )}

      <div className="mt-6 w-1/2 flex justify-center items-center mx-auto">
        <Editor
          height="800px"
          defaultLanguage="c"
          theme="vs-dark"
          value={code}
          onChange={(newCode) => setCode(newCode)} // Update code state as user edits
        />
      </div>

      {/*RESULTS PAGE*/}
      <div ref={resultsRef}>
        {results && !loading && (
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
                  {names.map((functionName, index) => (
                    <FunctionBubble
                      key={index}
                      functionName={functionName}
                      explanation={summaries[index]}
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
    </div>
  );
};

export default HomeComponent;
