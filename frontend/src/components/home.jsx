import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Editor from "@monaco-editor/react";

import "../App.css";

const HomeComponent = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(""); // State to store the code from the uploaded file

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".c")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
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
    </div>
  );
};

export default HomeComponent;
