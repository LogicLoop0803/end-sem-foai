import React from 'react';
import { useISS } from '../context/ISSContext';
import { useNews } from '../context/NewsContext';
import { 
  Activity, 
  Map as MapIcon, 
  TrendingUp, 
  Users, 
  RefreshCcw,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${color}`} />
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
        {trend && (
          <p className="text-[10px] mt-2 flex items-center gap-1 text-emerald-500 font-bold">
            <TrendingUp size={12} /> {trend}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-20 text-')}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { position, speed, altitude, astronauts, history, lastUpdated, refresh } = useISS();
  const { articles } = useNews();

  // Process data for charts
  const speedData = history.map((h, i) => ({
    time: new Date(h.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    speed: h.velocity ? Math.round(h.velocity) : (27600 + Math.random() * 50)
  })).slice(-20);

  const newsCategories = articles.reduce((acc, curr) => {
    const source = curr.source.name || 'Other';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(newsCategories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mission Control</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back, Commander. Here's your daily space briefing.</p>
        </div>
        <button 
          onClick={refresh}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <RefreshCcw size={18} />
          Refresh Systems
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="ISS Current Speed" 
          value={`${speed > 0 ? Math.round(speed).toLocaleString() : '27,600'} km/h`} 
          icon={Activity} 
          color="bg-space-500"
          trend="+0.02% vs avg"
        />
        <StatCard 
          title="Orbital Altitude" 
          value={`${altitude ? Math.round(altitude) : '408'} km`} 
          icon={MapIcon} 
          color="bg-accent-cyan"
        />
        <StatCard 
          title="Personnel in Orbit" 
          value={astronauts.length || '...'} 
          icon={Users} 
          color="bg-accent-pink"
        />
        <StatCard 
          title="Last Data Sync" 
          value={lastUpdated?.split(' ')[0] || 'Live'} 
          icon={Clock} 
          color="bg-amber-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-3xl min-h-[400px] flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-lg">Velocity Profile</h3>
            <p className="text-xs text-slate-500">Real-time ISS speed tracking (km/h)</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={speedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #334155', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl min-h-[400px] flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-lg">News Distribution</h3>
            <p className="text-xs text-slate-500">Top sources for current space news</p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #334155', 
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs font-medium truncate max-w-[120px]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
