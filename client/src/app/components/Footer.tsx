// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
        {/* Left Section */}
        <div>
          <h2 className="text-2xl font-extrabold mb-4">ConnectLocal Team</h2>
          <p className="text-sm leading-relaxed">
            <strong>Address:</strong> Level 1, 12 Sample St, Sydney NSW 2000
          </p>
          <p className="text-sm leading-relaxed mt-3">
            <strong>Contact:</strong> 1800 123 4567
            <br />
            info@connectlocal.com
          </p>
          <div className="flex items-center space-x-4 mt-6">
            <a
              href="#"
              className="hover:text-yellow-400 transition duration-300"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="#"
              className="hover:text-yellow-400 transition duration-300"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="#"
              className="hover:text-yellow-400 transition duration-300"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a
              href="#"
              className="hover:text-yellow-400 transition duration-300"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin-in text-xl"></i>
            </a>
            <a
              href="#"
              className="hover:text-yellow-400 transition duration-300"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube text-xl"></i>
            </a>
          </div>
        </div>

        {/* Center Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Explore</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline hover:text-yellow-400">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-yellow-400">
                Community Guidelines
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-yellow-400">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-yellow-400">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline hover:text-yellow-400">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-yellow-400">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-yellow-400">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline hover:text-yellow-400">
                Feedback
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/20 mt-8 pt-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm px-6">
          <p className="text-white/80">
            © {new Date().getFullYear()} ConnectLocal. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              className="hover:underline hover:text-yellow-400 transition duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:underline hover:text-yellow-400 transition duration-300"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
