"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api.js";
import { Menu, X, Zap, User, LogOut } from "lucide-react";

export default function Navbar({ onLogout }) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const userDropdownRef = useRef(null);

  const isAuthenticated = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const toggleUserDropdown = useCallback(() => {
    setIsUserDropdownOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setIsMounted(true); // Ensure the component is mounted
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-200 relative">
      <div className="flex items-center flex-grow">
        <Link className="flex items-center justify-center" href="/home">
          <Zap className="h-6 w-6" aria-hidden="true" />
          <span className="ml-2 text-2xl font-bold text-gray-900">EV Charge</span>
        </Link>

        {!isAuthenticated && (
          <nav className="hidden lg:flex items-center ml-8 space-x-6">
            <Link
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
              href="/home#features"
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
              href="/stationpage"
            >
              Find Stations
            </Link>
            <Link
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
              href="#"
            >
              About
            </Link>
            <Link
              className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline underline-offset-4"
              href="#"
            >
              Contact Us
            </Link>
          </nav>
        )}
      </div>

      {isMounted && (
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={toggleUserDropdown}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-expanded={isUserDropdownOpen}
            aria-haspopup="true"
          >
            <User className="h-6 w-6 text-gray-600" aria-hidden="true" />
          </button>

          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/mybookings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Bookings
                  </Link>
                  <Link
                    href="/payment-history"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Payment History
                  </Link>
                  <Link
                    href="/home#features"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Features
                  </Link>
                  <Link
                    href="/stationpage"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Find Stations
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    About
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Contact Us
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      logoutUser(dispatch);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="inline-block w-4 h-4 mr-2" aria-hidden="true" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
