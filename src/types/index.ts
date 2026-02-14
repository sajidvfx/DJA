export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD format
  sparks: string[]; // Array of bullet points
  achievements: string[]; // Array of bullet points
  mood: string;
  categories: string[];
  photos: string[]; // base64 encoded
  createdAt: number;
  updatedAt: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface AppSettings {
  pin: string;
  darkMode: boolean;
  reminderTime: string | null; // HH:MM format
  reminderEnabled: boolean;
}

export type ViewType = 'home' | 'calendar' | 'search' | 'settings' | 'entry';
