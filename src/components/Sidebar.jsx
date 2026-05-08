import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Newspaper, 
  Users, 
  Settings, 
  X,
  Orbit
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const links = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'ISS Tracker', path: '/iss', icon: MapPin },
    { name: 'Space News', path: '/news', icon: Newspaper },
    { name: 'Astronauts', path: '/astronauts', icon: Users },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/10 flex flex-col transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-space-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-space-500/30">
              <Orbit size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-space-600 to-accent-pink bg-clip-text text-transparent">
              SpacePulse
            </span>
          </div>
          <button className="lg:hidden p-2" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <link.icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-space-100/50 dark:bg-space-900/50 p-4 rounded-2xl border border-space-200/50 dark:border-white/5">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Storage Usage</p>
            <div className="w-full bg-slate-200 dark:bg-space-800 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '45%' }}
                className="bg-space-600 h-full rounded-full"
              />
            </div>
            <p className="text-[10px] mt-2 text-slate-400">450MB of 1GB Used</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
