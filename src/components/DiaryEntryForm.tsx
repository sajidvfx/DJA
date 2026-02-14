import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { DiaryEntry } from '@/types';
import { MoodSelector } from './MoodSelector';
import { CategoryTags } from './CategoryTags';
import { PhotoAttachment } from './PhotoAttachment';
import { BulletList } from './BulletList';

interface DiaryEntryFormProps {
  date: string;
  existingEntry?: DiaryEntry;
  onSave: (entry: DiaryEntry) => void;
  onBack: () => void;
  darkMode: boolean;
}

export const DiaryEntryForm: React.FC<DiaryEntryFormProps> = ({
  date,
  existingEntry,
  onSave,
  onBack,
  darkMode
}) => {
  const [sparks, setSparks] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [mood, setMood] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (existingEntry) {
      setSparks(existingEntry.sparks);
      setAchievements(existingEntry.achievements);
      setMood(existingEntry.mood);
      setCategories(existingEntry.categories);
      setPhotos(existingEntry.photos);
    }
  }, [existingEntry]);

  const formatDisplayDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSave = () => {
    const entry: DiaryEntry = {
      id: existingEntry?.id || Date.now().toString(),
      date,
      sparks,
      achievements,
      mood,
      categories,
      photos,
      createdAt: existingEntry?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };
    onSave(entry);
    onBack();
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
        <div>
          <h2 className={cn("text-xl font-bold", darkMode ? "text-white" : "text-gray-800")}>
            {existingEntry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <p className={cn("text-sm", darkMode ? "text-gray-400" : "text-gray-500")}>
            {formatDisplayDate(date)}
          </p>
        </div>
      </div>

      {/* Mood Section */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-3 flex items-center gap-2", darkMode ? "text-white" : "text-gray-800")}>
          😊 How was your day?
        </h3>
        <MoodSelector selected={mood} onSelect={setMood} darkMode={darkMode} />
      </div>

      {/* Sparks Section */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-3 flex items-center gap-2", darkMode ? "text-white" : "text-gray-800")}>
          ✨ Sparks of the Day
        </h3>
        <p className={cn("text-sm mb-3", darkMode ? "text-gray-400" : "text-gray-500")}>
          Little moments that made you smile
        </p>
        <BulletList 
          items={sparks} 
          onItemsChange={setSparks} 
          placeholder="Add a spark..."
          darkMode={darkMode} 
        />
      </div>

      {/* Achievements Section */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-3 flex items-center gap-2", darkMode ? "text-white" : "text-gray-800")}>
          🏆 Achievements & Reflections
        </h3>
        <p className={cn("text-sm mb-3", darkMode ? "text-gray-400" : "text-gray-500")}>
          What did you accomplish? What did you learn?
        </p>
        <BulletList 
          items={achievements} 
          onItemsChange={setAchievements} 
          placeholder="Add an achievement..."
          darkMode={darkMode} 
        />
      </div>

      {/* Categories */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-3 flex items-center gap-2", darkMode ? "text-white" : "text-gray-800")}>
          🏷️ Categories
        </h3>
        <CategoryTags selected={categories} onSelect={setCategories} darkMode={darkMode} />
      </div>

      {/* Photos */}
      <div className={cn("rounded-2xl p-4", darkMode ? "bg-gray-800" : "bg-white shadow-lg")}>
        <h3 className={cn("text-lg font-bold mb-3 flex items-center gap-2", darkMode ? "text-white" : "text-gray-800")}>
          📷 Photos
        </h3>
        <PhotoAttachment photos={photos} onPhotosChange={setPhotos} darkMode={darkMode} />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
      >
        💾 Save Entry
      </button>
    </div>
  );
};
