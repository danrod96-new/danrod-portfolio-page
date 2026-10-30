import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://danrod96-new.github.io/danrod-portfolio-page/
  base: '/danrod-portfolio-page/',
})
