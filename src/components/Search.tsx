import React, { useState, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { DiaryEntry } from '@/types';

interface SearchProps {
  entries: DiaryEntry[];
  onSelectEntry: (date: string) => void;
  darkMode: boolean;
  onBack: () => void;
}

export const Search: React.FC<SearchProps> = ({ entries, onSelectEntry, darkMode, onBack }) => {
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterMood, setFilterMood] = useState<string | null>(null);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    entries.forEach(e => e.categories.forEach(c => cats.add(c)));
    return Array.from(cats);
  }, [entries]);

  const allMoods = useMemo(() => {
    const moods = new Set<string>();
    entries.forEach(e => {
      if (e.mood) moods.add(e.mood);
    });
    return Array.from(moods);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const sparksText = entry.sparks.join(' ').toLowerCase();
      const achievementsText = entry.achievements.join(' ').toLowerCase();
      const matchesQuery = query === '' || 
        sparksText.includes(query.toLowerCase()) ||
        achievementsText.includes(query.toLowerCase()) ||
        entry.categories.some(c => c.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !filterCategory || entry.categories.includes(filterCategory);
      const matchesMood = !filterMood || entry.mood === filterMood;
      
      return matchesQuery && matchesCategory && matchesMood;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entries, query, filterCategory, filterMood]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
          🔍 Search Entries
        </h2>
      </div>

      {/* Search Input */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your diary..."
          className={cn(
            "w-full px-4 py-3 rounded-xl text-lg",
            darkMode 
              ? "bg-gray-700 text-white placeholder-gray-400" 
              : "bg-gray-100 text-gray-800 placeholder-gray-500"
          )}
        />
      </div>

      {/* Filters */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("font-medium mb-3", darkMode ? "text-gray-300" : "text-gray-600")}>
          Filter by Mood
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilterMood(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm",
              !filterMood
                ? "bg-indigo-500 text-white"
                : darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100"
            )}
          >
            All
          </button>
          {allMoods.map(mood => (
            <button
              key={mood}
              onClick={() => setFilterMood(mood === filterMood ? null : mood)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xl",
                filterMood === mood
                  ? "bg-indigo-500"
                  : darkMode ? "bg-gray-700" : "bg-gray-100"
              )}
            >
              {mood}
            </button>
          ))}
        </div>

        <h3 className={cn("font-medium mb-3", darkMode ? "text-gray-300" : "text-gray-600")}>
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm",
              !filterCategory
                ? "bg-indigo-500 text-white"
                : darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100"
            )}
          >
            All
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat === filterCategory ? null : cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm",
                filterCategory === cat
                  ? "bg-indigo-500 text-white"
                  : darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        <p className={cn("text-sm px-2", darkMode ? "text-gray-400" : "text-gray-500")}>
          {filteredEntries.length} entries found
        </p>
        {filteredEntries.map(entry => (
          <button
            key={entry.id}
            onClick={() => onSelectEntry(entry.date)}
            className={cn(
              "w-full text-left rounded-2xl p-4 transition-all",
              darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white shadow-lg hover:shadow-xl"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{entry.mood || '📝'}</span>
                <span className={cn("font-medium", darkMode ? "text-white" : "text-gray-800")}>
                  {formatDate(entry.date)}
                </span>
              </div>
              {entry.photos.length > 0 && (
                <span className="text-sm">📷 {entry.photos.length}</span>
              )}
            </div>
            {entry.sparks.length > 0 && (
              <p className={cn("text-sm mb-2 line-clamp-1", darkMode ? "text-gray-300" : "text-gray-600")}>
                ✨ {entry.sparks[0]}{entry.sparks.length > 1 ? ` (+${entry.sparks.length - 1} more)` : ''}
              </p>
            )}
            {entry.achievements.length > 0 && (
              <p className={cn("text-sm line-clamp-2", darkMode ? "text-gray-400" : "text-gray-500")}>
                🏆 {entry.achievements[0]}{entry.achievements.length > 1 ? ` (+${entry.achievements.length - 1} more)` : ''}
              </p>
            )}
            {entry.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {entry.categories.slice(0, 3).map(cat => (
                  <span
                    key={cat}
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {cat}
                  </span>
                ))}
                {entry.categories.length > 3 && (
                  <span className={cn("text-xs", darkMode ? "text-gray-500" : "text-gray-400")}>
                    +{entry.categories.length - 3}
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
        {filteredEntries.length === 0 && (
          <div className={cn(
            "text-center py-12 rounded-2xl",
            darkMode ? "bg-gray-800" : "bg-white shadow"
          )}>
            <p className="text-4xl mb-3">🔍</p>
            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
              No entries found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
