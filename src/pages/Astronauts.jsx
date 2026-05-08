import React from 'react';
import { useISS } from '../context/ISSContext';
import { Users, Rocket, Ship, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const AstronautCard = ({ astronaut }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card p-6 rounded-3xl relative overflow-hidden group border-white/20"
  >
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Users size={120} />
    </div>
    <div className="flex items-center gap-4 relative z-10">
      <div className="w-16 h-16 bg-gradient-to-br from-space-500 to-accent-purple rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
        {astronaut.name.charAt(0)}
      </div>
      <div>
        <h3 className="font-bold text-lg">{astronaut.name}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Ship size={14} className="text-accent-pink" />
          Vessel: {astronaut.craft}
        </p>
      </div>
    </div>
    <div className="mt-6 flex gap-2">
      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Active Duty</span>
      <span className="text-[10px] bg-space-500/10 text-space-600 dark:text-space-400 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Specialist</span>
    </div>
  </motion.div>
);

const Astronauts = () => {
  const { astronauts, loading } = useISS();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Astronauts</h1>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Rocket size={16} /> Current personnel in Earth's orbit.
          </p>
        </div>
        <div className="bg-space-600 text-white px-6 py-3 rounded-2xl flex items-center gap-4 shadow-xl shadow-space-500/20">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold opacity-80">Total in Space</p>
            <p className="text-2xl font-black">{astronauts.length}</p>
          </div>
          <Users size={32} />
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
        <Info className="text-amber-600 mt-1" size={20} />
        <p className="text-sm text-amber-800 dark:text-amber-200">
          <strong>Mission Note:</strong> Data is synchronized with the Open Notify registry. Vessel assignments are updated in real-time as docking procedures are completed.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card h-32 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {astronauts.map((astro, idx) => (
            <AstronautCard key={idx} astronaut={astro} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Astronauts;
