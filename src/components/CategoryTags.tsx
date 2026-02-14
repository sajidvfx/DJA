import React, { useState } from 'react';
import { cn } from '@/utils/cn';

const defaultCategories = [
  'Work', 'Personal', 'Health', 'Family', 'Learning', 'Travel', 'Finance', 'Goals'
];

interface CategoryTagsProps {
  selected: string[];
  onSelect: (categories: string[]) => void;
  darkMode: boolean;
}

export const CategoryTags: React.FC<CategoryTagsProps> = ({ selected, onSelect, darkMode }) => {
  const [customTag, setCustomTag] = useState('');

  const toggleCategory = (category: string) => {
    if (selected.includes(category)) {
      onSelect(selected.filter(c => c !== category));
    } else {
      onSelect([...selected, category]);
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selected.includes(customTag.trim())) {
      onSelect([...selected, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {defaultCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
              selected.includes(cat)
                ? "bg-indigo-500 text-white"
                : darkMode 
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
          placeholder="Add custom tag..."
          className={cn(
            "flex-1 px-3 py-2 rounded-lg text-sm",
            darkMode 
              ? "bg-gray-700 text-white placeholder-gray-400 border-gray-600" 
              : "bg-gray-100 text-gray-800 placeholder-gray-500"
          )}
        />
        <button
          onClick={addCustomTag}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-medium hover:bg-indigo-600"
        >
          Add
        </button>
      </div>
      {selected.filter(s => !defaultCategories.includes(s)).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.filter(s => !defaultCategories.includes(s)).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-sm bg-purple-500 text-white flex items-center gap-1"
            >
              {tag}
              <button onClick={() => toggleCategory(tag)} className="ml-1 hover:text-red-200">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
