'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, User, TrendingUp, Users, CompassIcon, LogOutIcon } from 'lucide-react';

export default function ResponsiveTabBar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const [activeTab, setActiveTab] = useState('');

  const tabs = [
    { name: 'Home', href: '/main', icon: Home },
    { name: 'Explore', href: '/explore', icon: CompassIcon },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Trending', href: '/trending', icon: TrendingUp },
    { name: 'Communities', href: '/communities', icon: Users },
    { name: 'Logout', href: '/login', icon: LogOutIcon },
    
  ];

  // Sync activeTab with the current route
  useEffect(() => {
    const currentPath = pathname.split('/')[1]; // Extract the first part of the path
    setActiveTab(currentPath);
  }, [pathname]);

  const handleTabClick = (href:string) => {
    if(href=='/login'){
      localStorage.clear();
    }
    router.push(href); // Navigate to the route
  };

  return (
    <div className="flex flex-col md:flex-row h-screen md:h-full">
      {/* Desktop (Left-Side Tab Bar) */}
      <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white py-6 px-4 shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-wide text-blue-400">
            LinkNest
          </h1>
        </div>
        <div className="flex-grow space-y-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.href)}
              className={`flex items-center p-3 rounded-xl transition-all w-full ${
                activeTab === tab.href.split('/')[1]
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-700 hover:text-white'
              }`}
            >
              <tab.icon className="w-6 h-6 mr-3" />
              <span className="text-lg font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile (Bottom Tab Bar) */}
      <div className="fixed bottom-0 left-0 w-full bg-white md:hidden shadow-lg z-30">
        <div className="flex justify-around p-3 ">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.href)}
              className={`flex flex-col items-center transition-all  ${
                activeTab === tab.href.split('/')[1]
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-400'
              }`}
            >
              <tab.icon
                className={`w-6 h-6 mb-1 ${
                  activeTab === tab.href.split('/')[1] ? 'animate-bounce' : ''
                }`}
              />
              <span className="text-xs font-semibold">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
