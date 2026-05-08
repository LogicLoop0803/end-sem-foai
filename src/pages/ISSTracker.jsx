import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useISS } from '../context/ISSContext';
import { 
  Navigation, 
  Map as MapIcon, 
  Info, 
  RefreshCw, 
  Crosshair,
  Globe,
  AlertCircle
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + React
// This is necessary because Vite renames assets, breaking Leaflet's default icon paths
const ISS_ICON = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2042/2042502.png',
  iconSize: [45, 45],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
  className: 'iss-marker-icon'
});

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lon], map.getZoom(), {
        animate: true,
        duration: 1
      });
    }
  }, [position, map]);
  return null;
};

const ISSTracker = () => {
  const { position, history, speed, altitude, nearestPlace, refresh, lastUpdated, error } = useISS();
  const [followMode, setFollowMode] = useState(true);

  const polylinePositions = history.map(h => [h.lat, h.lon]);

  if (error && !position) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold">Signal Lost</h2>
        <p className="text-slate-500 max-w-md text-center">We're having trouble connecting to the satellite tracking network. Please check your internet connection.</p>
        <button onClick={refresh} className="btn-primary flex items-center gap-2">
          <RefreshCw size={18} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ISS Live Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Globe size={16} className="text-space-500" /> 
            {nearestPlace || 'Fetching coordinates...'}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setFollowMode(!followMode)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-bold text-sm ${
              followMode ? 'bg-space-600 text-white shadow-lg' : 'bg-white dark:bg-space-900 border border-slate-200 dark:border-white/10'
            }`}
          >
            <Crosshair size={18} />
            {followMode ? 'Following' : 'Free Orbit'}
          </button>
          <button 
            onClick={refresh}
            className="p-2.5 bg-white dark:bg-space-900 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-space-800 transition-all"
            title="Force Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* Map Container */}
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden relative border-white/20 shadow-2xl">
          {position ? (
            <MapContainer 
              center={[position.lat, position.lon]} 
              zoom={3} 
              className="h-full w-full z-10"
              zoomControl={false}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline 
                positions={polylinePositions} 
                pathOptions={{ color: '#8b5cf6', weight: 3, opacity: 0.6, dashArray: '5, 10' }} 
              />
              <Marker position={[position.lat, position.lon]} icon={ISS_ICON}>
                <Popup className="custom-popup">
                  <div className="p-2 min-w-[150px]">
                    <p className="font-bold text-space-600 mb-1">ISS Location</p>
                    <div className="space-y-1 text-[10px]">
                      <p><strong>Lat:</strong> {position.lat.toFixed(4)}°</p>
                      <p><strong>Lon:</strong> {position.lon.toFixed(4)}°</p>
                      <p><strong>Alt:</strong> {Math.round(altitude)} km</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
              {followMode && <RecenterMap position={position} />}
            </MapContainer>
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center space-y-4 bg-slate-100 dark:bg-space-900/50">
              <div className="w-12 h-12 border-4 border-space-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 font-medium">Establishing Satellite Uplink...</p>
            </div>
          )}

          {/* Map Overlay Stats */}
          <div className="absolute bottom-6 left-6 z-[1000] flex gap-3">
             <div className="bg-white/90 dark:bg-space-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
                <p className="text-[10px] uppercase font-bold text-slate-500">Altitude</p>
                <p className="text-sm font-bold">{Math.round(altitude)} km</p>
             </div>
             <div className="bg-white/90 dark:bg-space-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl">
                <p className="text-[10px] uppercase font-bold text-slate-500">Velocity</p>
                <p className="text-sm font-bold">{Math.round(speed).toLocaleString()} km/h</p>
             </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              <Info size={20} className="text-space-500" />
              Mission Telemetry
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-space-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <span className="text-sm text-slate-500 font-medium">Latitude</span>
                <span className="font-mono font-bold text-space-600 dark:text-space-400 bg-white dark:bg-space-900 px-2 py-1 rounded-lg">
                  {position?.lat.toFixed(4)}°
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-space-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <span className="text-sm text-slate-500 font-medium">Longitude</span>
                <span className="font-mono font-bold text-space-600 dark:text-space-400 bg-white dark:bg-space-900 px-2 py-1 rounded-lg">
                  {position?.lon.toFixed(4)}°
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-space-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
                <span className="text-sm text-slate-500 font-medium">Last Sync</span>
                <span className="text-sm font-bold">{lastUpdated || 'Waiting...'}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4 flex-1 flex flex-col overflow-hidden">
            <h3 className="font-bold flex items-center gap-2 text-lg">
              <Navigation size={20} className="text-accent-pink" />
              Orbital Path
            </h3>
            <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                  Collecting tracking points...
                </div>
              ) : (
                history.slice().reverse().map((pos, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-space-800/30 rounded-xl border border-transparent hover:border-space-200 dark:hover:border-white/10 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-space-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {new Date(pos.timestamp * 1000).toLocaleTimeString()}
                      </p>
                      <p className="text-xs font-bold font-mono">
                        {pos.lat.toFixed(2)}, {pos.lon.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISSTracker;
