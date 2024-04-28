const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();
const port = 3003;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;  /// replace with API key

// Middleware to parse JSON requests and handle CORS
app.use(express.json());
app.use(cors());

// Endpoint to fetch video IDs based on channel ID using YouTube Data API
app.get('/api/get-videos', async (req, res) => {
 try {
     const { channelId } = req.query;
     const uploadsPlaylistId = await fetchUploadsPlaylistId(channelId);
     const videoIds = await fetchVideoIdsByPlaylistId(uploadsPlaylistId);
     res.json({ videoIds }); // Return video IDs
 } catch (error) {
     console.error('Error fetching video IDs:', error);
     res.status(500).json({ error: 'Error fetching video IDs' });
 }
});

// Function to fetch the uploads playlist ID for a channel
async function fetchUploadsPlaylistId(channelId) {
 try {
     const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
       params: {
         part: 'contentDetails',
         id: channelId,
         key: YOUTUBE_API_KEY,
       },
     });
     return response.data.items[0].contentDetails.relatedPlaylists.uploads;
 } catch (error) {
     console.error('Error fetching uploads playlist ID:', error);
     throw new Error('Error fetching uploads playlist ID');
 }
}

// Function to fetch video IDs and titles based on playlist ID using YouTube Data API
async function fetchVideoIdsByPlaylistId(playlistId) {
  try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet,contentDetails', // Fetch video titles
          playlistId: playlistId,
          key: YOUTUBE_API_KEY,
          maxResults: 20, // Fetch only the 20 latest videos
        },
      });
      return response.data.items.map((item) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
      }));
  } catch (error) {
      console.error('Error fetching video IDs and titles:', error);
      throw new Error('Error fetching video IDs and titles');
  }
 }
 

// Start the server
app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});
