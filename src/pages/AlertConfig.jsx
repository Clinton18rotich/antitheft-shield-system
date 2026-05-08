import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Clock, Copy, Check, ChevronRight } from 'lucide-react';

const configs = [
  {
    id: 1, title: 'Email Alert Template', icon: Mail, color: '#22d3ee',
    desc: 'Customizable email template with dynamic fields for theft alerts',
    code: 'Subject: [LEVEL] AntiTheft Alert - [EVENT]\n\nTime: [TIMESTAMP]\nDevice: [DEVICE_MODEL]\nLocation: [GPS_LINK]\nEvent: [DETAILS]\n\nEvidence Attached:\n[EVIDENCE_LIST]\n\n---\nSent by AntiTheft Shield'
  },
  {
    id: 2, title: 'Escalation Chain', icon: Bell, color: '#fbbf24',
    desc: 'Try email first, then SMS, then Telegram - never miss an alert',
    code: 'fun sendAlert(message: String, evidence: File) {\n    try { sendEmail("emergency@gmail.com", message, evidence) }\n    catch (e: Exception) {\n        try { sendSMS("+254700000000", message) }\n        catch (e2: Exception) {\n            sendTelegram("@emergency_chat", message)\n        }\n    }\n}'
  },
  {
    id: 3, title: 'Scheduled Digest', icon: Clock, color: '#34d399',
    desc: 'Send summary report every 6 hours with all evidence collected',
    code: 'AlarmManager.setInexactRepeating(\n    ELAPSED_REALTIME,\n    SystemClock.elapsedRealtime(),\n    6 * 3600 * 1000,\n    digestPendingIntent)\n\nfun sendDigest() {\n    val summary = "6-HOUR DIGEST\\nPhotos: $photoCount\\nLocations: $locCount"\n    sendEmail("DIGEST", summary)\n}'
  },
  {
    id: 4, title: 'Multi-Recipient Alerts', icon: Mail, color: '#a78bfa',
    desc: 'Send alerts to multiple emails and phones simultaneously',
    code: 'val recipients = listOf(\n    "emergency@gmail.com",\n    "police@kenya.go.ke",\n    "backup@gmail.com"\n)\n\nrecipients.forEach { email ->\n    sendEmail(email, subject, body, evidence)\n}'
  },
  {
    id: 5, title: 'Silent vs Loud Alerts', icon: Bell, color: '#f87171',
    desc: 'Choose between silent tracking or loud alarm based on situation',
    code: 'enum class AlertMode { SILENT, LOUD }\n\nfun triggerAlert(mode: AlertMode) {\n    when (mode) {\n        SILENT -> { capturePhoto(); sendEmail() }\n        LOUD -> { lockDevice(); soundAlarm(); flashSOS() }\n    }\n}'
  },
];

const AlertConfig = () => {
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
          <Bell size={32} color="#fbbf24" />
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Alert Configuration</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Customize how and when alerts are delivered</p>
      </div>

      {configs.map((cfg) => (
        <motion.div key={cfg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card" style={{ marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === cfg.id ? null : cfg.id)}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: cfg.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <cfg.icon size={24} color={cfg.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{cfg.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cfg.desc}</p>
            </div>
            <ChevronRight size={14} style={{ transform: expandedId === cfg.id ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </div>
          {expandedId === cfg.id && (
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px', position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); copyCode(cfg.code, cfg.id); }}
                style={{ position: 'absolute', top: '18px', right: '8px', padding: '5px 12px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '11px', zIndex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {copied === cfg.id ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
              </button>
              <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '16px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', maxHeight: '250px', border: '1px solid #30363d', fontFamily: 'monospace' }}>
                <code>{cfg.code}</code>
              </pre>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AlertConfig;
