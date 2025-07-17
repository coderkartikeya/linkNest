'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MessageCircle, Heart, Share2, Eye, Clock, Users, Hash, Flame, Star } from "lucide-react";
import ResponsiveTabBar from "../components/TabBar";

interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  category: string;
  hashtags: string[];
  posts: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  growth: number;
  timeframe: string;
  participants: number;
  image?: string;
  isHot?: boolean;
}

interface TrendingCategory {
  name: string;
  color: string;
  icon: React.ReactNode;
}

const TrendingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('today');
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);

  // Sample trending data
  const sampleTrendingData: TrendingTopic[] = [
    {
      id: '1',
      title: 'AI Revolution in Healthcare',
      description: 'Breakthrough AI models are transforming medical diagnosis and treatment planning across hospitals worldwide.',
      category: 'Technology',
      hashtags: ['#AI', '#Healthcare', '#MedTech', '#Innovation'],
      posts: 12547,
      views: 2847593,
      likes: 45892,
      comments: 8234,
      shares: 3421,
      growth: 85.4,
      timeframe: '2h ago',
      participants: 15623,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop',
      isHot: true
    },
    {
      id: '2',
      title: 'Sustainable Fashion Movement',
      description: 'Eco-friendly fashion brands are gaining massive popularity as consumers shift towards sustainable choices.',
      category: 'Lifestyle',
      hashtags: ['#SustainableFashion', '#EcoFriendly', '#Fashion', '#Sustainability'],
      posts: 9873,
      views: 1923847,
      likes: 38421,
      comments: 6789,
      shares: 2893,
      growth: 67.2,
      timeframe: '4h ago',
      participants: 12847,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Space Tourism Breakthrough',
      description: 'Commercial space flights become more accessible as costs drop and safety measures improve significantly.',
      category: 'Science',
      hashtags: ['#SpaceTourism', '#Space', '#Technology', '#Future'],
      posts: 8234,
      views: 1634729,
      likes: 29384,
      comments: 4521,
      shares: 1892,
      growth: 92.8,
      timeframe: '6h ago',
      participants: 9876,
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop',
      isHot: true
    },
    {
      id: '4',
      title: 'Remote Work Culture Evolution',
      description: 'Companies worldwide are embracing hybrid work models, reshaping traditional office dynamics.',
      category: 'Business',
      hashtags: ['#RemoteWork', '#WorkFromHome', '#Business', '#Future'],
      posts: 15642,
      views: 3247851,
      likes: 52693,
      comments: 9847,
      shares: 4123,
      growth: 45.7,
      timeframe: '8h ago',
      participants: 18923
    },
    {
      id: '5',
      title: 'Mental Health Awareness',
      description: 'Growing conversation about mental health support and wellness practices in modern society.',
      category: 'Health',
      hashtags: ['#MentalHealth', '#Wellness', '#SelfCare', '#Health'],
      posts: 11234,
      views: 2156789,
      likes: 41567,
      comments: 7892,
      shares: 3456,
      growth: 73.1,
      timeframe: '12h ago',
      participants: 13456
    },
    {
      id: '6',
      title: 'Cryptocurrency Regulation',
      description: 'New regulatory frameworks are being developed globally to govern digital currencies and blockchain technology.',
      category: 'Finance',
      hashtags: ['#Crypto', '#Blockchain', '#Finance', '#Regulation'],
      posts: 7891,
      views: 1456789,
      likes: 23456,
      comments: 3789,
      shares: 1567,
      growth: 56.9,
      timeframe: '1d ago',
      participants: 8934
    },
    {
      id: '7',
      title: 'Climate Action Initiatives',
      description: 'Global climate initiatives are gaining momentum with innovative solutions and community participation.',
      category: 'Environment',
      hashtags: ['#ClimateAction', '#Environment', '#Sustainability', '#Green'],
      posts: 13567,
      views: 2789456,
      likes: 47892,
      comments: 8567,
      shares: 3789,
      growth: 68.4,
      timeframe: '1d ago',
      participants: 16789
    },
    {
      id: '8',
      title: 'Gaming Industry Evolution',
      description: 'Next-generation gaming technologies and virtual reality experiences are reshaping entertainment.',
      category: 'Entertainment',
      hashtags: ['#Gaming', '#VR', '#Technology', '#Entertainment'],
      posts: 9456,
      views: 1789234,
      likes: 34567,
      comments: 5678,
      shares: 2345,
      growth: 61.3,
      timeframe: '2d ago',
      participants: 11234,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&h=300&fit=crop'
    }
  ];

  const categories: TrendingCategory[] = [
    { name: 'all', color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Technology', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: <Hash className="w-4 h-4" /> },
    { name: 'Lifestyle', color: 'bg-gradient-to-r from-pink-500 to-rose-500', icon: <Heart className="w-4 h-4" /> },
    { name: 'Science', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: <Star className="w-4 h-4" /> },
    { name: 'Business', color: 'bg-gradient-to-r from-yellow-500 to-orange-500', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Health', color: 'bg-gradient-to-r from-red-500 to-pink-500', icon: <Heart className="w-4 h-4" /> },
    { name: 'Entertainment', color: 'bg-gradient-to-r from-indigo-500 to-purple-500', icon: <Star className="w-4 h-4" /> }
  ];

  useEffect(() => {
    setTrendingTopics(sampleTrendingData);
  }, []);

  const filteredTopics = selectedCategory === 'all' 
    ? trendingTopics 
    : trendingTopics.filter(topic => topic.category === selectedCategory);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const TrendingCard = ({ topic, index }: { topic: TrendingTopic; index: number }) => (
    <motion.div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        {topic.image && (
          <div className="h-48 overflow-hidden">
            <img
              src={topic.image}
              alt={topic.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex gap-2">
          {topic.isHot && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Flame className="w-3 h-3" />
              HOT
            </span>
          )}
          <span className={`text-white px-3 py-1 rounded-full text-xs font-bold ${
            categories.find(c => c.name === topic.category)?.color || 'bg-gray-500'
          }`}>
            {topic.category}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-bold text-green-500">+{topic.growth}%</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-500">{topic.timeframe}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
          {topic.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {topic.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {topic.hashtags.map((hashtag, idx) => (
            <span 
              key={idx} 
              className="text-blue-500 text-sm bg-blue-50 px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer transition-colors"
            >
              {hashtag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{formatNumber(topic.posts)}</div>
            <div className="text-sm text-gray-500">Posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{formatNumber(topic.participants)}</div>
            <div className="text-sm text-gray-500">Participants</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{formatNumber(topic.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{formatNumber(topic.likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{formatNumber(topic.comments)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            <span>{formatNumber(topic.shares)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:w-auto">
          <ResponsiveTabBar />
        </div>

        <div className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full mb-4">
                <Flame className="w-5 h-5" />
                <span className="font-bold">Trending Now</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">What's Hot Today</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover the most talked-about topics, trending discussions, and viral content from communities around the world
              </p>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              {/* Category Filter */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                        selectedCategory === category.name
                          ? `${category.color} text-white shadow-lg`
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {category.icon}
                      {category.name === 'all' ? 'All Topics' : category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Time Range</h3>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">247</div>
                    <div className="text-blue-100">Trending Topics</div>
                  </div>
                  <Hash className="w-8 h-8 text-blue-200" />
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">12.4M</div>
                    <div className="text-green-100">Total Views</div>
                  </div>
                  <Eye className="w-8 h-8 text-green-200" />
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">89K</div>
                    <div className="text-purple-100">Active Users</div>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">156K</div>
                    <div className="text-orange-100">Interactions</div>
                  </div>
                  <MessageCircle className="w-8 h-8 text-orange-200" />
                </div>
              </motion.div>
            </div>

            {/* Trending Topics Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {filteredTopics.map((topic, index) => (
                <TrendingCard key={topic.id} topic={topic} index={index} />
              ))}
            </motion.div>

            {/* Load More Button */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg transition-all">
                Load More Trending Topics
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;