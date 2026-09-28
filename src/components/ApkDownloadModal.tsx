import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Terminal, 
  ShieldCheck, 
  Radio, 
  Volume2,
  Package,
  Layers,
  FileCode2,
  Cpu
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { realtimeSyncService } from '../services/realtimeSyncService';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDisplayName?: string;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  userDisplayName,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [notificationPermission, setNotificationPermission] = useState<'granted' | 'denied' | 'default' | 'unsupported'>(
    realtimeSyncService.getNotificationPermission()
  );
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bundle' | 'guide' | 'direct'>('bundle');

  if (!isOpen) return null;

  const handleTestNotification = async () => {
    setTestStatus('नोटिफिकेशन और साउंड भेजा जा रहा है...');
    try {
      await realtimeSyncService.sendTestNotification();
      setNotificationPermission(realtimeSyncService.getNotificationPermission());
      setTestStatus('✅ नोटिफिकेशन और साउंड सफलतापूर्वक बज गया!');
      setTimeout(() => setTestStatus(null), 4000);
    } catch {
      setTestStatus('❌ नोटिफिकेशन की अनुमति (Permission) दें।');
    }
  };

  const downloadApkBundleZip = () => {
    setTestStatus('📥 पूरा Android APK प्रोजेक्ट बंडल डाउनलोड हो रहा है...');
    const link = document.createElement('a');
    link.href = '/TaskFlow-Android-APK-Bundle.zip';
    link.download = 'TaskFlow-Android-APK-Bundle.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => {
      setTestStatus('✅ बंडल ज़िप डाउनलोड हो गई! इसे Android Studio में खोलें।');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="w-full max-w-xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base sm:text-lg">
                  Android APK & AAB Bundle
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                  v1.0.0 (API 34)
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                नेटिव Android APK प्रोजेक्ट, बैकग्राउंड नोटिफिकेशन & बंडल
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/50 px-4 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('bundle')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'bundle'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>APK बंडल डाउनलोड</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>बिल्ड गाइड (Build APK)</span>
          </button>
          <button
            onClick={() => setActiveTab('direct')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'direct'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>डायरेक्ट फोन इंस्टाल</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Status Message */}
          {testStatus && (
            <div className="p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-400" />
              <span>{testStatus}</span>
            </div>
          )}

          {activeTab === 'bundle' && (
            <>
              {/* Main Android APK Project Bundle Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/70 via-zinc-900 to-zinc-900 border border-indigo-500/30 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        पूरा Android Studio APK प्रोजेक्ट (.zip)
                      </h3>
                      <p className="text-[11px] text-zinc-300">
                        Package: <code className="text-indigo-300 font-mono">com.taskflow.app</code>
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                    Gradle 8.5
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  इस बंडल में पूरा Android प्रोजेक्ट शामिल है जिसे आप <strong>Android Studio</strong> में सीधे खोलकर 1-क्लिक में <strong>APK (app-release.apk)</strong> या Google Play Store के लिए <strong>AAB Bundle</strong> बना सकते हैं।
                </p>

                {/* Android Architecture Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
                    <span className="text-[10px] text-zinc-400 block">Target SDK</span>
                    <strong className="text-white font-mono text-xs">34 (Android 14)</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
                    <span className="text-[10px] text-zinc-400 block">Min SDK</span>
                    <strong className="text-white font-mono text-xs">24 (Android 7+)</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
                    <span className="text-[10px] text-zinc-400 block">Language</span>
                    <strong className="text-white font-mono text-xs">Kotlin 1.9</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
                    <span className="text-[10px] text-zinc-400 block">Offline Assets</span>
                    <strong className="text-emerald-400 font-mono text-xs">Bundled (www)</strong>
                  </div>
                </div>

                {/* Big Download Button */}
                <button
                  onClick={downloadApkBundleZip}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Android APK / AAB Bundle (.zip) डाउनलोड करें</span>
                </button>
              </div>

              {/* Native Notification & Hardware Integration */}
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <h3 className="text-sm font-semibold text-white">
                      नेटिव Android नोटिफिकेशन (No Browser Limits)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    Active Bridge
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  APK के अंदर <code className="text-indigo-300 font-mono">WebAppInterface.kt</code> और <code className="text-indigo-300 font-mono">NotificationManagerCompat</code> सीधे फोन के हार्डवेयर से जुड़े हैं। टास्क पूरा होने या नया टास्क जुड़ने पर बिना किसी ब्राउज़र रुकावट के सीधे फुल-वॉल्यूम साउंड, कस्टम वाइब्रेशन और हाई-प्रायोरिटी पुश नोटिफिकेशन जाता है।
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-medium text-xs transition"
                  >
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>अलर्ट साउंड & नोटिफिकेशन टेस्ट करें 🔔</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      const perm = await realtimeSyncService.requestNotificationPermission();
                      setNotificationPermission(perm);
                    }}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-xs transition ${
                      notificationPermission === 'granted'
                        ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>
                      {notificationPermission === 'granted' ? 'नोटिफिकेशन चालू है ✅' : 'परमिशन चालू करें'}
                    </span>
                  </button>
                </div>
              </div>

              {/* What is inside the project */}
              <div className="p-3.5 rounded-xl bg-zinc-800/30 border border-zinc-700/50 space-y-2 text-xs">
                <h4 className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  प्रोजेक्ट बंडल के अंदर क्या-क्या है:
                </h4>
                <ul className="text-zinc-400 space-y-1 text-[11px] list-disc list-inside">
                  <li><strong className="text-zinc-300">app/src/main/AndroidManifest.xml</strong>: POST_NOTIFICATIONS, VIBRATE, WAKE_LOCK अनुमतियों के साथ।</li>
                  <li><strong className="text-zinc-300">MainActivity.kt & WebAppInterface.kt</strong>: फुल-स्क्रीन नेटिव WebView + नोटिफिकेशन ब्रिज।</li>
                  <li><strong className="text-zinc-300">app/src/main/assets/www/</strong>: पहले से पूरी तरह संकलित (Bundled) वेब फाइल्स जो ऑफलाइन भी चलती हैं।</li>
                  <li><strong className="text-zinc-300">res/mipmap-*/</strong>: HD ऐप आइकन्स (192px, 512px, Adaptive Squircle)।</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Android Studio में APK कैसे बनाएं (सिर्फ 1 मिनट):
                </h4>
                <ol className="text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed pt-1">
                  <li>डाउनलोड की गई <code className="text-indigo-300 font-mono">TaskFlow-Android-APK-Bundle.zip</code> को अनज़िप (Extract) करें।</li>
                  <li><strong>Android Studio</strong> खोलें और <strong>"Open"</strong> पर क्लिक करके अनज़िप किया हुआ फ़ोल्डर चुनें।</li>
                  <li>Gradle अपने आप सब कुछ सिंक कर लेगा।</li>
                  <li>
                    ऊपर मेनू में जाएं: <br />
                    <code className="text-amber-300 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 inline-block mt-1 font-mono">
                      Build → Build Bundle(s) / APK(s) → Build APK(s)
                    </code>
                  </li>
                  <li>बिल्ड होने के बाद आपको सीधे <strong>app-debug.apk</strong> या <strong>app-release.apk</strong> मिल जाएगी जिसे आप किसी भी फोन में इंस्टॉल कर सकते हैं!</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 font-mono text-[11px]">
                <p className="text-zinc-400 font-sans font-semibold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  या कमांड लाइन (Terminal) से बनाएं:
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400 space-y-1">
                  <p># Debug APK बनाने के लिए:</p>
                  <p className="text-white font-bold">./gradlew assembleDebug</p>
                  <p className="pt-2"># Release APK बनाने के लिए:</p>
                  <p className="text-white font-bold">./gradlew assembleRelease</p>
                  <p className="pt-2"># Play Store AAB Bundle बनाने के लिए:</p>
                  <p className="text-white font-bold">./gradlew bundleRelease</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'direct' && (
            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">
                    डायरेक्ट फोन में बिना PC के चलाएं (WebAPK)
                  </h4>
                  {isInstalled && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                      इंस्टॉल्ड
                    </span>
                  )}
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  अगर आपके पास अभी कंप्यूटर नहीं है, तो Android फोन में Google Chrome के जरिए आप इसे तुरंत 2 सेकंड में ऐप की तरह इंस्टॉल कर सकते हैं।
                </p>

                {isInstallable ? (
                  <button
                    onClick={install}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>अभी फोन में जोड़ें (Install)</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 space-y-1 text-[11px]">
                    <p>1. फोन में Chrome के ऊपर तीन बिंदु <strong>(⋮)</strong> दबाएं।</p>
                    <p>2. <strong>"Install app"</strong> या <strong>"Add to Home Screen"</strong> पर टैप करें।</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick specs pill row */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>सभी Android 7 से 14 फोन पर समर्थित</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>हार्डवेयर वाइब्रेशन & साउंड सपोर्ट</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
          <span>यूज़र: <strong className="text-zinc-200">{userDisplayName || 'Active User'}</strong></span>
          <div className="flex gap-2">
            <button
              onClick={downloadApkBundleZip}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>बंडल .zip</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition"
            >
              बंद करें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
