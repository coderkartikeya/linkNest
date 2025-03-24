'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResponsiveTabBar from '../components/TabBar';
import { AuthenticatedUser } from '../Interfaces/User';
import { IChatGroup } from '../Interfaces/ChatGroup';
import Link from 'next/link';

const Page = () => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [chatGroups, setChatGroups] = useState<IChatGroup[]>([]);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      setUser(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchGroups = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/users/getGroup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: user.data.user.username }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setChatGroups(data.data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    fetchGroups();
  }, [user]);

  return (
    <div className='h-screen flex flex-row bg-slate-200'>
      {/* Sidebar */}
      <div>
        <ResponsiveTabBar />
      </div>

      {/* Main Content */}
      <div className='md:m-5 m-3 md:p-5 p-3 rounded-xl w-full bg-white flex flex-col overflow-y-auto scrollbar-hide'>
        <h1 className='md:text-4xl md:p-5 m-3 text-2xl'>Groups you Joined!</h1>

        {
          chatGroups && chatGroups.map((r)=>{
            return(
              <Link key={r._id} href={`/inbox/${r._id}`}>
              <div 
           
          className="md:m-5 m-3 flex items-center gap-5 bg-white p-4 md:p-6 h-auto rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer"
        >
          {/* Profile Image */}
          <img 
            src={r.ProfilePic || `/images/default.jpg`} 
            alt={r.name[0]} 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-gray-300 object-cover"
          />

          {/* Group Details */}
          <div className="flex flex-col">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">{r.name}</h2>
            <p className="text-sm text-gray-500">Tap to open chat</p>
          </div>
        </div>
        </Link>

            )
          })
          
        }
        
      </div>
    </div>
  );
};

export default Page;
