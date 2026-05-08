import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Server, Cloud, Radio, Bluetooth, Smartphone, Monitor, Shield, Zap, ChevronRight, Copy, Check, Lightbulb, Activity, Send } from 'lucide-react';

const techniques = [
  {
    id: 1, title: 'Reverse SSH Tunnel', icon: Server, color: '#22d3ee',
    desc: 'Phone creates SSH tunnel to your server. You connect back through it.',
    code: 'ssh -N -R 2222:localhost:5555 user@your-server.com\n# Then you connect:\nssh -p 2222 localhost\nadb connect localhost:2222',
    useCase: 'Full remote shell. Execute commands, pull files, stream camera.'
  },
  {
    id: 2, title: 'Ngrok Reverse Proxy', icon: Cloud, color: '#a78bfa',
    desc: 'Phone runs ngrok exposing ADB to public URL. No server needed.',
    code: 'ngrok tcp 5555\n# Output: tcp://0.tcp.ngrok.io:12345\n# You connect:\nadb connect 0.tcp.ngrok.io:12345',
    useCase: 'Instant ADB access. Zero config. Works behind NAT.'
  },
  {
    id: 3, title: 'Cloudflare Tunnel', icon: Cloud, color: '#fb923c',
    desc: 'Enterprise free tunnel via Cloudflare. Custom domain, HTTPS.',
    code: 'cloudflared tunnel create antitheft\ncloudflared tunnel run antitheft\n# Access via: https://phone.yourdomain.com',
    useCase: 'Production-grade persistent tunnel. No port forwarding needed.'
  },
  {
    id: 4, title: 'WebRTC P2P Direct', icon: ArrowLeftRight, color: '#34d399',
    desc: 'Browser-to-phone P2P. No server after handshake. Ultra-low latency.',
    code: 'val peer = PeerConnectionFactory.createPeerConnection()\npeer.createOffer()\n// Direct data channel for commands + file transfer',
    useCase: 'Direct P2P. Stream camera live. Voice calls to thief.'
  },
  {
    id: 5, title: 'Tor Hidden Service', icon: Shield, color: '#8b5cf6',
    desc: 'Phone becomes .onion service. Anonymous, firewall-proof access.',
    code: 'tor -f torrc\n# HiddenServicePort 5555\n# .onion address generated\n# Connect via Tor:\nadb connect abcdef.onion:5555',
    useCase: 'Untraceable. Bypasses all firewalls. Hostile network proof.'
  },
  {
    id: 6, title: 'DNS Tunnel (Iodine)', icon: Radio, color: '#f472b6',
    desc: 'Tunnel IP over DNS. Works on captive portals, restricted WiFi.',
    code: 'iodine -f -P password tunnel.domain.com\n# Creates tun interface\n# Now SSH/ADB over DNS',
    useCase: 'Works on hotel/airport WiFi. Bypasses paywalls.'
  },
  {
    id: 7, title: 'WebSocket Shell', icon: Zap, color: '#fbbf24',
    desc: 'Phone connects to your server. Send commands, get output.',
    code: 'val ws = OkHttpClient().newWebSocket("wss://server.com/shell")\nws.send("ls /sdcard")\n// Output returned via WebSocket',
    useCase: 'Browser-based shell. Execute any command remotely.'
  },
  {
    id: 8, title: 'MQTT C2 Channel', icon: Activity, color: '#06b6d4',
    desc: 'Lightweight IoT protocol. Phone subscribes to commands.',
    code: 'mqtt.subscribe("cmd/device123")\nmqtt.publish("result/device123", output)\n// Thousands of devices on one server',
    useCase: 'Ultra-lightweight. Instant commands globally.'
  },
  {
    id: 9, title: 'Telegram Bot Control', icon: Send, color: '#0088cc',
    desc: 'Control phone through Telegram chat. Easiest setup.',
    code: '/photo -> Bot captures photo\n/location -> Bot sends GPS\n/audio -> Bot records audio\n/shell ls -> Bot executes command',
    useCase: 'Chat-based control. All evidence to your Telegram.'
  },
  {
    id: 10, title: 'Bluetooth PAN', icon: Bluetooth, color: '#3b82f6',
    desc: 'Connect via Bluetooth. Works offline without internet.',
    code: 'bt-pan server bridge\n# Laptop connects via Bluetooth PAN\n# IP connectivity without WiFi/data',
    useCase: 'Offline access when thief has no internet.'
  },
];

const ReverseConnection = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(null);

  const copyCode = async (code, key) => {
    try { await navigator.clipboard.writeText(code); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = code; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    }
    setCopied(key); setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <ArrowLeftRight size={32} color="#22d3ee" />
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Reverse Connection Techniques</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
          {techniques.length} methods to connect TO the stolen phone through firewalls.
          Phone initiates outbound connection (always works). You connect back.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '28px' }}>
        {[
          { label: 'Techniques', value: techniques.length, color: '#22d3ee' },
          { label: 'Firewall Bypass', value: '100%', color: '#34d399' },
          { label: 'No Port Forward', value: 'All', color: '#a78bfa' },
          { label: 'Works via NAT', value: 'All', color: '#fbbf24' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 800, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ marginBottom: '24px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>How It Works</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {['📱 Stolen Phone', '🔒 Firewall', '☁️ Relay', '💻 You'].map((step, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ fontSize: '20px' }}>→</span>}
              <span style={{ padding: '10px 16px', background: 'var(--bg-primary)', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>{step}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {techniques.map((tech) => (
        <motion.div key={tech.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card" style={{ marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === tech.id ? null : tech.id)}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: tech.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <tech.icon size={24} color={tech.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{tech.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{tech.desc}</p>
            </div>
            <ChevronRight size={14} style={{ transform: expandedId === tech.id ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </div>

          {expandedId === tech.id && (
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px' }}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <button onClick={(e) => { e.stopPropagation(); copyCode(tech.code, tech.id); }}
                  style={{ position: 'absolute', top: '8px', right: '8px', padding: '5px 12px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                  {copied === tech.id ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  {copied === tech.id ? 'Copied' : 'Copy'}
                </button>
                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#22d3ee' }}>Implementation</h4>
                <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '16px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', maxHeight: '200px', overflowY: 'auto', border: '1px solid #30363d', fontFamily: 'monospace' }}>
                  <code>{tech.code}</code>
                </pre>
              </div>
              <div style={{ padding: '10px', background: 'rgba(34,211,238,0.05)', borderRadius: '8px', border: '1px solid rgba(34,211,238,0.1)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#22d3ee' }}>Use Case: </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tech.useCase}</span>
              </div>
            </div>
          )}
        </motion.div>
      ))}

      <div className="glass-card" style={{ background: 'rgba(34,211,238,0.05)', borderColor: 'rgba(34,211,238,0.2)', marginTop: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lightbulb size={18} color="#fbbf24" /> Key Insight
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Traditional connections fail because NAT/firewall blocks inbound traffic.
          <strong style={{ color: '#22d3ee' }}> Reverse connections solve this:</strong> the stolen phone
          initiates outbound (which always works), creating a tunnel you can connect back through.
          Combine with email delivery for the most reliable anti-theft system.
        </p>
      </div>
    </div>
  );
};

export default ReverseConnection;
