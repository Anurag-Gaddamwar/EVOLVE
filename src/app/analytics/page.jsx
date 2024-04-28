// D:\PROJECTS\BACKEND\evolve\src\app\analytics\page.jsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faComments, faEye, faCalendar, faChartLine, faSortAmountAsc } from '@fortawesome/free-solid-svg-icons';


const YOUTUBE_API_KEY = 'your_youtube_api_key';   

const CommentSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [geminiResponse, setGeminiResponse] = useState({ summary: '', recommendations: '', suggestion: '', conclusion : '', spam: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [videoThumbnail , setVideoThumbnail] = useState('');
  const [engagementRate, setEngagementRate] = useState('');


  const handleInputChange = (e) => {
    setVideoUrl(e.target.value);
    // Clear old report when URL changes
    setGeminiResponse({ summary: '', recommendations: '', suggestions: '', conclusion: '', spam: '', videoStatistics: '', videoPostedDate: '', channelName: '', channelProfile: '', videoTitle: '', videoThumbnail: '' });
    setError('');
  };

//Miscalculation,.....
// eR = (likeCount*commentCount*subsCount)/views)
  const calculateEngagementRate = (likeCountStr, commentCountStr, viewCountStr) => {
    const likeCount = parseInt(likeCountStr, 10);
    const commentCount = parseInt(commentCountStr, 10);
    const viewCount = parseInt(viewCountStr, 10);
    if (viewCount === 0) return '0.00%';

    const engagementRate = ((likeCount + commentCount) / (viewCount)).toFixed(2);
    console.log(engagementRate);
    console.log(likeCount);
    console.log(commentCount);
    console.log(viewCount);

    return `${engagementRate}%`;
  };


  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        setError('Invalid YouTube URL');
        return;
      }
  
      // Fetch video details
      const videoDetailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics`
      );
      const videoTitle = videoDetailsResponse.data.items[0].snippet.title;
      const videoStatistics = videoDetailsResponse.data.items[0].statistics;
      const channelId = videoDetailsResponse.data.items[0].snippet.channelId;
      const videoPostedDate = videoDetailsResponse.data.items[0].snippet.publishedAt;
      const videoThumbnailUrl = videoDetailsResponse.data.items[0].snippet.thumbnails.high.url;
      setVideoThumbnail(videoThumbnailUrl);
  
      // Fetch channel details
      const channelDetailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?id=${channelId}&key=${YOUTUBE_API_KEY}&part=snippet,statistics`
      );
      console.log(channelDetailsResponse.data); // Log the entire response to see its structure
      const channelName = channelDetailsResponse.data.items[0].snippet.title;
      const channelProfile = channelDetailsResponse.data.items[0].snippet.thumbnails.default.url;
      let subscriberCount = 'N/A';
  
      // Check if statistics are available and set subscriberCount
      if (channelDetailsResponse.data.items[0].statistics) {
        subscriberCount = channelDetailsResponse.data.items[0].statistics.subscriberCount;
      }
  
      // Fetch comments
      const commentResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/commentThreads?key=${YOUTUBE_API_KEY}&part=snippet&videoId=${videoId}`
      );
      const commentsData = commentResponse.data.items.map(item => item.snippet.topLevelComment.snippet.textDisplay);
  
      const engagementRate = calculateEngagementRate(
        videoStatistics.likeCount || 0,
        videoStatistics.commentCount || 0,
        videoStatistics.viewCount || 0
      );
      setEngagementRate(engagementRate);
  
// Send data to backend
const backendResponse = await axios.post('http://localhost:3001/generate-content', {
  comments: commentsData.join('\n'),
  videoTitle: videoTitle,
  channelName: channelName,
  videoStatistics: videoStatistics,
  videoPostedDate: videoPostedDate,
  engagementRate: engagementRate,
  subscriberCount: subscriberCount, 
  likes: videoStatistics.likeCount, 
  dislikes: videoStatistics.dislikeCount,
  views: videoStatistics.viewCount 
});

console.log('Data sent to backend:', backendResponse.data);


  
      // Process backend response
      if (backendResponse.data.geminiResponse && !backendResponse.data.geminiResponse.includes('Error')) {
        const responseText = backendResponse.data.geminiResponse;
        // Find the start and end indices of each section
        const summaryStart = responseText.indexOf("Summary of Comments:") + "Summary of Comments:".length;
        const recommendationsStart = responseText.indexOf("Recommendations for Improvement:") + "Recommendations for Improvement:".length;
        const suggestionsStart = responseText.indexOf("Suggestion of content:") + "Suggestion of content:".length;
        const conclusionStart = responseText.indexOf("Conclusion:") + "Conclusion:".length;
        const spamStart = responseText.indexOf("Spam and Abusive Comments:") +"Spam and Abusive Comments:".length;


        let summary = '';
        let recommendations = '';
        let suggestions = '';
        let conclusion = '';
        let spam = '';
  
        if (summaryStart !== -1) {
          summary = responseText.substring(summaryStart, recommendationsStart).trim();
          summary = summary.replace(/\*/g, '');
          summary = summary.replace(/Recommendations for Improvement:/, "");
        }
  
        if (recommendationsStart !== -1) {
          recommendations = responseText.substring(recommendationsStart, suggestionsStart).trim();
          recommendations = recommendations.replace(/\*/g, '');
          recommendations = recommendations.replace(/Suggestion of content:/, "");
        }
  
        if (suggestionsStart !== -1) {
          suggestions = responseText.substring(suggestionsStart, conclusionStart).trim();
          suggestions = suggestions.replace(/\*/g, '');
          suggestions = suggestions.replace(/Conclusion:/, "");
        }

        if (conclusionStart !== -1) {
          conclusion = responseText.substring(conclusionStart, spamStart).trim();
          conclusion = conclusion.replace(/\*/g, '');
          conclusion = conclusion.replace(/Spam and Abusive Comments:/, '');
        }

        if (spamStart !== -1) {
          spam = responseText.substring(spamStart).trim();
          spam = spam.replace(/\*/g, '');
        }
  
        setGeminiResponse({
          summary: summary,
          recommendations: recommendations,
          suggestions: suggestions,
          conclusion: conclusion,
          spam: spam,

          videoStatistics: videoStatistics,
          videoPostedDate: videoPostedDate,
          channelName: channelName,
          channelProfile: channelProfile,
          videoTitle: videoTitle,
          videoThumbnail: videoThumbnail,
          subscriberCount: subscriberCount
        });
      } else {
        setError('Error fetching or processing comments. Please try again later.');
      }
  
      setError('');
    } catch (error) {
      setError('Error fetching comments or sending to backend. Please try again later.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
   



  const handleFetchComments = async (e) => {
    e.preventDefault();
    fetchComments();
  };


  
  const extractVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\*))([^?&"'>]+)/);
    return match ? match[1] : null;
  };



  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-20">
        <div className="max-w-4xl w-full p-10 pt-20 bg-gray-800 rounded-lg shadow-lg analytics">
          {/* <img src='analytics.png' className='cover absolute z-0  top-72 h-80'/> */}
          <h1 className="text-4xl font-bold text-center mb-8">YouTube Analyzer</h1>
          <form onSubmit={handleFetchComments} className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <input
                type="text"
                id="videoUrl"
                value={videoUrl}
                onChange={handleInputChange}
                placeholder="Paste YouTube URL here"
                className="text-white block w-full p-3 border border-gray-500 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 mb-20"
              />
              <button
                type="submit"
                className="py-2 px-4 mb-20 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                Analyze
              </button> 
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </form>
          {isLoading && (
            <div className="flex justify-center items-center mt-7">
              <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
            </div>
          )}
          
          {!isLoading && geminiResponse.summary && (
            <h2 className="text-5xl font-semibold text-center">R E P O R T</h2>
          )}

          
  
  {geminiResponse.channelName && (
  <div className="mt-8 rounded-lg p-4">
    <div className="flex items-center justify-center border-y py-5 border-blue-300">
      <img src={geminiResponse.channelProfile} alt="Channel Profile" className="w-16 h-16 rounded-full mr-4" />
      <div>
        <h2 className="text-2xl font-bold">{geminiResponse.channelName}</h2>
        <p className='text-gray-400'> {geminiResponse.subscriberCount.toLocaleString()} Subscribers</p>
      </div>
    </div>
  </div>
)}

{geminiResponse.videoStatistics && (
 <div className="mt-8 rounded-lg">
   <h2 className="text-2xl font-bold mb-4">Video Details:</h2>
    <div
      className="video-title p-8 bg-gray-700 rounded-lg shadow mb-10 border "
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(0.5, 0.5, 0.5, 0.48)), url(${videoThumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h3 className="text-xl font-semibold">Video Title:</h3>
      <span>{geminiResponse.videoTitle}</span>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="p-4 bg-gray-700 rounded-lg shadow">
 <h3 className="text-xl font-semibold">
    <FontAwesomeIcon icon={faThumbsUp} className="mr-2 text-blue-300" />Likes
 </h3>
 <p>{geminiResponse.videoStatistics.likeCount?.toLocaleString() || '--'}</p>
</div>
<div className="p-4 bg-gray-700 rounded-lg shadow">
 <h3 className="text-xl font-semibold">
    <FontAwesomeIcon icon={faThumbsDown} className="mr-2 text-red-400" />Dislikes
 </h3>
 <p>{geminiResponse.videoStatistics.dislikeCount || '--'}</p>
</div>
<div className="p-4 bg-gray-700 rounded-lg shadow">
 <h3 className="text-xl font-semibold">
    <FontAwesomeIcon icon={faComments} className="mr-2 text-blue-300" />Comments
 </h3>
 <p>{geminiResponse.videoStatistics.commentCount || '--'}</p>
</div>
<div className="p-4 bg-gray-700 rounded-lg shadow">
 <h3 className="text-xl font-semibold">
    <FontAwesomeIcon icon={faEye} className="mr-2 text-blue-300" />Views
 </h3>
 <p>{geminiResponse.videoStatistics.viewCount || '--'}</p>
</div>

 <div className="p-4 bg-gray-700 rounded-lg shadow">
    <h3 className="text-xl font-semibold">
       <FontAwesomeIcon icon={faCalendar} className="mr-2 text-blue-300" />Posted Date:
    </h3>
    <p>{new Date(geminiResponse.videoPostedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
 </div>
 <div className="p-4 bg-gray-700 rounded-lg shadow">
    <h3 className="text-xl font-semibold">
     <FontAwesomeIcon icon={faChartLine} className="mr-2 text-blue-300" />Engagement Rate:
    </h3>
     <p >{engagementRate}</p>
 </div>
</div>

 </div>
)}


  
           {geminiResponse.summary && (
            <div className="mt-8 border border-blue-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Summary of Comments:</h2>
              <div className="prose text-gray-300">
                {geminiResponse.summary.split("\n").map((line, index) => {
                  const parts = line.split(":");
                  if (parts.length > 1) {
                    return (
                      <p key={index}>
                        <strong>{parts[0].trim()}:</strong> {parts.slice(1).join(":").trim()}
                      </p>
                    );
                  } else {
                    return <p key={index}>{line.trim()}</p>;
                  }
                })}
              </div>
            </div>
          )}
          
  
          {geminiResponse.recommendations && (
            <div className="mt-8 border border-blue-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Area for Enhancement:</h2>
              <div className="prose text-gray-300">
                {geminiResponse.recommendations.split("\n").map((line, index) => {
                  const parts = line.split(":");
                  if (parts.length > 1) {
                    return (
                      <p key={index}>
                        <strong>{parts[0].trim()}:</strong> {parts.slice(1).join(":").trim()}
                      </p>
                    );
                  } else {
                    return <p key={index}>{line.trim()}</p>;
                  }
                })}
              </div>
            </div>
          )}



          {geminiResponse.suggestions && (
            <div className="mt-8 border border-blue-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Content Recommendation:</h2>
              <div className="prose text-gray-300">
                {geminiResponse.suggestions.split("\n").map((line, index) => {
                  const parts = line.split(":");
                  if (parts.length > 1) {
                    return (
                      <p key={index}>
                        <strong>{parts[0].trim()}:</strong> {parts.slice(1).join(":").trim()}
                      </p>
                    );
                  } else {
                    return <p key={index}>{line.trim()}</p>;
                  }
                })}
              </div>
            </div>
          )}

       {geminiResponse.conclusion && (
            <div className="mt-8 border border-blue-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Final Thoughts:</h2>
              <div className="prose text-gray-300">
                {geminiResponse.conclusion.split("\n").map((line, index) => {
                  const parts = line.split(":");
                  if (parts.length > 1) {
                    return (
                      <p key={index}>
                        <strong>{parts[0].trim()}:</strong> {parts.slice(1).join(":").trim()}
                      </p>
                    );
                  } else {
                    return <p key={index}>{line.trim()}</p>;
                  }
                })}
              </div>
            </div>
          )}
          

           {geminiResponse.spam && (
            <div className="mt-8 border border-blue-300 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Spam and Abusive Comments:</h2>
              <div className="prose text-gray-300">
                {geminiResponse.spam.split("\n").map((line, index) => {
                  const parts = line.split(":");
                  if (parts.length > 1) {
                    return (
                      <p key={index}>
                        <strong>{parts[0].trim()}:</strong> {parts.slice(1).join(":").trim()}
                      </p>
                    );
                  } else {
                    return <p key={index}>{line.trim()}</p>;
                  }
                })}
              </div>
            </div>
          )}




        </div>
      </div>
      <Footer />
    </div>
  );
          
    
};



export default CommentSummarizer;