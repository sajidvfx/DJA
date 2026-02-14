import React from 'react';
import { cn } from '@/utils/cn';
import { ViewType } from '@/types';

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  darkMode: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, darkMode }) => {
  const items: { view: ViewType; icon: string; label: string }[] = [
    { view: 'home', icon: '🏠', label: 'Home' },
    { view: 'calendar', icon: '📅', label: 'Calendar' },
    { view: 'search', icon: '🔍', label: 'Search' },
    { view: 'settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 pb-safe",
      darkMode ? "bg-gray-900" : "bg-white shadow-lg"
    )}>
      <div className="flex justify-around items-center py-2 max-w-lg mx-auto">
        {items.map(({ view, icon, label }) => (
          <button
            key={view}
            onClick={() => onNavigate(view)}
            className={cn(
              "flex flex-col items-center py-2 px-4 rounded-xl transition-all",
              currentView === view
                ? "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                : darkMode ? "text-gray-400" : "text-gray-500"
            )}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
