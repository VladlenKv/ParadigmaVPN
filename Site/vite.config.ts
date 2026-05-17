import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(() => {
  const isGitHubPages = process.env.GITHUB_PAGES === "true";

  return {
    base: isGitHubPages ? "/ParadigmaVPN/" : "/",
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": "http://localhost:3001",
      },
    },
  };
})
