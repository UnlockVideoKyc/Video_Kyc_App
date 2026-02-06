import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


// export default defineConfig({
//   optimizeDeps: {
//     plugins: [react()],
//     entries: [], // Pre-bundle only necessary files
//   },
//   build: {
//     commonjsOptions: {
//       include: [/node_modules/],
//     },
//   },
// });