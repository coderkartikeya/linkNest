'use client'
import React, { useEffect, useState } from 'react';
import ResponsiveTabBar from '../components/TabBar';
import GoogleMapComponent from '../components/GoogleMap';
import { Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
interface Community {
  map(arg0: (e: any) => React.JSX.Element): React.ReactNode;
  _id: string;
  name: string;
  category: string;
  createdOn: string; // you can convert this to Date if needed.
  description: string;
  group: string;
  isPrivate: boolean;
  members: any[]; // you may later replace `any` with a more specific type.
  owner: {
    _id: string;
    username: string;
  };
  __v: number;
}
interface CommunityCardProps {
  community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/communities/${community._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer mb-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{community.name}</h2>
        {community.isPrivate ? (
          <span className="text-sm text-red-500 font-semibold">Private</span>
        ) : (
          <span className="text-sm text-green-500 font-semibold">Public</span>
        )}
      </div>
      <p className="mt-2 text-gray-600">{community.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
          {community.category}
        </span>
        <span className="text-sm text-gray-500">Owner: {community.owner.username}</span>
        <span className="text-sm text-gray-500">
          Created: {new Date(community.createdOn).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
const Page = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [communities,set]=useState<Community>();

  useEffect(()=>{
    const func=async ()=>{
      const response=await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/all`);
      const res=await response.json();
      set(res.message);
      console.log(res.message)
    }
    func();
  },[])



  function filterCommunities(event:any): void {
    throw new Error('Function not implemented.');
  }

  function setShowMap(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="flex flex-row md:h-screen bg-slate-100">
      {/* Sidebar */}
      <div>
        <ResponsiveTabBar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col bg-white w-full md:w-full m-3 p-3 md:m-5 md:p-5 rounded-lg overflow-y-auto scrollbar-hide">
        
        

        {/* Map Component */}
        <div className="rounded-lg drop-shadow-lg">
          <GoogleMapComponent />
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

        {/* View Toggle */}
        {/* <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowMap(!showMap)}
            className="bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"
          >
            {showMap ? 'Show List View' : 'Show Map View'}
          </button>
        </div> */}
        {
          communities && communities.map((e:any)=>{
            return <CommunityCard key={e._id} community={e}/>
          })
        }
      </div>
    </div>
  );
};

export default Page;
