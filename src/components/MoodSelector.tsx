import React from 'react';
import { cn } from '@/utils/cn';

const moods = [
  { emoji: '😄', label: 'Great' },
  { emoji: '😊', label: 'Good' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😢', label: 'Tough' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '🥰', label: 'Loved' },
  { emoji: '🤔', label: 'Thoughtful' },
];

interface MoodSelectorProps {
  selected: string;
  onSelect: (mood: string) => void;
  darkMode: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ selected, onSelect, darkMode }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood.emoji}
          onClick={() => onSelect(mood.emoji)}
          className={cn(
            "flex flex-col items-center p-2 rounded-xl transition-all",
            selected === mood.emoji
              ? "bg-indigo-500 text-white scale-110"
              : darkMode 
                ? "bg-gray-700 hover:bg-gray-600" 
                : "bg-gray-100 hover:bg-gray-200"
          )}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <span className="text-xs mt-1">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};
