import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { DiaryEntry, TodoItem, AppSettings, ViewType } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PinLock } from '@/components/PinLock';
import { Navigation } from '@/components/Navigation';
import { Home } from '@/components/Home';
import { Calendar } from '@/components/Calendar';
import { Search } from '@/components/Search';
import { Settings } from '@/components/Settings';
import { DiaryEntryForm } from '@/components/DiaryEntryForm';

const defaultSettings: AppSettings = {
  pin: '',
  darkMode: false,
  reminderTime: '21:00',
  reminderEnabled: false,
};

export const App: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [settings, setSettings] = useLocalStorage<AppSettings>('diary-settings', defaultSettings);
  const [entries, setEntries] = useLocalStorage<DiaryEntry[]>('diary-entries', []);
  const [todos, setTodos] = useLocalStorage<TodoItem[]>('diary-todos', []);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const darkMode = settings.darkMode;

  // Setup reminder notifications
  useEffect(() => {
    if (settings.reminderEnabled && settings.reminderTime && 'Notification' in window) {
      const checkReminder = () => {
        const now = new Date();
        const [hours, minutes] = settings.reminderTime!.split(':').map(Number);
        
        if (now.getHours() === hours && now.getMinutes() === minutes) {
          const today = now.toISOString().split('T')[0];
          const hasTodayEntry = entries.some(e => e.date === today);
          
          if (!hasTodayEntry && Notification.permission === 'granted') {
            new Notification('📔 Daily Diary Reminder', {
              body: "Don't forget to write about your day!",
              icon: '📔',
            });
          }
        }
      };

      const interval = setInterval(checkReminder, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [settings.reminderEnabled, settings.reminderTime, entries]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Service worker would be registered here for full PWA support
      console.log('PWA support available');
    }
  }, []);

  const handleUnlock = useCallback(() => {
    setIsUnlocked(true);
  }, []);

  const handleSetPin = useCallback((pin: string) => {
    setSettings(prev => ({ ...prev, pin }));
  }, [setSettings]);

  const handleNavigate = useCallback((view: ViewType) => {
    setCurrentView(view);
    setSelectedDate(null);
  }, []);

  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
    setCurrentView('entry');
  }, []);

  const handleNewEntry = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    setCurrentView('entry');
  }, []);

  const handleSaveEntry = useCallback((entry: DiaryEntry) => {
    setEntries(prev => {
      const existing = prev.findIndex(e => e.id === entry.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = entry;
        return updated;
      }
      return [...prev, entry];
    });
  }, [setEntries]);

  const handleSync = useCallback(() => {
    // In a real app, this would sync to Google Drive
    console.log('Syncing to cloud...');
  }, []);

  const handleImport = useCallback((data: { entries: DiaryEntry[]; todos: TodoItem[] }) => {
    // Merge imported data with existing
    setEntries(prev => {
      const existingIds = new Set(prev.map(e => e.id));
      const newEntries = data.entries.filter(e => !existingIds.has(e.id));
      return [...prev, ...newEntries];
    });
    setTodos(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const newTodos = data.todos.filter(t => !existingIds.has(t.id));
      return [...prev, ...newTodos];
    });
  }, [setEntries, setTodos]);

  const handleBack = useCallback(() => {
    setCurrentView('home');
    setSelectedDate(null);
  }, []);

  // Show PIN setup or lock screen
  if (!isUnlocked) {
    const needsSetup = !settings.pin;
    return (
      <PinLock
        onUnlock={handleUnlock}
        correctPin={settings.pin}
        isSetup={needsSetup}
        onSetPin={handleSetPin}
        darkMode={darkMode}
      />
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <Home
            entries={entries}
            todos={todos}
            onTodosChange={setTodos}
            onNewEntry={handleNewEntry}
            onViewEntry={handleSelectDate}
            darkMode={darkMode}
          />
        );
      
      case 'calendar':
        return (
          <div className="space-y-4 pb-24">
            <h2 className={cn("text-xl font-bold px-2", darkMode ? "text-white" : "text-gray-800")}>
              📅 Calendar
            </h2>
            <Calendar
              entries={entries}
              onSelectDate={handleSelectDate}
              darkMode={darkMode}
            />
          </div>
        );
      
      case 'search':
        return (
          <Search
            entries={entries}
            onSelectEntry={handleSelectDate}
            darkMode={darkMode}
            onBack={handleBack}
          />
        );
      
      case 'settings':
        return (
          <Settings
            settings={settings}
            onSettingsChange={setSettings}
            entries={entries}
            todos={todos}
            onSync={handleSync}
            onImport={handleImport}
            darkMode={darkMode}
            onBack={handleBack}
          />
        );
      
      case 'entry':
        if (!selectedDate) return null;
        const existingEntry = entries.find(e => e.date === selectedDate);
        return (
          <DiaryEntryForm
            date={selectedDate}
            existingEntry={existingEntry}
            onSave={handleSaveEntry}
            onBack={handleBack}
            darkMode={darkMode}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors",
      darkMode ? "bg-gray-900" : "bg-gray-50"
    )}>
      <div className="max-w-lg mx-auto px-4 py-6">
        {renderContent()}
      </div>
      
      {currentView !== 'entry' && (
        <Navigation
          currentView={currentView}
          onNavigate={handleNavigate}
          darkMode={darkMode}
        />
      )}

      {/* Floating Add Button */}
      {currentView === 'home' && (
        <button
          onClick={handleNewEntry}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        >
          ✍️
        </button>
      )}
    </div>
  );
};
