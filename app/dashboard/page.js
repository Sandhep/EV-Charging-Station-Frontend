'use client';

import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api"; // Import the API function to fetch user profile
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(""); // State to track any error
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("auth_token"); // Get the token from cookies

        if (!token) {
          router.push("/login"); // Redirect to login if no token is found
          return;
        }

        // Fetch user profile data
        const data = await fetchUserProfile(token); // Pass token if required by the API
        setUserData(data); // Set the user data to state
      } catch (err) {
        setError("Failed to fetch user data."); // Handle errors
        console.error("Error fetching user data:", err); // Log the error for debugging
      } finally {
        setLoading(false); // Set loading to false once the request is complete
      }
    };

    fetchProfile(); // Call the function to fetch user data
  }, [router]); // Re-run the effect when router changes

  // Show loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if there was an issue with fetching data
  if (error) {
    return <div>{error}</div>;
  }

  // Render the user profile data if available
  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      {userData ? (
        <div>
          <h2>User Profile</h2>
          <p><strong>Name:</strong> {userData.Name}</p>
          <p><strong>Email:</strong> {userData.Email}</p>
          {/* Add more user data fields as needed */}
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}
