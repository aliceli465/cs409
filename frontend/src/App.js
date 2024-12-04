import React, { useState } from "react";
import "./App.css";

function App() {
  var na = "";
  const [showScreen, setShowScreen] = useState(false);

  const handleImageClick = () => {
    setShowScreen(true);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Uploaded file:", file.name);
      na = file.name;
    }
  };

  if (showScreen) {
    return (
      <div className="new-screen">
        <h1 className="greeting2">Past Uploads</h1>
        <img src="assets/icon.jpg" alt="sm" className="small-image2" />

        <p className="profileinfo">
          Alice Li <br />{" "}
        </p>
        <p className="profileinfo2">
          <strong>username:</strong> alice_li409 <br />
          <strong>email: </strong> alice_li409@illinois.edu
        </p>
        <div className="parent-container">
          <div className="text-box-container">
            <div className="text-box">file1.c</div>
            <div className="text-box">file2.c</div>
            <div className="text-box">file3.c</div>
            <div className="text-box">file4.c</div>
          </div>
          <div className="text-box-container2">
            <div className="text-box2">Score: 1/10</div>
            <div className="text-box2">Score: 5/10</div>
            <div className="text-box2">Score: 7/10</div>
            <div className="text-box2">Score: 2/10</div>
          </div>
        </div>

        <button onClick={() => setShowScreen(false)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1 className="greeting">Hello, xyz!</h1>
      <img
        src="/images/small-image.jpg"
        alt="Small"
        className="small-image"
        onClick={handleImageClick}
      />
      <div className="center-content">
        <label className="upload-button">
          Upload Files
          <input type="file" onChange={handleFileUpload} />
        </label>
      </div>
      <div className="image-container">
        <img
          src="/images/large-image.jpg"
          alt="Large"
          className="large-image"
        />
      </div>
    </div>
  );
}

export default App;
