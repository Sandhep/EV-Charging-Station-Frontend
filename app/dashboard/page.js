'use client';

import { useEffect, useState } from "react";
import { fetchUserProfile } from "../api"; // Import the API function to fetch user profile
import Cookies from "js-cookie"; // Import js-cookie for cookie handling
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

  // Logout functionality using js-cookie
  const handleLogout = () => {
    Cookies.remove("auth_token"); // Remove the auth token cookie
    router.push("/login"); // Redirect the user to the login page
  };

  // Show loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error message if there was an issue with fetching data
  if (error) {
    return <div>{error}</div>;
  }

  // Render the user profile data and logout button
  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      {userData ? (
        <div>
          <h2>User Profile</h2>
          <p><strong>Name:</strong> {userData.Name}</p>
          <p><strong>Email:</strong> {userData.Email}</p>
          {/* Add more user data fields as needed */}
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}
