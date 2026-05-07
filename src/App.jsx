import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Activity, Zap, AlertTriangle, Eye, Menu, X, Package } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CommandCenter from './pages/CommandCenter';
import Modules from './pages/Modules';
import Android15 from './pages/Android15';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Shield, label: 'Dashboard', color: '#22d3ee' },
    { path: '/modules', icon: Package, label: 'Modules', color: '#a78bfa' },
    { path: '/command', icon: Zap, label: 'Commands', color: '#fb923c' },
    { path: '/android15', icon: AlertTriangle, label: 'Android 15', color: '#f87171' },
  ];

  return (
    <div className="app-layout">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Shield size={32} className="logo-icon" />
          <h1 className="logo-text">AntiTheft</h1>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
            >
              <item.icon size={20} color={item.color} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="main-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/command" element={<CommandCenter />} />
          <Route path="/android15" element={<Android15 />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
