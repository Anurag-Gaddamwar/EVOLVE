"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ProfilePage.css"; 

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    lastLogin: "",
    profileImage: "",
    channelId: "",
  });
  const [loading, setLoading] = useState(true);
  const [videoIds, setVideoIds] = useState([]);
  const [copiedVideoId, setCopiedVideoId] = useState(null);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      const { username, email, lastLogin, profileImage, channelId } = res.data.data;
      const formattedLastLogin = new Date(lastLogin).toLocaleDateString();
      setUserData({ username, email, lastLogin: formattedLastLogin, profileImage, channelId });
      const fetchedVideoIds = await fetchVideos(channelId);
      setVideoIds(fetchedVideoIds);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async (channelId) => {
    try {
      const response = await axios.get(`http://localhost:3003/api/get-videos?channelId=${channelId}`);
      return response.data.videoIds;
    } catch (error) {
      console.error("Error fetching videos:", error);
      return [];
    }
  };

  const handleCopyLink = (videoId) => {
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(videoLink).then(() => {
      setCopiedVideoId(videoId);
      setTimeout(() => setCopiedVideoId(null), 2000); 
    });
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8">
          <div className="bg-gray-800 rounded-lg p-8 text-white">
            <div className="flex items-center gap-8">
              <div className="rounded-full overflow-hidden w-24 h-24 border-4 border-gray-400 animate-pulse">
                <div className="bg-gray-500 flex items-center justify-center w-full h-full"></div>
              </div>
              <div>
                <div className="bg-gray-500 w-32 h-4 mb-4 animate-pulse"></div>
                <div className="bg-gray-500 w-24 h-4 animate-pulse"></div>
                <div className="bg-gray-500 w-32 h-4 mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-800 p-4 rounded-lg relative animate-pulse">
              <div className="bg-gray-500 w-full h-48 rounded-lg"></div>
              <div className="bg-gray-500 w-full h-4 mt-2"></div>
              <div className="bg-gray-500 w-32 h-4 mt-3"></div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg relative animate-pulse">
              <div className="bg-gray-500 w-full h-48 rounded-lg"></div>
              <div className="bg-gray-500 w-full h-4 mt-2"></div>
              <div className="bg-gray-500 w-32 h-4 mt-3"></div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg relative animate-pulse">
              <div className="bg-gray-500 w-full h-48 rounded-lg"></div>
              <div className="bg-gray-500 w-full h-4 mt-2"></div>
              <div className="bg-gray-500 w-32 h-4 mt-3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="bg-gray-800 rounded-lg p-8 text-white">
          <div className="flex items-center gap-8">
            <div className="rounded-full overflow-hidden w-24 h-24 border-4 border-gray-400">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="Profile Image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-500 flex items-center justify-center rounded-lg w-full h-full">
                  <p className="text-white font-bold text-3xl">{userData.username.charAt(0)}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xl font-semibold">{userData.username}</p>
              <p className="text-sm text-gray-400">{userData.email}</p>
              <p className="text-sm text-gray-400 pt-2"><span className="text-white">Channel ID:</span> {userData.channelId}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {videoIds.map((video) => (
            <div key={video.id} className="bg-gray-800 p-4 rounded-lg relative">
              <img src={video.thumbnail} alt={`Video ${video.id}`} className="w-full h-48 object-cover rounded-lg" />
              <p className="text-white mt-2 line-clamp-2">{video.title}</p>
              <button
                onClick={() => handleCopyLink(video.id)}
                className="relative bg-gray-600 mt-3 px-3 py-1 rounded-md hover:bg-gray-700 transition"
              >
                Copy Link
                {copiedVideoId === video.id && (
                  <span className="copied-message">Copied</span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

