'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Share2, Clock, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import ResponsiveTabBar from '../components/TabBar';


interface User {
  fullName: string;
  username: string;
  profilePic: string;
  accessToken: string;
  refreshToken: string;
}

interface UserData {
  user: User;
}

interface AuthenticatedUser {
  data: UserData;
}

interface Post {
  _id: string;
  ownerName: string;
  owner: string;
  content: string;
  date: Date;
  picture?: string;
  createdAt: Date;
  likes?: number;
  comments?: number;
  community:string;
}

const TimeAgo = ({ date }: { date: Date }) => {
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm';
    
    return Math.floor(seconds) + 's';
  };

  return (
    <div className="flex items-center text-sm text-gray-500">
      <Clock className="w-4 h-4 mr-1" />
      {getTimeAgo(date)}
    </div>
  );
};

const Page: React.FC = () => {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const worker = new Worker('/worker.js');

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/allposts`);
        const data = await response.json();
        // console.log(data);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${data.message}`);
        }
        worker.onmessage = function (e) {
          setPosts(e.data);
        };
        
        worker.postMessage(data.message);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      return newLikedPosts;
    });

    setPosts(prev => 
      prev.map(post => 
        post._id === postId 
          ? { ...post, likes: (post.likes || 0) + (likedPosts.has(postId) ? -1 : 1) }
          : post
      )
    );
  };

  const handlePostClick = (postId: string) => {
    router.push(`/communities/${postId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-row bg-slate-200">
      <div>
        <ResponsiveTabBar />
      </div>
      <div className="md:m-5 m-3 md:p-5 p-3 rounded-xl w-full bg-white flex flex-col mb-5vh">
        <div className="flex flex-row-reverse w-full h-[100px] p-2">
          <div className="flex flex-row items-center md:gap-4 gap-2">
            <button
              className="text-xl font-semibold bg-gray-100 md:p-5 p-3 rounded-xl drop-shadow-lg"
              onClick={() => router.push('/profile')}
            >
              {user?.data.user.fullName}
            </button>
            <button
              className="text-xl font-semibold bg-gray-100 md:p-5 p-3 rounded-xl drop-shadow-lg"
              onClick={() => router.push('/inbox')}
            >
              <Inbox />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-5 overflow-y-auto scrollbar-hide">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              whileHover={{ y: -2 }}
              onClick={() => handlePostClick(post.community)}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-semibold">
                    {post.ownerName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{post.ownerName}</h3>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                {post.picture && (
                  <img
                    src={post.picture}
                    alt="Post content"
                    className="mt-4 rounded-lg w-full object-cover max-h-96"
                  />
                )}
              </div>

              {/* Post Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex gap-6">
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post._id);
                    }}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        likedPosts.has(post._id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/${post._id}`);
                    }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.share?.({
                        title: post.ownerName,
                        text: post.content,
                        url: `${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/${post._id}`
                      });
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <TimeAgo date={post.createdAt} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;