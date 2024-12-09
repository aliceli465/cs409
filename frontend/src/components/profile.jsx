import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opHistory, setOpHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails) {
      //may not have fully loaded, if not fully loaded, don't do tanythign
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://cs409-express.vercel.app/api/users/${userDetails.email}`
        );
        const data = await response.json();
        console.log("response from /get", data);
        if (data.optimizationHistory) {
          setOpHistory(data.optimizationHistory);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [userDetails]);

  const goBack = () => {
    navigate("/home");
  };

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser; // Use auth.currentUser directly
      if (user) {
        const docRef = doc(db, "Users", user.uid); // Fetch user data from Firestore
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          console.log("User data:", docSnap.data());
        } else {
          console.log("No user data found in Firestore");
        }
      } else {
        console.log("No user is currently logged in");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  async function Logout() {
    try {
      await auth.signOut();
      console.log("User logged out successfully!");
      window.location.href = "/login"; // Redirect to login
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  if (!auth.currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-2xl font-bold pt-14">
      {userDetails ? (
        <>
          <div className="absolute top-0 text-center left-[2vmin]">
            <button onClick={goBack}>← Upload a file</button>
          </div>
          <div className="flex flex-col items-center justify-center bg-black text-white">
            <p className="profileinfo">
              Hello {userDetails.userName} <br />
            </p>
            <div className="profileinfo2">
              <p>
                <strong>email: </strong> {userDetails.email}
              </p>
              <button
                className="btn p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                onClick={Logout}
              >
                Logout
              </button>
            </div>
            <h1>Upload History</h1>

            <div className="parent-container">
              <div className="text-box-container">
                {opHistory.map((historyItem, index) => (
                  <div key={index} className="text-box">
                    {historyItem.fileName}
                  </div>
                ))}
              </div>
              <div className="text-box-container2">
                {opHistory.map((historyItem, index) => (
                  <div key={index} className="text-box2">
                    {new Date(historyItem.date).toLocaleDateString()}{" "}
                  </div>
                ))}
              </div>
              <div className="text-box-container2">
                {opHistory.map((historyItem, index) => (
                  <div key={index} className="text-box2">
                    Score: {historyItem.score}/100
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>Hello Guest, you are now logged in.</p>
          <button
            className="btn p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            onClick={Logout}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
