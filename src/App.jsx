import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import { ThemeProvider } from './context/ThemeContext';
import { ISSProvider } from './context/ISSContext';
import { NewsProvider } from './context/NewsContext';
import { ChatProvider } from './context/ChatContext';

// Lazy loading pages for performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ISSTracker = lazy(() => import('./pages/ISSTracker'));
const News = lazy(() => import('./pages/News'));
const Astronauts = lazy(() => import('./pages/Astronauts'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="w-12 h-12 border-4 border-space-600 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-slate-500 font-medium animate-pulse">Initializing Systems...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ISSProvider>
        <NewsProvider>
          <ChatProvider>
            <DashboardLayout>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/iss" element={<ISSTracker />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/astronauts" element={<Astronauts />} />
                  <Route path="*" element={
                    <div className="text-center py-20">
                      <h2 className="text-4xl font-bold mb-4">404 - Lost in Space</h2>
                      <p className="text-slate-500">The coordinate you're looking for doesn't exist.</p>
                    </div>
                  } />
                </Routes>
              </Suspense>
            </DashboardLayout>
          </ChatProvider>
        </NewsProvider>
      </ISSProvider>
    </ThemeProvider>
  );
}

export default App;
