'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie
import { loginUser } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateInputs = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setIsSubmitting(true);

    try {
      // Call the loginUser function, assuming it returns a response containing a token
      const response = await loginUser({ email, password });
      
      // Check if the response contains a token and store it in the cookie
      if (response.token) {
        Cookies.set("auth_token", response.token, { expires: 7, path: "/" }); // Store token in a cookie with 7-day expiration
      }
      
      alert("Login successful!");
      router.push("/dashboard");
    } catch (err) {
      setServerError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(errors).length > 0}
            className={`w-full py-2 px-4 rounded-lg text-white ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"} focus:outline-none sm:py-3 sm:text-lg`}
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </button>
        </form>
        {serverError && (
          <p className="text-red-500 text-sm mt-4 text-center">{serverError}</p>
        )}
        <div className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
