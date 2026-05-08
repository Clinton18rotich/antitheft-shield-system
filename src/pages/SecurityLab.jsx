import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Smartphone, Lock, Unlock, Cpu, HardDrive, ChevronRight, Copy, Check } from 'lucide-react';

const tests = [
  { id: 1, name: 'Root Detection', icon: Cpu, color: '#f87171',
    code: `fun isRooted(): Boolean {
    val paths = listOf(
        "/system/app/Superuser.apk",
        "/sbin/su", "/system/bin/su",
        "/system/xbin/su", "/data/local/su"
    )
    if (paths.any { File(it).exists() }) return true
    
    try {
        Runtime.getRuntime().exec("su")
        return true
    } catch (e: Exception) { return false }
}` },
  { id: 2, name: 'Bootloader Status', icon: Unlock, color: '#fb923c',
    code: `fun isBootloaderUnlocked(): Boolean {
    return try {
        val process = Runtime.getRuntime().exec("getprop ro.boot.flash.locked")
        process.inputStream.bufferedReader().readText().trim() != "1"
    } catch (e: Exception) { false }
}` },
  { id: 3, name: 'USB Debugging Check', icon: Smartphone, color: '#22d3ee',
    code: `fun isUSBDebugEnabled(): Boolean {
    return Settings.Global.getInt(
        contentResolver, ADB_ENABLED, 0) == 1
}` },
  { id: 4, name: 'Developer Options', icon: Cpu, color: '#a78bfa',
    code: `fun isDevOptionsEnabled(): Boolean {
    return Settings.Global.getInt(
        contentResolver, DEVELOPMENT_SETTINGS_ENABLED, 0) == 1
}` },
  { id: 5, name: 'Encryption Status', icon: Lock, color: '#34d399',
    code: `fun isEncrypted(): Boolean {
    val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
    return dpm.storageEncryptionStatus == 
        DevicePolicyManager.ENCRYPTION_STATUS_ACTIVE
}` },
];

const SecurityLab = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(null);
  const copyCode = async (code, key) => { try { await navigator.clipboard.writeText(code); } catch {}; setCopied(key); setTimeout(() => setCopied(null), 2000); };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}><Shield size={28} color="#34d399" /> Security Testing Lab</h1>
        <p style={{ color: 'var(--text-muted)' }}>Verify device security status and detect tampering</p>
      </div>
      {tests.map((test) => (
        <motion.div key={test.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card" style={{ marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === test.id ? null : test.id)}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: test.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><test.icon size={24} color={test.color} /></div>
            <div style={{ flex: 1 }}><h3 style={{ fontSize: '15px', fontWeight: 700 }}>{test.name}</h3></div>
            <ChevronRight size={14} style={{ transform: expandedId === test.id ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </div>
          {expandedId === test.id && (
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px', position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); copyCode(test.code, test.id); }}
                style={{ position: 'absolute', top: '18px', right: '8px', padding: '5px 12px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '11px', zIndex: 1 }}>
                {copied === test.id ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
              </button>
              <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '16px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', fontFamily: 'monospace' }}><code>{test.code}</code></pre>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
export default SecurityLab;
