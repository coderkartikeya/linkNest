'use client'
import React, { useEffect, useState } from 'react';
import ResponsiveTabBar from '../components/TabBar';
import GoogleMapComponent from '../components/GoogleMap';
import { Filter, Search, Heart, Users, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthenticatedUser } from '../Interfaces/User';
import Link from 'next/link';

interface Community {
  _id: string;
  name: string;
  username: string;
  category: string;
  createdOn: string;
  description: string;
  group: string;
  isPrivate: boolean;
  members: string[];
  owner: {
    _id: string;
    username: string;
  };
  location?: {
    ipAddress:{
      lat:number,
      lng:number
    }
    ,
    city:string;
    state:string;
    country:string;

  };
  __v: number;
  isFollowed?: boolean;
}

interface CommunityCardProps {
  community: Community;
  onFollowToggle: (communityId: string) => void;
  isOwner: boolean;
  currentUserId?: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ 
  community, 
  onFollowToggle, 
  isOwner,
  currentUserId
}) => {
  // const router = useRouter(

  // Determine follow status and visibility of follow button
  
  // console.log(community._id)
  const isFollowed = community.members.includes(currentUserId || '') || isOwner;
  const canFollow = !isOwner;

  

  return (
    <div
      className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer mb-4 relative border border-gray-100"
    >
      
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{community.name}</h2>
              {isOwner && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                  Your Community
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {community.isPrivate ? (
                <span className="text-sm text-red-500 font-semibold">Private</span>
              ) : (
                <span className="text-sm text-green-500 font-semibold">Public</span>
              )}
              {canFollow && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onFollowToggle(community._id);
                  }}
                  className={`p-1.5 rounded-full ${
                    isFollowed 
                      ? 'bg-green-100 text-green-500' 
                      : 'bg-gray-100 text-gray-500'
                  } hover:bg-green-200 transition-colors`}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      isFollowed ? 'fill-current' : ''
                    }`} 
                  />
                  <span className="sr-only">{isFollowed ? 'Followed' : 'Follow'}</span>
                </button>
              )}
            </div>
            
            
          </div>
          <Link href={`/communities/${community._id}`}>
          <p className="mt-2 text-gray-600 mb-4">{community.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Tag className="w-4 h-4" />
              <span>{community.category}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{community.members.length} Members</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            <span>Created by {community.username} on {new Date(community.createdOn).toLocaleDateString()}</span>
          </div>
          </Link>
        </div>
      
    </div>
  );
};

const Page = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser|null>(null);

  // Fetch user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setCurrentUser(parsedUser);
    }
  }, []);

  // Fetch communities 
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const communitiesResponse = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/all`);
        const communitiesData = await communitiesResponse.json();
        
        setCommunities(communitiesData.message);
        setFilteredCommunities(communitiesData.message);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };
    
    fetchCommunities();
  }, [currentUser]);

  // Filtering function
  const filterCommunities = () => {
    let result = [...communities];

    if (search) {
      result = result.filter(community => 
        community.name.toLowerCase().includes(search.toLowerCase()) ||
        community.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter(community => 
        community.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (location) {
      result = result.filter(community => 
        community.location?.city===location        
      );
    }

    setFilteredCommunities(result);
  };

  // Follow/Unfollow toggle
  const handleFollowToggle = async (communityId: string) => {
    if (!currentUser) {
      alert('Please log in to follow communities');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/addMember`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser.data.user.username,
          communityId: communityId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        const updatedCommunities = filteredCommunities.map(community => 
          community._id === communityId 
            ? { 
                ...community, 
                members: data.operation === 'joined' 
                  ? [...community.members, currentUser.data.user._id]
                  : community.members.filter(memberId => memberId !== currentUser.data.user._id)
              }
            : community
        );

        setFilteredCommunities(updatedCommunities);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  return (
    <div className="flex flex-row md:h-screen bg-slate-50">
      {/* Sidebar */}
      <div>
        <ResponsiveTabBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col bg-white w-full md:w-full m-3 p-3 md:m-5 md:p-5 rounded-lg overflow-y-auto scrollbar-hide">
        {/* Map Component */}
        <div className="rounded-xl drop-shadow-lg mb-6">
          <GoogleMapComponent communities={filteredCommunities} />
        </div>

        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search communities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="environment">Environment</option>
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
            </select>

            <button
              onClick={filterCommunities}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Communities List */}
        {filteredCommunities.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No communities found. Try adjusting your filters.
          </div>
        ) : (
          filteredCommunities.map((community) => (
            <CommunityCard 
              key={community._id} 
              community={community} 
              onFollowToggle={handleFollowToggle}
              isOwner={currentUser?.data.user._id === community.owner._id}
              currentUserId={currentUser?.data.user._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Page;