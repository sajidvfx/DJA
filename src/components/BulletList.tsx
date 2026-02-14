import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface BulletListProps {
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  darkMode: boolean;
}

export const BulletList: React.FC<BulletListProps> = ({ 
  items, 
  onItemsChange, 
  placeholder = "Add an item...",
  darkMode 
}) => {
  const [newItem, setNewItem] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onItemsChange([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const deleteItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(items[index]);
  };

  const saveEdit = () => {
    if (editText.trim() && editingIndex !== null) {
      const newItems = [...items];
      newItems[editingIndex] = editText.trim();
      onItemsChange(newItems);
      setEditingIndex(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText('');
  };

  return (
    <div className="space-y-2">
      {/* Add new item input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          placeholder={placeholder}
          className={cn(
            "flex-1 px-4 py-2 rounded-xl text-sm",
            darkMode 
              ? "bg-gray-700 text-white placeholder-gray-400" 
              : "bg-gray-100 text-gray-800 placeholder-gray-500"
          )}
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors"
        >
          Add
        </button>
      </div>

      {/* List of bullet points */}
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className={cn("text-center py-4 text-sm", darkMode ? "text-gray-500" : "text-gray-400")}>
            No items yet. Add one above!
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl transition-all",
                darkMode ? "bg-gray-700" : "bg-gray-50"
              )}
            >
              {/* Bullet point */}
              <span className={cn(
                "mt-1 w-2 h-2 rounded-full flex-shrink-0",
                darkMode ? "bg-indigo-400" : "bg-indigo-500"
              )} />
              
              {editingIndex === index ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    autoFocus
                    className={cn(
                      "flex-1 px-2 py-1 rounded text-sm",
                      darkMode ? "bg-gray-600 text-white" : "bg-white text-gray-800"
                    )}
                  />
                  <button
                    onClick={saveEdit}
                    className="text-green-500 hover:text-green-600 text-sm px-2"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-400 hover:text-gray-500 text-sm px-2"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={cn(
                      "flex-1 text-sm leading-relaxed",
                      darkMode ? "text-white" : "text-gray-700"
                    )}
                  >
                    {item}
                  </span>
                  <button
                    onClick={() => startEdit(index)}
                    className={cn(
                      "text-sm px-2 flex-shrink-0",
                      darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteItem(index)}
                    className="text-red-400 hover:text-red-500 text-sm px-2 flex-shrink-0"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
