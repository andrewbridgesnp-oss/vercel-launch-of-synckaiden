import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh
      fastRefresh: true,
      // Babel configuration for production optimizations
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === 'production' && [
            'transform-remove-console',
            { exclude: ['error', 'warn'] }
          ]
        ].filter(Boolean)
      }
    })
  ],
  
  // Build optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for production debugging
    sourcemap: false,
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      }
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend'],
          'icons-vendor': ['lucide-react'],
          
          // Component chunks
          'ui-components': [
            './components/ui/button.tsx',
            './components/ui/card.tsx',
            './components/ui/dialog.tsx',
            './components/ui/dropdown-menu.tsx',
            './components/ui/select.tsx',
            './components/ui/tabs.tsx'
          ]
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Target modern browsers for better optimization
    target: 'es2020',
    
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Asset inline limit (smaller assets will be inlined as base64)
    assetsInlineLimit: 4096
  },
  
  // Development server configuration
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    open: true
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    host: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'recharts',
      'lucide-react',
      'react-dnd',
      'react-dnd-html5-backend'
    ]
  },
  
  // Environment variable prefix
  envPrefix: 'VITE_'
});
