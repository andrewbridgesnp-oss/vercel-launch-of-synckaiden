import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TrendBrief from './pages/TrendBrief';
import VideoQueue from './pages/VideoQueue';
import Scheduler from './pages/Scheduler';
import Affiliates from './pages/Affiliates';
import Capabilities from './pages/Capabilities';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary font-mono">Loading...</div>
      </div>
    );
  }

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/trends"
            element={
              <PrivateRoute>
                <TrendBrief />
              </PrivateRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <PrivateRoute>
                <VideoQueue />
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <PrivateRoute>
                <Scheduler />
              </PrivateRoute>
            }
          />
          <Route
            path="/affiliates"
            element={
              <PrivateRoute>
                <Affiliates />
              </PrivateRoute>
            }
          />
          <Route
            path="/capabilities"
            element={
              <PrivateRoute>
                <Capabilities />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" theme="dark" richColors />
    </AuthProvider>
  );
}

export default App;
