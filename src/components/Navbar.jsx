import React from 'react';
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useISS } from '../context/ISSContext';

const Navbar = ({ toggleSidebar }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { lastUpdated } = useISS();

  return (
    <header className="h-16 glass-card border-b border-white/10 flex items-center justify-between px-4 md:px-8 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-space-900 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-space-900/50 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-white/5">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search mission control..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-48 ml-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:block text-right mr-2">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Live Feed</p>
          <p className="text-xs font-medium text-space-600 dark:text-space-400">
            {lastUpdated ? `Sync: ${lastUpdated}` : 'Connecting...'}
          </p>
        </div>

        <button 
          onClick={toggleDarkMode}
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-space-900 rounded-xl transition-all active:scale-90"
        >
          {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-space-600" />}
        </button>

        <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-space-900 rounded-xl transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-pink rounded-full border-2 border-white dark:border-space-950"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-1"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-space-500 to-accent-purple flex items-center justify-center text-white font-bold text-sm shadow-md">
            JD
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold">Commander Doe</p>
            <p className="text-[10px] text-slate-500">Mission Specialist</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
