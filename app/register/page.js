'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../api";
import Navbar from "../components/Navbar";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateInputs = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    try {
      const userData = { name, email, phoneNumber, password };
      await registerUser(userData); // API call
      alert("Account created successfully!");
      router.push("/login");
    } catch (error) {
      setErrors({ api: error.message }); // Handle API errors
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar hideAuth={true} />
      <div className="flex items-center justify-center flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md border border-gray-200">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-gray-900 mb-6 text-center">
            Create Your Account
          </h1>
          <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-6">
            {errors.api && (
              <p className="text-gray-700 text-sm text-center">{errors.api}</p>
            )}
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 
                  ${errors.name ? 'border-gray-900 ring-gray-900' : 'border-gray-200 focus:ring-gray-500'}`}
              />
              {errors.name && (
                <p className="text-gray-700 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
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
                <p className="text-gray-700 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            {/* Phone Number Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 
                  ${errors.phoneNumber ? 'border-gray-900 ring-gray-900' : 'border-gray-200 focus:ring-gray-500'}`}
              />
              {errors.phoneNumber && (
                <p className="text-gray-700 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>
            {/* Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 
                  ${errors.password ? 'border-gray-900 ring-gray-900' : 'border-gray-200 focus:ring-gray-500'}`}
              />
              {errors.password && (
                <p className="text-gray-700 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            {/* Confirm Password Input */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 sm:px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 
                  ${errors.confirmPassword ? 'border-gray-900 ring-gray-900' : 'border-gray-200 focus:ring-gray-500'}`}
              />
              {errors.confirmPassword && (
                <p className="text-gray-700 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 rounded-lg text-white ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-gray-800 focus:ring-2 focus:ring-gray-500"
              } focus:outline-none sm:py-3 sm:text-lg`}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-gray-900 hover:text-gray-700 hover:underline">
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
