import axios from "axios";
import Cookies from "js-cookie";  // Import js-cookie to manage cookies
import {useDispatch} from "react-redux";
import { loginSuccess, loginFailure,logout} from "@/slices/authSlice";

const api = axios.create({
  baseURL: `${ process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
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
export const loginUser = async (credentials,dispatch) => {
  
  try {
    const response = await api.post("/login", credentials);
  
    if (response.data.token) {

      dispatch(loginSuccess({
        token:response.data.token
      }));

    }

    return response.data;
  } catch (error) {
    dispatch(loginFailure(error.message));
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
export const logoutUser = (dispatch) => {
  dispatch(logout());
};

export default api;
