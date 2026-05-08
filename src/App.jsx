import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Play, Package, Zap, Eye, AlertTriangle, Menu, X, Sun, Moon, Lightbulb, ArrowLeftRight, Download } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import TheftSimulator from './pages/TheftSimulator';
import Modules from './pages/Modules';
import CommandCenter from './pages/CommandCenter';
import EvidenceFlow from './pages/EvidenceFlow';
import Android15 from './pages/Android15';
import Android15Bypass from './pages/Android15Bypass';
import ReverseConnection from './pages/ReverseConnection';
import RemoteInstall from './pages/RemoteInstall';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', icon: Shield, label: 'Dashboard', color: '#22d3ee' },
    { path: '/simulator', icon: Play, label: 'Simulator', color: '#f87171' },
    { path: '/modules', icon: Package, label: 'Modules', color: '#a78bfa' },
    { path: '/command', icon: Zap, label: 'Commands', color: '#fb923c' },
    { path: '/flow', icon: Eye, label: 'Evidence Flow', color: '#34d399' },
    { path: '/reverse', icon: ArrowLeftRight, label: 'Reverse Connect', color: '#22d3ee' },
    { path: '/install', icon: Download, label: 'Remote Install', color: '#a78bfa' },
    { path: '/bypass', icon: Lightbulb, label: 'Bypass', color: '#fbbf24' },
    { path: '/android15', icon: AlertTriangle, label: 'Restrictions', color: '#f87171' },
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
            <button key={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}>
              <item.icon size={20} color={item.color} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
      <main className="main-area">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/simulator" element={<TheftSimulator />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/command" element={<CommandCenter />} />
          <Route path="/flow" element={<EvidenceFlow />} />
          <Route path="/reverse" element={<ReverseConnection />} />
          <Route path="/install" element={<RemoteInstall />} />
          <Route path="/bypass" element={<Android15Bypass />} />
          <Route path="/android15" element={<Android15 />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;
