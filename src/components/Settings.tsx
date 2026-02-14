import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { AppSettings, DiaryEntry, TodoItem } from '@/types';

interface SettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  entries: DiaryEntry[];
  todos: TodoItem[];
  onSync: () => void;
  onImport: (data: { entries: DiaryEntry[]; todos: TodoItem[] }) => void;
  darkMode: boolean;
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsChange,
  entries,
  todos,
  onSync,
  onImport,
  darkMode,
  onBack,
}) => {
  const [showPinChange, setShowPinChange] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleDarkModeToggle = () => {
    onSettingsChange({ ...settings, darkMode: !settings.darkMode });
  };

  const handleReminderToggle = () => {
    if (!settings.reminderEnabled) {
      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            onSettingsChange({ 
              ...settings, 
              reminderEnabled: true,
              reminderTime: settings.reminderTime || '21:00'
            });
          }
        });
      }
    } else {
      onSettingsChange({ ...settings, reminderEnabled: false });
    }
  };

  const handleReminderTimeChange = (time: string) => {
    onSettingsChange({ ...settings, reminderTime: time });
  };

  const handlePinChange = () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinError('PIN must be 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }
    onSettingsChange({ ...settings, pin: newPin });
    setShowPinChange(false);
    setNewPin('');
    setConfirmPin('');
    setPinError('');
  };

  const handleExport = () => {
    const data = {
      entries,
      todos,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diary-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.entries && data.todos) {
            onImport(data);
            setSyncStatus('Import successful!');
            setTimeout(() => setSyncStatus(null), 3000);
          }
        } catch {
          setSyncStatus('Invalid file format');
          setTimeout(() => setSyncStatus(null), 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDriveSync = async () => {
    setSyncStatus('Syncing...');
    onSync();
    setTimeout(() => {
      setSyncStatus('Sync complete! (Demo mode - using local export)');
      handleExport();
      setTimeout(() => setSyncStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            darkMode ? "bg-gray-800 text-white" : "bg-white shadow text-gray-600"
          )}
        >
          ←
        </button>
        <h2 className={cn("text-xl font-bold", darkMode ? "text-white" : "text-gray-800")}>
          ⚙️ Settings
        </h2>
      </div>

      {/* Appearance */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-4", darkMode ? "text-white" : "text-gray-800")}>
          🎨 Appearance
        </h3>
        <div className="flex items-center justify-between">
          <span className={darkMode ? "text-white" : "text-gray-700"}>Dark Mode</span>
          <button
            onClick={handleDarkModeToggle}
            className={cn(
              "w-14 h-8 rounded-full transition-all relative",
              settings.darkMode ? "bg-indigo-500" : "bg-gray-300"
            )}
          >
            <span
              className={cn(
                "absolute w-6 h-6 bg-white rounded-full top-1 transition-all",
                settings.darkMode ? "right-1" : "left-1"
              )}
            />
          </button>
        </div>
      </div>

      {/* Reminders */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-4", darkMode ? "text-white" : "text-gray-800")}>
          🔔 Daily Reminder
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={darkMode ? "text-white" : "text-gray-700"}>Enable Reminder</span>
            <button
              onClick={handleReminderToggle}
              className={cn(
                "w-14 h-8 rounded-full transition-all relative",
                settings.reminderEnabled ? "bg-indigo-500" : "bg-gray-300"
              )}
            >
              <span
                className={cn(
                  "absolute w-6 h-6 bg-white rounded-full top-1 transition-all",
                  settings.reminderEnabled ? "right-1" : "left-1"
                )}
              />
            </button>
          </div>
          {settings.reminderEnabled && (
            <div className="flex items-center justify-between">
              <span className={darkMode ? "text-gray-300" : "text-gray-600"}>Reminder Time</span>
              <input
                type="time"
                value={settings.reminderTime || '21:00'}
                onChange={(e) => handleReminderTimeChange(e.target.value)}
                className={cn(
                  "px-3 py-2 rounded-lg",
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Security */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-4", darkMode ? "text-white" : "text-gray-800")}>
          🔒 Security
        </h3>
        {!showPinChange ? (
          <button
            onClick={() => setShowPinChange(true)}
            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-medium"
          >
            Change PIN
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="password"
              placeholder="New PIN (4 digits)"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className={cn(
                "w-full px-4 py-3 rounded-xl",
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
              )}
            />
            <input
              type="password"
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className={cn(
                "w-full px-4 py-3 rounded-xl",
                darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
              )}
            />
            {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => setShowPinChange(false)}
                className={cn(
                  "flex-1 py-3 rounded-xl font-medium",
                  darkMode ? "bg-gray-700 text-white" : "bg-gray-200"
                )}
              >
                Cancel
              </button>
              <button
                onClick={handlePinChange}
                className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-medium"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sync & Backup */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-4", darkMode ? "text-white" : "text-gray-800")}>
          ☁️ Sync & Backup
        </h3>
        <div className="space-y-3">
          <button
            onClick={handleDriveSync}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <span>☁️</span> Sync to Drive
          </button>
          <button
            onClick={handleExport}
            className={cn(
              "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2",
              darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"
            )}
          >
            <span>📤</span> Export Backup
          </button>
          <label className={cn(
            "w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 cursor-pointer",
            darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-700"
          )}>
            <span>📥</span> Import Backup
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
          {syncStatus && (
            <p className={cn(
              "text-center text-sm py-2 rounded-lg",
              syncStatus.includes('success') || syncStatus.includes('complete')
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            )}>
              {syncStatus}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-4", darkMode ? "text-white" : "text-gray-800")}>
          📊 Your Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className={cn("p-4 rounded-xl text-center", darkMode ? "bg-gray-700" : "bg-indigo-50")}>
            <p className="text-3xl font-bold text-indigo-500">{entries.length}</p>
            <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>Diary Entries</p>
          </div>
          <div className={cn("p-4 rounded-xl text-center", darkMode ? "bg-gray-700" : "bg-green-50")}>
            <p className="text-3xl font-bold text-green-500">{todos.filter(t => t.completed).length}</p>
            <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>Tasks Done</p>
          </div>
        </div>
      </div>
    </div>
  );
};
