import React, { createContext, useContext, useState, useEffect } from 'react';
import { useISS } from './ISSContext';
import { useNews } from './NewsContext';
import { fetchAIResponse } from '../services/aiService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: 'Hello! I am your SpacePulse Assistant. I can help you with real-time ISS tracking data and the latest space news. How can I help you today?' }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  
  const { position, speed, astronauts, nearestPlace } = useISS();
  const { articles } = useNews();

  useEffect(() => {
    if (!import.meta.env.VITE_AI_TOKEN) {
      console.warn('⚠️ VITE_AI_TOKEN is not defined in your environment variables!');
    }
    localStorage.setItem('chatHistory', JSON.stringify(messages.slice(-30)));
  }, [messages]);

  const sendMessage = async (userMessage) => {
    // Add user message
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsTyping(true);
    setLoadingStatus('Consulting mission control...');

    // Prepare dynamic context
    const issContext = `
      CURRENT ISS STATUS:
      - Latitude: ${position?.lat?.toFixed(4) || 'Unknown'}
      - Longitude: ${position?.lon?.toFixed(4) || 'Unknown'}
      - Speed: ${speed > 0 ? Math.round(speed).toLocaleString() : '27,600'} km/h
      - Location: Over ${nearestPlace || 'the Ocean'}
      - Astronauts in space: ${astronauts.length} (${astronauts.map(a => a.name).join(', ')})
    `;

    const newsContext = `
      LATEST SPACE NEWS:
      ${articles.slice(0, 5).map((a, i) => `${i+1}. ${a.title}`).join('\n')}
    `;

    // Strict System Prompt
    const systemInstruction = `You are a SpacePulse dashboard assistant. You can ONLY answer questions using ISS tracking data, astronaut data, and news data available in this dashboard. If the question is unrelated (like coding, general knowledge, or other topics), refuse politely and suggest asking about the space station or current news. 

    ${issContext}
    ${newsContext}

    Current User Question: ${userMessage}
    Assistant Answer:`;

    // Create the final prompt in Mistral Instruct format
    const fullPrompt = `<s>[INST] ${systemInstruction} [/INST]`;

    try {
      const aiResponse = await fetchAIResponse(fullPrompt);
      
      // Simulate streaming effect for the response
      const newAiMessage = { role: 'assistant', content: '' };
      setMessages([...updatedMessages, newAiMessage]);
      
      let currentText = '';
      const words = aiResponse.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        currentText += words[i] + ' ';
        setMessages([...updatedMessages, { role: 'assistant', content: currentText.trim() }]);
        // Variable typing speed for realism
        await new Promise(r => setTimeout(r, 20 + Math.random() * 30));
      }

    } catch (error) {
      console.error('Chat Context Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: "AI service is temporarily unavailable. Please verify your connection and try again." 
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
      setLoadingStatus('');
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat history cleared. How can I help you explore space today?' }]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      isTyping, 
      loadingStatus, 
      clearChat 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
