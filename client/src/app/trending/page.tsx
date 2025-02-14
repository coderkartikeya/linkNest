import React from 'react';

const TrendingSection = () => {
  const trendingTopics = [
    { title: '#ReactJS', likes: 120, shares: 45, comments: 30 },
    { title: '#WebDevelopment', likes: 200, shares: 80, comments: 50 },
    { title: '#JavaScript', likes: 150, shares: 60, comments: 40 },
    { title: '#CSS', likes: 90, shares: 30, comments: 20 },
    { title: '#NodeJS', likes: 110, shares: 50, comments: 25 },
    { title: '#Frontend', likes: 180, shares: 70, comments: 35 },
    // Add more topics as needed
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Trending Topics</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center min-w-[200px]">
            <h3 className="text-lg font-semibold text-blue-600">{topic.title}</h3>
            <div className="text-gray-500 text-sm">
              <p>{topic.likes} Likes</p>
              <p>{topic.shares} Shares</p>
              <p>{topic.comments} Comments</p>
            </div>
            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;