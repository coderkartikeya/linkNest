// pages/auth.js
'use client';
import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useUserContext } from '@/context/UserContext';
// import Router from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function Login() {
  const[username,setUserName]=useState('');
  const[password,setPassword]=useState('');
  const {login}=useAuth();
  const {setUserContext}=useUserContext();
  // const {setUsername,setFullName,setEmail,setRefreshToken,setAcessToken,setProfilePic,createdOn}=useUserContext();
  const router=useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      

      const response= await fetch('http://localhost:8000/api/v1/users/login',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({username,password})
      });
      // console.log(response);
      if(response.ok){
        const data=await response.json();
        login();
        setUserContext(data); // Call setUserContext to update UserContext 
        router.push('/main');
      }
    } catch (error) {
      alert("something went wrong");
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <Head>
        <title>Login - YourAppName</title>
      </Head>
      <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:flex-row w-full max-w-4xl">
        <div className="md:w-1/2 flex items-center justify-center bg-blue-100 rounded-lg">
          <img
            src="/images/login_page.jpg"
            alt="Illustration"
            className="w-3/4 h-auto md:w-full md:h-auto object-cover rounded-lg"
          />
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 px-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">Sign in to continue to LinkNest.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
              />

            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don’t have an account?{' '}
              <Link href="/signin">
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
