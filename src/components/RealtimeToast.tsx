import React from 'react';
import { RemoteSyncEvent } from '../services/realtimeSyncService';
import { CheckCircle2, PlusCircle, RefreshCw, X, Smartphone } from 'lucide-react';

interface RealtimeToastProps {
  event: RemoteSyncEvent | null;
  onDismiss: () => void;
  onAction?: () => void;
}

export const RealtimeToast: React.FC<RealtimeToastProps> = ({
  event,
  onDismiss,
  onAction,
}) => {
  if (!event) return null;

  const isCompleted = event.type === 'TASK_COMPLETED';
  const isCreated = event.type === 'TASK_CREATED';

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-in slide-in-from-top-4 duration-200">
      <div className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 ${
        isCompleted
          ? 'bg-zinc-900/95 border-emerald-500/40 text-emerald-200 shadow-emerald-950/40'
          : 'bg-zinc-900/95 border-indigo-500/40 text-indigo-200 shadow-indigo-950/40'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isCompleted 
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
              : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
          }`}>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isCreated ? (
              <PlusCircle className="w-5 h-5" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-zinc-400" />
                {event.userName ? `${event.userName} (दूसरा डिवाइस)` : 'दूसरे डिवाइस पर'}
              </span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 rounded">अभी</span>
            </div>
            <p className="text-xs font-bold text-white truncate">
              {isCompleted ? 'कार्य पूरा हुआ:' : isCreated ? 'नया कार्य जुड़ा:' : 'कार्य अपडेट:'} {event.todoTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {onAction && (
            <button
              onClick={onAction}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition ${
                isCompleted
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              देखें
            </button>
          )}
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
