'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router=useRouter();
  return (
    <div className="relative bg-cover bg-center h-screen" style={{ backgroundImage: `url('/images/heroSection.jpg')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Connect with Locals</h1>
        <p className="text-lg md:text-xl mb-6">
          Discover and engage with people in your area. Ask questions, share experiences, 
          and get recommendations about local attractions and hidden gems.
        </p>
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-600" onClick={()=>{router.push('/login')}}>
          Get Started Now
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
