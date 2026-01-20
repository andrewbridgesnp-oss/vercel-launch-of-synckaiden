import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';
import '../styles/globals.css';

// Performance monitoring
const reportWebVitals = (metric: any) => {
  if (import.meta.env.DEV) {
    console.warn('Web Vitals:', metric);
  }
  // In production, send to analytics service
  // Example: sendToAnalytics(metric);
};

// Register service worker for PWA capabilities (optional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.warn('SW registered:', registration);
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
      });
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create root with concurrent features
const root = createRoot(rootElement);

// Render app with StrictMode for better development experience
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Report web vitals
if (import.meta.env.DEV) {
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(reportWebVitals);
    onFID(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
  }).catch(() => {
    // web-vitals not available
  });
}
