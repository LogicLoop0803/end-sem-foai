import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // If you are deploying to GitHub Pages, uncomment the line below and replace 'REPO_NAME' with your repository name.
  // base: '/REPO_NAME/',
})
