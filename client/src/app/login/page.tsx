// pages/auth.js
'use client'
import { useState } from 'react';

import Link from 'next/link';
import Head from 'next/head';

export default function Login() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Head>
        <title>Login - YourAppName</title>
      </Head>
      <div className="bg-white shadow-md rounded-lg p-8 flex flex-col md:flex-row">
        <div className="md:w-1/2 flex items-center justify-center ">
          <img src="/images/login_page.jpg" alt="Illustration" className="w-3/4 md:h-3/4" />
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <Link href="/signup">
            
          </Link>
        </div>
      </div>
    </div>
  );
}

