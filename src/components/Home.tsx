import React from 'react';
import { cn } from '@/utils/cn';
import { DiaryEntry, TodoItem } from '@/types';
import { TodoList } from './TodoList';

interface HomeProps {
  entries: DiaryEntry[];
  todos: TodoItem[];
  onTodosChange: (todos: TodoItem[]) => void;
  onNewEntry: () => void;
  onViewEntry: (date: string) => void;
  darkMode: boolean;
}

export const Home: React.FC<HomeProps> = ({
  entries,
  todos,
  onTodosChange,
  onNewEntry,
  onViewEntry,
  darkMode
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = entries.find(e => e.date === today);
  
  const recentEntries = entries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStreakCount = () => {
    let streak = 0;
    const sortedDates = entries.map(e => e.date).sort().reverse();
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (sortedDates.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className={cn("text-2xl font-bold", darkMode ? "text-white" : "text-gray-800")}>
          {getGreeting()}! 👋
        </h1>
        <p className={cn("text-sm mt-1", darkMode ? "text-gray-400" : "text-gray-500")}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className={cn(
          "rounded-2xl p-4 text-center",
          darkMode ? "bg-gray-800" : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
        )}>
          <p className="text-3xl font-bold">{entries.length}</p>
          <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-indigo-100")}>
            Total Entries
          </p>
        </div>
        <div className={cn(
          "rounded-2xl p-4 text-center",
          darkMode ? "bg-gray-800" : "bg-gradient-to-br from-orange-400 to-pink-500 text-white"
        )}>
          <p className="text-3xl font-bold">🔥 {getStreakCount()}</p>
          <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-orange-100")}>
            Day Streak
          </p>
        </div>
      </div>

      {/* Today's Entry */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-3 flex items-center gap-2", darkMode ? "text-white" : "text-gray-800")}>
          📔 Today's Entry
        </h3>
        {todayEntry ? (
          <button
            onClick={() => onViewEntry(today)}
            className="w-full text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{todayEntry.mood || '📝'}</span>
              <span className={cn("text-sm", darkMode ? "text-gray-300" : "text-gray-600")}>
                Tap to view/edit
              </span>
            </div>
            {todayEntry.sparks.length > 0 && (
              <p className={cn("text-sm line-clamp-2", darkMode ? "text-gray-400" : "text-gray-500")}>
                ✨ {todayEntry.sparks[0]}{todayEntry.sparks.length > 1 ? ` (+${todayEntry.sparks.length - 1} more)` : ''}
              </p>
            )}
          </button>
        ) : (
          <button
            onClick={onNewEntry}
            className="w-full py-4 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-500 font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all"
          >
            ✍️ Write today's entry
          </button>
        )}
      </div>

      {/* Todo List */}
      <TodoList todos={todos} onTodosChange={onTodosChange} darkMode={darkMode} />

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
          <h3 className={cn("text-lg font-bold mb-3 flex items-center gap-2", darkMode ? "text-white" : "text-gray-800")}>
            📚 Recent Entries
          </h3>
          <div className="space-y-2">
            {recentEntries.map(entry => (
              <button
                key={entry.id}
                onClick={() => onViewEntry(entry.date)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                  darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
                )}
              >
                <span className="text-2xl">{entry.mood || '📝'}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium", darkMode ? "text-white" : "text-gray-800")}>
                    {formatDate(entry.date)}
                  </p>
                  <p className={cn("text-sm truncate", darkMode ? "text-gray-400" : "text-gray-500")}>
                    {entry.sparks.length > 0 ? entry.sparks[0] : (entry.achievements.length > 0 ? entry.achievements[0] : 'No content')}
                  </p>
                </div>
                <span className={cn("text-sm", darkMode ? "text-gray-500" : "text-gray-400")}>
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
