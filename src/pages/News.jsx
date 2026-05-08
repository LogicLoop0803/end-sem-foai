import React from 'react';
import { useNews } from '../context/NewsContext';
import { 
  Search, 
  RefreshCcw, 
  ExternalLink, 
  Calendar, 
  User,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';

const NewsCard = ({ article }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card rounded-3xl overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300 border-white/20"
  >
    <div className="h-48 overflow-hidden relative">
      <img 
        src={article.urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'} 
        alt={article.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-space-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
          {article.source.name}
        </span>
      </div>
    </div>
    <div className="p-5 flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(article.publishedAt).toLocaleDateString()}</span>
        <span className="flex items-center gap-1"><User size={12} /> {article.author || 'Mission Control'}</span>
      </div>
      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-space-600 dark:group-hover:text-space-400 transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
        {article.description}
      </p>
      <a 
        href={article.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 dark:bg-space-800 rounded-xl font-bold text-sm hover:bg-space-600 hover:text-white transition-all group/btn"
      >
        Read Mission Report
        <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
      </a>
    </div>
  </motion.div>
);

const News = () => {
  const { 
    articles, 
    loading, 
    searchQuery, 
    setSearchQuery, 
    refresh,
    handleSearch
  } = useNews();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Space News Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Verified transmissions from global space agencies.</p>
        </div>
        <div className="flex items-center gap-2 bg-space-600/10 text-space-600 dark:text-space-400 px-4 py-2 rounded-2xl border border-space-600/20">
          <Rocket size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Live SNAPI Feed</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 glass-card rounded-2xl flex items-center px-4 py-2 border-white/20">
          <Search size={20} className="text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search interstellar archives..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1 ml-2"
          />
        </div>
        <button 
          onClick={refresh}
          className="p-3 bg-space-600 text-white rounded-2xl hover:bg-space-700 transition-all shadow-lg flex items-center gap-2 px-6"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
          <span className="hidden sm:inline font-bold text-sm">Sync Feed</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card rounded-3xl h-96 animate-pulse bg-slate-200 dark:bg-space-900/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}

      {!loading && articles.length === 0 && (
        <div className="text-center py-20 glass-card rounded-3xl">
          <p className="text-slate-500 font-medium">No transmissions found matching your criteria.</p>
          <button onClick={() => { setSearchQuery(''); }} className="mt-4 text-space-600 font-bold">Clear Search</button>
        </div>
      )}
    </div>
  );
};

export default News;
