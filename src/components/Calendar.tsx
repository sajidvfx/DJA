import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { DiaryEntry } from '@/types';

interface CalendarProps {
  entries: DiaryEntry[];
  onSelectDate: (date: string) => void;
  darkMode: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({ entries, onSelectDate, darkMode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay, year, month };
  };

  const { daysInMonth, startingDay, year, month } = getDaysInMonth(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const hasEntry = (day: number) => {
    const dateStr = formatDate(day);
    return entries.some(e => e.date === dateStr);
  };

  const getEntryMood = (day: number) => {
    const dateStr = formatDate(day);
    const entry = entries.find(e => e.date === dateStr);
    return entry?.mood || null;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={cn(
      "rounded-2xl p-4",
      darkMode ? "bg-gray-800" : "bg-white shadow-lg"
    )}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
          )}
        >
          ←
        </button>
        <h3 className={cn("text-lg font-bold", darkMode ? "text-white" : "text-gray-800")}>
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
          )}
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className={cn(
            "text-center text-xs font-medium py-2",
            darkMode ? "text-gray-400" : "text-gray-500"
          )}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const has = hasEntry(day);
          const mood = getEntryMood(day);
          return (
            <button
              key={day}
              onClick={() => onSelectDate(formatDate(day))}
              className={cn(
                "aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all",
                isToday(day) && "ring-2 ring-indigo-500",
                has
                  ? "bg-indigo-500 text-white"
                  : darkMode 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                    : "bg-gray-50 hover:bg-gray-100"
              )}
            >
              <span>{day}</span>
              {mood && <span className="text-xs">{mood}</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-indigo-500"></span>
          <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Has Entry</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded ring-2 ring-indigo-500"></span>
          <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Today</span>
        </span>
      </div>
    </div>
  );
};
