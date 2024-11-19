'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { loginUser } from "../api";
import Navbar from "../components/Navbar";

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
      const response = await loginUser({ email, password });
      if (response.token) {
        Cookies.set("auth_token", response.token, { expires: 7, path: "/" });
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar hideAuth={true} />
      <div className="flex items-center justify-center flex-1">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md border border-gray-200">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-900">
            Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 
                  ${errors.email ? 'border-gray-900 ring-gray-900' : 'border-gray-200 focus:ring-gray-500'}`}
              />
              {errors.email && (
                <p className="text-sm mt-1 text-gray-700">
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2
                  ${errors.password ? 'border-gray-900 ring-gray-900' : 'border-gray-200 focus:ring-gray-500'}`}
              />
              {errors.password && (
                <p className="text-sm mt-1 text-gray-700">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className={`w-full py-2 px-4 rounded-lg text-white
                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 cursor-pointer'}`}
            >
              {isSubmitting ? "Logging In..." : "Login"}
            </button>
          </form>

          {serverError && (
            <p className="text-sm mt-4 text-center text-gray-700">
              {serverError}
            </p>
          )}

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-gray-900 hover:text-gray-700 underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
