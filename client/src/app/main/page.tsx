'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import GoogleMapComponent from '../components/GoogleMap';
import ResponsiveTabBar from '../components/TabBar';
import { Inbox} from 'lucide-react'

// Define the structure of the user object
interface User {
  fullName: string;
  username:string;
  profilePic:string;
  accessToken:string;
  refreshToken:string;

  // Add other properties as needed
}

interface UserData {
  user: User;
}

interface AuthenticatedUser {
  data: UserData;
}

const Page: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }

    if (isInitialized) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, isInitialized, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading... </p>
      </div>
    );
  }

  
  return (
    <div className="h-screen flex flex-row bg-slate-200">
      <div>
        <ResponsiveTabBar />
      </div>
      <div className="md:m-5 m-3 md:p-5 p-3 rounded-xl w-full bg-white flex">
        <div className="flex flex-row-reverse w-full  h-[100px] p-2">
          <div className='flex flex-row items-center md:gap-4 gap-2  '>
          <button
          className="text-xl font-semibold bg-gray-100 md:p-5 p-3 rounded-xl drop-shadow-lg"
          onClick={()=>{
            router.push('/profile')
          }}
          >
            {user?.data.user.fullName}
          </button>
          <button 
          className='text-xl font-semibold bg-gray-100 md:p-5 p-3 rounded-xl drop-shadow-lg'
          >
            <Inbox/>

          </button>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Page;
