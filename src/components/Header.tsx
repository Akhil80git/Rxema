import React, { useState } from 'react';
import { ActiveTab, AppUser } from '../types/todo';
import { SyncState } from '../services/storageService';
import { 
  CheckSquare, 
  LayoutGrid, 
  BarChart3, 
  Cloud, 
  LogOut, 
  Database,
  History,
  Smartphone,
  Bell,
  Radio
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: AppUser | null;
  syncState: SyncState;
  completedCount: number;
  onOpenSupabaseModal: () => void;
  onDownloadApk: () => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  currentUser,
  syncState,
  completedCount,
  onOpenSupabaseModal,
  onDownloadApk,
  onLogout,
  onOpenAuth,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-4xl mx-auto px-2.5 sm:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Main 4 Navigation Icon Tabs */}
          <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl gap-0.5 sm:gap-1">
            
            {/* 1. View Icon (Default tab: Shows pending/active cards) */}
            <button
              type="button"
              onClick={() => onTabChange('view')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'view'
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="सक्रिय लिस्ट देखें"
            >
              <CheckSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              <span>लिस्ट</span>
            </button>

            {/* 2. Template / Add Icon */}
            <button
              type="button"
              onClick={() => onTabChange('templates')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'templates'
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="नयी लिस्ट जोड़ें (Templates)"
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              <span>जोड़ें</span>
            </button>

            {/* 3. Analytics Icon */}
            <button
              type="button"
              onClick={() => onTabChange('analytics')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="एनालिटिक्स & हिसाब"
            >
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              <span>हिसाब</span>
            </button>

            {/* 4. History Icon (Dedicated tab for completed items) */}
            <button
              type="button"
              onClick={() => onTabChange('history')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="पूर्ण कार्य इतिहास (Completed History)"
            >
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              <span>हिस्ट्री</span>
              {completedCount > 0 && (
                <span className={`text-[10px] font-mono px-1 rounded ${
                  activeTab === 'history' 
                    ? 'bg-zinc-300 text-zinc-950 font-bold' 
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {completedCount}
                </span>
              )}
            </button>

          </div>

          {/* Right minimal status & profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Direct APK Download Button (1-Click Direct Download) */}
            <button
              onClick={onDownloadApk}
              title="Download TaskFlow-Pro.apk (Direct)"
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 text-xs font-bold transition active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-white" />
              <span>APK डाउनलोड</span>
            </button>

            {/* Supabase status minimal button */}
            <button
              onClick={onOpenSupabaseModal}
              title="Supabase Cloud Status"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            >
              {syncState === 'synced' ? (
                <Cloud className="w-4 h-4 text-emerald-400" />
              ) : (
                <Database className="w-4 h-4 text-sky-400" />
              )}
            </button>

            {/* User profile dropdown - Logout is strictly inside profile click */}
            {currentUser ? (
              <div className="relative pl-1">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 hover:border-indigo-500 flex items-center justify-center font-bold text-xs text-zinc-200 uppercase transition-colors relative"
                  title="Profile Menu & APK Download"
                >
                  {currentUser.username[0]}
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950" title="Live Sync Active" />
                </button>

                {profileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setProfileOpen(false)} 
                    />
                    <div className="absolute right-0 top-10 z-40 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 text-xs text-zinc-200 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-2.5 py-2 border-b border-zinc-800">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-white truncate">
                            {currentUser.displayName || currentUser.username}
                          </p>
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                            <Radio className="w-2.5 h-2.5 animate-pulse" />
                            लाइव सिंक
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          @{currentUser.username}
                        </p>
                      </div>

                      {/* APK Download Button inside Profile Dropdown */}
                      <div className="py-1 border-b border-zinc-800">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            onDownloadApk();
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-indigo-300 hover:text-white hover:bg-indigo-600/20 rounded-lg font-medium transition-colors text-left"
                        >
                          <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold">📥 APK सीधे डाउनलोड करें</span>
                            <span className="text-[10px] text-zinc-400">1-क्लिक में TaskFlow-Pro.apk डाउनलोड</span>
                          </div>
                        </button>
                      </div>

                      <div className="pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileOpen(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg font-medium transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>लॉगआउट (Logout)</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
              >
                Login
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
