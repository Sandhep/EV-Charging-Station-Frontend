'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar({ hideAuth = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-200 relative">
      <div className="flex items-center">
        <Link className="flex items-center justify-center" href="/home">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ml-2 text-2xl font-bold text-gray-900">EV Charge</span>
        </Link>
        
        <div className="hidden lg:flex items-center ml-8 space-x-6">
          <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="/home#features">
            Features
          </Link>
          <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="/stationpage">
            Find Stations
          </Link>
          <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium text-gray-700 hover:underline underline-offset-4" href="#">
            Careers
          </Link>
        </div>
      </div>

      <button
        className="ml-auto lg:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="h-6 w-6 text-gray-900"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMenuOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {!hideAuth && (
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
      )}

      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex flex-col px-4 py-2">
            <Link 
              className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900" 
              href="#features"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900" 
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900" 
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              className="py-2 text-sm font-medium text-gray-700 hover:text-gray-900" 
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              Careers
            </Link>
            {!hideAuth && (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 mt-2">
                <Link 
                  href="/login" 
                  className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm font-medium border border-gray-900 text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
} 