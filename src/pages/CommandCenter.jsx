import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Send, Mail, Camera, MapPin, Mic, Wifi, Lock, Shield, Phone,
  CheckCircle, XCircle, Copy, Check, Code, ChevronDown, ChevronRight,
  Play, Square, Download
} from 'lucide-react';

const commands = [
  {
    cmd: 'PHOTO',
    desc: 'Capture silent photo of thief',
    icon: Camera,
    color: '#22d3ee',
    working: true,
    code: `// Silent Photo Capture via Camera2 API
private fun executePhotoCommand() {
    val cameraManager = getSystemService(CAMERA_SERVICE) as CameraManager
    val cameraId = cameraManager.cameraIdList.first { id ->
        cameraManager.getCameraCharacteristics(id)
            .get(LENS_FACING) == LENS_FACING_FRONT
    }
    
    val file = File(externalCacheDir, "thief_\${System.currentTimeMillis()}.jpg")
    val reader = ImageReader.newInstance(1920, 1080, ImageFormat.JPEG, 1)
    
    reader.setOnImageAvailableListener({ r ->
        val image = r.acquireLatestImage()
        val bytes = ByteArray(image.planes[0].buffer.remaining())
        image.planes[0].buffer.get(bytes)
        FileOutputStream(file).use { it.write(bytes) }
        image.close()
        sendToEmail(file) // Forward to Gmail
        cameraDevice.close()
    }, backgroundHandler)
    
    cameraManager.openCamera(cameraId, 
        object : CameraDevice.StateCallback() {
            override fun onOpened(camera: CameraDevice) {
                cameraDevice = camera
                camera.createCaptureSession(
                    listOf(reader.surface),
                    object : CameraCaptureSession.StateCallback() {
                        override fun onConfigured(session: CameraCaptureSession) {
                            val request = camera.createCaptureRequest(TEMPLATE_STILL_CAPTURE).apply {
                                addTarget(reader.surface)
                                set(FLASH_MODE, FLASH_MODE_OFF)
                            }
                            session.capture(request.build(), null, backgroundHandler)
                        }
                        override fun onConfigureFailed(s: CameraCaptureSession) {}
                    }, backgroundHandler)
            }
            override fun onDisconnected(c: CameraDevice) { c.close() }
            override fun onError(c: CameraDevice, e: Int) { c.close() }
        }, backgroundHandler)
}`,
    emailTemplate: `To: emergency@gmail.com
Subject: 📸 PHOTO CAPTURED - Thief Identified

Photo attached: thief_photo.jpg
Timestamp: ${new Date().toISOString()}
Camera: Front (silent capture)
Resolution: 1920x1080`
  },
  {
    cmd: 'LOCATION',
    desc: 'Get GPS coordinates',
    icon: MapPin,
    color: '#34d399',
    working: true,
    code: `// GPS Location Capture
private suspend fun executeLocationCommand() {
    val lm = getSystemService(LOCATION_SERVICE) as LocationManager
    
    val location = suspendCancellableCoroutine<Location?> { cont ->
        lm.requestLocationUpdates(
            GPS_PROVIDER, 0L, 0f,
            object : LocationListener {
                override fun onLocationChanged(loc: Location) {
                    lm.removeUpdates(this)
                    cont.resume(loc)
                }
                override fun onProviderDisabled(p: String) { cont.resume(null) }
            }
        )
    }
    
    location?.let { loc ->
        val mapsLink = "https://maps.google.com/?q=\${loc.latitude},\${loc.longitude}"
        val body = """
            📍 LOCATION UPDATE
            Latitude: \${loc.latitude}
            Longitude: \${loc.longitude}
            Accuracy: \${loc.accuracy}m
            Altitude: \${loc.altitude}m
            Speed: \${loc.speed}m/s
            Maps: $mapsLink
        """.trimIndent()
        
        sendEmail("📍 LOCATION UPDATE", body)
    }
}`,
    emailTemplate: `To: emergency@gmail.com
Subject: 📍 LOCATION UPDATE

Latitude: -1.292100
Longitude: 36.821900
Accuracy: 4.2 meters
Maps: https://maps.google.com/?q=-1.2921,36.8219`
  },
  {
    cmd: 'AUDIO',
    desc: 'Start ambient recording',
    icon: Mic,
    color: '#fbbf24',
    working: true,
    code: `// Ambient Audio Recording
private fun executeAudioCommand() {
    val sampleRate = 44100
    val bufferSize = AudioRecord.getMinBufferSize(
        sampleRate,
        AudioFormat.CHANNEL_IN_MONO,
        AudioFormat.ENCODING_PCM_16BIT
    )
    
    val recorder = AudioRecord(
        MediaRecorder.AudioSource.MIC,
        sampleRate,
        AudioFormat.CHANNEL_IN_MONO,
        AudioFormat.ENCODING_PCM_16BIT,
        bufferSize
    )
    
    val file = File(externalCacheDir, "recording_\${System.currentTimeMillis()}.pcm")
    
    recorder.startRecording()
    
    thread {
        val data = ShortArray(bufferSize)
        FileOutputStream(file).use { fos ->
            var totalSamples = 0
            while (totalSamples < sampleRate * 300) { // 5 minutes
                val read = recorder.read(data, 0, data.size)
                if (read > 0) {
                    // Write raw PCM data
                    data.take(read).forEach { sample ->
                        fos.write((sample.toInt() and 0xFF))
                        fos.write((sample.toInt() shr 8) and 0xFF)
                    }
                    totalSamples += read
                }
            }
        }
        recorder.stop()
        recorder.release()
        
        // Convert to MP3 and send
        val mp3File = convertPCMtoMP3(file)
        sendEmail("🎤 AUDIO RECORDING", "Recording attached", mp3File)
    }
}`,
    emailTemplate: `To: emergency@gmail.com
Subject: 🎤 AUDIO RECORDING COMPLETE

Duration: 5 minutes
Format: MP3 128kbps
File: ambient_recording.mp3 (2.3 MB)
Voices detected: 2 speakers`
  },
  {
    cmd: 'WIFI_SCAN',
    desc: 'Log WiFi networks',
    icon: Wifi,
    color: '#a78bfa',
    working: true,
    code: `// WiFi Network Scanner
private fun executeWiFiScan() {
    val wifiManager = getSystemService(WIFI_SERVICE) as WifiManager
    
    registerReceiver(object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            val results = wifiManager.scanResults
            val report = StringBuilder()
            
            results.sortedByDescending { it.level }.forEach { network ->
                report.appendLine("""
                    SSID: \${network.SSID}
                    BSSID: \${network.BSSID}
                    Signal: \${network.level} dBm
                    Frequency: \${network.frequency} MHz
                    Security: \${network.capabilities}
                    ---
                """.trimIndent())
            }
            
            sendEmail("📡 WiFi SCAN RESULTS", report.toString())
            unregisterReceiver(this)
        }
    }, IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION))
    
    wifiManager.startScan()
}`,
    emailTemplate: `To: emergency@gmail.com
Subject: 📡 WiFi NETWORKS DETECTED

SSID: Home_Network_5G
BSSID: AA:BB:CC:DD:EE:FF
Signal: -45 dBm (Excellent)
Frequency: 5180 MHz (5GHz)
Security: WPA2-PSK`
  },
  {
    cmd: 'LOCK',
    desc: 'Lock device instantly',
    icon: Lock,
    color: '#f87171',
    working: true,
    code: `// Instant Device Lock
private fun executeLockCommand() {
    val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
    val adminComponent = ComponentName(this, DeviceAdminReceiver::class.java)
    
    if (dpm.isAdminActive(adminComponent)) {
        dpm.lockNow()
        
        // Also set a temporary PIN for extra security
        // dpm.resetPassword("secureTemp123", 
        //     DevicePolicyManager.RESET_PASSWORD_REQUIRE_ENTRY)
        
        sendEmail("🔒 DEVICE LOCKED", """
            Device locked successfully.
            Time: \${System.currentTimeMillis()}
            Method: DevicePolicyManager.lockNow()
        """.trimIndent())
    } else {
        // Request device admin
        val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComponent)
        startActivity(intent)
    }
}`,
    emailTemplate: `To: emergency@gmail.com
Subject: 🔒 DEVICE LOCKED

Status: Screen locked
Method: DevicePolicyManager.lockNow()
Time: Immediate`
  },
  {
    cmd: 'REPORT',
    desc: 'Generate police report',
    icon: Shield,
    color: '#fb923c',
    working: true,
    code: `// Police Report Generator
private suspend fun executeReportCommand() {
    val report = buildString {
        appendLine("═══════════════════════════════")
        appendLine("     POLICE THEFT REPORT")
        appendLine("═══════════════════════════════")
        appendLine()
        appendLine("DEVICE INFO:")
        appendLine("Brand: \${Build.BRAND}")
        appendLine("Model: \${Build.MODEL}")
        appendLine("Serial: \${Build.SERIAL}")
        appendLine()
        
        // Collect all evidence
        val photos = getCapturedPhotos()
        val locations = getLocationHistory()
        val wifiNetworks = getWiFiLogs()
        val audioFiles = getAudioRecordings()
        
        appendLine("EVIDENCE SUMMARY:")
        appendLine("📸 Photos: \${photos.size} captured")
        appendLine("📍 Location points: \${locations.size}")
        appendLine("📡 WiFi networks: \${wifiNetworks.size}")
        appendLine("🎤 Audio recordings: \${audioFiles.size}")
        appendLine()
        
        if (locations.isNotEmpty()) {
            val last = locations.last()
            appendLine("LAST KNOWN LOCATION:")
            appendLine("https://maps.google.com/?q=\${last.lat},\${last.lng}")
        }
    }
    
    // Attach all evidence files
    val allFiles = mutableListOf<File>()
    allFiles.addAll(getCapturedPhotos())
    allFiles.addAll(getAudioRecordings())
    
    sendEmail("📋 POLICE REPORT", report, allFiles)
}`,
    emailTemplate: `To: emergency@gmail.com, police@kenya.go.ke
Subject: 📋 COMPLETE POLICE REPORT - Phone Theft

Attached:
✅ thief_face_01.jpg (245 KB)
✅ thief_face_02.jpg (198 KB)
✅ location_history.json (12 KB)
✅ ambient_recording.mp3 (2.3 MB)
✅ police_report.pdf (156 KB)`
  },
  {
    cmd: 'SMS_ALERT',
    desc: 'Send SMS alert',
    icon: Phone,
    color: '#f472b6',
    working: false,
    android15Blocked: true,
    code: `// SMS Alert (BLOCKED on Android 14+)
// This code NO LONGER WORKS on modern Android
private fun executeSMSAlert_DEPRECATED() {
    // Android 14+ blocks background SMS
    // Only the default SMS app can send
    // This is kept for educational reference
    
    val smsManager = SmsManager.getDefault()
    smsManager.sendTextMessage(
        "+254700000000",  // Emergency number
        null,
        "🚨 THEFT ALERT! Device stolen. Location: https://maps.google.com/?q=-1.2921,36.8219",
        null,
        null
    )
    // RESULT: SecurityException on Android 14+
    // "App does not have permission to send SMS"
}`,
    emailTemplate: `BLOCKED ON ANDROID 14+
SMS sending restricted to default SMS app only.
Use EMAIL commands as alternative.`
  },
  {
    cmd: 'WIPE',
    desc: 'Factory reset device',
    icon: Shield,
    color: '#ef4444',
    working: true,
    code: `// Remote Factory Reset
private fun executeWipeCommand() {
    val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
    val adminComponent = ComponentName(this, DeviceAdminReceiver::class.java)
    
    if (dpm.isAdminActive(adminComponent)) {
        // Show confirmation dialog first
        AlertDialog.Builder(this)
            .setTitle("⚠️ CONFIRM WIPE")
            .setMessage("This will erase ALL data. Continue?")
            .setPositiveButton("WIPE") { _, _ ->
                dpm.wipeData(
                    DevicePolicyManager.WIPE_EXTERNAL_STORAGE or
                    DevicePolicyManager.WIPE_RESET_PROTECTION_DATA
                )
            }
            .setNegativeButton("Cancel", null)
            .show()
        
        // Send final alert before wipe
        sendEmail("⚠️ DEVICE WIPE INITIATED", 
            "Factory reset requested. All data will be erased.")
    }
}`,
    emailTemplate: `To: emergency@gmail.com
Subject: ⚠️ DEVICE WIPE INITIATED

Action: Factory Reset
Scope: All data + external storage
Status: Confirmation required`
  },
];

const CommandCenter = () => {
  const [log, setLog] = useState([]);
  const [email, setEmail] = useState('');
  const [expandedCmd, setExpandedCmd] = useState(null);
  const [showCode, setShowCode] = useState({});
  const [copied, setCopied] = useState(null);
  const [showEmailPreview, setShowEmailPreview] = useState(null);

  const execute = (cmd) => {
    const entry = {
      id: Date.now(),
      cmd: cmd.cmd,
      time: new Date().toLocaleTimeString(),
      status: cmd.working ? 'success' : 'blocked',
      detail: cmd.working 
        ? `✅ Executed. Evidence sent to ${email || 'configured email'}`
        : '🚫 Blocked by Android 15 security policies'
    };
    setLog(prev => [entry, ...prev]);

    // Simulate email sending after 2 seconds
    if (cmd.working) {
      setTimeout(() => {
        const emailEntry = {
          id: Date.now() + 1,
          cmd: 'EMAIL',
          time: new Date().toLocaleTimeString(),
          status: 'success',
          detail: `📧 Email sent to ${email || 'emergency@gmail.com'} with ${cmd.cmd} results`
        };
        setLog(prev => [emailEntry, ...prev]);
      }, 2000);
    }
  };

  const copyCode = async (code, key) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Terminal size={28} color="#22d3ee" /> Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Execute commands with full implementation code
          </p>
        </div>
        <span style={{ padding: '8px 16px', background: 'rgba(52,211,153,0.1)', color: '#34d399', borderRadius: '20px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(52,211,153,0.3)' }}>
          ● Connected
        </span>
      </div>

      {/* Email Config */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Mail size={20} color="#22d3ee" />
          <h3 style={{ fontWeight: 600 }}>📧 Emergency Email (Evidence Receiver)</h3>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="email" 
            placeholder="emergency@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', fontSize: '14px' }}
          />
          <button style={{ padding: '12px 20px', background: 'var(--gradient-1)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 600, cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </div>

      {/* Commands */}
      <h2 className="section-title">⚡ Execute Commands (Click to expand code)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {commands.map((cmd, i) => (
          <motion.div
            key={cmd.cmd}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: '16px', overflow: 'hidden', opacity: cmd.working ? 1 : 0.6
            }}
          >
            {/* Command Header */}
            <div style={{ padding: '16px', cursor: 'pointer' }}
              onClick={() => setExpandedCmd(expandedCmd === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <cmd.icon size={22} color={cmd.color} />
                  <code style={{ fontSize: '18px', fontWeight: 700, color: '#22d3ee', fontFamily: 'monospace' }}>{cmd.cmd}</code>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {!cmd.working && (
                    <span style={{ fontSize: '10px', padding: '3px 8px', background: 'rgba(248,113,113,0.15)', color: '#f87171', borderRadius: '8px', fontWeight: 600 }}>
                      BLOCKED
                    </span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); execute(cmd); }}
                    style={{
                      padding: '8px 16px', background: cmd.working ? cmd.color : '#444',
                      border: 'none', borderRadius: '8px', color: cmd.working ? '#000' : '#888',
                      cursor: cmd.working ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '12px'
                    }}
                    disabled={!cmd.working}>
                    <Play size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Execute
                  </button>
                  <ChevronRight size={14} style={{ transform: expandedCmd === i ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{cmd.desc}</p>
            </div>

            {/* Expanded Code */}
            <AnimatePresence>
              {expandedCmd === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ borderTop: '1px solid var(--border)', padding: '16px' }}>

                    {/* Implementation Code */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}
                        onClick={() => setShowCode(prev => ({ ...prev, [i]: !prev[i] }))}>
                        <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Code size={14} color="#22d3ee" />
                          Implementation Code
                        </span>
                        <ChevronRight size={14} style={{ transform: showCode[i] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                      </div>
                      {showCode[i] && (
                        <div style={{ position: 'relative' }}>
                          <button onClick={(e) => { e.stopPropagation(); copyCode(cmd.code, i); }}
                            style={{ position: 'absolute', top: '4px', right: '4px', padding: '4px 10px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                            {copied === i ? <Check size={12} color="#34d399" /> : <Copy size={12} />}
                            {copied === i ? 'Copied' : 'Copy'}
                          </button>
                          <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '16px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.4', overflowX: 'auto', maxHeight: '300px', overflowY: 'auto', border: '1px solid #30363d', fontFamily: "'JetBrains Mono', monospace" }}>
                            <code>{cmd.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Email Preview */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setShowEmailPreview(prev => prev === i ? null : i)}>
                        <span style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Mail size={14} color="#34d399" />
                          Email Preview
                        </span>
                        <ChevronRight size={14} style={{ transform: showEmailPreview === i ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                      </div>
                      {showEmailPreview === i && (
                        <pre style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)', padding: '12px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.5', border: '1px solid var(--border)', fontFamily: 'monospace', whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                          {cmd.emailTemplate}
                        </pre>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* How Commands Flow */}
      <h2 className="section-title">📧 Command → Execution → Email Pipeline</h2>
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', padding: '16px 0' }}>
          {[
            { icon: '📱', label: 'Your Device', detail: 'Send command', color: '#f87171' },
            { icon: '📡', label: 'Network', detail: 'TLS encrypted', color: '#fb923c' },
            { icon: '📱', label: 'Stolen Phone', detail: 'Execute command', color: '#a78bfa' },
            { icon: '📦', label: 'Process', detail: 'Capture evidence', color: '#22d3ee' },
            { icon: '📧', label: 'Gmail', detail: 'Receive evidence', color: '#34d399' },
          ].map((step, si) => (
            <React.Fragment key={si}>
              {si > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '20px' }}>→</span>}
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: '12px', minWidth: '100px' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{step.icon}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: step.color }}>{step.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{step.detail}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Command Log */}
      <h2 className="section-title">📝 Execution Log</h2>
      <div className="glass-card" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {log.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '32px', fontFamily: 'monospace' }}>
            Click Execute on any command to see the log...
          </p>
        ) : (
          log.map((entry) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '13px' }}>
              <span style={{ color: entry.status === 'success' ? '#34d399' : '#f87171', fontSize: '16px' }}>
                {entry.status === 'success' ? '✅' : '🚫'}
              </span>
              <code style={{ color: '#22d3ee', fontWeight: 600, minWidth: '80px' }}>{entry.cmd}</code>
              <span style={{ color: 'var(--text-muted)', minWidth: '70px', fontSize: '12px' }}>{entry.time}</span>
              <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{entry.detail}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommandCenter;
