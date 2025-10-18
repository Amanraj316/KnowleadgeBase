import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ChatWindow = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { items: documents } = useSelector((state) => state.documents);
  const messagesEndRef = useRef(null);

  const isReady = documents.some(doc => doc.status === 'ready');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMessage = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/ai/chat', { query });
      const aiMessage = { sender: 'ai', text: response.data.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setQuery('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-15rem)]"> {/* Adjust height as needed */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-900 rounded-t-lg">
        {messages.length === 0 && (
          <div className="text-center text-gray-500">
            {isReady ? 'Your documents are ready. Ask a question to begin!' : 'Upload a document and wait for it to be processed.'}
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-800 border-t border-gray-700 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isReady ? "Ask anything..." : "Waiting for a document to be ready..."}
            disabled={!isReady || loading}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSend} disabled={!isReady || loading} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;