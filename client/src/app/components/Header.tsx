"use client"
import React, { useRef } from 'react';

const Header = () => {
  const clickPoint = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    if (clickPoint.current) {
      clickPoint.current.style.display = "none";
    }
  };

  const handleBlur = () => {
    if (clickPoint.current) {
      clickPoint.current.style.display = "block";
    }
  };

  return (
    <header className="bg-green-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="md:text-4xl text-2xl font-bold">LinkNest</h1>
        <div className="relative flex items-center w-full max-w-md mx-auto"> {/* Centralized and widened search bar */}
          
          
        </div>
        <nav className="flex space-x-4"> {/* Added a flex class here */}
          <ul className="flex md:space-x-6 space-x-3">
            <li><a href="#" className="hover:text-blue-300 md:text-2xl font-bold">Home</a></li>
            <li><a href="#" className="hover:text-blue-300 md:text-2xl font-bold">About</a></li>
            <li><a href="/login" className="hover:text-blue-300 md:text-2xl font-bold">Login</a></li>
            <li><a href="#" className="hover:text-blue-300 md:text-2xl font-bold">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
