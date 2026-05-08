import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ISSContext = createContext();

export const ISSProvider = ({ children }) => {
  const [position, setPosition] = useState(null);
  const [history, setHistory] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [altitude, setAltitude] = useState(0);
  const [astronauts, setAstronauts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nearestPlace, setNearestPlace] = useState('Fetching...');

  // Using wheretheiss.at API - It's HTTPS and more reliable than open-notify
  const fetchISSData = useCallback(async () => {
    try {
      let response;
      try {
        response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544', { timeout: 10000 });
      } catch (directErr) {
        console.warn('Direct ISS fetch failed, trying proxy...');
        response = await axios.get('https://api.allorigins.win/raw?url=https://api.wheretheiss.at/v1/satellites/25544');
      }

      const { latitude, longitude, velocity, altitude: alt, timestamp } = response.data;
      
      const newPos = {
        lat: parseFloat(latitude),
        lon: parseFloat(longitude),
        timestamp: timestamp
      };

      setPosition(newPos);
      setSpeed(velocity);
      setAltitude(alt);
      setLastUpdated(new Date().toLocaleTimeString());

      setHistory(prev => {
        if (prev.length > 0 && prev[prev.length - 1].timestamp === timestamp) return prev;
        return [...prev, newPos].slice(-30);
      });

      fetchNearestPlace(latitude, longitude);
      setError(null);
    } catch (err) {
      console.error('ISS Fetch Error:', err);
      setError('Failed to fetch ISS location');
      if (loading) toast.error('ISS Tracking error. Mission control is unreachable.');
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const fetchNearestPlace = async (lat, lon) => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`, {
        headers: {
          'User-Agent': 'SpacePulse-Dashboard/1.0'
        },
        timeout: 5000
      });
      setNearestPlace(res.data.display_name || 'Over the Ocean');
    } catch (e) {
      setNearestPlace('Over the Ocean');
    }
  };

  const fetchAstronauts = async () => {
    try {
      const response = await axios.get('https://api.allorigins.win/raw?url=http://api.open-notify.org/astros.json'); 
      setAstronauts(response.data.people);
    } catch (err) {
      console.error('Failed to fetch astronauts, using fallback data');
      setAstronauts([
        { name: 'Oleg Kononenko', craft: 'ISS' },
        { name: 'Nikolai Chub', craft: 'ISS' },
        { name: 'Tracy Caldwell Dyson', craft: 'ISS' },
        { name: 'Matthew Dominick', craft: 'ISS' },
        { name: 'Michael Barratt', craft: 'ISS' },
        { name: 'Jeanette Epps', craft: 'ISS' },
        { name: 'Alexander Grebenkin', craft: 'ISS' }
      ]);
    }
  };

  useEffect(() => {
    fetchISSData();
    fetchAstronauts();
    const interval = setInterval(fetchISSData, 15000);
    return () => clearInterval(interval);
  }, [fetchISSData]);

  return (
    <ISSContext.Provider value={{
      position,
      history,
      speed,
      altitude,
      astronauts,
      loading,
      error,
      lastUpdated,
      nearestPlace,
      refresh: fetchISSData
    }}>
      {children}
    </ISSContext.Provider>
  );
};

export const useISS = () => useContext(ISSContext);
