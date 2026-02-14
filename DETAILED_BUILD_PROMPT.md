# Complete Prompt: Build "My Daily Diary" Android App

## Overview
Build a personal diary Android app using React + TypeScript + Capacitor. The app should work offline-first with local storage and provide optional Google Drive sync for backup. Convert the final web app to an APK using Capacitor.

---

## Tech Stack Required
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Mobile Conversion**: Capacitor (for APK generation)
- **Storage**: localStorage (offline-first)
- **Icons**: Lucide React
- **Date Handling**: date-fns

---

## Core Features

### 1. PIN Lock Screen (Security)
- On first launch, prompt user to set a 4-digit PIN
- On subsequent launches, require PIN to access the app
- Store PIN in localStorage (hashed if possible)
- Option to change PIN in settings
- Show 4 circular indicators that fill as digits are entered
- Shake animation on wrong PIN

### 2. Daily Diary Entry
Each diary entry should have:

#### a) Date
- Automatically set to selected date
- Display formatted date at top (e.g., "Monday, January 15, 2025")

#### b) Sparks of the Day (Bullet Point List)
- Small highlights/memorable moments
- Add items one by one (input field + add button)
- Each item displayed as a bullet point with colored dot
- Edit inline by clicking on item
- Delete individual items with X button
- Store as string array: `sparks: string[]`

#### c) Achievements & Reflections (Bullet Point List)
- Main accomplishments of the day
- Same functionality as Sparks
- Store as string array: `achievements: string[]`

#### d) Mood Tracker
- 8 mood options as clickable emoji buttons:
  - 😊 Happy, 😢 Sad, 😡 Angry, 😰 Anxious
  - 😴 Tired, 🤩 Excited, 😌 Calm, 🤔 Thoughtful
- Single selection, visually highlight selected mood
- Store as: `mood: string` (the emoji)

#### e) Category Tags
- Pre-defined tags: Work, Personal, Health, Family, Travel, Learning, Finance, Social
- Allow custom tags (input + add)
- Multi-select with visual chips
- Store as: `tags: string[]`

#### f) Photo Attachments
- Button to add photos
- Convert to base64 for localStorage storage
- Display as thumbnail grid
- Click to view full size in modal
- Delete individual photos
- Store as: `photos: string[]` (base64 strings)

### 3. Todo List
- Single persistent checklist (not daily reset)
- Features:
  - Add new task (input + button)
  - Checkbox to mark complete (strikethrough when done)
  - Edit task inline
  - Delete task
  - Show progress: "3/5 completed"
- Store as array: `{ id: string, text: string, completed: boolean }[]`

### 4. Calendar View
- Monthly calendar grid
- Navigation: Previous/Next month arrows
- Current date highlighted differently
- Dates with entries should have:
  - Colored dot or highlight
  - Mood emoji displayed on the date
- Tap any date to:
  - View existing entry, OR
  - Create new entry for that date
- Quick stats below calendar: total entries this month

### 5. Search Feature
- Search input with icon
- Search across: sparks, achievements (all bullet points)
- Filter by mood (emoji buttons)
- Filter by tags (chip selection)
- Display results as cards showing:
  - Date
  - Mood emoji
  - First spark/achievement with "+N more" indicator
  - Matching tags

### 6. Settings Page
- **Dark Mode Toggle**: Switch between light/dark themes
- **Daily Reminder**: 
  - Toggle on/off
  - Time picker (default 9:00 PM)
  - Use browser Notification API
- **Change PIN**: Verify old PIN, set new PIN
- **Sync to Google Drive**:
  - Manual sync button
  - Use Google Drive API or generate downloadable JSON
  - For simplicity: Export as JSON file that user manually uploads to Drive
- **Export Backup**: Download all data as JSON file
- **Import Backup**: Upload JSON file to restore data
- **Statistics Display**:
  - Total entries count
  - Total tasks completed
  - Most used mood
  - Current streak (consecutive days with entries)

---

## Data Structures (TypeScript)

```typescript
interface DiaryEntry {
  id: string;
  date: string; // ISO format: "2025-01-15"
  sparks: string[]; // Array of bullet points
  achievements: string[]; // Array of bullet points
  mood: string; // Emoji
  tags: string[];
  photos: string[]; // Base64 encoded
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface AppSettings {
  darkMode: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // "21:00"
  customTags: string[];
}

interface AppData {
  pin: string;
  entries: DiaryEntry[];
  todos: Todo[];
  settings: AppSettings;
}
```

---

## UI/UX Design Specifications

### Color Scheme
**Light Mode:**
- Background: #f8fafc (slate-50)
- Cards: #ffffff
- Primary: #8b5cf6 (violet-500)
- Secondary: #f59e0b (amber-500)
- Text: #1e293b (slate-800)

**Dark Mode:**
- Background: #0f172a (slate-900)
- Cards: #1e293b (slate-800)
- Primary: #a78bfa (violet-400)
- Secondary: #fbbf24 (amber-400)
- Text: #f1f5f9 (slate-100)

### Layout
- Mobile-first responsive design
- Bottom navigation bar with 4 tabs:
  - 🏠 Home
  - 📅 Calendar
  - 🔍 Search
  - ⚙️ Settings
- Floating Action Button (FAB) for "Write Today's Entry"
- Safe area padding for notched phones

### Components Style
- Rounded corners (rounded-xl for cards, rounded-full for buttons)
- Subtle shadows in light mode
- Smooth transitions (300ms)
- Touch-friendly tap targets (min 44px)

---

## Component Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Main app with routing logic
├── index.css             # Tailwind imports + custom styles
├── types/
│   └── index.ts          # TypeScript interfaces
├── hooks/
│   ├── useLocalStorage.ts    # Generic localStorage hook
│   ├── useDiary.ts           # Diary entries CRUD
│   ├── useTodos.ts           # Todo list CRUD
│   └── useSettings.ts        # App settings
├── components/
│   ├── PinLock.tsx           # PIN entry/setup screen
│   ├── Navigation.tsx        # Bottom tab bar
│   ├── Home.tsx              # Home dashboard
│   ├── Calendar.tsx          # Calendar view
│   ├── Search.tsx            # Search & filter
│   ├── Settings.tsx          # Settings page
│   ├── DiaryEntryForm.tsx    # Create/edit entry
│   ├── DiaryEntryView.tsx    # View single entry
│   ├── TodoList.tsx          # Todo component
│   ├── BulletList.tsx        # Reusable bullet point list
│   ├── MoodSelector.tsx      # Mood emoji picker
│   ├── TagSelector.tsx       # Tag multi-select
│   ├── PhotoAttachment.tsx   # Photo upload/display
│   └── PhotoModal.tsx        # Full-screen photo view
└── utils/
    ├── storage.ts            # localStorage helpers
    ├── dateUtils.ts          # Date formatting
    └── exportImport.ts       # Backup functions
```

---

## Step-by-Step Build Instructions

### Phase 1: Project Setup
1. Create Vite React TypeScript project
2. Install dependencies:
   ```bash
   npm install lucide-react date-fns
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
3. Configure Tailwind with dark mode support
4. Set up base CSS with custom scrollbar, safe areas

### Phase 2: Core Infrastructure
1. Create TypeScript types/interfaces
2. Build useLocalStorage hook
3. Build useDiary, useTodos, useSettings hooks
4. Create utility functions

### Phase 3: Build Components
1. PinLock component (first to ensure security works)
2. Navigation component
3. Home dashboard with TodoList
4. BulletList reusable component
5. DiaryEntryForm with all features
6. Calendar view
7. Search with filters
8. Settings page

### Phase 4: Polish
1. Add dark mode toggle functionality
2. Implement reminder notifications
3. Add export/import functionality
4. Test all features
5. Add PWA manifest and service worker

### Phase 5: Convert to APK using Capacitor

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "My Daily Diary" "com.mydiary.app"

# Install Android platform
npm install @capacitor/android
npx cap add android

# Build the web app
npm run build

# Sync web assets to Android
npx cap sync android

# Open in Android Studio
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync to complete
2. Go to Build → Generate Signed Bundle / APK
3. Select APK
4. Create new keystore or use existing
5. Select release build variant
6. Click Finish
7. APK will be in: `android/app/release/app-release.apk`

---

## Additional Configuration Files Needed

### capacitor.config.ts
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mydiary.app',
  appName: 'My Daily Diary',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon",
      iconColor: "#8b5cf6"
    }
  }
};

export default config;
```

### For Local Notifications (Reminders)
```bash
npm install @capacitor/local-notifications
npx cap sync
```

### For File System (Export/Import)
```bash
npm install @capacitor/filesystem
npx cap sync
```

---

## Important Implementation Notes

1. **Offline-First**: Never depend on network. All data in localStorage.

2. **Data Persistence**: Save to localStorage immediately on every change.

3. **Date Handling**: Always use ISO format (YYYY-MM-DD) for storage, format for display.

4. **Photo Size**: Compress images before storing as base64 to prevent localStorage limits (~5MB).

5. **PIN Security**: Consider using Web Crypto API to hash PIN.

6. **Dark Mode**: Use Tailwind's `dark:` prefix and toggle `dark` class on `<html>` element.

7. **Responsive**: Design for 360px minimum width (common Android phones).

8. **Performance**: Use React.memo for list items, virtualize long lists if needed.

9. **Error Handling**: Wrap localStorage operations in try-catch, handle quota exceeded.

10. **Testing**: Test on actual Android device via USB debugging before final APK build.

---

## Sample Component Code Reference

### BulletList Component (Key Feature)
```tsx
// Reusable component for Sparks and Achievements
// - Input field with Add button
// - List of items with colored bullet dots
// - Inline edit on click
// - Delete button (X) on each item
// - Smooth animations on add/remove
```

### Home Dashboard Layout
```
┌─────────────────────────────┐
│  Good Evening, Writer! 👋   │
│  Monday, Jan 15, 2025       │
├─────────────────────────────┤
│  📊 Your Stats              │
│  [5 Entries] [12 Tasks] [🔥3]│
├─────────────────────────────┤
│  ✅ Today's Tasks           │
│  ☑ Task 1                   │
│  ☐ Task 2                   │
│  [+ Add task]               │
├─────────────────────────────┤
│  📝 Recent Entries          │
│  ┌─────────────────────┐    │
│  │ Jan 14 😊            │    │
│  │ First spark...       │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│      [ ✍️ Write Today ]     │  ← FAB
├─────────────────────────────┤
│ 🏠    📅    🔍    ⚙️      │  ← Bottom Nav
└─────────────────────────────┘
```

---

## Final Checklist Before APK Build

- [ ] All features working offline
- [ ] PIN lock tested
- [ ] Dark mode working
- [ ] Data persists after app close
- [ ] Export/Import working
- [ ] No console errors
- [ ] Tested on mobile viewport
- [ ] Touch interactions smooth
- [ ] All icons loading
- [ ] Form validations working

---

## Expected Final Output

A fully functional Android APK file that:
1. Opens with PIN lock screen
2. Shows home dashboard with todos and recent entries
3. Allows creating diary entries with bullet points, mood, tags, photos
4. Has calendar for browsing past entries
5. Has search with filters
6. Has settings for dark mode, reminders, backup
7. Works completely offline
8. Can export/import data for backup

---

*This prompt contains everything needed to build the complete app. Follow each phase sequentially and test thoroughly before moving to APK conversion.*
