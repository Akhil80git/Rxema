import { supabase } from '../lib/supabase';
import { TodoItem } from '../types/todo';

export interface RemoteSyncEvent {
  type: 'TASK_COMPLETED' | 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED';
  deviceId: string;
  todoId: string;
  todoTitle: string;
  userName: string;
  timestamp: number;
  todo?: TodoItem;
}

// Generate persistent unique device ID for this session/app instance
function getDeviceId(): string {
  let id = localStorage.getItem('taskflow_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem('taskflow_device_id', id);
  }
  return id;
}

const CURRENT_DEVICE_ID = getDeviceId();

// Web Audio API Synthesized Chime (Works on all devices without external MP3 files)
function playNotificationChime(type: 'completed' | 'created' | 'alert') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === 'completed') {
      // Cheerful celebratory chord (D5 -> F#5 -> A5)
      const freqs = [587.33, 739.99, 880.00];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } else {
      // Soft ping bell (C5 -> G5)
      const freqs = [523.25, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.1 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.55);
      });
    }
  } catch (err) {
    console.warn('Audio chime note:', err);
  }
}

interface AndroidBridge {
  isNativeApp?: () => boolean;
  showNotification?: (title: string, message: string, isCompletion: boolean) => void;
  vibratePhone?: (durationMs: number) => void;
}

declare global {
  interface Window {
    AndroidInterface?: AndroidBridge;
  }
}

// Trigger device physical vibration & system notification
async function triggerDeviceNotification(title: string, body: string, type: 'completed' | 'created') {
  // 0. Native Android APK Bridge - Direct Android OS Notification (No browser restrictions)
  if (typeof window !== 'undefined' && window.AndroidInterface?.showNotification) {
    try {
      window.AndroidInterface.showNotification(title, body, type === 'completed');
      if (window.AndroidInterface.vibratePhone) {
        window.AndroidInterface.vibratePhone(type === 'completed' ? 400 : 200);
      }
      return;
    } catch (e) {
      console.warn('Native Android notification error:', e);
    }
  }

  // 1. Audio chime
  playNotificationChime(type);

  // 2. Mobile vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (type === 'completed') {
        navigator.vibrate([150, 70, 150, 70, 200]);
      } else {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {
      // Ignore vibration error on unsupported platforms
    }
  }

  // 3. System Push / Browser Notification
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && reg.showNotification) {
            await reg.showNotification(title, {
              body,
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
              tag: 'taskflow-notification',
              // @ts-expect-error vibrate is standard in web notification options
              vibrate: [200, 100, 200],
            });
            return;
          }
        }
        // Fallback to standard window Notification
        new Notification(title, {
          body,
          icon: '/pwa-192x192.png',
        });
      } catch (e) {
        console.warn('Native notification dispatch:', e);
      }
    }
  }
}

type EventCallback = (event: RemoteSyncEvent) => void;

class RealtimeSyncService {
  private channel: ReturnType<typeof supabase.channel> | null = null;
  private localBroadcast: BroadcastChannel | null = null;
  private currentUserId: string | null = null;
  private listeners: Set<EventCallback> = new Set();
  private isConnected = false;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.localBroadcast = new BroadcastChannel('taskflow_multitab_channel');
      this.localBroadcast.onmessage = (msg) => {
        if (msg.data && msg.data.deviceId !== CURRENT_DEVICE_ID) {
          this.handleIncomingEvent(msg.data);
        }
      };
    }
  }

  getDeviceId() {
    return CURRENT_DEVICE_ID;
  }

  async requestNotificationPermission(): Promise<'granted' | 'denied' | 'default'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      const res = await Notification.requestPermission();
      return res;
    } catch {
      return 'denied';
    }
  }

  getNotificationPermission(): 'granted' | 'denied' | 'default' | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  // Subscribe to user's real-time channel across all devices
  subscribeUser(userId: string, onEvent: EventCallback) {
    this.listeners.add(onEvent);

    if (this.currentUserId === userId && this.channel) {
      return () => this.listeners.delete(onEvent);
    }

    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }

    this.currentUserId = userId;
    const channelName = `taskflow_user_sync_${userId}`;

    try {
      const ch = supabase.channel(channelName, {
        config: {
          broadcast: { self: false }, // Only other devices receive
        },
      });

      ch.on('broadcast', { event: 'TASK_EVENT' }, ({ payload }) => {
        if (payload && payload.deviceId !== CURRENT_DEVICE_ID) {
          this.handleIncomingEvent(payload as RemoteSyncEvent);
        }
      });

      ch.subscribe((status) => {
        this.isConnected = status === 'SUBSCRIBED';
      });

      this.channel = ch;
    } catch (e) {
      console.warn('Realtime channel subscribe failed:', e);
    }

    return () => {
      this.listeners.delete(onEvent);
    };
  }

  unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.currentUserId = null;
    this.isConnected = false;
  }

  isRealtimeConnected(): boolean {
    return this.isConnected;
  }

  private handleIncomingEvent(event: RemoteSyncEvent) {
    let title = 'TaskFlow Pro';
    let body = '';
    const userLabel = event.userName ? `${event.userName}` : 'दूसरे डिवाइस';

    if (event.type === 'TASK_COMPLETED') {
      title = '✅ कार्य पूरा हुआ! (Task Completed)';
      body = `"${event.todoTitle}" को ${userLabel} ने पूरा कर दिया है!`;
      triggerDeviceNotification(title, body, 'completed');
    } else if (event.type === 'TASK_CREATED') {
      title = '📝 नया कार्य जोड़ा गया (New Task)';
      body = `"${event.todoTitle}" नया कार्य ${userLabel} द्वारा जोड़ा गया।`;
      triggerDeviceNotification(title, body, 'created');
    } else if (event.type === 'TASK_UPDATED') {
      title = '🔄 कार्य अपडेट हुआ (Task Updated)';
      body = `"${event.todoTitle}" को अपडेट किया गया।`;
      triggerDeviceNotification(title, body, 'created');
    } else if (event.type === 'TASK_DELETED') {
      title = '🗑️ कार्य हटाया गया (Task Deleted)';
      body = `"${event.todoTitle}" को हटाया गया।`;
      triggerDeviceNotification(title, body, 'created');
    }

    // Notify all UI listeners to update React state
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('Error in sync listener:', err);
      }
    });
  }

  // Broadcast to other devices
  private async dispatchEvent(event: RemoteSyncEvent) {
    // 1. Broadcast locally to other tabs
    if (this.localBroadcast) {
      try {
        this.localBroadcast.postMessage(event);
      } catch {
        // Broadcast error
      }
    }

    // 2. Broadcast via Supabase Realtime to other devices/phones
    if (this.channel) {
      try {
        await this.channel.send({
          type: 'broadcast',
          event: 'TASK_EVENT',
          payload: event,
        });
      } catch (e) {
        console.warn('Realtime broadcast failed:', e);
      }
    }
  }

  async broadcastTaskCompleted(userId: string, todo: TodoItem, userName?: string) {
    const event: RemoteSyncEvent = {
      type: 'TASK_COMPLETED',
      deviceId: CURRENT_DEVICE_ID,
      todoId: todo.id,
      todoTitle: todo.title,
      userName: userName || 'User',
      timestamp: Date.now(),
      todo,
    };
    await this.dispatchEvent(event);
  }

  async broadcastTaskCreated(userId: string, todo: TodoItem, userName?: string) {
    const event: RemoteSyncEvent = {
      type: 'TASK_CREATED',
      deviceId: CURRENT_DEVICE_ID,
      todoId: todo.id,
      todoTitle: todo.title,
      userName: userName || 'User',
      timestamp: Date.now(),
      todo,
    };
    await this.dispatchEvent(event);
  }

  async broadcastTaskUpdated(userId: string, todo: TodoItem, userName?: string) {
    const event: RemoteSyncEvent = {
      type: 'TASK_UPDATED',
      deviceId: CURRENT_DEVICE_ID,
      todoId: todo.id,
      todoTitle: todo.title,
      userName: userName || 'User',
      timestamp: Date.now(),
      todo,
    };
    await this.dispatchEvent(event);
  }

  async broadcastTaskDeleted(userId: string, todoId: string, todoTitle: string, userName?: string) {
    const event: RemoteSyncEvent = {
      type: 'TASK_DELETED',
      deviceId: CURRENT_DEVICE_ID,
      todoId,
      todoTitle,
      userName: userName || 'User',
      timestamp: Date.now(),
    };
    await this.dispatchEvent(event);
  }

  // Test notification helper for UI button
  async sendTestNotification() {
    await this.requestNotificationPermission();
    await triggerDeviceNotification(
      '🎉 TaskFlow Pro नोटिफिकेशन टेस्ट!',
      'सभी डिवाइसों पर नोटिफिकेशन और साउंड बिल्कुल सही तरीके से काम कर रहा है!',
      'completed'
    );
  }
}

export const realtimeSyncService = new RealtimeSyncService();
