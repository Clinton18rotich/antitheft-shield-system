import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Camera, MapPin, Mic, Wifi, Shield, FileText, CheckCircle, ArrowRight, Download, Eye, Smartphone, Database, Lock, Send } from 'lucide-react';

const emailPreview = {
  to: 'emergency@gmail.com',
  from: 'antitheft-shield@device.com',
  subject: '🚨 THEFT ALERT - Device Stolen - Evidence Attached',
  body: `THEFT INCIDENT REPORT\n\nINCIDENT DETAILS:\nTime: 2:00 PM\nDevice: Samsung Galaxy S24\nTrigger: Motion Detection\n\nEVIDENCE COLLECTED:\n\n📸 Photos: 3 captured\n📍 Location: -1.2921, 36.8219\n📶 SIM: +254 798 123 456\n📡 WiFi: Home_Network_5G\n🎤 Audio: 5min recording\n\nDEVICE STATUS:\n🔒 Locked\n🔌 Fake Shutdown Active\n🛰️ GPS Tracking Active\n🔋 Battery: 72%\n\nAll evidence attached below.`,
  attachments: [
    'thief_face_01.jpg (245 KB)',
    'thief_face_02.jpg (198 KB)',
    'location_track.json (12 KB)',
    'ambient_recording.mp3 (2.3 MB)',
    'police_report.pdf (156 KB)',
  ]
};

const flowSteps = [
  { id: 1, icon: Smartphone, title: 'Stolen Device', desc: 'Theft detected via motion sensors', color: '#f87171', outputs: ['Motion detected', 'Screen locked', 'Sensors activated'] },
  { id: 2, icon: Camera, title: 'Capture Evidence', desc: 'Photo, GPS, audio recording', color: '#fb923c', outputs: ['Photos captured', 'GPS coordinates', 'Audio recording'] },
  { id: 3, icon: Database, title: 'Package Data', desc: 'Encrypt and compress evidence', color: '#a78bfa', outputs: ['Encrypted package', 'Compressed files', 'Metadata added'] },
  { id: 4, icon: Lock, title: 'Secure Transmission', desc: 'SMTP over TLS to Gmail', color: '#22d3ee', outputs: ['TLS encrypted', 'Authenticated', 'Queued'] },
  { id: 5, icon: Mail, title: 'Gmail Delivery', desc: 'Email with all evidence attached', color: '#34d399', outputs: ['In inbox', 'Attachments ready', 'Map link active'] },
];

const EvidenceFlow = () => {
  const [showEmail, setShowEmail] = useState(false);
  const [activeStep, setActiveStep] = useState(null);

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Eye size={28} color="#34d399" /> Evidence Flow
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            How evidence travels from stolen device to your Gmail
          </p>
        </div>
        <button
          onClick={() => setShowEmail(!showEmail)}
          style={{
            padding: '10px 20px', background: showEmail ? '#34d399' : 'var(--bg-card)',
            border: '1px solid var(--border)', borderRadius: '10px', color: showEmail ? '#000' : '#fff',
            cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Mail size={16} />
          {showEmail ? 'Hide Email' : 'View Email Preview'}
        </button>
      </div>

      {/* Flow Diagram */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>📧 Data Flow Pipeline</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {flowSteps.map((step, i) => (
            <React.Fragment key={step.id}>
              <div
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                style={{
                  width: '140px', padding: '16px', background: activeStep === step.id ? `${step.color}15` : 'var(--bg-primary)',
                  borderRadius: '14px', border: `2px solid ${activeStep === step.id ? step.color : 'var(--border)'}`,
                  cursor: 'pointer', textAlign: 'center', transition: 'all 0.3s'
                }}
              >
                <step.icon size={28} color={step.color} style={{ marginBottom: '8px' }} />
                <h4 style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>{step.title}</h4>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{step.desc}</p>
              </div>
              {i < flowSteps.length - 1 && (
                <ArrowRight size={20} color="var(--text-muted)" />
              )}
            </React.Fragment>
          ))}
        </div>

        {activeStep && (
          <div style={{
            marginTop: '16px', padding: '16px', background: 'var(--bg-primary)',
            borderRadius: '12px', border: '1px solid var(--border)'
          }}>
            <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
              Outputs: {flowSteps.find(s => s.id === activeStep)?.title}
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {flowSteps.find(s => s.id === activeStep)?.outputs.map((out, i) => (
                <span key={i} style={{
                  padding: '6px 12px', background: 'var(--bg-card)', borderRadius: '8px',
                  fontSize: '12px', color: 'var(--text-secondary)'
                }}>{out}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Email Preview */}
      {showEmail && (
        <div className="glass-card" style={{ marginBottom: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>📧 Email Preview</h3>
            <span style={{ fontSize: '12px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} /> Delivered
            </span>
          </div>
          <div style={{
            background: '#1e1e1e', borderRadius: '12px', padding: '20px',
            color: '#ddd', fontFamily: 'monospace', fontSize: '12px',
            maxHeight: '400px', overflowY: 'auto', lineHeight: '1.6'
          }}>
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '12px', marginBottom: '12px' }}>
              <div style={{ color: '#888' }}><strong style={{ color: '#ccc' }}>From:</strong> {emailPreview.from}</div>
              <div style={{ color: '#888' }}><strong style={{ color: '#ccc' }}>To:</strong> {emailPreview.to}</div>
              <div style={{ color: '#888' }}><strong style={{ color: '#ccc' }}>Subject:</strong> {emailPreview.subject}</div>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '11px', color: '#bbb' }}>
              {emailPreview.body}
            </pre>
            <div style={{ borderTop: '1px solid #333', marginTop: '12px', paddingTop: '12px' }}>
              <div style={{ color: '#888', marginBottom: '8px' }}>
                <strong style={{ color: '#ccc' }}>📎 Attachments ({emailPreview.attachments.length}):</strong>
              </div>
              {emailPreview.attachments.map((att, i) => (
                <div key={i} style={{ color: '#60a5fa', padding: '3px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={12} /> {att}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="glass-card">
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>⏱️ Evidence Timeline</h3>
        {[
          { time: '2:00:05', event: 'Photo captured', detail: 'Front camera silent capture', icon: '📸', color: '#22d3ee' },
          { time: '2:00:10', event: 'Location obtained', detail: 'GPS + Network triangulation', icon: '📍', color: '#34d399' },
          { time: '2:00:12', event: 'Data packaged', detail: 'Encrypted and compressed', icon: '📦', color: '#a78bfa' },
          { time: '2:00:15', event: 'Email sent', detail: 'SMTP to emergency@gmail.com', icon: '📧', color: '#fbbf24' },
          { time: '2:00:17', event: 'Email delivered', detail: 'In your inbox with all evidence', icon: '✅', color: '#34d399' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0',
            borderBottom: i < 4 ? '1px solid var(--border)' : 'none'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '12px', color: item.color, fontFamily: 'monospace', fontWeight: 600, minWidth: '70px' }}>{item.time}</span>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{item.event}</span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidenceFlow;
