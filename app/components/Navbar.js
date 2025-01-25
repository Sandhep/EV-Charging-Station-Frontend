"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../api.js";
import { Menu, X, Zap, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const userDropdownRef = useRef(null);

  const isAuthenticated = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

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
      </div>

      <button
        className="lg:hidden"
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6 text-gray-900" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6 text-gray-900" aria-hidden="true" />
        )}
      </button>

      {isMounted && isAuthenticated ? (
        <div className="hidden lg:block relative" ref={userDropdownRef}>
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
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/mybookings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                My Bookings
              </Link>
              <Link
                href="/payment-history"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                Payment History
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
            </div>
          )}
        </div>
      ) : (
        isMounted && (
          <div className="hidden lg:flex items-center ml-auto space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium border border-gray-900 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Register
            </Link>
          </div>
        )
      )}

      {isMounted && isMenuOpen && (
        <div id="mobile-menu" className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 lg:hidden">
          <nav className="flex flex-col px-4 py-2">
            <Link
              className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              href="#features"
              onClick={closeMenu}
            >
              Features
            </Link>
            <Link
              className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              href="/stationpage"
              onClick={closeMenu}
            >
              Find Stations
            </Link>
            <Link
              className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              href="#"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              href="#"
              onClick={closeMenu}
            >
              Contact Us
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                <Link
                  href="/mybookings"
                  className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={closeMenu}
                >
                  My Bookings
                </Link>
                <Link
                  href="/payment-history"
                  className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={closeMenu}
                >
                  Payment History
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    logoutUser(dispatch);
                  }}
                  className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 mt-2">
                <Link
                  href="/login"
                  className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-center"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium border border-gray-900 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-center"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
