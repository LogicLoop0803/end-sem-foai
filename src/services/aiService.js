import axios from 'axios';
import { retryWithBackoff } from '../utils/retry';

const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
/**
 * Sends a message to the Mistral AI model via HuggingFace Inference API
 */
export const fetchAIResponse = async (prompt) => {
  const TOKEN = import.meta.env.VITE_AI_TOKEN;

  if (!TOKEN || TOKEN === '' || TOKEN.includes('YOUR_HUGGINGFACE_TOKEN')) {
    console.error('AI Service: Token is missing or invalid.');
    return "Error: AI Token (VITE_AI_TOKEN) is missing or still set to placeholder. If you are running locally, check your .env file and restart the server. If this is a hosted website, please add VITE_AI_TOKEN to your environment variables in the hosting dashboard (e.g. Vercel/Netlify settings).";
  }

  const callApi = () => axios.post(
    API_URL,
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.9,
        return_full_text: false
      },
      options: {
        wait_for_model: true, // This tells HF to wait if model is loading
        use_cache: true
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 second timeout
    }
  );

  try {
    if (import.meta.env.DEV) console.log('🚀 AI Requesting with Token:', TOKEN.substring(0, 5) + '...');
    
    const response = await retryWithBackoff(callApi, 3, 2000);
    
    if (import.meta.env.DEV) console.log('✅ AI Response:', response.data);

    const result = response.data;
    
    // Some models return an array, some return an object
    if (Array.isArray(result) && result[0]?.generated_text) {
      return result[0].generated_text.trim();
    } else if (result.generated_text) {
      return result.generated_text.trim();
    }
    
    if (result.error) {
       console.error('HF API Error Object:', result.error);
       return `AI Error: ${result.error}`;
    }
    
    return "I received an empty response from the mission archives.";
  } catch (error) {
    console.error('❌ AI Service Exception:', error);
    
    if (error.code === 'ECONNABORTED') {
      return "Connection timed out. Mission control is taking too long to respond.";
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      console.error(`Status: ${status}`, data);

      if (status === 401) return "Authentication failed. Your VITE_AI_TOKEN might be invalid or expired.";
      if (status === 404) return "Model not found. Please verify the model ID in aiService.js.";
      if (status === 429) return "Rate limit reached. HuggingFace is throttling requests. Please wait a minute.";
      if (status === 503) return "The AI model is currently overloaded or loading. Retrying might help.";
      
      return `Mission Control Error (${status}): ${data?.error || 'Unknown error'}`;
    }
    
    return `Network Error: ${error.message}. Check your internet connection.`;
  }
};
