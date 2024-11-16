import axios from "axios";
import Cookies from "js-cookie";  // Import js-cookie to manage cookies

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to register user.";
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    
    // If login is successful, store the token in the cookie
    if (response.data.token) {
      Cookies.set("auth_token", response.data.token, { expires: 7, path: "/" }); // Store token for 7 days
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed.";
  }
};

// Fetch User Profile
export const fetchUserProfile = async () => {
  try {
    // Retrieve the token from the cookie
    const token = Cookies.get("auth_token");

    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await api.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch user profile.";
  }
};

// Optionally: You can also create a function to handle token removal (logout)
export const logoutUser = () => {
  Cookies.remove("auth_token"); // Remove the token when the user logs out
};

export default api;
