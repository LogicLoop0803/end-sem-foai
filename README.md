# 🚀 SpacePulse AI Dashboard

SpacePulse is a production-level React + Vite dashboard designed for tracking the International Space Station (ISS), exploring the latest space news, and interacting with an AI mission assistant.

![Dashboard Preview](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop)

## ✨ Features

- **🛰️ Live ISS Tracking**: Real-time position updates every 15 seconds with Leaflet maps.
- **📈 Advanced Telemetry**: Speed calculation (Haversine), trajectory mapping, and velocity charts.
- **📰 News Hub**: Integrated News API with search, sorting, category filtering, and localStorage caching.
- **🤖 AI Mission Assistant**: Floating chatbot using Mistral-7B via HuggingFace, restricted to space data context.
- **📊 Data Visualization**: Interactive charts using Recharts for speed and news distribution.
- **🌗 Modern UI/UX**: Space-inspired glassmorphism design with Dark/Light mode support.
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop viewports.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **Maps**: Leaflet.js, React-Leaflet
- **Charts**: Recharts
- **State Management**: React Context API
- **Networking**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- NPM or Yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory (or use the provided one):
   ```env
   VITE_NEWS_API_KEY=your_news_api_key
   VITE_AI_TOKEN=your_huggingface_token
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌍 Deployment

### Deploying to Vercel

1. **Push to GitHub**: Initialize a git repo and push your code.
2. **Import to Vercel**: Connect your GitHub account and select the repository.
3. **Configure Environment Variables**: Add `VITE_NEWS_API_KEY` and `VITE_AI_TOKEN` in the Vercel dashboard.
4. **Deploy**: Click "Deploy" and your dashboard will be live!

### Production Build

To create a production bundle:
```bash
npm run build
```
The output will be in the `dist` folder.

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components
├── context/      # Global state (ISS, News, Theme, Chat)
├── hooks/        # Custom React hooks
├── layouts/      # Page layout wrappers
├── pages/        # Dashboard, ISS, News, Astronauts
├── services/     # API service layers
├── utils/        # Calculation helpers (Haversine)
└── assets/       # Static assets
```

## 📜 License

MIT License - Copyright (c) 2026 SpacePulse AI
