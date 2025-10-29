# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Virtual Food Photographer is a **React Native mobile application** (Android & iOS) built with Expo that transforms restaurant menus into AI-generated professional food photography. Users can type or scan menus, select a photography style, and the app uses Google's Gemini AI for menu parsing and Pollinations.ai for image generation. Features include favorites with persistence, image downloads, and haptic feedback.

## Quick Start Commands

### Development
```bash
npm install                    # Install dependencies
npm start                      # Start Expo dev server
npm run android                # Run on Android device/emulator
npm run ios                    # Run on iOS device/simulator (macOS only)
npm run web                    # Run in web browser (optional)
```

### Environment Setup
```bash
# Create .env file with your API key
echo "EXPO_PUBLIC_GEMINI_API_KEY=your-api-key-here" > .env
```

### Building for Production
```bash
npm run build:android          # Build Android APK/AAB
npm run build:ios              # Build iOS IPA (requires macOS)
```

## Technology Stack

- **React Native 0.76.5** - Mobile framework
- **React 18.3.1** - UI library
- **Expo ~52.0.0** - React Native tooling and services
- **Expo Router ~4.0.0** - File-based navigation
- **TypeScript 5.8.2** - Type safety
- **React Native StyleSheet** - Styling (native)
- **react-native-svg 15.8.0** - SVG rendering for icons
- **expo-linear-gradient** - Gradient components
- **@react-native-async-storage/async-storage 1.23.1** - Local persistence for favorites
- **expo-haptics** - Touch feedback
- **expo-media-library** - Photo library access for downloads
- **expo-file-system** - File operations (base64 conversion, downloads)
- **expo-image-picker** - Camera access for menu scanning
- **expo-sharing** - Share functionality
- **Google Gemini AI API** (@google/genai ^1.26.0)
  - Gemini 2.5 Flash - Menu parsing (structured JSON output) and OCR
- **Pollinations.ai** - Free image generation API (replaced Imagen 4.0)

## Project Structure

```
virtual-food-photographer/
├── app/                       # Expo Router pages (tab navigation)
│   ├── _layout.tsx            # Root layout with tabs, FavoritesProvider wrapper
│   ├── index.tsx              # Main app screen with menu input & generation
│   └── favorites.tsx          # Favorites screen with download functionality
│
├── components/                # React Native components
│   ├── MenuInput.tsx          # TextInput with camera scan & clear buttons
│   ├── StyleSelector.tsx      # TouchableOpacity-based style picker
│   ├── ImageGrid.tsx          # FlatList-based grid for images
│   ├── ImageCard.tsx          # Dish card with loading states & favorite toggle
│   └── icons/
│       ├── SparklesIcon.tsx   # SVG icon for generate button
│       ├── LoaderIcon.tsx     # SVG loading spinner
│       └── RefreshIcon.tsx    # SVG refresh icon for retry
│
├── contexts/
│   └── FavoritesContext.tsx   # React Context for favorites state management
│                              # Uses AsyncStorage for persistence
│
├── services/
│   └── geminiService.ts       # AI API integration (mobile-compatible)
│       ├── parseMenu()        # Extract dish names from menu text (Gemini)
│       ├── extractTextFromImage() # OCR for camera-scanned menus (Gemini)
│       └── generateFoodImage() # Generate images (Pollinations.ai)
│
├── types.ts                   # TypeScript interfaces and enums
├── assets/                    # App icons and splash screens
│   └── README.md              # Asset requirements
│
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── metro.config.js            # Metro bundler config
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── .env                       # Environment variables (git-ignored)
```

## Architecture & Patterns

### Data Flow
1. **User Input** → Manual text entry OR camera scan with OCR (extractTextFromImage)
2. **Style Selection** → Choose from 3 photography styles via TouchableOpacity
3. **Menu Parsing** → Gemini 2.5 Flash extracts dish names using structured JSON schema
4. **Image Generation** → Pollinations.ai generates images in parallel (Promise.all)
5. **State Updates** → Each image transitions: generating → completed/failed
6. **Display** → FlatList renders images in 2-column grid with favorite hearts
7. **Persistence** → Favorites saved to AsyncStorage, accessible in Favorites tab

### State Management
- **app/index.tsx** uses React hooks (useState, useCallback)
  - `menuText` - Raw menu input
  - `selectedStyle` - Active PhotoStyle enum value
  - `dishes` - Array of Dish objects with generation status
  - `isLoading` - Boolean for initial parsing phase
  - `isScanning` - Boolean for camera OCR in progress
  - Alert API for error messages (instead of web alerts)

- **contexts/FavoritesContext.tsx** - Global state via React Context
  - `favorites` - Array of favorited Dish objects
  - `addFavorite()` / `removeFavorite()` - Modify favorites & persist to AsyncStorage
  - `isFavorite()` - Check if dish is favorited
  - `toggleFavorite()` - Toggle favorite status
  - Provider wraps entire app in _layout.tsx

- **app/favorites.tsx** - Local state for downloads
  - `downloadingIds` - Set of dish IDs currently being downloaded
  - `isDownloadingAll` - Boolean for batch download in progress
  - `downloadProgress` - Object tracking current/total for batch downloads

### Type System
**Dish Interface:**
```typescript
interface Dish {
  id: string;                           // UUID for unique identification
  name: string;                         // Extracted dish name
  imageUrl: string | null;              // Base64 data URL when completed
  status: 'pending' | 'generating' | 'completed' | 'failed'
  isFavorite?: boolean;                 // Optional flag (not used in current impl)
}

enum PhotoStyle {
  RUSTIC = 'Rustic/Dark'
  MODERN = 'Bright/Modern'
  SOCIAL = 'Social Media'
}
```

### Navigation Architecture
- **Expo Router Tabs** - File-based routing with bottom tab navigation
  - `app/_layout.tsx` - Root layout with `<Tabs>` component
  - `app/index.tsx` - Home tab (main screen)
  - `app/favorites.tsx` - Favorites tab
  - Custom SVG icons (HomeIcon, HeartIcon) for tab bar
  - Dark theme styling (#1F2937 background, #F59E0B active)

### Component Breakdown
- **MenuInput** - TextInput with multiline prop, camera scan button, clear button
- **StyleSelector** - TouchableOpacity-based radio buttons with custom radio UI
- **ImageGrid** - FlatList with numColumns={2} for grid layout, retry button for failed images
- **ImageCard** - View-based cards with Image component, handles states (generating/completed/failed), favorite heart toggle
- **Icons** - react-native-svg based components (SparklesIcon, LoaderIcon, RefreshIcon)

### API Integration (services/geminiService.ts)
1. **parseMenu()** - Uses Gemini 2.5 Flash with responseSchema
   - Input: Raw menu text
   - Output: JSON array of dish names
   - Uses schema validation to ensure proper format
   - Error handling for 503/429/network/400 errors with user-friendly messages

2. **extractTextFromImage()** - Uses Gemini 2.5 Flash multimodal (OCR)
   - Input: Image URI from camera
   - Converts to base64, sends to Gemini with OCR prompt
   - Output: Extracted text from menu image
   - Error handling with specific error messages for each failure type

3. **generateFoodImage()** - Uses Pollinations.ai free API
   - Input: Dish name + PhotoStyle enum
   - Style prompts provide detailed photography direction
   - Downloads image via expo-file-system, converts to base64
   - Output: Base64 JPEG image
   - Aspect ratio: 4:3 (800x600)

### Environment Variables
- Uses **expo-constants** to access environment variables
- Variables must be prefixed with `EXPO_PUBLIC_` to be accessible
- Configured in `.env` file and injected via app.json
- Access via: `process.env.EXPO_PUBLIC_GEMINI_API_KEY` or `Constants.expoConfig.extra.EXPO_PUBLIC_GEMINI_API_KEY`

### Styling
- **StyleSheet.create()** - React Native styling API
- **Color scheme** - Dark theme (#111827 base) with amber/orange accents (#F59E0B, #EA580C)
- **LinearGradient** - Used for title and button backgrounds
- **Flexbox** - All layouts use React Native flex
- **Animations** - Animated API for spinner rotation

## Mobile-Specific Considerations

### React Native Differences from Web
1. **No HTML elements** - Use View, Text, Image, TextInput, ScrollView, etc.
2. **No CSS** - Use StyleSheet.create() with JS objects
3. **Touch interactions** - Use TouchableOpacity, Pressable instead of buttons
4. **Lists** - Use FlatList for efficient rendering of large lists
5. **Navigation** - Expo Router provides file-based navigation
6. **Environment** - expo-constants for config, no process.env by default

### UUID Generation
- Uses `react-native-get-random-values` for crypto polyfill
- Custom UUID generator function in app/index.tsx
- Required for generating unique dish IDs

### Image Handling
- Base64 images work with React Native Image component
- Use `source={{ uri: 'data:image/jpeg;base64,...' }}` format
- expo-file-system used for downloading images and base64 conversion
- expo-media-library used for saving to device photo library

### Persistence & Storage
- **AsyncStorage** (@react-native-async-storage/async-storage)
  - Key: `@favorites` - Stores serialized array of Dish objects
  - Loaded on app launch via useEffect in FavoritesContext
  - Automatically saved when favorites are added/removed
- **File System** (expo-file-system)
  - Cache directory used for temporary image storage during downloads
  - Base64 encoding/decoding for image data

### User Interactions
- **Haptic Feedback** (expo-haptics)
  - Success notification on successful image downloads
  - Enhances tactile experience on mobile
- **Camera Integration** (expo-image-picker)
  - Request camera permissions
  - Launch camera with editing capability
  - Quality: 0.8 for balance between size and quality
- **Photo Library** (expo-media-library)
  - Request media library write permissions
  - Create album "VirtualFoodPhotographer"
  - Save base64 images as JPEG assets

### Platform Testing
- **iOS**: Requires macOS with Xcode installed
- **Android**: Works on macOS, Windows, Linux with Android Studio
- **Expo Go**: Test on physical devices without builds
- **Web**: Optional web support via Expo (runs in browser)

## Development Workflow

### First Time Setup
```bash
npm install
echo "EXPO_PUBLIC_GEMINI_API_KEY=your-key" > .env
npm start
```

### Testing on Device
1. Install Expo Go app on your phone (iOS/Android)
2. Run `npm start`
3. Scan QR code with Expo Go (Android) or Camera (iOS)

### Testing on Emulator
```bash
# Android (requires Android Studio)
npm run android

# iOS (requires macOS + Xcode)
npm run ios
```

### Debugging
- Use React Native Debugger or Chrome DevTools
- Expo Dev Tools accessible via browser
- Console.log appears in terminal
- Errors shown in Expo Go app

## Key Files & Responsibilities

| File | Purpose |
|------|---------|
| `app/index.tsx` | Main home screen, menu input, OCR, generation flow, retry logic |
| `app/favorites.tsx` | Favorites screen, download functionality, batch downloads |
| `app/_layout.tsx` | Root tab navigation layout, FavoritesProvider, status bar config |
| `contexts/FavoritesContext.tsx` | Global favorites state, AsyncStorage persistence |
| `services/geminiService.ts` | Gemini API (parsing & OCR) + Pollinations.ai (image gen) |
| `types.ts` | Dish interface and PhotoStyle enum |
| `components/ImageCard.tsx` | Dish card with favorite toggle, status handling |
| `components/ImageGrid.tsx` | Grid layout with retry functionality |
| `babel.config.js` | Babel preset for Expo |
| `metro.config.js` | Metro bundler configuration |

## Environment Variables

```bash
EXPO_PUBLIC_GEMINI_API_KEY  # Required for API calls to Google Gemini
```
- Set in `.env` (git-ignored)
- Also configured in `app.json` extra field
- Accessible via expo-constants package

## Building for Production

### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Local Builds
- Android: `npx expo run:android --variant release`
- iOS: `npx expo run:ios --configuration Release`

## Assets
The app requires the following assets in the `assets/` directory:
- icon.png (1024x1024) - App icon
- splash.png (1284x2778) - Splash screen
- adaptive-icon.png (1024x1024) - Android adaptive icon
- favicon.png - Web favicon (optional)

See `assets/README.md` for details.

## Key Features & Implementation Notes

### Favorites System
- Favorites persist across app restarts via AsyncStorage
- Heart icon on ImageCard toggles favorite status
- FavoritesContext provides global state accessible from any component
- Favorites screen shows all saved images with download options
- Each favorite can be downloaded individually or all at once (batch download)

### Camera Scanning (OCR)
- Camera button in MenuInput launches device camera
- Captured image sent to Gemini 2.5 Flash for text extraction
- Extracted text appended to existing menuText (preserves existing content)
- Requires camera permissions (requested on first use)
- Useful for physical menus in restaurants

### Image Generation
- **Parallel generation** - All dishes generate simultaneously via Promise.all
- Changed from Imagen 4.0 (paid) to Pollinations.ai (free)
- No API rate limiting with Pollinations.ai
- Faster overall generation time due to parallelization
- Each image independently updates status (generating → completed/failed)

### Download Functionality (Favorites Screen)
- Individual downloads per image
- Batch "Download All" with progress indicator
- Creates album "VirtualFoodPhotographer" in photo library
- Requires media library write permissions
- Haptic feedback on successful downloads
- Base64 images converted to JPEG files via expo-file-system

### Error Handling
- Comprehensive error messages for API failures (503, 429, 400, network errors)
- Retry button for failed image generations
- Permission denial alerts for camera and media library
- Clear user feedback for all error states

## Technical Notes

- App uses Expo Router tabs for navigation (file-based routing)
- Images stored as base64 data URLs (no external file storage except during downloads)
- Generation time depends on Pollinations.ai API response times
- Uses React Native Animated API for spinner animations
- All state management via React hooks + Context API (no Redux/MobX)
