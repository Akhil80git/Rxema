import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  X, 
  Terminal, 
  ExternalLink, 
  Github, 
  Sparkles, 
  FileCode2, 
  Layers, 
  Link as LinkIcon,
  Check
} from 'lucide-react';

interface RealApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'taskflow_custom_apk_download_url';

export const RealApkModal: React.FC<RealApkModalProps> = ({ isOpen, onClose }) => {
  const [apkUrl, setApkUrl] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'download' | 'github' | 'studio'>('download');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setApkUrl(saved);
    }
  }, []);

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (apkUrl.trim()) {
      localStorage.setItem(STORAGE_KEY, apkUrl.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleDirectDownload = () => {
    const targetUrl = apkUrl.trim() || '/TaskFlow-Capacitor-Android.zip';
    const link = document.createElement('a');
    link.href = targetUrl;
    if (!apkUrl.trim()) {
      link.setAttribute('download', 'TaskFlow-Capacitor-Android.zip');
    } else {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadProjectZip = () => {
    const link = document.createElement('a');
    link.href = '/TaskFlow-Capacitor-Android.zip';
    link.setAttribute('download', 'TaskFlow-Capacitor-Android.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base sm:text-lg">
                  Real Android APK & Capacitor
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                  Capacitor 8.5
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                असली साइन्ड APK डाउनलोड & GitHub ऑटोमैटिक CI/CD बिल्डर
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
            onClick={() => setActiveTab('download')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'download'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>APK डाउनलोड / लिंक</span>
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'github'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Actions ऑटो-बिल्ड</span>
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`pb-2.5 px-3 font-semibold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'studio'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>Android Studio प्रोजेक्ट</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">

          {activeTab === 'download' && (
            <div className="space-y-4">
              
              {/* Primary Direct Download Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">
                      1-क्लिक डायरेक्ट APK डाउनलोड
                    </h3>
                  </div>
                  {apkUrl ? (
                    <span className="text-[10px] bg-emerald-900/50 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded">
                      कस्टम लिंक एक्टिव
                    </span>
                  ) : (
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                      डिफ़ॉल्ट
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {apkUrl 
                    ? 'आपका सेट किया हुआ असली साइन्ड APK डाउनलोड करने के लिए नीचे दिए गए बटन पर क्लिक करें:' 
                    : 'अगर आपने GitHub Releases या Firebase पर APK अपलोड किया है, तो नीचे उसका डायरेक्ट लिंक सेट कर लें, जिससे 1-क्लिक में वही APK डाउनलोड होगी:'}
                </p>

                <button
                  type="button"
                  onClick={handleDirectDownload}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/30 transition active:scale-[0.99]"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {apkUrl ? '📥 TaskFlow-Pro.apk डाउनलोड करें' : '📥 Capacitor Android प्रोजेक्ट (.zip) डाउनलोड'}
                  </span>
                </button>
              </div>

              {/* Set Custom APK URL Form */}
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/60 space-y-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    कस्टम APK डाउनलोड URL सेट करें (GitHub / Drive / CDN)
                  </h4>
                </div>

                <form onSubmit={handleSaveUrl} className="space-y-2.5">
                  <input
                    type="url"
                    value={apkUrl}
                    onChange={(e) => setApkUrl(e.target.value)}
                    placeholder="https://github.com/USER/REPO/releases/download/v1.0.0/app-debug.apk"
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-zinc-400">
                      यह लिंक आपके ब्राउज़र में सुरक्षित रहेगा और "APK डाउनलोड" बटन सीधे इसे खोलेगा।
                    </p>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>सेव हो गया!</span>
                        </>
                      ) : (
                        <span>लिंक सेव करें</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-zinc-900 border border-indigo-500/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-white" />
                  <h4 className="font-bold text-white text-sm">
                    GitHub Actions ऑटोमैटिक APK बिल्डर (No PC Required!)
                  </h4>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  चूँकि Vercel केवल वेब पेजों को होस्ट करता है (Android SDK नहीं चलाता), इसलिए हमने आपकी रिपॉजिटरी में <strong>GitHub Actions CI/CD</strong> जोड़ दिया है:
                </p>
                <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-200 font-mono text-[11px]">
                  📁 .github/workflows/build-apk.yml
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  यह कैसे काम करता है:
                </h5>
                <ol className="text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>
                    जब आप यह कोड अपने <strong>GitHub Repo</strong> पर पुश करेंगे (जो आप Vercel के लिए करते ही हैं), GitHub Actions अपने आप Ubuntu + Java 17 + Android SDK का वातावरण तैयार कर लेगा।
                  </li>
                  <li>
                    यह <code className="text-indigo-300 font-mono">./gradlew assembleDebug</code> चलाकर एक असली, साइन्ड <strong>app-debug.apk</strong> बना देगा।
                  </li>
                  <li>
                    यह APK सीधे आपके GitHub के <strong>Actions Artifacts</strong> और <strong>Releases</strong> में डाउनलोड के लिए उपलब्ध हो जाएगी।
                  </li>
                  <li>
                    उस लिंक को कॉपी करके यहाँ <strong>"कस्टम APK डाउनलोड URL"</strong> में पेस्ट कर दें।
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'studio' && (
            <div className="space-y-3.5 text-xs">
              <div className="p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    लोकल कंप्यूटर / Android Studio में बिल्ड करें
                  </h4>
                  <button
                    onClick={handleDownloadProjectZip}
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] flex items-center gap-1 transition"
                  >
                    <Download className="w-3 h-3" />
                    <span>प्रोजेक्ट .zip</span>
                  </button>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  अगर आपके पास PC / Android Studio है, तो आप 2 कमांड में असली APK जनरेट कर सकते हैं:
                </p>

                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-emerald-400 space-y-1.5">
                  <p className="text-zinc-400"># 1. वेब कोड बिल्ड और Capacitor सिंक:</p>
                  <p className="text-white font-bold">npm run build</p>
                  <p className="text-zinc-400 pt-1"># 2. Android Studio में खोलें:</p>
                  <p className="text-white font-bold">npx cap open android</p>
                  <p className="text-zinc-400 pt-1"># 3. Android Studio में क्लिक करें:</p>
                  <p className="text-amber-300">Build ➔ Build Bundle(s) / APK(s) ➔ Build APK(s)</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-800/30 border border-zinc-700/50 space-y-1.5 text-zinc-400 text-[11px]">
                <h5 className="font-semibold text-zinc-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  प्रोजेक्ट कॉन्फ़िगरेशन:
                </h5>
                <p>• पैकेज: <code className="text-indigo-300 font-mono">com.taskflow.app</code></p>
                <p>• कॉन्फ़िगरेशन फ़ाइल: <code className="text-indigo-300 font-mono">capacitor.config.ts</code></p>
                <p>• आउटपुट पथ: <code className="text-zinc-300 font-mono">android/app/build/outputs/apk/debug/app-debug.apk</code></p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
          <span>Capacitor Native Framework</span>
          <div className="flex gap-2">
            <button
              onClick={handleDirectDownload}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>डाउनलोड</span>
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
