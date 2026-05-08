import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Phone, MessageSquare, Clock, ChevronRight, Copy, Check } from 'lucide-react';

const configs = [
  { id: 1, title: 'Email Alert Template', icon: Mail, color: '#22d3ee',
    code: `Subject: [LEVEL] AntiTheft Alert - [EVENT]
    
Time: [TIMESTAMP]
Device: [DEVICE_MODEL]
Location: [GPS_LINK]
Event: [DETAILS]

Evidence Attached:
[EVIDENCE_LIST]

---
Sent by AntiTheft Shield` },
  { id: 2, title: 'Escalation Chain', icon: Bell, color: '#fbbf24',
    code: `// Try email first, then SMS, then Telegram
fun sendAlert(message: String, evidence: File) {
    try {
        sendEmail("emergency@gmail.com", message, evidence)
    } catch (e: Exception) {
        try { sendSMS("+254700000000", message) }
        catch (e2: Exception) {
            sendTelegram("@emergency_chat", message)
        }
    }
}` },
  { id: 3, title: 'Scheduled Digest', icon: Clock, color: '#34d399',
    code: `// Send summary every 6 hours
AlarmManager.setInexactRepeating(
    ELAPSED_REALTIME, SystemClock.elapsedRealtime(),
    6 * 3600 * 1000, digestPendingIntent)

fun sendDigest() {
    val summary = buildString {
        appendLine("6-HOUR DIGEST")
        appendLine("Photos: ${photoCount}")
        appendLine("Locations: ${locCount}")
        appendLine("WiFi: ${wifiCount}")
    }
    sendEmail("DIGEST", summary)
}` },
];

const AlertConfig = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(null);
  const copyCode = async (code, key) => { try { await navigator.clipboard.writeText(code); } catch {}; setCopied(key); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}><Bell size={28} color="#fbbf24" /> Alert Configuration</h1>
        <p style={{ color: 'var(--text-muted)' }}>Customize how alerts are delivered</p>
      </div>
      {configs.map((cfg) => (
        <motion.div key={cfg.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card" style={{ marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === cfg.id ? null : cfg.id)}>
            <cfg.icon size={24} color={cfg.color} />
            <div style={{ flex: 1 }}><h3 style={{ fontSize: '15px', fontWeight: 700 }}>{cfg.title}</h3></div>
            <ChevronRight size={14} style={{ transform: expandedId === cfg.id ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </div>
          {expandedId === cfg.id && (
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px', position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); copyCode(cfg.code, cfg.id); }}
                style={{ position: 'absolute', top: '18px', right: '8px', padding: '5px 12px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '11px', zIndex: 1 }}>
                {copied === cfg.id ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
              </button>
              <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '16px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4', fontFamily: 'monospace' }}><code>{cfg.code}</code></pre>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
export default AlertConfig;
