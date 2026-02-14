# Quick Prompt: My Daily Diary App (React + Capacitor → APK)

## One-Shot Prompt for AI Agent

```
Build a personal diary Android app with React + TypeScript + Tailwind CSS + Capacitor.

## Features Required:

1. **PIN Lock**: 4-digit PIN on app launch, setup on first use, change in settings

2. **Daily Diary Entry with**:
   - Sparks of the Day: Bullet point list (add/edit/delete items one by one)
   - Achievements: Bullet point list (same as sparks)
   - Mood: 8 emoji options (😊😢😡😰😴🤩😌🤔) - single select
   - Tags: Pre-defined (Work, Personal, Health, Family, Travel, Learning) + custom tags
   - Photos: Attach multiple photos, store as base64

3. **Todo List**: Persistent checklist with add/edit/delete/complete functionality

4. **Calendar View**: Monthly grid, dates with entries highlighted with mood emoji, tap to view/create

5. **Search**: Full-text search across entries, filter by mood and tags

6. **Settings**:
   - Dark mode toggle
   - Daily reminder with time picker (use Notification API)
   - Change PIN
   - Export data as JSON file
   - Import data from JSON file
   - Show stats (total entries, tasks completed)

7. **Offline-First**: All data in localStorage, manual export for backup

## Tech Stack:
- React 18 + TypeScript + Vite
- Tailwind CSS (dark mode support)
- Lucide React icons
- date-fns for dates
- Capacitor for APK conversion

## UI Requirements:
- Mobile-first (360px min width)
- Bottom navigation: Home, Calendar, Search, Settings
- Floating "Write" button
- Card-based layouts with rounded corners
- Light/Dark theme support

## Data Structure:
- DiaryEntry: { id, date, sparks: string[], achievements: string[], mood, tags: string[], photos: string[], createdAt, updatedAt }
- Todo: { id, text, completed, createdAt }
- Settings: { darkMode, reminderEnabled, reminderTime, customTags }

## APK Conversion Steps:
1. npm install @capacitor/core @capacitor/cli @capacitor/android
2. npx cap init "My Daily Diary" "com.mydiary.app"
3. npx cap add android
4. npm run build
5. npx cap sync android
6. npx cap open android
7. In Android Studio: Build → Generate Signed APK

Build the complete app with all components, hooks for state management, and proper TypeScript types.
```

---

## Even Shorter Version (Copy-Paste Ready)

```
Create a React + TypeScript diary app convertible to Android APK:

Features:
- 4-digit PIN lock
- Daily entries with: bullet-point Sparks list, bullet-point Achievements list, mood emoji selector (8 options), category tags, photo attachments
- Todo checklist (add/edit/delete/complete)
- Calendar view showing entries with mood emojis
- Search with mood & tag filters
- Settings: dark mode, reminders, change PIN, export/import JSON backup

Tech: React, Vite, Tailwind, Capacitor
Storage: localStorage (offline-first)
UI: Mobile-first, bottom nav, floating write button

After building, convert to APK using Capacitor + Android Studio.
```

---

## AI Agent Instructions

If the AI asks clarifying questions, respond with:

> "Proceed with your best judgment. Use localStorage for all data. Make it offline-first. Use Tailwind for styling with dark mode support. Create reusable components. The bullet lists should allow adding items one by one like a todo list but without checkboxes. After completing the web app, provide Capacitor setup commands for APK generation."

---

## Post-Build Commands (Run These After AI Creates the App)

```bash
# 1. Install dependencies
npm install

# 2. Test the web app
npm run dev

# 3. Build for production
npm run build

# 4. Add Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "My Daily Diary" "com.mydiary.app"

# 5. Add Android platform
npm install @capacitor/android
npx cap add android

# 6. Copy web assets to Android
npx cap sync android

# 7. Open in Android Studio (must have Android Studio installed)
npx cap open android

# 8. In Android Studio:
#    - Wait for Gradle sync
#    - Build → Generate Signed Bundle / APK
#    - Select APK → Create keystore → Build Release
#    - Find APK at: android/app/release/app-release.apk
```

---

## Prerequisites on Your Computer

1. **Node.js** (v18+): https://nodejs.org
2. **Android Studio**: https://developer.android.com/studio
3. **Java JDK 17**: Required by Android Studio
4. **Android SDK**: Install via Android Studio SDK Manager

---

## Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| `cap: command not found` | Run `npm install @capacitor/cli` |
| Gradle sync failed | Update Android Studio & SDK |
| Build fails | Check Java 17 is installed |
| White screen in APK | Check `dist` folder exists, run `npm run build` first |
| Icons missing | Add icons to `android/app/src/main/res/` folders |

---

*Use the detailed prompt (DETAILED_BUILD_PROMPT.md) for best results, or the quick version above for capable AI agents.*
