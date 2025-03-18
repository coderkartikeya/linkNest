'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Send, PaperclipIcon, X, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import ResponsiveTabBar from '@/app/components/TabBar';
import ChatC from '@/app/components/ChatC';

// Interfaces
interface User {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
  accessToken: string;
  refreshToken: string;
  dateCreatedAt: Date;
}

interface UserData {
  user: User;
}

interface AuthenticatedUser  {
  data: UserData;
}

interface Message {
  ownerName: string;
  owner: string;
  content: string;
  date: Date;
  picture?: string;
  createdAt: Date;
}

interface Community {
  _id: string;
  name: string;
  description: string;
  profileImage: string;
  owner: string;
  category: string;
  group: string;
  isPrivate: boolean;
  members: string[];
  posts: any[];
  createdOn: Date;
  reportCommunity: boolean;
  __v: number;
}

const CommunityPage = () => {
  // States
  const [user, setUser ] = useState<AuthenticatedUser  | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin

  const router = useRouter();
  const pathname = usePathname();
  const communityId = pathname?.split('/').pop();

  // Load user data
  useEffect(() => {
    const loadUser  = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser (JSON.parse(userData));
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Error loading user data:', err);
        router.push('/login');
      }
    };

    loadUser ();
  }, [router]);

  // Fetch community data
  useEffect(() => {
    const fetchCommunity = async () => {
      if (!communityId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/byId`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: communityId }),
        });

        if (!response.ok) throw new Error('Failed to fetch community');

        const data = await response.json();
        
        if (data.message) {
          setCommunity(data.message);
          setMessages(data.message.posts || []);
          // Check if the current user is the admin
          if (data.message.owner === user?.data.user._id) {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error('Error fetching community:', err);
        setError('Failed to load community');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();
  }, [communityId, user]);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedFile) || !user || !communityId) return;

    try {
      const formData = new FormData();
      formData.append('text', newMessage);
      formData.append('user', user.data.user._id);
      formData.append('community', communityId);
      

      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/savePost`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to send message');

      // Add new message to the list
      const newMsg: Message = {
        ownerName: user.data.user.fullName,
        owner: user.data.user._id,
        content: newMessage,
        date: new Date(),
        picture: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setSelectedFile(null);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleDeleteCommunity = async () => {
    if (!community || !user || community.owner !== user.data.user._id) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/deleteCommuntiy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: community._id,user_id:user.data.user._id }
            ),
      });

      if (!response.ok) throw new Error('Failed to delete community');

      router.push('/communities');
    } catch (err) {
      console.error('Error deleting community:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F0F2F5]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F0F2F5]">
        <div className="text-red-500">{error || 'Community not found'}</div>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-gray-100 flex overflow-y-auto scrollbar-hide`}>
      {/* Header */}
      <div className='h-screen'>
        <ResponsiveTabBar />
      </div>

      <div className='bg-white w-full md:m-6 m-4 md:p-6 p-4 rounded-xl shadow-md'>
        <div className='flex justify-between'>
          <button onClick={() => router.back()}>
            <ChevronLeft />
          </button>
          <h2 className="md:text-3xl text-2xl font-bold">{community.name}</h2>
          <button 
            className="text-500 hover:text-red-700 transition duration-300 ease-in-out"
            onClick={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
          >
            <Menu />
          </button>
        </div>
        <div className={`${selectedFile ? `h-[68vh]` : `h-[73vh]`} w-full overflow-y-scroll scrollbar-hide`}>
          {user && <ChatC messages={messages} user={user} />}
        </div>
        {isAdmin && ( // Only show this section if the user is the admin
          <div className="bg-white border-t p-2 md:p-2 mb-20">
            {selectedFile && (
              <div className="mb-2 p-2 bg-blue-50 rounded-lg flex items-center gap-2">
                <span className="text-xs md:text-sm text-blue-600 truncate flex-1">
                  {selectedFile.name}
                </span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-blue-100 rounded-full"
                >
                  <X size={16} className="text-blue-600" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full text-sm md:text-base resize-none rounded-lg pl-3 pr-10 py-2 focus:outline-none border focus:ring-2 focus:ring-blue-500 min-h-[40px] md:min-h-[45px]"
                  rows={1}
                  onKeyPress={handleKeyPress}
                />
                <label className="absolute right-2 bottom-2 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  <PaperclipIcon size={20} className="text-gray-400 hover:text-blue-500" />
                </label>
              </div>
              <button
                onClick={handleSendMessage}
                className="p-2 md:p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
              >
                <Send size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`
        fixed inset-0 bg-black bg-opacity-50 z-50 transition-all duration-300
        ${isInfoPanelOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
        onClick={() => setIsInfoPanelOpen(false)}
      >
        <div 
          className={`
            w-[85vw] md:w-80 md:h-full h-[calc(100vh-64px)] bg-white absolute right-0 transform transition-transform duration-300
            ${isInfoPanelOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b flex items-center">
            <button 
              onClick={() => setIsInfoPanelOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight size={24} />
            </button>
            <h2 className="ml-2 text-lg font-semibold">Community Info</h2>
          </div>
          
          <div className="p-4 overflow-y-auto">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
                <Image
                  src={community.profileImage || '/placeholder.png'}
                  alt={community.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h1 className="text-xl md:text-2xl font-bold mb-1 text-center">{community.name}</h1>
              <p className="text-sm text-gray-500 text-center mb-6">
                {community.description}
              </p>

              <div className="w-full space-y-4">
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-600">Members</span>
                    <span className="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full text-sm font-medium">
                      {community.members.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-600">Category</span>
                    <span className="bg-purple-100 text-purple-600 px-2.5 py-0.5 rounded-full text-sm font-medium">
                      {community.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm md:text-base text-gray-600">Private</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      community.isPrivate 
                        ? 'bg-red-100 text-red-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {community.isPrivate ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {user?.data.user._id === community.owner && (
                  <button 
                    onClick={handleDeleteCommunity}
                    className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm md:text-base"
                  >
                    Delete Community
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;