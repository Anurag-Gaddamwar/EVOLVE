const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const app = express();
const port = 3002;

const API_KEY = process.env.GEMINI_API_KEY; 
const genAI = new GoogleGenerativeAI(API_KEY);

// Middleware to parse JSON requests and handle CORS
app.use(express.json());
app.use(cors({
 origin: 'http://localhost:3000',
}));

app.post('/botResponse', async (req, res) => {
 try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Extract the question from the request body
    const { userRequest } = req.body;

    // Craft a more detailed prompt to guide the AI
    const detailedPrompt=`You are a YouTube content creation assistant. I said - ${userRequest}`;

    // Generate content using the gemini-pro model with the detailed prompt
    const result = await model.generateContent(detailedPrompt);
    const response = await result.response;
    const text = await response.text();


    res.json({ text });
 } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Error generating content' });
 }
});

// Start the server
app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});