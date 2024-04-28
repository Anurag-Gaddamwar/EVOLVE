const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3001;
require('dotenv').config();

// Initialize the Google Generative AI with your API key
const API_KEY =  process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Middleware to parse JSON requests and handle CORS
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));

// Endpoint to handle POST requests for generating content
app.post('/generate-content', async (req, res) => {
  try {
    // Extract data from the request body sent by the frontend
    const {
      comments,
      videoTitle,
      likes,
      dislikes,
      commentsCount,
      datePosted,
      engagementRate,
      videoThumbnailUrl,
      subscriberCount,
      channelName,
    } = req.body;

    console.log('Data received from frontend:', req.body);

    // Include relevant data in the prompt for context
    const geminiResponse = await sendToGeminiAPI(
      comments,
      videoTitle,
      likes,
      dislikes,
      commentsCount,
      datePosted,
      engagementRate,
      videoThumbnailUrl,
      subscriberCount,
      channelName
    );

    // Send the geminiResponse back to the frontend
    res.json({ geminiResponse: geminiResponse.geminiResponse });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Error generating content' });
  }
});

// Function to send data to the Gemini API for content generation
async function sendToGeminiAPI(
  comments,
  videoTitle,
  likes,
  dislikes,
  commentsCount,
  datePosted,
  engagementRate,
  subscriberCount,
  channelName
) {
  try {
    // Get the gemini-pro model from Google Generative AI
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });


    const prompt = `Channel Name: ${channelName}\nVideo Title: ${videoTitle}\nLikes: ${likes}\nDislikes: ${dislikes}\nComments Count: ${commentsCount}\nDate Posted: ${datePosted}\nEngagement Rate: ${engagementRate}\nSubscriber Count: ${subscriberCount}\n\nComments:\n${comments}\n\nPlease analyze the comments and provide a comprehensive summary, recommendations for improvement, suggestions for content, and identify any spam and abusive comments.
    1. **Summary of Comments:** Provide a proper comprehensive summary that captures the main sentiments and feedback from the viewers. This should include any common themes, praises, or criticisms mentioned in the comments.
     
    2. **Recommendations for Improvement:** Based on the summary, offer specific recommendations on what content or aspects of the video could be improved or enhanced. Consider any areas where viewers expressed dissatisfaction or where there is potential for growth.

    3. **Suggestion of content:** Based on the comments and video title, understand the type of content that the creator posts, and based on that, considering the trending topics in that field, suggest the creator that what content should he post/work in the future to maximize their reach and growth.

    4. **Conclusion:** Based on the video metrics that I gave you like the channel name, video title, number of likes, dislikes, comments, views on the video, and the engagement ratio, understand the performance of the video and give the concluding feedback on the how is the video. Provide what should be an ideal engagement rate and what is mine, how much improvement is needed.

    5. **Spam and abusive comments:** Identify and mention all the spam and abusive comments, and provide recommendations on how to handle them effectively.

    Ensure your response is structured as follows:
    
    **Summary of Comments:** [Insert summary here (in a proper structure but not in points)]
    
    **Recommendations for Improvement:** [Insert recommendations here (in a proper structure but not in points)]
    
    **Suggestion of content:** [Insert suggestions here (in a proper structure but not in points)]
    
    **Conclusion:** [Insert conclusion here (in a proper structure but not in points)]
    
    **Spam and Abusive Comments:** [Insert identified spam and abusive comments here (in a proper structure but not in points)]`;


    
    // Generate content using the gemini-pro model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Return the generated response
    console.log(text);
    return { geminiResponse: text };
  } catch (error) {
    console.error('Error generating content with Gemini API:', error);
    return { geminiResponse: 'Error generating content with Gemini API' };
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
