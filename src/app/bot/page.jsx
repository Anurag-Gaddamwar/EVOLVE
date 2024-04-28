'use client';
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function BotChat() {
 const [messages, setMessages] = useState([]);
 const [input, setInput] = useState('');
 const messageContainerRef = useRef(null);

 const handleSendClick = async () => {
  const message = input.trim();
  if (message) {
     setMessages(prevMessages => [...prevMessages, { text: message, fromUser: true }]);
     setInput('');
 
     try {
       const response = await fetch('http://localhost:3002/botResponse', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ userRequest: message }),
       });
 
       if (!response.ok) {
         throw new Error('Network response was not ok');
       }
 
       const data = await response.json();
 
       // Clean and format the bot's response
       const formattedResponse = data.text
         .split(/\n/) // Split the response into lines
         .map((line, index) => {
           // Remove all occurrences of "*" from the line
           
           let cleanedLine = line.replace(/\*/g, '');
           cleanedLine = cleanedLine.replace(/Assistant:/, '');


 
           // Check if the line starts with a capital letter, indicating it's a head point
           if (/^[A-Z]/.test(cleanedLine.trim())) {
             // Wrap the head point in a <strong> tag for bold formatting
             return <p key={index}>{cleanedLine.trim()}</p>;
           } else {
             // Return the cleaned line as is, wrapped in a <p> tag for paragraphs
             return <p key={index}>{cleanedLine.trim()}</p>;
           }
         });
 
       const botResponse = <div><strong>Bot:</strong>{formattedResponse}</div>;
       setMessages(prevMessages => [...prevMessages, { text: botResponse, fromUser: false }]);
     } catch (error) {
       console.error('Error fetching data:', error);
       setMessages(prevMessages => [...prevMessages, { text: 'Error generating response.', fromUser: false }]);
     }
  }
 };
 

 const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendClick();
    }
 };

 useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
 }, [messages]);

 return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow overflow-hidden">
        <div className="flex-grow h-[80vh] max-h-[80vh] overflow-y-hidden relative">
          <h1 className="text-2xl font-bold py-4 px-6 bg-gray-800 text-white"><span className='text-blue-400'>Imagi</span>nate</h1>
          <div className="mt-20 mb-0 absolute inset-0 overflow-y-auto flex flex-col custom-scrollbar" ref={messageContainerRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message p-3 rounded-xl ${message.fromUser ? 'bg-blue-600 text-white self-end my-3 sm:mx-4 lg:mx-10 xl:mx-16 2xl:mx-24 flex justify-center' : 'bg-gray-300 text-gray-900 self-start my-3 sm:mx-4 lg:mx-10 xl:mx-16 2xl:mx-24 flex justify-center'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
        </div>

        <div className="message-input flex items-center bg-gray-800 p-4 rounded-2xl">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flexGrow: 1,
              border: '1px solid #4b5563',
              borderRadius: '12px',
              padding: '8px',
              outline: 'none',
              resize: 'none',
              color: '#d1d5db',
              backgroundColor: '#2d3748',
            }}
            placeholder="Type what you need help with..."
            onKeyDown={handleKeyDown}
          ></textarea>
          <button
            onClick={handleSendClick}
            style={{
              marginLeft: '8px',
              padding: '8px 16px',
              backgroundColor: '#4299e1',
              color: '#ffffff',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </main>

      <Footer />
    </div>
 );
}

export default BotChat;
