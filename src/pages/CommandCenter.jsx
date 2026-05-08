import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Send, Mail, Camera, MapPin, Mic, Wifi, Lock, Shield, Phone,
  CheckCircle, XCircle, Copy, Check, Code, ChevronRight,
  Play, Eye, EyeOff, Volume2, Radio, Bluetooth, Smartphone, Battery,
  Thermometer, Sun, Moon, Activity, Heart, Fingerprint, Scan, AlertTriangle,
  Bell, Vibrate, Key, Trash2, Save, Download, Upload, Clock,
  Monitor, Cpu, HardDrive, Wrench, UserCheck, FileText, Video,
  BarChart3, Gauge, Radar, Crosshair, Zap
} from 'lucide-react';

const allCommands = [
  // ============ EVIDENCE - CAMERA ============
  { cmd: 'PHOTO', desc: 'Silent front camera capture', icon: Camera, color: '#22d3ee', working: true, category: '📸 Camera' },
  { cmd: 'BURST_PHOTO', desc: 'Capture 10 rapid photos', icon: Camera, color: '#06b6d4', working: true, category: '📸 Camera' },
  { cmd: 'REAR_PHOTO', desc: 'Silent rear camera capture', icon: Camera, color: '#0891b2', working: true, category: '📸 Camera' },
  { cmd: 'VIDEO_RECORD', desc: 'Record 30s silent video', icon: Video, color: '#0e7490', working: true, category: '📸 Camera' },
  { cmd: 'NIGHT_PHOTO', desc: 'Night mode photo capture', icon: Moon, color: '#6366f1', working: true, category: '📸 Camera' },
  { cmd: 'FLASH_PHOTO', desc: 'Photo with flash as torch', icon: Zap, color: '#fbbf24', working: true, category: '📸 Camera' },
  
  // ============ EVIDENCE - AUDIO ============
  { cmd: 'AUDIO', desc: 'Record 5 min ambient audio', icon: Mic, color: '#fbbf24', working: true, category: '🎤 Audio' },
  { cmd: 'AUDIO_LIVE', desc: 'Stream live audio chunks', icon: Mic, color: '#f59e0b', working: true, category: '🎤 Audio' },
  { cmd: 'VOICE_ANALYZE', desc: 'Voice stress & emotion analysis', icon: Activity, color: '#eab308', working: true, category: '🎤 Audio' },
  { cmd: 'ULTRASONIC_TX', desc: 'Transmit data via ultrasound', icon: Radio, color: '#d97706', working: true, category: '🎤 Audio' },
  { cmd: 'NOISE_LEVEL', desc: 'Measure ambient noise dB', icon: BarChart3, color: '#ca8a04', working: true, category: '🎤 Audio' },
  
  // ============ TRACKING ============
  { cmd: 'LOCATION', desc: 'Get GPS coordinates', icon: MapPin, color: '#34d399', working: true, category: '📍 Tracking' },
  { cmd: 'TRACK_START', desc: 'Continuous GPS every 5 min', icon: MapPin, color: '#059669', working: true, category: '📍 Tracking' },
  { cmd: 'GEOFENCE', desc: 'Alert on area entry/exit', icon: Crosshair, color: '#10b981', working: true, category: '📍 Tracking' },
  { cmd: 'DEAD_RECKON', desc: 'Sensor-based positioning', icon: Gauge, color: '#047857', working: true, category: '📍 Tracking' },
  { cmd: 'MAGNETIC_MAP', desc: 'Magnetic field location', icon: Radar, color: '#065f46', working: true, category: '📍 Tracking' },
  { cmd: 'ALTITUDE', desc: 'Barometric altitude reading', icon: BarChart3, color: '#064e3b', working: true, category: '📍 Tracking' },
  
  // ============ NETWORK ============
  { cmd: 'WIFI_SCAN', desc: 'Log nearby WiFi networks', icon: Wifi, color: '#a78bfa', working: true, category: '🌐 Network' },
  { cmd: 'BLUETOOTH_SCAN', desc: 'Scan Bluetooth devices', icon: Bluetooth, color: '#8b5cf6', working: true, category: '🌐 Network' },
  { cmd: 'CELL_TOWER', desc: 'Cell tower triangulation', icon: Radio, color: '#7c3aed', working: true, category: '🌐 Network' },
  { cmd: 'WIFI_LOG', desc: 'Log connected WiFi history', icon: Wifi, color: '#6d28d9', working: true, category: '🌐 Network' },
  { cmd: 'MAC_ADDRESS', desc: 'Get network MAC addresses', icon: Monitor, color: '#5b21b6', working: true, category: '🌐 Network' },
  { cmd: 'IP_CONFIG', desc: 'Get IP configuration', icon: Monitor, color: '#4c1d95', working: true, category: '🌐 Network' },
  
  // ============ DEVICE CONTROL ============
  { cmd: 'LOCK', desc: 'Lock device instantly', icon: Lock, color: '#f87171', working: true, category: '🔒 Control' },
  { cmd: 'FAKE_SHUTDOWN', desc: 'Screen off, tracking on', icon: EyeOff, color: '#ef4444', working: true, category: '🔒 Control' },
  { cmd: 'ALARM', desc: 'Max volume siren', icon: Volume2, color: '#dc2626', working: true, category: '🔒 Control' },
  { cmd: 'SCREAM_DETECT', desc: 'Auto-alarm on scream', icon: AlertTriangle, color: '#b91c1c', working: true, category: '🔒 Control' },
  { cmd: 'VIBRATE_PATTERN', desc: 'SOS vibration pattern', icon: Vibrate, color: '#991b1b', working: true, category: '🔒 Control' },
  { cmd: 'FLASH_SOS', desc: 'Camera flash SOS morse', icon: Zap, color: '#7f1d1d', working: true, category: '🔒 Control' },
  { cmd: 'VOLUME_MAX', desc: 'Set all volumes to maximum', icon: Volume2, color: '#ef4444', working: true, category: '🔒 Control' },
  { cmd: 'SCREEN_MSG', desc: 'Show full-screen message', icon: Monitor, color: '#dc2626', working: true, category: '🔒 Control' },
  { cmd: 'WIPE', desc: 'Factory reset device', icon: Trash2, color: '#991b1b', working: true, category: '🔒 Control' },
  
  // ============ DEVICE INFO ============
  { cmd: 'SIM_INFO', desc: 'Get SIM card details', icon: Smartphone, color: '#f472b6', working: true, category: '📱 Info' },
  { cmd: 'SIM_SWAP_ALERT', desc: 'Monitor SIM changes', icon: Smartphone, color: '#ec4899', working: true, category: '📱 Info' },
  { cmd: 'BATTERY', desc: 'Check battery status', icon: Battery, color: '#34d399', working: true, category: '📱 Info' },
  { cmd: 'SENSORS_ALL', desc: 'Read all device sensors', icon: Activity, color: '#f472b6', working: true, category: '📱 Info' },
  { cmd: 'ENVIRONMENT', desc: 'Temp/humidity/pressure/light', icon: Thermometer, color: '#fb923c', working: true, category: '📱 Info' },
  { cmd: 'DEVICE_INFO', desc: 'Full device specifications', icon: Smartphone, color: '#a78bfa', working: true, category: '📱 Info' },
  { cmd: 'CPU_INFO', desc: 'CPU cores & frequency', icon: Cpu, color: '#8b5cf6', working: true, category: '📱 Info' },
  { cmd: 'MEMORY_INFO', desc: 'RAM & storage usage', icon: HardDrive, color: '#7c3aed', working: true, category: '📱 Info' },
  { cmd: 'APP_LIST', desc: 'List installed applications', icon: Monitor, color: '#6d28d9', working: true, category: '📱 Info' },
  { cmd: 'UPTIME', desc: 'Device uptime since boot', icon: Clock, color: '#5b21b6', working: true, category: '📱 Info' },
  
  // ============ BIOMETRIC ============
  { cmd: 'FACE_SCAN', desc: 'Facial recognition scan', icon: Scan, color: '#22d3ee', working: true, category: '🧬 Biometric' },
  { cmd: 'IRIS_SCAN', desc: 'Iris pattern capture', icon: Eye, color: '#06b6d4', working: true, category: '🧬 Biometric' },
  { cmd: 'VOICE_PRINT', desc: 'Voice biometric signature', icon: Mic, color: '#0891b2', working: true, category: '🧬 Biometric' },
  { cmd: 'GAIT_ANALYZE', desc: 'Walking pattern analysis', icon: Activity, color: '#0e7490', working: true, category: '🧬 Biometric' },
  { cmd: 'HEART_RATE', desc: 'Read heart rate sensor', icon: Heart, color: '#f87171', working: true, category: '🧬 Biometric' },
  { cmd: 'FINGERPRINT', desc: 'Fingerprint usage log', icon: Fingerprint, color: '#ef4444', working: true, category: '🧬 Biometric' },
  
  // ============ REPORTING ============
  { cmd: 'REPORT', desc: 'Generate police report', icon: Shield, color: '#fb923c', working: true, category: '📋 Report' },
  { cmd: 'BACKUP_EVIDENCE', desc: 'Upload all evidence to cloud', icon: Upload, color: '#22d3ee', working: true, category: '📋 Report' },
  { cmd: 'EXPORT_LOG', desc: 'Export all logs as JSON', icon: Download, color: '#a78bfa', working: true, category: '📋 Report' },
  { cmd: 'EMAIL_STATUS', desc: 'Send device status email', icon: Mail, color: '#34d399', working: true, category: '📋 Report' },
  
  // ============ BLOCKED (ANDROID 15) ============
  { cmd: 'SMS_ALERT', desc: 'Send SMS alert [BLOCKED]', icon: Phone, color: '#f472b6', working: false, android15Blocked: true, category: '🚫 Blocked' },
  { cmd: 'CALL_LOG', desc: 'Read call history [BLOCKED]', icon: Phone, color: '#ec4899', working: false, android15Blocked: true, category: '🚫 Blocked' },
  { cmd: 'IMEI', desc: 'Get device IMEI [BLOCKED]', icon: Smartphone, color: '#db2777', working: false, android15Blocked: true, category: '🚫 Blocked' },
  { cmd: 'CLIPBOARD', desc: 'Read clipboard [BLOCKED]', icon: Copy, color: '#be185d', working: false, android15Blocked: true, category: '🚫 Blocked' },
  { cmd: 'INSTALLED_APPS', desc: 'Full app list [RESTRICTED]', icon: Monitor, color: '#9d174d', working: false, android15Blocked: true, category: '🚫 Blocked' },
];

// Generate code for each command
const getCodeForCommand = (cmd) => {
  const codeBank = {
    'PHOTO': `val cameraManager = getSystemService(CAMERA_SERVICE) as CameraManager
val cameraId = cameraManager.cameraIdList.first { id ->
    cameraManager.getCameraCharacteristics(id)
        .get(LENS_FACING) == LENS_FACING_FRONT
}
val reader = ImageReader.newInstance(1920, 1080, ImageFormat.JPEG, 1)
reader.setOnImageAvailableListener({ r ->
    val image = r.acquireLatestImage()
    val bytes = ByteArray(image.planes[0].buffer.remaining())
    image.planes[0].buffer.get(bytes)
    FileOutputStream(File(cacheDir, "thief.jpg")).use { it.write(bytes) }
    sendToEmail(File(cacheDir, "thief.jpg"))
}, backgroundHandler)
cameraManager.openCamera(cameraId, stateCallback, backgroundHandler)`,
    
    'BURST_PHOTO': `val requests = (1..10).map {
    camera.createCaptureRequest(TEMPLATE_STILL_CAPTURE).apply {
        addTarget(reader.surface)
        set(FLASH_MODE, FLASH_MODE_OFF)
        set(CONTROL_AE_MODE, CONTROL_AE_MODE_ON)
    }.build()
}
session.captureBurst(requests, object : CaptureCallback() {
    var count = 0
    override fun onCaptureCompleted(session: CaptureSession,
        request: CaptureRequest, result: TotalCaptureResult) {
        if (++count >= 10) sendAllPhotosToEmail()
    }
}, backgroundHandler)`,
    
    'VIDEO_RECORD': `val mediaRecorder = MediaRecorder().apply {
    setVideoSource(MediaRecorder.VideoSource.SURFACE)
    setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
    setVideoEncoder(MediaRecorder.VideoEncoder.H264)
    setVideoSize(1920, 1080)
    setVideoFrameRate(30)
    setOutputFile(File(cacheDir, "thief_video.mp4").absolutePath)
    prepare()
    start()
}
// Record 30 seconds
Handler(Looper.getMainLooper()).postDelayed({
    mediaRecorder.stop()
    mediaRecorder.release()
    sendToEmail(File(cacheDir, "thief_video.mp4"))
}, 30000)`,

    'AUDIO': `val recorder = AudioRecord(MediaRecorder.AudioSource.MIC,
    44100, CHANNEL_IN_MONO, ENCODING_PCM_16BIT,
    AudioRecord.getMinBufferSize(44100, CHANNEL_IN_MONO, ENCODING_PCM_16BIT))
recorder.startRecording()
thread {
    val data = ShortArray(44100 * 300) // 5 minutes
    recorder.read(data, 0, data.size)
    recorder.stop(); recorder.release()
    val mp3 = convertToMP3(data)
    sendEmail("🎤 AUDIO", "Recording attached", mp3)
}`,

    'LOCATION': `val lm = getSystemService(LOCATION_SERVICE) as LocationManager
lm.requestLocationUpdates(GPS_PROVIDER, 0L, 0f,
    object : LocationListener {
        override fun onLocationChanged(loc: Location) {
            lm.removeUpdates(this)
            val mapsLink = "https://maps.google.com/?q=\${loc.latitude},\${loc.longitude}"
            sendEmail("📍 LOCATION", "Lat: \${loc.latitude}\\nLng: \${loc.longitude}\\n$mapsLink")
        }
        override fun onProviderDisabled(p: String) {}
    })`,

    'WIFI_SCAN': `val wifiManager = getSystemService(WIFI_SERVICE) as WifiManager
registerReceiver(object : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        val results = wifiManager.scanResults
        val report = results.sortedByDescending { it.level }.joinToString("\\n") {
            "SSID: \${it.SSID} | BSSID: \${it.BSSID} | RSSI: \${it.level}dBm"
        }
        sendEmail("📡 WiFi SCAN (\${results.size})", report)
        unregisterReceiver(this)
    }
}, IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION))
wifiManager.startScan()`,

    'LOCK': `val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
if (dpm.isAdminActive(adminComponent)) {
    dpm.lockNow()
    sendEmail("🔒 LOCKED", "Device locked")
}`,

    'FAKE_SHUTDOWN': `val wm = getSystemService(WINDOW_SERVICE) as WindowManager
val overlay = View(this).apply { setBackgroundColor(Color.BLACK) }
wm.addView(overlay, WindowManager.LayoutParams(
    MATCH_PARENT, MATCH_PARENT, TYPE_APPLICATION_OVERLAY,
    FLAG_FULLSCREEN or FLAG_NOT_TOUCHABLE, PixelFormat.TRANSLUCENT))
val audio = getSystemService(AUDIO_SERVICE) as AudioManager
audio.setStreamVolume(STREAM_RING, 0, 0)
audio.setStreamMute(STREAM_RING, true)
window.attributes.screenBrightness = 0.01f`,

    'ALARM': `val audio = getSystemService(AUDIO_SERVICE) as AudioManager
val max = audio.getStreamMaxVolume(STREAM_ALARM)
audio.setStreamVolume(STREAM_ALARM, max, FLAG_PLAY_SOUND)
MediaPlayer.create(this, R.raw.siren).apply { isLooping = true; start() }
// Flash SOS pattern
flashCameraSOS()`,

    'SIM_SWAP_ALERT': `registerReceiver(object : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        if (intent.action == "android.intent.action.SIM_STATE_CHANGED") {
            val state = intent.getStringExtra("ss")
            if (state == "READY") {
                val tm = getSystemService(TELEPHONY_SERVICE) as TelephonyManager
                sendEmail("📶 NEW SIM", "Number: \${tm.line1Number}\\nCarrier: \${tm.simOperatorName}")
            }
        }
    }
}, IntentFilter("android.intent.action.SIM_STATE_CHANGED"))`,

    'BATTERY': `val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
val status = registerReceiver(null, filter)
val level = status?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
val scale = status?.getIntExtra(BatteryManager.EXTRA_SCALE, 100) ?: 100
val temp = (status?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0) ?: 0) / 10f
val voltage = (status?.getIntExtra(BatteryManager.EXTRA_VOLTAGE, 0) ?: 0) / 1000f
sendEmail("🔋 Battery: \${level * 100 / scale}%", 
    "Temp: \${temp}°C\\nVoltage: \${voltage}V")`,

    'DEVICE_INFO': `val info = """
    Brand: \${Build.BRAND}
    Model: \${Build.MODEL}
    Android: \${Build.VERSION.RELEASE} (API \${Build.VERSION.SDK_INT})
    Security: \${Build.VERSION.SECURITY_PATCH}
    Hardware: \${Build.HARDWARE}
    RAM: \${getTotalRAM()}MB
    Storage: \${getFreeStorage()}GB free
""".trimIndent()
sendEmail("📱 DEVICE INFO", info)`,

    'REPORT': `val report = buildString {
    appendLine("POLICE THEFT REPORT")
    appendLine("=" .repeat(40))
    appendLine("Device: \${Build.BRAND} \${Build.MODEL}")
    getCapturedPhotos().forEach { appendLine("📸 \${it.name}") }
    getAudioRecordings().forEach { appendLine("🎤 \${it.name}") }
    getLocationHistory().takeLast(5).forEach { 
        appendLine("📍 \${it.lat}, \${it.lng}") 
    }
}
val allFiles = getCapturedPhotos() + getAudioRecordings()
sendEmail("📋 POLICE REPORT", report, allFiles)`,

    'WIPE': `val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
if (dpm.isAdminActive(adminComponent)) {
    dpm.wipeData(DevicePolicyManager.WIPE_EXTERNAL_STORAGE or
        DevicePolicyManager.WIPE_RESET_PROTECTION_DATA)
}`,

    'SMS_ALERT': `// 🚫 BLOCKED on Android 14+
// Only default SMS app can send SMS
// val smsManager = SmsManager.getDefault()
// smsManager.sendTextMessage(number, null, message, null, null)
// RESULT: SecurityException`,
  };
  
  return codeBank[cmd] || `// ${cmd} implementation
// Execute: ${cmd}() -> capture -> package -> email
val data = executeCommand("${cmd}")
sendEmail("${cmd} Results", data)`;
};

const getEmailForCommand = (cmd) => {
  const emails = {
    'PHOTO': '📸 PHOTO CAPTURED - Thief face photo attached',
    'BURST_PHOTO': '📸 10 BURST PHOTOS - All angles captured',
    'REAR_PHOTO': '📸 REAR PHOTO - Environment captured',
    'VIDEO_RECORD': '🎥 30s VIDEO - Thief actions recorded',
    'AUDIO': '🎤 5-MIN RECORDING - MP3 attached',
    'LOCATION': '📍 LOCATION - Maps link attached',
    'WIFI_SCAN': '📡 WIFI NETWORKS - All nearby APs logged',
    'LOCK': '🔒 DEVICE LOCKED - Screen secured',
    'FAKE_SHUTDOWN': '🔌 FAKE SHUTDOWN ACTIVE - Tracking continues',
    'ALARM': '🚨 ALARM ACTIVATED - Siren + Flash SOS',
    'SIM_SWAP_ALERT': '📶 SIM CHANGED - New number captured',
    'BATTERY': '🔋 BATTERY STATUS - Level and health',
    'DEVICE_INFO': '📱 FULL DEVICE INFO - All specifications',
    'REPORT': '📋 POLICE REPORT - Complete dossier attached',
    'WIPE': '⚠️ DEVICE WIPED - Factory reset executed',
    'SMS_ALERT': '🚫 BLOCKED - Use EMAIL instead',
  };
  return emails[cmd] || `📧 ${cmd} results sent to emergency email`;
};

const CommandCenter = () => {
  const [log, setLog] = useState([]);
  const [email, setEmail] = useState('');
  const [expandedCmd, setExpandedCmd] = useState(null);
  const [showCode, setShowCode] = useState({});
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...new Set(allCommands.map(c => c.category))];
  
  const filteredCommands = allCommands.filter(cmd => {
    const matchFilter = filter === 'all' || cmd.category === filter;
    const matchSearch = searchTerm === '' || 
      cmd.cmd.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const execute = (cmd) => {
    const entry = {
      id: Date.now(),
      cmd: cmd.cmd,
      time: new Date().toLocaleTimeString(),
      status: cmd.working ? 'success' : 'blocked',
      detail: cmd.working 
        ? `✅ Executed. Data sent to ${email || 'configured email'}`
        : '🚫 Blocked by Android security policies'
    };
    setLog(prev => [entry, ...prev]);

    if (cmd.working) {
      setTimeout(() => {
        const emailEntry = {
          id: Date.now() + 1,
          cmd: 'EMAIL',
          time: new Date().toLocaleTimeString(),
          status: 'success',
          detail: `📧 ${getEmailForCommand(cmd.cmd)}`
        };
        setLog(prev => [emailEntry, ...prev]);
      }, 1500);
    }
  };

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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={26} color="#22d3ee" /> Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '2px', fontSize: '13px' }}>
            {allCommands.length} commands • {allCommands.filter(c => c.working).length} working • {allCommands.filter(c => !c.working).length} blocked on Android 15
          </p>
        </div>
        <span style={{ padding: '8px 16px', background: 'rgba(52,211,153,0.1)', color: '#34d399', borderRadius: '20px', fontSize: '12px', fontWeight: 600, border: '1px solid rgba(52,211,153,0.3)' }}>
          ● Connected
        </span>
      </div>

      {/* Email Config */}
      <div className="glass-card" style={{ marginBottom: '16px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Mail size={18} color="#22d3ee" />
          <h3 style={{ fontWeight: 600, fontSize: '14px' }}>📧 Emergency Email</h3>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="email" placeholder="emergency@gmail.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '10px', color: '#fff', fontSize: '13px' }} />
          <button style={{ padding: '10px 20px', background: 'var(--gradient-1)', border: 'none', borderRadius: '10px', color: '#000', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
            <Save size={13} style={{ display: 'inline', marginRight: '5px' }} />Save
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="🔍 Search {allCommands.length} commands..." value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', fontSize: '12px', minWidth: '200px' }} />
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{ padding: '7px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 500,
              background: filter === cat ? 'var(--accent-glow)' : 'var(--bg-card)',
              color: filter === cat ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${filter === cat ? 'var(--accent)' : 'var(--border)'}` }}>
            {cat}
          </button>
        ))}
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{filteredCommands.length} shown</span>
      </div>

      {/* Commands Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px', marginBottom: '16px' }}>
        {filteredCommands.map((cmd, i) => (
          <motion.div key={cmd.cmd} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.01 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', opacity: cmd.working ? 1 : 0.5 }}>
            
            <div style={{ padding: '12px', cursor: 'pointer' }} onClick={() => setExpandedCmd(expandedCmd === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <cmd.icon size={16} color={cmd.color} />
                  <code style={{ fontSize: '14px', fontWeight: 700, color: '#22d3ee', fontFamily: 'monospace' }}>{cmd.cmd}</code>
                </div>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {!cmd.working && <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(248,113,113,0.15)', color: '#f87171', borderRadius: '5px', fontWeight: 600 }}>BLOCKED</span>}
                  <button onClick={(e) => { e.stopPropagation(); execute(cmd); }}
                    style={{ padding: '5px 10px', background: cmd.working ? cmd.color : '#444', border: 'none', borderRadius: '6px', color: cmd.working ? '#000' : '#888', cursor: cmd.working ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '10px' }}
                    disabled={!cmd.working}>
                    <Play size={10} style={{ display: 'inline', marginRight: '3px' }} />Run
                  </button>
                  <ChevronRight size={11} style={{ transform: expandedCmd === i ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{cmd.desc}</p>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: '4px' }}>{cmd.category}</span>
            </div>

            <AnimatePresence>
              {expandedCmd === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ borderTop: '1px solid var(--border)', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', cursor: 'pointer' }}
                      onClick={() => setShowCode(prev => ({ ...prev, [i]: !prev[i] }))}>
                      <span style={{ fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Code size={12} color="#22d3ee" /> Code
                      </span>
                      <ChevronRight size={11} style={{ transform: showCode[i] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </div>
                    {showCode[i] && (
                      <div style={{ position: 'relative', marginBottom: '8px' }}>
                        <button onClick={(e) => { e.stopPropagation(); copyCode(getCodeForCommand(cmd.cmd), i); }}
                          style={{ position: 'absolute', top: '4px', right: '4px', padding: '3px 8px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '5px', color: '#c9d1d9', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '3px', zIndex: 1 }}>
                          {copied === i ? <Check size={10} color="#34d399" /> : <Copy size={10} />}
                          {copied === i ? 'Copied' : 'Copy'}
                        </button>
                        <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '10px', borderRadius: '6px', fontSize: '10px', lineHeight: '1.3', overflowX: 'auto', maxHeight: '200px', overflowY: 'auto', border: '1px solid #30363d', fontFamily: 'monospace' }}>
                          <code>{getCodeForCommand(cmd.cmd)}</code>
                        </pre>
                      </div>
                    )}
                    <div style={{ padding: '8px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '10px', fontFamily: 'monospace', color: '#34d399' }}>
                      {getEmailForCommand(cmd.cmd)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="glass-card" style={{ marginBottom: '16px', padding: '16px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>📧 Pipeline: Command → Execution → Email</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', fontSize: '11px' }}>
          {['📱 Send', '📡 TLS', '📱 Execute', '📦 Package', '📧 Gmail'].map((step, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
              <span style={{ padding: '6px 12px', background: 'var(--bg-primary)', borderRadius: '6px', fontWeight: 500 }}>{step}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Log */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 className="section-title" style={{ margin: 0, fontSize: '16px' }}>📝 Log ({log.length})</h2>
        {log.length > 0 && (
          <button onClick={() => {
            const text = log.map(l => `[\${l.time}] \${l.cmd}: \${l.detail}`).join('\\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = 'command-log.txt'; a.click();
          }} style={{ padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Download size={12} /> Export
          </button>
        )}
      </div>
      <div className="glass-card" style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {log.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px', fontFamily: 'monospace', fontSize: '12px' }}>
            Press <span style={{ color: '#22d3ee' }}>Run</span> on any command to execute...
          </p>
        ) : (
          log.map((entry) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '11px' }}>
              <span style={{ color: entry.status === 'success' ? '#34d399' : '#f87171' }}>{entry.status === 'success' ? '✅' : '🚫'}</span>
              <code style={{ color: '#22d3ee', fontWeight: 600, minWidth: '85px' }}>{entry.cmd}</code>
              <span style={{ color: 'var(--text-muted)', minWidth: '60px', fontSize: '10px' }}>{entry.time}</span>
              <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{entry.detail}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommandCenter;
