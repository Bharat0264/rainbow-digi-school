import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ isPreview }) => ({
  appType: isPreview ? 'mpa' : 'spa',
  plugins: [
    tailwindcss(),
    react(),
  ],
}))
