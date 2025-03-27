'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlusCircle, X } from "lucide-react";
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
  city:string;
  state:string;
  country:string;
  ipAddress:{
    lat:number,
    lng:number
  }
}

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    owner: "",
    category: "",
    profileImage: null,
    city:"",
    state:"",
    country:"",
    ipAddress:{
      lat:0,
      lng:0

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
        if (Array.isArray(data.message)) {
          setCommunities(data.message);
        } else {
          setCommunities([]);
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        setError("Failed to fetch communities");
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
    
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("owner", formData.owner);
    formDataToSend.append("category", formData.category);
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }
    formDataToSend.append("city",formData.city)
    formDataToSend.append("country",formData.country)
    formDataToSend.append("state",formData.state);
    formDataToSend.append("ipAddress",JSON.stringify(formData.ipAddress));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_ADDRESS}/api/v1/community/register`, {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Refresh communities list
      setCommunities(prev => [...prev, data.data]);
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        owner: user?.data.user._id || "",
        category: "",
        profileImage: null,
        city:"",
        country:"",
        state:"",
        ipAddress:{
          lat:0,
          lng:0
        }

      });
      alert("Community created successfully!");
    } catch (error) {
      console.error("Error creating community:", error);
      setError("Failed to create community. Please try again.");
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

  return (
    <div className="relative">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-xl w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Community</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input 
                type="text" 
                name="name" 
                placeholder="Community Name" 
                className="border p-2 rounded" 
                onChange={handleChange} 
                value={formData.name}
                required 
              />
              <textarea 
                name="description" 
                placeholder="Description" 
                className="border p-2 rounded" 
                onChange={handleChange} 
                value={formData.description}
                required 
              />
              <input 
                type="text" 
                name="category" 
                placeholder="Category" 
                className="border p-2 rounded" 
                onChange={handleChange} 
                value={formData.category}
                required 
              />
              <input 
                type="file" 
                name="profileImage" 
                className="border p-2 rounded" 
                onChange={handleImageChange} 
                accept="image/*"
                required 
              />
              <input
                type="text"
                name="city"
                className="border p-2 rounded"
                onChange={handleChange}
                value={formData.city}
                placeholder="City"
              />
              <input
                type="text"
                name="state"
                className="border p-2 rounded"
                onChange={handleChange}
                value={formData.state}
                placeholder="State"
              />
              <input
                type="text"
                name="country"
                className="border p-2 rounded"
                onChange={handleChange}
                value={formData.country}
                placeholder="Country"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  name="lat"
                  placeholder="Latitude"
                  className="border p-2 rounded w-1/2"
                  value={formData.ipAddress.lat.toString() || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    ipAddress: {
                      ...prev.ipAddress,
                      lat: parseFloat(e.target.value) || 0
                    }
                  }))}
                />
                <input
                      type="number"
                      name="lng"
                      placeholder="Longitude"
                      className="border p-2 rounded w-1/2"
                      value={formData.ipAddress.lng.toString()} // Convert to string
                      onChange={(e) => setFormData(prev => ({
                          ...prev,
                          ipAddress: {
                              ...prev.ipAddress,
                              lng: parseFloat(e.target.value) || 0
                          }
                      }))}
                  />
              </div>
              <button
                type="button"
                className="bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
                onClick={handleLocationPermission}
              >
                Get Location
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Create Community
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-row md:h-screen bg-gray-100">
        <div>
          <ResponsiveTabBar />
        </div>

        <div className="flex flex-col bg-white w-full m-3 p-5 rounded-xl shadow-md">
          <motion.h1
            className="text-3xl font-extrabold text-gray-800 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            My Communities
          </motion.h1>

          <div className="mb-10">
            <motion.h2 className="text-2xl font-semibold mb-5 text-blue-700">
              Communities I've created
            </motion.h2>
            <div className="flex gap-5 overflow-x-auto scrollbar-hide">
              {communities.map((community,index) => (
                <motion.div 
                  key={index} 
                  className="min-w-[250px] p-6 bg-blue-200 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <Link href={`/communities/${community._id}`}>
                    {community.profileImage && (
                      <Image 
                        src={community.profileImage} 
                        alt={community.name}
                        className="h-[200px] w-full object-cover rounded-lg mb-3"
                        width={500}
                        height={500}
                      />
                    )}
                    <h3 className="text-lg font-bold">{community.name}</h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div className="flex justify-end">
            <button 
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircle size={20} /> Create New Community
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Page;