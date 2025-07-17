'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlusCircle, X, MapPin, Users, Calendar } from "lucide-react";
import ResponsiveTabBar from "../components/TabBar";
import Link from "next/link";
import { Community } from "../Interfaces/Community";

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

interface AuthenticatedUser {
  data: UserData;
}

interface FormData {
  name: string;
  description: string;
  owner: string;
  category: string;
  profileImage: File | null;
  city: string;
  state: string;
  country: string;
  ipAddress: {
    lat: number;
    lng: number;
  };
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [partOfCommunity, setPartOfCommunity] = useState<Community[]>([]);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    owner: "",
    category: "",
    profileImage: null,
    city: "",
    state: "",
    country: "",
    ipAddress: {
      lat: 0,
      lng: 0
    }
  });

  useEffect(() => {
    try {
      const data = localStorage.getItem("user");
      if (data) {
        const parsedUser = JSON.parse(data);
        setUser(parsedUser);
        setFormData(prev => ({ ...prev, owner: parsedUser.data.user.username }));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user data");
    }
  }, []);

  useEffect(() => {
    const fetchCommunities = async () => {
      if (!user?.data.user._id) return;

      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/byMember`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ userId: user.data.user._id })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.message) {
          setCommunities(data.message.createdByUser || []);
          setPartOfCommunity(data.message.userIsMemberOf || []);
        } else {
          setCommunities([]);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        setError("Failed to fetch communities");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCommunities();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, profileImage: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("owner", formData.owner);
    formDataToSend.append("category", formData.category);
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }
    formDataToSend.append("city", formData.city);
    formDataToSend.append("country", formData.country);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("ipAddress", JSON.stringify(formData.ipAddress));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/register`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setCommunities(prev => [...prev, data.data]);
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        owner: user?.data.user._id || "",
        category: "",
        profileImage: null,
        city: "",
        country: "",
        state: "",
        ipAddress: {
          lat: 0,
          lng: 0
        }
      });
      alert("Community created successfully!");
    } catch (error) {
      console.error("Error creating community:", error);
      setError("Failed to create community. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            ipAddress: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
          alert("Location captured successfully!");
        },
        (error) => {
          alert("Error capturing location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const CommunityCard = ({ community }: { community: Community }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Link href={`/communities/${community._id}`}>
        <div className="cursor-pointer">
          <div className="relative h-48 overflow-hidden">
            {community.profileImage ? (
              <Image
                src={community.profileImage}
                alt={community.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                width={500}
                height={500}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <Users className="w-16 h-16 text-white opacity-60" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              {community.name}
            </h3>
            {community.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {community.description}
              </p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Location Based</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(community.dateCreated).toLocaleDateString()}</span>
              </div> */}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create Community</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Community Name</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Enter community name" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  onChange={handleChange} 
                  value={formData.name}
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea 
                  name="description" 
                  placeholder="Describe your community" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-24" 
                  onChange={handleChange} 
                  value={formData.description}
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input 
                  type="text" 
                  name="category" 
                  placeholder="e.g., Technology, Sports, Arts" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" 
                  onChange={handleChange} 
                  value={formData.category}
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input 
                  type="file" 
                  name="profileImage" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                  onChange={handleImageChange} 
                  accept="image/*"
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    onChange={handleChange}
                    value={formData.city}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    onChange={handleChange}
                    value={formData.state}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    onChange={handleChange}
                    value={formData.country}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location Coordinates</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="lat"
                    placeholder="Latitude"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.ipAddress.lat.toString() || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ipAddress: {
                        ...prev.ipAddress,
                        lat: parseFloat(e.target.value) || 0
                      }
                    }))}
                    step="any"
                  />
                  <input
                    type="number"
                    name="lng"
                    placeholder="Longitude"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={formData.ipAddress.lng.toString()}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      ipAddress: {
                        ...prev.ipAddress,
                        lng: parseFloat(e.target.value) || 0
                      }
                    }))}
                    step="any"
                  />
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
                onClick={handleLocationPermission}
              >
                <MapPin size={20} />
                Get My Location
              </button>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Community'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:w-auto">
          <ResponsiveTabBar />
        </div>

        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Communities</h1>
                <p className="text-gray-600">Manage and explore your community connections</p>
              </div>
              <button
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircle size={20} />
                Create Community
              </button>
            </motion.div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Communities I've Created */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Communities I've Created</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {communities.length}
                </span>
              </div>
              
              {communities.length === 0 ? (
                <motion.div 
                  className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">No communities created yet</p>
                  <p className="text-gray-500">Start building your community today!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {communities.map((community, index) => (
                    <CommunityCard key={`created-${index}`} community={community} />
                  ))}
                </div>
              )}
            </section>

            {/* Communities I'm Part Of */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Communities I'm Part Of</h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {partOfCommunity.length}
                </span>
              </div>
              
              {partOfCommunity.length === 0 ? (
                <motion.div 
                  className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">Not part of any communities yet</p>
                  <p className="text-gray-500">Join communities that interest you!</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {partOfCommunity.map((community, index) => (
                    <CommunityCard key={`member-${index}`} community={community} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;