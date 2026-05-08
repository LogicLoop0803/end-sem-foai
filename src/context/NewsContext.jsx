import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('technology');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');

  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  const fetchNews = async (force = false) => {
    // Check cache
    const cacheKey = `news_${category}_${searchQuery}_${sortBy}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(`${cacheKey}_time`);

    if (!force && cachedData && cacheTime && (Date.now() - cacheTime < 15 * 60 * 1000)) {
      setArticles(JSON.parse(cachedData));
      return;
    }

    setLoading(true);
    try {
      const url = searchQuery 
        ? `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=${sortBy}&apiKey=${API_KEY}`
        : `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}`;
      
      const response = await axios.get(url);
      const data = response.data.articles.filter(a => a.title !== '[Removed]');
      
      setArticles(data);
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      setError(null);
    } catch (err) {
      setError('Failed to fetch news. Please check your API key.');
      toast.error('News API error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (API_KEY) fetchNews();
  }, [category, sortBy]);

  const handleSearch = () => {
    fetchNews(true);
  };

  return (
    <NewsContext.Provider value={{
      articles,
      loading,
      error,
      category,
      setCategory,
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
