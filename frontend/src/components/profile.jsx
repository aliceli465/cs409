import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
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

  if (!auth.currentUser ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="text-2xl font-bold pt-14">
      {userDetails ? (
        <>
          <p>Hello {userDetails.userName}, you are now logged in.</p>
          <button className="btn p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer" onClick={Logout}>
            Logout
          </button>
        </>
      ) : (
        <>
            <p>Hello Guest, you are now logged in.</p>
            <button className="btn p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer" onClick={Logout}>
            Logout
            </button>
      </>
      )}
    </div>
  );
};

export default Profile;
