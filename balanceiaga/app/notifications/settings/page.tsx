"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Clock, AlertTriangle, Zap, Moon, Mail, Sliders, Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { defaultSettings, MotivationStyle, NotifFrequency } from "@/lib/notificationData";

const motivationStyles: { value: MotivationStyle; label: string; emoji: string; desc: string }[] = [
  { value: 'encouraging', label: 'Encouraging', emoji: '💪', desc: 'Bold, motivating pushes' },
  { value: 'calm', label: 'Calm', emoji: '🌿', desc: 'Gentle, peaceful tone' },
  { value: 'friendly', label: 'Friendly', emoji: '😄', desc: 'Warm and supportive' },
  { value: 'goal', label: 'Goal-oriented', emoji: '🎯', desc: 'Focus on outcomes' },
  { value: 'playful', label: 'Playful', emoji: '😂', desc: 'Light-hearted humor' },
  { value: 'minimal', label: 'Minimal', emoji: '💬', desc: 'Concise messages only' },
  { value: 'off', label: 'Off', emoji: '🔕', desc: 'No motivational messages' },
];

const reminderOptions = [5, 10, 15, 30, 60];

const frequencyOptions: { value: NotifFrequency; label: string; desc: string }[] = [
  { value: 'all', label: 'All Notifications', desc: 'Every alert and reminder' },
  { value: 'important', label: 'Important Only', desc: 'High-priority alerts only' },
  { value: 'minimal', label: 'Minimal', desc: 'Only critical overruns' },
];

export default function NotificationSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof typeof settings>(key: K, val: typeof settings[K]) => {
    setSettings((s) => ({ ...s, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="w-12 h-6 rounded-full transition-colors relative flex-shrink-0"
      style={{ background: value ? '#6C63FF' : '#E5E7EB' }}
    >
      <span className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: value ? '26px' : '4px' }} />
    </button>
  );

  const SectionHeader = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <div className="flex items-center gap-2 mt-5 mb-2">
      {icon}
      <p className="text-xs font-bold tracking-wider" style={{ color: '#8B8FB5' }}>{label}</p>
    </div>
  );

  return (
    <>
      <div className="screen" style={{ padding: "24px 16px 100px 16px" }}>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ background: '#EEF0FF' }}>
            <ArrowLeft size={18} color="#6C63FF" />
          </button>
          <div>
            <p className="text-lg font-bold" style={{ color: '#1A1A3E' }}>Notification Settings</p>
            <p className="text-xs" style={{ marginBottom: "5px", color: '#8B8FB5' }}>Customize your smart alerts</p>
          </div>
        </div>

        {/* Reminder timing */}
        <SectionHeader icon={<Clock size={14} color="#6C63FF" />} label="STARTING REMINDER" />
        <div className="card">
          <p className="text-xs font-semibold mb-3" style={{ color: '#8B8FB5' }}>Notify me before a task starts</p>
          <div className="flex flex-wrap" style={{ gap: "8px" }}>
            {reminderOptions.map((min) => (
              <button key={min} onClick={() => update('reminderMinutes', min)}
                className="rounded-xl text-sm font-bold"
                style={{ padding: "6px 12px", background: settings.reminderMinutes === min ? '#6C63FF' : '#EEF0FF', color: settings.reminderMinutes === min ? 'white' : '#6C63FF' }}>
                {min} min
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <SectionHeader icon={<Bell size={14} color="#6C63FF" />} label="ALERT TYPES" />
        <div className="card flex flex-col" style={{ gap: 14 }}>
          {[
            { key: 'endingReminder' as const, label: 'Ending Reminder', sub: 'Ask if you\'re finished when task ends' },
            { key: 'overrunAlerts' as const, label: 'Overrun Alerts', sub: 'Warn when task exceeds scheduled time' },
            { key: 'rebalanceAlerts' as const, label: 'Rebalance Alerts', sub: 'Suggest alternatives when schedule conflicts' },
          ].map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1A1A3E' }}>{label}</p>
                <p className="text-xs" style={{ color: '#8B8FB5' }}>{sub}</p>
              </div>
              <Toggle value={settings[key] as boolean} onChange={(v) => update(key, v)} />
            </div>
          ))}
        </div>

        {/* Quiet Hours */}
        <SectionHeader icon={<Moon size={14} color="#6C63FF" />} label="QUIET HOURS" />
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1A1A3E' }}>Enable Quiet Hours</p>
              <p className="text-xs" style={{ color: '#8B8FB5' }}>No notifications during this period</p>
            </div>
            <Toggle value={settings.quietHoursEnabled} onChange={(v) => update('quietHoursEnabled', v)} />
          </div>
          {settings.quietHoursEnabled && (
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1" style={{ color: '#8B8FB5' }}>Start</p>
                <input type="time" value={settings.quietStart}
                  onChange={(e) => update('quietStart', e.target.value)}
                  className="w-full text-sm font-bold outline-none rounded-xl"
                  style={{ padding: "8px 12px", background: '#F0F1FF', color: '#1A1A3E' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold mb-1" style={{ color: '#8B8FB5' }}>End</p>
                <input type="time" value={settings.quietEnd}
                  onChange={(e) => update('quietEnd', e.target.value)}
                  className="w-full text-sm font-bold outline-none rounded-xl"
                  style={{ padding: "8px 12px", background: '#F0F1FF', color: '#1A1A3E' }} />
              </div>
            </div>
          )}
        </div>

        {/* Frequency */}
        <SectionHeader icon={<Sliders size={14} color="#6C63FF" />} label="NOTIFICATION FREQUENCY" />
        <div className="card">
          <div className="flex flex-col" style={{ gap: "8px" }}>
            {frequencyOptions.map(({ value, label, desc }) => (
              <button key={value} onClick={() => update('frequency', value)}
                className="w-full flex items-center rounded-xl text-left"
                style={{ padding: "12px", gap: "12px", background: settings.frequency === value ? '#EEF0FF' : 'transparent', border: `1.5px solid ${settings.frequency === value ? '#6C63FF' : 'transparent'}` }}>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: settings.frequency === value ? '#6C63FF' : '#D1D5DB' }}>
                  {settings.frequency === value && <div className="w-2 h-2 rounded-full" style={{ background: '#6C63FF' }} />}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: '#1A1A3E' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#8B8FB5' }}>{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Motivation Style */}
        <SectionHeader icon={<Heart size={14} color="#6C63FF" />} label="MOTIVATION STYLE" />
        <div className="card">
          <p className="text-xs mb-3" style={{ color: '#8B8FB5' }}>Choose the tone of your motivational messages</p>
          <div className="flex flex-col mt-3" style={{ gap: "8px" }}>
            {motivationStyles.map(({ value, label, emoji, desc }) => (
              <button key={value} onClick={() => update('motivationStyle', value)}
                className="w-full flex items-center rounded-xl text-left"
                style={{ padding: "12px", gap: "12px", background: settings.motivationStyle === value ? '#EEF0FF' : 'transparent', border: `1.5px solid ${settings.motivationStyle === value ? '#6C63FF' : 'transparent'}` }}>
                <span className="text-xl">{emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: '#1A1A3E' }}>{label}</p>
                  <p className="text-xs" style={{ color: '#8B8FB5' }}>{desc}</p>
                </div>
                {settings.motivationStyle === value && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#6C63FF' }}>
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <SectionHeader icon={<Mail size={14} color="#6C63FF" />} label="EMAIL NOTIFICATIONS" />
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1A1A3E' }}>Weekly Digest Email</p>
            <p className="text-xs" style={{ color: '#8B8FB5' }}>Planned vs actual summary every Sunday</p>
          </div>
          <Toggle value={settings.emailNotifications} onChange={(v) => update('emailNotifications', v)} />
        </div>

        {/* Save */}
        <div style={{ height: 16 }} />
        <button onClick={handleSave} className="w-full py-4 rounded-2xl font-bold text-base"
          style={{ background: saved ? '#00C853' : '#6C63FF', color: 'white' }}>
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>

        <div style={{ height: 24 }} />
      </div>
      <BottomNav />
    </>
  );
}