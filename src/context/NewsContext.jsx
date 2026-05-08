import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('published_at'); // SNAPI uses published_at

  // We're switching to Spaceflight News API (SNAPI) 
  // because NewsAPI.org free tier blocks production (Vercel) requests.
  const fetchNews = useCallback(async (force = false) => {
    const cacheKey = `snapi_news_${searchQuery}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}_time`);

    if (!force && cachedData && cacheTime && (Date.now() - cacheTime < 15 * 60 * 1000)) {
      setArticles(JSON.parse(cachedData));
      return;
    }

    setLoading(true);
    try {
      // SNAPI v4 Endpoint
      let url = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=15';
      if (searchQuery) {
        url += `&search=${searchQuery}`;
      }
      
      const response = await axios.get(url);
      
      // Normalize data to match our existing component structure
      const normalizedArticles = response.data.results.map(article => ({
        title: article.title,
        description: article.summary,
        url: article.url,
        urlToImage: article.image_url,
        publishedAt: article.published_at,
        source: { name: article.news_site },
        author: article.news_site
      }));
      
      setArticles(normalizedArticles);
      localStorage.setItem(cacheKey, JSON.stringify(normalizedArticles));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      setError(null);
    } catch (err) {
      console.error('News Fetch Error:', err);
      setError('Failed to fetch space news.');
      toast.error('News feed is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleSearch = () => {
    fetchNews(true);
  };

  return (
    <NewsContext.Provider value={{
      articles,
      loading,
      error,
      category: 'Space', // Hardcoded as we are using a specialized space API now
      setCategory: () => {}, // No-op for compatibility
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      refresh: () => fetchNews(true),
      handleSearch
    }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
