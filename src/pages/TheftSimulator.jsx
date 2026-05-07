import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Camera, MapPin, Mic, Wifi, Mail, Shield, Lock, AlertTriangle, CheckCircle, Clock, Phone, Smartphone } from 'lucide-react';

const theftScenario = [
  { time: '2:00:00 PM', event: 'Thief grabs phone and runs', icon: '🏃', type: 'theft', detail: 'Motion sensors detect sudden acceleration', color: '#f87171', data: null },
  { time: '2:00:03 PM', event: 'Motion triggers instant lock', icon: '🔒', type: 'action', detail: 'Screen locked, device secured', color: '#fb923c', data: { device: 'Locked' } },
  { time: '2:00:05 PM', event: 'Silent photo captured', icon: '📸', type: 'evidence', detail: 'Front camera captures thief face', color: '#22d3ee', data: { photo: 'thief_face.jpg' } },
  { time: '2:00:10 PM', event: 'Location sent to Gmail', icon: '📧', type: 'communication', detail: 'GPS coordinates emailed', color: '#34d399', data: { lat: '-1.2921', lng: '36.8219' } },
  { time: '2:01:00 PM', event: 'Thief tries power off', icon: '🔌', type: 'action', detail: 'Fake shutdown activates - screen off, tracking on', color: '#a78bfa', data: { shutdown: 'fake' } },
  { time: '2:02:00 PM', event: 'Thief thinks phone is off', icon: '💭', type: 'theft', detail: 'Phone appears dead but fully operational', color: '#f87171', data: { actual: 'Tracking active' } },
  { time: '2:05:00 PM', event: 'GPS tracking active', icon: '🛰️', type: 'tracking', detail: 'Location logged every 5 minutes', color: '#34d399', data: { tracking: '5min interval' } },
  { time: '2:10:00 PM', event: 'SIM swap detected', icon: '📶', type: 'alert', detail: 'New SIM inserted - new number captured', color: '#fbbf24', data: { sim: '+254 798 123 456' } },
  { time: '2:10:30 PM', event: 'Photo sent to new SIM', icon: '📤', type: 'communication', detail: 'Thief photo delivered to captured number', color: '#22d3ee', data: { sent: 'photo + location' } },
  { time: '2:10:35 PM', event: 'Evidence sent to Gmail', icon: '📧', type: 'communication', detail: 'Photo + location + SIM info emailed', color: '#34d399', data: { email: 'emergency@gmail.com' } },
  { time: '2:11:00 PM', event: 'Audio recording starts', icon: '🎤', type: 'evidence', detail: 'Ambient microphone capture activated', color: '#f472b6', data: { recording: 'ambient.mp3' } },
  { time: '2:16:00 PM', event: 'Audio file sent to Gmail', icon: '📧', type: 'communication', detail: '5-min recording with voices delivered', color: '#34d399', data: { audio: '5min_recording.mp3' } },
  { time: '2:20:00 PM', event: 'WiFi network logged', icon: '📡', type: 'tracking', detail: 'Thief connects to home WiFi - SSID captured', color: '#a78bfa', data: { ssid: 'Home_Network_5G' } },
  { time: '2:30:00 PM', event: 'Police report generated', icon: '📋', type: 'action', detail: 'Complete dossier with all evidence', color: '#fb923c', data: { report: 'Full evidence package' } },
  { time: '3:00:00 PM', event: 'Police have all evidence', icon: '👮', type: 'complete', detail: 'Face, voice, location, WiFi, SIM - case ready', color: '#22d3ee', data: { status: 'Case Ready' } },
];

const TheftSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [speed, setSpeed] = useState(1);
  const [logs, setLogs] = useState([]);
  const [evidence, setEvidence] = useState({});
  const timerRef = useRef(null);

  const startSimulation = () => {
    setIsRunning(true);
    setIsPaused(false);
    setLogs([]);
    setEvidence({});
    if (currentStep >= theftScenario.length - 1) setCurrentStep(-1);
  };

  const pauseSimulation = () => setIsPaused(!isPaused);
  const resetSimulation = () => {
    clearTimeout(timerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(-1);
    setLogs([]);
    setEvidence({});
  };

  const skipAhead = () => {
    if (currentStep < theftScenario.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (!isRunning || isPaused) return;
    if (currentStep >= theftScenario.length - 1) {
      setIsRunning(false);
      return;
    }

    timerRef.current = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 2000 / speed);
    return () => clearTimeout(timerRef.current);
  }, [isRunning, isPaused, currentStep, speed]);

  useEffect(() => {
    if (currentStep < 0) return;
    const event = theftScenario[currentStep];
    setLogs(prev => [...prev, { ...event, timestamp: new Date().toLocaleTimeString() }]);
    if (event.data) {
      setEvidence(prev => ({ ...prev, [event.type]: event.data }));
    }
  }, [currentStep]);

  const getStatusColor = (type) => {
    const colors = {
      theft: '#f87171', action: '#fb923c', evidence: '#22d3ee',
      tracking: '#34d399', communication: '#a78bfa', alert: '#fbbf24', complete: '#22d3ee'
    };
    return colors[type] || '#666';
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Play size={28} color="#f87171" /> Theft Simulator
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Real-time demonstration of anti-theft response
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{
              padding: '8px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer'
            }}
          >
            <option value={0.5}>0.5x Speed</option>
            <option value={1}>1x Speed</option>
            <option value={2}>2x Speed</option>
            <option value={5}>5x Speed</option>
            <option value={10}>10x Speed</option>
          </select>
          {!isRunning ? (
            <button onClick={startSimulation} style={{
              padding: '10px 20px', background: '#f87171', border: 'none', borderRadius: '10px',
              color: '#fff', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Play size={16} /> Start Simulation
            </button>
          ) : (
            <>
              <button onClick={pauseSimulation} style={{
                padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '10px', color: '#fff', cursor: 'pointer'
              }}>
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <button onClick={resetSimulation} style={{
                padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '10px', color: '#fff', cursor: 'pointer'
              }}>
                <RotateCcw size={16} />
              </button>
              <button onClick={skipAhead} style={{
                padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '10px', color: '#fff', cursor: 'pointer'
              }}>
                <SkipForward size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Timeline */}
        <div className="glass-card" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            ⏱️ Timeline ({currentStep + 1}/{theftScenario.length})
          </h3>
          {isRunning && (
            <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', marginBottom: '16px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: '#f87171', borderRadius: '2px' }}
                animate={{ width: `${((currentStep + 1) / theftScenario.length) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          )}
          {theftScenario.map((event, i) => (
            <motion.div
              key={i}
              animate={{
                opacity: i <= currentStep ? 1 : 0.3,
                scale: i === currentStep ? 1.02 : 1
              }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '12px',
                padding: '10px 0', position: 'relative'
              }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: i <= currentStep ? `${getStatusColor(event.type)}22` : 'var(--bg-card)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0,
                border: `2px solid ${i <= currentStep ? getStatusColor(event.type) : 'var(--border)'}`
              }}>
                {event.icon}
              </div>
              {i < theftScenario.length - 1 && (
                <div style={{
                  position: 'absolute', left: '17px', top: '46px', bottom: '-10px',
                  width: '2px', background: i < currentStep ? getStatusColor(event.type) : 'var(--border)'
                }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{
                    fontWeight: i === currentStep ? 700 : 500, fontSize: '13px',
                    color: i <= currentStep ? '#fff' : 'var(--text-muted)'
                  }}>
                    {event.event}
                  </span>
                  <span style={{
                    fontSize: '11px', color: i <= currentStep ? getStatusColor(event.type) : 'var(--text-muted)',
                    fontFamily: 'monospace'
                  }}>
                    {event.time}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{event.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Evidence Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ flex: 1 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>📊 Evidence Collected</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { icon: '📸', label: 'Photos', key: 'evidence', value: evidence.evidence ? '1 captured' : 'Waiting...' },
                { icon: '📍', label: 'Location', key: 'communication', value: evidence.communication ? 'GPS locked' : 'Waiting...' },
                { icon: '📶', label: 'SIM Info', key: 'alert', value: evidence.alert ? 'New SIM captured' : 'Waiting...' },
                { icon: '📡', label: 'WiFi', key: 'tracking', value: evidence.tracking ? 'Network logged' : 'Waiting...' },
                { icon: '🎤', label: 'Audio', key: 'evidence' },  
                { icon: '📧', label: 'Gmail', key: 'communication', value: evidence.communication ? 'Email sent' : 'Waiting...' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '12px', background: 'var(--bg-primary)', borderRadius: '10px',
                  textAlign: 'center', opacity: item.value ? 1 : 0.5
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: '11px', color: item.value ? '#34d399' : 'var(--text-muted)', marginTop: '2px' }}>
                    {item.value || 'Waiting...'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ background: 'rgba(34,211,238,0.05)', borderColor: 'rgba(34,211,238,0.2)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#22d3ee' }}>
              📧 Email Delivery Status
            </h3>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {evidence.communication ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} color="#34d399" />
                  Evidence sent to emergency@gmail.com
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color="var(--text-muted)" />
                  Awaiting evidence collection...
                </div>
              )}
            </div>
            {currentStep >= theftScenario.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '12px', padding: '12px', background: 'rgba(34,211,153,0.1)',
                  borderRadius: '10px', border: '1px solid rgba(34,211,153,0.3)'
                }}
              >
                <p style={{ fontSize: '13px', color: '#34d399', fontWeight: 600 }}>
                  ✅ Simulation Complete! Police have all evidence.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Log Console */}
      <div className="glass-card">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>📝 System Log</h3>
        <div style={{
          maxHeight: '200px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px',
          background: 'var(--bg-primary)', borderRadius: '10px', padding: '12px'
        }}>
          {logs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
              Press Start Simulation to begin...
            </p>
          ) : (
            logs.map((log, i) => (
              <div key={i} style={{ padding: '4px 0', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>[{log.timestamp}]</span>{' '}
                <span style={{ color: getStatusColor(log.type) }}>{log.icon}</span>{' '}
                {log.event} - <span style={{ color: 'var(--text-muted)' }}>{log.detail}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TheftSimulator;
