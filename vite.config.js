import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['aws-amplify']
  },
  define: {
    global: {},
  },
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,      // Optional: Specify the port if needed
  },
});
