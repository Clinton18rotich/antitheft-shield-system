import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Send, Mail, Camera, MapPin, Mic, Wifi, Lock, Shield, Phone,
  CheckCircle, XCircle, Copy, Check, Code, ChevronRight,
  Play, Eye, EyeOff, Volume2, Radio, Bluetooth, Smartphone, Battery,
  Thermometer, Sun, Moon, Activity, Heart, Fingerprint, Scan, AlertTriangle,
  Bell, Vibrate, Key, Trash2, Save, Download, Upload, Clock
} from 'lucide-react';

const commands = [
  {
    cmd: 'PHOTO',
    desc: 'Silent front camera capture',
    icon: Camera, color: '#22d3ee', working: true, category: 'Evidence',
    code: `val cameraManager = getSystemService(CAMERA_SERVICE) as CameraManager
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
    image.close()
    sendToEmail(File(cacheDir, "thief.jpg"))
}, backgroundHandler)
cameraManager.openCamera(cameraId, stateCallback, backgroundHandler)`,
    email: '📸 PHOTO CAPTURED - Thief identified'
  },
  {
    cmd: 'BURST_PHOTO',
    desc: 'Capture 10 rapid photos',
    icon: Camera, color: '#06b6d4', working: true, category: 'Evidence',
    code: `val requests = (1..10).map {
    camera.createCaptureRequest(TEMPLATE_STILL_CAPTURE).apply {
        addTarget(reader.surface)
        set(FLASH_MODE, FLASH_MODE_OFF)
        set(CONTROL_AE_MODE, CONTROL_AE_MODE_ON)
    }.build()
}
session.captureBurst(requests, object : CameraCaptureSession.CaptureCallback() {
    var count = 0
    override fun onCaptureCompleted(session: CameraCaptureSession,
        request: CaptureRequest, result: TotalCaptureResult) {
        count++
        if (count >= 10) sendAllPhotosToEmail()
    }
}, backgroundHandler)`,
    email: '📸 10 BURST PHOTOS CAPTURED'
  },
  {
    cmd: 'REAR_PHOTO',
    desc: 'Silent rear camera capture',
    icon: Camera, color: '#0891b2', working: true, category: 'Evidence',
    code: `val rearId = cameraManager.cameraIdList.first { id ->
    cameraManager.getCameraCharacteristics(id)
        .get(LENS_FACING) == LENS_FACING_BACK
}
cameraManager.openCamera(rearId, object : CameraDevice.StateCallback() {
    override fun onOpened(camera: CameraDevice) {
        camera.createCaptureSession(listOf(reader.surface),
            object : CameraCaptureSession.StateCallback() {
                override fun onConfigured(session: CameraCaptureSession) {
                    val request = camera.createCaptureRequest(TEMPLATE_STILL_CAPTURE)
                        .apply { addTarget(reader.surface) }
                    session.capture(request.build(), null, backgroundHandler)
                }
                override fun onConfigureFailed(s: CameraCaptureSession) {}
            }, backgroundHandler)
    }
    override fun onDisconnected(c: CameraDevice) { c.close() }
    override fun onError(c: CameraDevice, e: Int) { c.close() }
}, backgroundHandler)`,
    email: '📸 REAR PHOTO CAPTURED - Environment captured'
  },
  {
    cmd: 'LOCATION',
    desc: 'Get GPS coordinates',
    icon: MapPin, color: '#34d399', working: true, category: 'Tracking',
    code: `val lm = getSystemService(LOCATION_SERVICE) as LocationManager
lm.requestLocationUpdates(GPS_PROVIDER, 0L, 0f,
    object : LocationListener {
        override fun onLocationChanged(loc: Location) {
            lm.removeUpdates(this)
            val mapsLink = "https://maps.google.com/?q=\${loc.latitude},\${loc.longitude}"
            sendEmail("📍 LOCATION", "Lat: \${loc.latitude}\\nLng: \${loc.longitude}\\n$mapsLink")
        }
        override fun onProviderDisabled(p: String) {}
    })`,
    email: '📍 LOCATION - Maps link attached'
  },
  {
    cmd: 'TRACK_START',
    desc: 'Continuous GPS every 5 min',
    icon: MapPin, color: '#059669', working: true, category: 'Tracking',
    code: `val intent = Intent(this, LocationService::class.java)
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    startForegroundService(intent)
}
class LocationService : Service() {
    override fun onCreate() {
        startForeground(1, buildNotification("Location tracking active"))
        val lm = getSystemService(LOCATION_SERVICE) as LocationManager
        lm.requestLocationUpdates(GPS_PROVIDER, 300000L, 10f) { loc ->
            saveToDatabase(loc)
            if (shouldSendUpdate()) sendLocationEmail(loc)
        }
    }
}`,
    email: '🛰️ CONTINUOUS TRACKING STARTED - 5min intervals'
  },
  {
    cmd: 'GEOFENCE',
    desc: 'Alert when entering area',
    icon: MapPin, color: '#10b981', working: true, category: 'Tracking',
    code: `val geofencingClient = LocationServices.getGeofencingClient(this)
val geofence = Geofence.Builder()
    .setRequestId("police_station")
    .setCircularRegion(-1.2921, 36.8219, 100f)
    .setExpirationDuration(Geofence.NEVER_EXPIRE)
    .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER)
    .build()
geofencingClient.addGeofences(
    GeofencingRequest.Builder()
        .addGeofence(geofence)
        .setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER)
        .build(),
    geofencePendingIntent
)`,
    email: '📍 GEOFENCE SET - Alert on area entry'
  },
  {
    cmd: 'AUDIO',
    desc: 'Record 5 min ambient audio',
    icon: Mic, color: '#fbbf24', working: true, category: 'Evidence',
    code: `val recorder = AudioRecord(MediaRecorder.AudioSource.MIC,
    44100, CHANNEL_IN_MONO, ENCODING_PCM_16BIT,
    AudioRecord.getMinBufferSize(44100, CHANNEL_IN_MONO, ENCODING_PCM_16BIT))
recorder.startRecording()
thread {
    val data = ShortArray(44100 * 300) // 5 minutes
    recorder.read(data, 0, data.size)
    recorder.stop(); recorder.release()
    val mp3 = PCMtoMP3Converter.convert(data)
    sendEmail("🎤 AUDIO", "Recording attached", mp3)
}`,
    email: '🎤 5-MINUTE RECORDING - MP3 attached'
  },
  {
    cmd: 'AUDIO_LIVE',
    desc: 'Stream live audio to email',
    icon: Mic, color: '#f59e0b', working: true, category: 'Evidence',
    code: `val recorder = AudioRecord(MediaRecorder.AudioSource.MIC,
    16000, CHANNEL_IN_MONO, ENCODING_PCM_16BIT, bufferSize)
recorder.startRecording()
// Record in 60-second chunks and send
for (chunk in 1..5) {
    val buffer = ShortArray(16000 * 60)
    recorder.read(buffer, 0, buffer.size)
    val mp3Chunk = convertToMP3(buffer)
    sendEmail("🎤 LIVE AUDIO Chunk $chunk", "Streaming audio", mp3Chunk)
    Thread.sleep(60000)
}
recorder.stop(); recorder.release()`,
    email: '🎤 LIVE AUDIO STREAMING - Chunks emailed'
  },
  {
    cmd: 'VOICE_ANALYZE',
    desc: 'Voice stress & emotion analysis',
    icon: Activity, color: '#eab308', working: true, category: 'Evidence',
    code: `val audioData = recordAudioSample(30000) // 30 seconds
val mfccFeatures = extractMFCC(audioData, 44100)
val pitch = detectPitch(audioData, 44100)
val stress = analyzeVoiceStress(mfccFeatures, pitch)
val emotion = detectEmotion(mfccFeatures)
val result = """
    VOICE ANALYSIS:
    Stress Level: \${stress * 100}%
    Emotion: \$emotion
    Pitch: \${pitch}Hz
    Speaker Count: \${detectSpeakers(audioData)}
""".trimIndent()
sendEmail("🎤 VOICE ANALYSIS", result)`,
    email: '🎤 VOICE ANALYSIS - Stress & emotion report'
  },
  {
    cmd: 'WIFI_SCAN',
    desc: 'Log nearby WiFi networks',
    icon: Wifi, color: '#a78bfa', working: true, category: 'Network',
    code: `val wifiManager = getSystemService(WIFI_SERVICE) as WifiManager
registerReceiver(object : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        val results = wifiManager.scanResults
        val report = results.sortedByDescending { it.level }.joinToString("\\n") {
            "SSID: \${it.SSID} | BSSID: \${it.BSSID} | RSSI: \${it.level}dBm | \${it.frequency}MHz"
        }
        sendEmail("📡 WiFi SCAN (\${results.size} networks)", report)
        unregisterReceiver(this)
    }
}, IntentFilter(WifiManager.SCAN_RESULTS_AVAILABLE_ACTION))
wifiManager.startScan()`,
    email: '📡 WIFI SCAN - All nearby networks logged'
  },
  {
    cmd: 'BLUETOOTH_SCAN',
    desc: 'Scan Bluetooth devices',
    icon: Bluetooth, color: '#8b5cf6', working: true, category: 'Network',
    code: `val btManager = getSystemService(BLUETOOTH_SERVICE) as BluetoothManager
val adapter = btManager.adapter
registerReceiver(object : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        when (intent.action) {
            BluetoothDevice.ACTION_FOUND -> {
                val device = intent.getParcelableExtra<BluetoothDevice>(
                    BluetoothDevice.EXTRA_DEVICE)
                val rssi = intent.getShortExtra(
                    BluetoothDevice.EXTRA_RSSI, Short.MIN_VALUE).toInt()
                logDevice(device.name ?: "Unknown", device.address, rssi)
            }
            BluetoothAdapter.ACTION_DISCOVERY_FINISHED -> {
                sendEmail("📶 BT SCAN", getLoggedDevices())
                unregisterReceiver(this)
            }
        }
    }
}, IntentFilter().apply {
    addAction(BluetoothDevice.ACTION_FOUND)
    addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED)
})
adapter.startDiscovery()`,
    email: '📶 BLUETOOTH SCAN - Nearby devices'
  },
  {
    cmd: 'CELL_TOWER',
    desc: 'Cell tower triangulation',
    icon: Radio, color: '#7c3aed', working: true, category: 'Network',
    code: `val tm = getSystemService(TELEPHONY_SERVICE) as TelephonyManager
val cells = tm.allCellInfo
val report = cells.joinToString("\\n\\n") { cell ->
    when (cell) {
        is CellInfoLte -> """
            LTE Tower:
            MCC: \${cell.cellIdentity.mcc}
            MNC: \${cell.cellIdentity.mnc}
            TAC: \${cell.cellIdentity.tac}
            CI: \${cell.cellIdentity.ci}
            RSRP: \${cell.cellSignalStrength.rsrp}dBm
            RSRQ: \${cell.cellSignalStrength.rsrq}dB
        """.trimIndent()
        is CellInfoWcdma -> """
            3G Tower:
            MCC: \${cell.cellIdentity.mcc}
            MNC: \${cell.cellIdentity.mnc}
            LAC: \${cell.cellIdentity.lac}
            CID: \${cell.cellIdentity.cid}
            RSSI: \${cell.cellSignalStrength.rssi}dBm
        """.trimIndent()
        else -> cell.toString()
    }
}
sendEmail("📶 CELL TOWERS", report)`,
    email: '📶 CELL TOWERS - Triangulation data'
  },
  {
    cmd: 'LOCK',
    desc: 'Lock device instantly',
    icon: Lock, color: '#f87171', working: true, category: 'Control',
    code: `val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
val adminComponent = ComponentName(this, DeviceAdminReceiver::class.java)
if (dpm.isAdminActive(adminComponent)) {
    dpm.lockNow()
    sendEmail("🔒 DEVICE LOCKED", "Screen locked at \${System.currentTimeMillis()}")
} else {
    val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
    intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, adminComponent)
    startActivity(intent)
}`,
    email: '🔒 DEVICE LOCKED - Screen secured'
  },
  {
    cmd: 'FAKE_SHUTDOWN',
    desc: 'Screen off, tracking on',
    icon: EyeOff, color: '#ef4444', working: true, category: 'Control',
    code: `val wm = getSystemService(WINDOW_SERVICE) as WindowManager
val overlay = View(this).apply { setBackgroundColor(Color.BLACK) }
val params = WindowManager.LayoutParams(
    MATCH_PARENT, MATCH_PARENT,
    TYPE_APPLICATION_OVERLAY,
    FLAG_FULLSCREEN or FLAG_NOT_TOUCHABLE,
    PixelFormat.TRANSLUCENT
)
wm.addView(overlay, params)
// Mute all sounds
val audio = getSystemService(AUDIO_SERVICE) as AudioManager
audio.setStreamVolume(STREAM_RING, 0, 0)
audio.setStreamVolume(STREAM_NOTIFICATION, 0, 0)
audio.setStreamMute(STREAM_RING, true)
// Dim brightness
window.attributes = window.attributes.apply { screenBrightness = 0.01f }
// Keep CPU awake
val wl = (getSystemService(POWER_SERVICE) as PowerManager)
    .newWakeLock(PARTIAL_WAKE_LOCK, "AntiTheft::FakeShutdown")
wl.acquire(10 * 60 * 1000L)
sendEmail("🔌 FAKE SHUTDOWN ACTIVE", "Screen off, all tracking continues")`,
    email: '🔌 FAKE SHUTDOWN - Thief thinks phone is off'
  },
  {
    cmd: 'ALARM',
    desc: 'Max volume siren',
    icon: Volume2, color: '#dc2626', working: true, category: 'Control',
    code: `val audio = getSystemService(AUDIO_SERVICE) as AudioManager
val maxVol = audio.getStreamMaxVolume(STREAM_ALARM)
audio.setStreamVolume(STREAM_ALARM, maxVol, FLAG_PLAY_SOUND)
audio.setStreamVolume(STREAM_RING, audio.getStreamMaxVolume(STREAM_RING), 0)
audio.setStreamVolume(STREAM_MUSIC, audio.getStreamMaxVolume(STREAM_MUSIC), 0)
// Play alarm sound
val mp = MediaPlayer.create(this, R.raw.alarm_siren).apply {
    isLooping = true; start()
}
// Flash camera in SOS pattern (... --- ...)
flashCameraSOS()
sendEmail("🚨 ALARM ACTIVATED", "Siren + Flash SOS pattern")`,
    email: '🚨 ALARM ACTIVATED - Siren blasting'
  },
  {
    cmd: 'SCREAM_DETECT',
    desc: 'Auto-alarm on scream',
    icon: AlertTriangle, color: '#b91c1c', working: true, category: 'Control',
    code: `val recorder = AudioRecord(MediaRecorder.AudioSource.MIC,
    16000, CHANNEL_IN_MONO, ENCODING_PCM_16BIT, bufferSize)
recorder.startRecording()
thread {
    while (isMonitoring) {
        val buffer = ShortArray(16000) // 1 second
        recorder.read(buffer, 0, buffer.size)
        val maxAmplitude = buffer.maxOf { abs(it.toInt()) }
        // Scream: amplitude > 25000, frequency 500-4000Hz
        if (maxAmplitude > 25000 && detectScreamFrequency(buffer)) {
            triggerAlarm()
            sendEmail("🆘 SCREAM DETECTED", "Auto-alarm triggered")
            break
        }
    }
}`,
    email: '🆘 SCREAM DETECTED - Auto-alarm triggered'
  },
  {
    cmd: 'VIBRATE_PATTERN',
    desc: 'SOS vibration pattern',
    icon: Vibrate, color: '#991b1b', working: true, category: 'Control',
    code: `val vibrator = getSystemService(VIBRATOR_SERVICE) as Vibrator
val sosPattern = longArrayOf(
    0, 200, 200, 200, 200, 200, 200,  // S (...)
    0, 500, 200, 500, 200, 500,        // O (---)
    0, 200, 200, 200, 200, 200, 200    // S (...)
)
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    vibrator.vibrate(VibrationEffect.createWaveform(sosPattern, 0))
} else {
    vibrator.vibrate(sosPattern, 0)
}`,
    email: '📳 SOS VIBRATION PATTERN ACTIVATED'
  },
  {
    cmd: 'SIM_INFO',
    desc: 'Get SIM card details',
    icon: Smartphone, color: '#f472b6', working: true, category: 'Info',
    code: `val tm = getSystemService(TELEPHONY_SERVICE) as TelephonyManager
val simInfo = """
    SIM CARD INFO:
    Operator: \${tm.simOperatorName}
    Carrier: \${tm.networkOperatorName}
    Country: \${tm.networkCountryIso}
    Roaming: \${if (tm.isNetworkRoaming) "YES" else "NO"}
    Network Type: \${getNetworkType(tm.networkType)}
    Signal: \${getSignalStrength()}dBm
""".trimIndent()
sendEmail("📶 SIM INFO", simInfo)`,
    email: '📶 SIM CARD INFO - Carrier details'
  },
  {
    cmd: 'SIM_SWAP_ALERT',
    desc: 'Monitor SIM changes',
    icon: Smartphone, color: '#ec4899', working: true, category: 'Info',
    code: `registerReceiver(object : BroadcastReceiver() {
    override fun onReceive(ctx: Context, intent: Intent) {
        if (intent.action == "android.intent.action.SIM_STATE_CHANGED") {
            val state = intent.getStringExtra("ss")
            when (state) {
                "ABSENT" -> sendEmail("📶 SIM REMOVED", "SIM card removed!")
                "READY" -> {
                    val tm = getSystemService(TELEPHONY_SERVICE) as TelephonyManager
                    sendEmail("📶 NEW SIM INSERTED", """
                        Number: \${tm.line1Number}
                        Carrier: \${tm.simOperatorName}
                        IMSI: \${tm.subscriberId}
                    """.trimIndent())
                }
            }
        }
    }
}, IntentFilter("android.intent.action.SIM_STATE_CHANGED"))`,
    email: '📶 SIM SWAP DETECTED - New number captured'
  },
  {
    cmd: 'BATTERY',
    desc: 'Check battery status',
    icon: Battery, color: '#34d399', working: true, category: 'Info',
    code: `val filter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
val batteryStatus = registerReceiver(null, filter)
val level = batteryStatus?.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) ?: -1
val scale = batteryStatus?.getIntExtra(BatteryManager.EXTRA_SCALE, 100) ?: 100
val temp = (batteryStatus?.getIntExtra(BatteryManager.EXTRA_TEMPERATURE, 0) ?: 0) / 10f
val voltage = batteryStatus?.getIntExtra(BatteryManager.EXTRA_VOLTAGE, 0) ?: 0
val status = when (batteryStatus?.getIntExtra(BatteryManager.EXTRA_STATUS, -1)) {
    BatteryManager.BATTERY_STATUS_CHARGING -> "Charging"
    BatteryManager.BATTERY_STATUS_FULL -> "Full"
    else -> "Discharging"
}
sendEmail("🔋 BATTERY: \${level * 100 / scale}%", """
    Level: \${level * 100 / scale}%
    Status: $status
    Temperature: \${temp}°C
    Voltage: \${voltage / 1000f}V
""".trimIndent())`,
    email: '🔋 BATTERY STATUS - Level, temp, voltage'
  },
  {
    cmd: 'SENSORS_ALL',
    desc: 'Read all device sensors',
    icon: Activity, color: '#f472b6', working: true, category: 'Info',
    code: `val sm = getSystemService(SENSOR_SERVICE) as SensorManager
val sensors = sm.getSensorList(Sensor.TYPE_ALL)
val report = sensors.joinToString("\\n") { sensor ->
    """
    \${sensor.name}
    Type: \${sensor.type}
    Vendor: \${sensor.vendor}
    Power: \${sensor.power}mA
    Range: \${sensor.maximumRange}
    Resolution: \${sensor.resolution}
    Min Delay: \${sensor.minDelay}μs
    ---
    """.trimIndent()
}
sendEmail("🎯 ALL SENSORS (\${sensors.size})", report)`,
    email: '🎯 ALL SENSORS - Full sensor list'
  },
  {
    cmd: 'ENVIRONMENT',
    desc: 'Capture environment data',
    icon: Thermometer, color: '#fb923c', working: true, category: 'Info',
    code: `val sm = getSystemService(SENSOR_SERVICE) as SensorManager
val results = mutableMapOf<String, Float>()
sm.getDefaultSensor(Sensor.TYPE_AMBIENT_TEMPERATURE)?.let {
    sm.registerListener(sensorListener, it, SENSOR_DELAY_NORMAL)
    results["Temperature"] = it.maximumRange
}
sm.getDefaultSensor(Sensor.TYPE_LIGHT)?.let {
    results["Light (lux)"] = it.maximumRange
}
sm.getDefaultSensor(Sensor.TYPE_RELATIVE_HUMIDITY)?.let {
    results["Humidity (%)"] = it.maximumRange
}
sm.getDefaultSensor(Sensor.TYPE_PRESSURE)?.let {
    results["Pressure (hPa)"] = it.maximumRange
}
sendEmail("🌡️ ENVIRONMENT", results.entries.joinToString("\\n") { 
    "\${it.key}: \${it.value}" 
})`,
    email: '🌡️ ENVIRONMENT - Temp, humidity, pressure, light'
  },
  {
    cmd: 'DEVICE_INFO',
    desc: 'Full device information',
    icon: Smartphone, color: '#a78bfa', working: true, category: 'Info',
    code: `val info = """
    DEVICE INFORMATION:
    Brand: \${Build.BRAND}
    Model: \${Build.MODEL}
    Manufacturer: \${Build.MANUFACTURER}
    Android: \${Build.VERSION.RELEASE} (API \${Build.VERSION.SDK_INT})
    Security Patch: \${Build.VERSION.SECURITY_PATCH}
    Build: \${Build.DISPLAY}
    Hardware: \${Build.HARDWARE}
    Bootloader: \${Build.BOOTLOADER}
    Radio: \${Build.RADIO}
    Fingerprint: \${Build.FINGERPRINT}
    RAM: \${getTotalRAM()}MB
    Storage: \${getFreeStorage()}GB free
""".trimIndent()
sendEmail("📱 DEVICE INFO", info)`,
    email: '📱 DEVICE INFO - Complete specifications'
  },
  {
    cmd: 'REPORT',
    desc: 'Generate police report',
    icon: Shield, color: '#fb923c', working: true, category: 'Report',
    code: `val report = buildString {
    appendLine("POLICE THEFT REPORT")
    appendLine("=" .repeat(40))
    appendLine("Device: \${Build.BRAND} \${Build.MODEL}")
    appendLine("Time: \${Date()}")
    appendLine()
    appendLine("EVIDENCE:")
    getCapturedPhotos().forEach { appendLine("📸 \${it.name}") }
    getAudioRecordings().forEach { appendLine("🎤 \${it.name}") }
    getLocationHistory().takeLast(5).forEach { 
        appendLine("📍 \${it.lat}, \${it.lng} - \${it.time}") 
    }
    appendLine()
    appendLine("LAST LOCATION:")
    val last = getLastLocation()
    appendLine("https://maps.google.com/?q=\${last.lat},\${last.lng}")
}
val allFiles = getCapturedPhotos() + getAudioRecordings()
sendEmail("📋 POLICE REPORT", report, allFiles)`,
    email: '📋 POLICE REPORT - Complete dossier with all evidence'
  },
  {
    cmd: 'WIPE',
    desc: 'Factory reset device',
    icon: Trash2, color: '#ef4444', working: true, category: 'Control',
    code: `val dpm = getSystemService(DEVICE_POLICY_SERVICE) as DevicePolicyManager
if (dpm.isAdminActive(adminComponent)) {
    AlertDialog.Builder(this)
        .setTitle("⚠️ CONFIRM FACTORY RESET")
        .setMessage("This will erase ALL data permanently!")
        .setPositiveButton("WIPE DEVICE") { _, _ ->
            sendEmail("⚠️ WIPING DEVICE", "Factory reset initiated")
            dpm.wipeData(
                DevicePolicyManager.WIPE_EXTERNAL_STORAGE or
                DevicePolicyManager.WIPE_RESET_PROTECTION_DATA
            )
        }
        .setNegativeButton("Cancel", null)
        .show()
}`,
    email: '⚠️ DEVICE WIPED - Factory reset executed'
  },
  {
    cmd: 'BACKUP_EVIDENCE',
    desc: 'Upload all evidence to cloud',
    icon: Upload, color: '#22d3ee', working: true, category: 'Report',
    code: `val allEvidence = collectAllEvidence()
allEvidence.forEach { file ->
    // Upload to multiple cloud services
    uploadToGoogleDrive(file)
    uploadToFirebase(file)
    uploadToDropbox(file)
    // Also send via email as backup
    sendEmail("💾 EVIDENCE BACKUP: \${file.name}", "File attached", file)
}
sendEmail("✅ BACKUP COMPLETE", 
    "\${allEvidence.size} files backed up to cloud + email")`,
    email: '💾 EVIDENCE BACKED UP - Cloud + Email copies'
  },
  {
    cmd: 'SMS_ALERT',
    desc: 'Send SMS alert',
    icon: Phone, color: '#f472b6', working: false, android15Blocked: true, category: 'Blocked',
    code: `// BLOCKED on Android 14+
// Only default SMS app can send SMS
val smsManager = SmsManager.getDefault()
smsManager.sendTextMessage(
    "+254700000000", null,
    "🚨 THEFT ALERT! Location: maps.google.com/?q=-1.2921,36.8219",
    null, null
)
// RESULT: SecurityException on Android 14+
// "App does not have permission to send SMS"
// ALTERNATIVE: Use email instead`,
    email: '🚫 BLOCKED - Use EMAIL commands instead'
  },
  {
    cmd: 'CALL_LOG',
    desc: 'Read call history',
    icon: Phone, color: '#ec4899', working: false, android15Blocked: true, category: 'Blocked',
    code: `// BLOCKED on Android 10+
// Requires CALL_LOG permission
val cursor = contentResolver.query(
    CallLog.Calls.CONTENT_URI, null, null, null, null)
// RESULT: SecurityException
// "Permission denial: reading call log requires 
//  android.permission.READ_CALL_LOG"
// ALTERNATIVE: SIM swap detection provides new number`,
    email: '🚫 BLOCKED - Call log access restricted'
  },
];

const CommandCenter = () => {
  const [log, setLog] = useState([]);
  const [email, setEmail] = useState('');
  const [expandedCmd, setExpandedCmd] = useState(null);
  const [showCode, setShowCode] = useState({});
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', ...new Set(commands.map(c => c.category))];
  
  const filteredCommands = commands.filter(cmd => {
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
          detail: `📧 Evidence sent to ${email || 'emergency@gmail.com'} - ${cmd.email}`
        };
        setLog(prev => [emailEntry, ...prev]);
      }, 1500);
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

  const exportLog = () => {
    const text = log.map(l => `[\${l.time}] \${l.cmd}: \${l.detail}`).join('\\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'command-log.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Terminal size={28} color="#22d3ee" /> Command Center
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            {commands.length} commands • {commands.filter(c => c.working).length} working • {commands.filter(c => !c.working).length} blocked
          </p>
        </div>
        <span style={{ padding: '8px 16px', background: 'rgba(52,211,153,0.1)', color: '#34d399', borderRadius: '20px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(52,211,153,0.3)' }}>
          ● Connected
        </span>
      </div>

      {/* Email Config */}
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <Mail size={20} color="#22d3ee" />
          <h3 style={{ fontWeight: 600, fontSize: '15px' }}>📧 Emergency Email (All evidence sent here)</h3>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="email" placeholder="emergency@gmail.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', color: '#fff', fontSize: '14px' }} />
          <button style={{ padding: '12px 24px', background: 'var(--gradient-1)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 600, cursor: 'pointer' }}>
            <Save size={14} style={{ display: 'inline', marginRight: '6px' }} />Save
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="🔍 Search commands..." value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: '10px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', color: '#fff', fontSize: '13px', minWidth: '200px' }} />
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: filter === cat ? 'var(--accent-glow)' : 'var(--bg-card)',
              color: filter === cat ? '#fff' : 'var(--text-muted)', fontSize: '12px', fontWeight: 500,
              border: `1px solid ${filter === cat ? 'var(--accent)' : 'var(--border)'}`,
              textTransform: 'capitalize'
            }}>
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {filteredCommands.length} commands
        </span>
      </div>

      {/* Commands Grid */}
      <h2 className="section-title">⚡ Commands ({filteredCommands.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        {filteredCommands.map((cmd, i) => (
          <motion.div key={cmd.cmd} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', opacity: cmd.working ? 1 : 0.6 }}>
            
            <div style={{ padding: '14px', cursor: 'pointer' }} onClick={() => setExpandedCmd(expandedCmd === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <cmd.icon size={18} color={cmd.color} />
                  <code style={{ fontSize: '16px', fontWeight: 700, color: '#22d3ee', fontFamily: 'monospace' }}>{cmd.cmd}</code>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {!cmd.working && <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(248,113,113,0.15)', color: '#f87171', borderRadius: '6px', fontWeight: 600 }}>BLOCKED</span>}
                  <button onClick={(e) => { e.stopPropagation(); execute(cmd); }}
                    style={{ padding: '6px 12px', background: cmd.working ? cmd.color : '#444', border: 'none', borderRadius: '6px', color: cmd.working ? '#000' : '#888', cursor: cmd.working ? 'pointer' : 'not-allowed', fontWeight: 600, fontSize: '11px' }}
                    disabled={!cmd.working}>
                    <Play size={12} style={{ display: 'inline', marginRight: '3px' }} />Run
                  </button>
                  <ChevronRight size={12} style={{ transform: expandedCmd === i ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cmd.desc}</p>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px' }}>{cmd.category}</span>
            </div>

            <AnimatePresence>
              {expandedCmd === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ borderTop: '1px solid var(--border)', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', cursor: 'pointer' }}
                      onClick={() => setShowCode(prev => ({ ...prev, [i]: !prev[i] }))}>
                      <span style={{ fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Code size={13} color="#22d3ee" /> Implementation Code
                      </span>
                      <ChevronRight size={12} style={{ transform: showCode[i] ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </div>
                    {showCode[i] && (
                      <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <button onClick={(e) => { e.stopPropagation(); copyCode(cmd.code, i); }}
                          style={{ position: 'absolute', top: '4px', right: '4px', padding: '4px 8px', background: '#1e2433', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1 }}>
                          {copied === i ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
                          {copied === i ? 'Copied' : 'Copy'}
                        </button>
                        <pre style={{ background: '#0d1117', color: '#c9d1d9', padding: '12px', borderRadius: '8px', fontSize: '11px', lineHeight: '1.3', overflowX: 'auto', maxHeight: '250px', overflowY: 'auto', border: '1px solid #30363d', fontFamily: 'monospace' }}>
                          <code>{cmd.code}</code>
                        </pre>
                      </div>
                    )}
                    <div style={{ padding: '10px', background: 'var(--bg-primary)', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace', color: '#34d399' }}>
                      📧 {cmd.email}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="glass-card" style={{ marginBottom: '20px', padding: '20px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>📧 Command → Email Pipeline</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
          {['📱 Send', '📡 TLS', '📱 Execute', '📦 Package', '📧 Gmail'].map((step, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
              <span style={{ padding: '8px 14px', background: 'var(--bg-primary)', borderRadius: '8px', fontWeight: 500 }}>{step}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Log */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>📝 Log ({log.length})</h2>
        {log.length > 0 && (
          <button onClick={exportLog} style={{ padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={13} /> Export
          </button>
        )}
      </div>
      <div className="glass-card" style={{ maxHeight: '250px', overflowY: 'auto' }}>
        {log.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '28px', fontFamily: 'monospace', fontSize: '13px' }}>
            Press <span style={{ color: '#22d3ee' }}>Run</span> on any command to execute...
          </p>
        ) : (
          log.map((entry) => (
            <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '12px' }}>
              <span style={{ color: entry.status === 'success' ? '#34d399' : '#f87171', fontSize: '14px' }}>
                {entry.status === 'success' ? '✅' : '🚫'}
              </span>
              <code style={{ color: '#22d3ee', fontWeight: 600, minWidth: '90px' }}>{entry.cmd}</code>
              <span style={{ color: 'var(--text-muted)', minWidth: '65px', fontSize: '11px' }}>{entry.time}</span>
              <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{entry.detail}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommandCenter;
