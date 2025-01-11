import React from 'react';


const LocalNetworkSection = () => {
  return (
    <div className="bg-green-50 py-12 px-6">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">Join Your Local Network</h1>
        <p className="text-lg md:text-xl text-green-700">Connect with People Around You</p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1 */}
        <div className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-green-800 mb-2">Engage with Locals Instantly</h3>
            <p className="text-green-600 mb-4">Find Answers and Make Friends</p>
            <p className="text-green-500 font-medium">Sign Up Today</p>
          </div>
          <img
            src="/images/map.jpg"
            alt="Network map"
            className="w-full md:w-1/2  object-cover"
          />
        </div>

        {/* Card 2 */}
        <div className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-green-800 mb-2">Connect with Travelers and Locals</h3>
            <p className="text-green-600 mb-4">Share Experiences and Tips</p>
            <p className="text-green-500 font-medium">Join the Conversation</p>
          </div>
          <img
            src="/images/chat_main_website.jpg"
            alt="Locals chatting"
            className="w-full md:w-1/2 object-cover"
          />
        </div>

        {/* Card 3 */}
        <div className="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-green-800 mb-2">Get Help Anytime, Anywhere</h3>
            <p className="text-green-600 mb-4">AI-Powered Community Support</p>
            <p className="text-green-500 font-medium">Discover More</p>
          </div>
          <img
            src="/images/ai_main_website.jpg"
            alt="AI support"
            className="w-full md:w-1/2 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LocalNetworkSection;
