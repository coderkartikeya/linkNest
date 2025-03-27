'use client';
import React, { useEffect, useState } from 'react';
import ResponsiveTabBar from '../components/TabBar';
import { Post } from '../Interfaces/Post';

interface User {
  _id:string;
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
import Link from "next/link";
import Image from 'next/image';

const CommunityPosts = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Community Posts</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link 
              key={post._id} 
              href={`/communities/${post.community}`} 
              className="block border-b border-gray-200 py-3 transition duration-300 hover:bg-gray-100 rounded-md px-3"
            >
              <div className="flex items-start space-x-3">
                {post.picture && (
                  <Image 
                    src={post.picture} 
                    alt="Post" 
                    className="w-12 h-12 rounded-full object-cover"
                    height={500}
                    width={500}
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.ownerName}</h3>
                  <p className="text-gray-700">{post.content}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span>❤️ {post.likes || 0}</span>
                    <span className="mx-2">·</span>
                    <span>💬 {post.comments || 0}</span>
                    <span className="mx-2">·</span>
                    <span>{new Date(post.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No posts available.</p>
        )}
      </div>
    </div>
  );
};



const Page = () => {
  const [user, setUser ] = useState<AuthenticatedUser  | null>(null);
  const [editing, setEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedProfilePic, setUpdatedProfilePic] = useState<string | null>(null);
  const [joiningDate, setJoiningDate] = useState('');
  const [posts, setPosts] = useState<Post[]>([]); // Sample posts
  

  useEffect(() => {
    try {
      const data = localStorage.getItem('user');
      if (data) {
        const parsedUser  = JSON.parse(data);
        setUser (parsedUser );
        setUpdatedName(parsedUser .data.user.fullName);
        setUpdatedProfilePic(parsedUser .data.user.profilePic);
        setJoiningDate(parsedUser .data.user.dateCreatedAt || 'Unknown');
        
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);
  const userId=user?.data.user._id;
  useEffect(()=>{
    const func=async()=>{
      

      const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/users/post`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        }
        ,
        body: JSON.stringify({id:userId})        

      });
      const data = await response.json();
      console.log(data.message)
      setPosts(data.message);
      
    }
    func();
  },[user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedProfilePic(reader.result as string); // Convert to base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    try {
      if (user) {
        const updatedUser  = {
          ...user,
          data: {
            user: {
              ...user.data.user,
              fullName: updatedName,
              profilePic: updatedProfilePic || '', // Fallback to empty string if null
            },
          },
        };
        setUser (updatedUser );
        localStorage.setItem('user', JSON.stringify(updatedUser ));
        setEditing(false); // Exit edit mode
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div>
        <ResponsiveTabBar />
      </div>

      {/* Main Content */}
      <div className="bg-white w-full md:m-6 m-4 md:p-6 p-4 rounded-xl shadow-lg">
        {/* User Info Section */}
        <div className="flex flex-col md:flex-row items-start md:gap-8 gap-6">
          {/* Profile Picture */}
          <div className="bg-gray-200 rounded-lg shadow-lg p-4 flex md:w-[300px] w-full">
            {updatedProfilePic && (
              <Image
                src={updatedProfilePic}
                alt={`${updatedName}'s profile`}
                className="h-full w-full rounded-lg object-cover"
                height={500}
                width={500}
              />
            )}
          </div>

          {/* User Details */}
          <div className="flex flex-col w-full gap-4">
            {editing ? (
              <div className="flex flex-col gap-4">
                <label className="flex flex-col text-sm font-medium text-gray-700">
                  Full Name:
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-gray-700">
                  Profile Picture URL:
                  <input
                    type="text"
                    value={updatedProfilePic || ''}
                    onChange={(e) => setUpdatedProfilePic(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col text-sm font-medium text-gray-700">
                  Upload Profile Picture:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
                  />
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="md:text-4xl text-2xl font-bold">{user?.data.user.fullName}</div>
                <div className="text-gray-500 text-lg md:text-xl">@{user?.data.user.username}</div>
                <div className="text-gray-600 text-sm">Joined: {joiningDate}</div>
                <button
                  onClick={() => setEditing(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Community Posts Section */}
        <CommunityPosts posts={posts}/>
      </div>
    </div>
  );
};

export default Page;