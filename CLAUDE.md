# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Virtual Food Photographer is a **React Native mobile application** (Android & iOS) built with Expo that transforms restaurant menus into AI-generated professional food photography. Users input menu items, select a photography style, and the app uses Google's Gemini AI models to parse the menu and generate realistic food images.

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
- **Google Gemini AI API** (@google/genai ^1.26.0)
  - Gemini 2.5 Flash - Menu parsing (structured JSON output)
  - Imagen 4.0 - Food image generation

## Project Structure

```
virtual-food-photographer/
├── app/                       # Expo Router pages
│   ├── _layout.tsx            # Root layout with navigation setup
│   └── index.tsx              # Main app screen (converted from App.tsx)
│
├── components/                # React Native components
│   ├── MenuInput.tsx          # TextInput for menu input (multiline)
│   ├── StyleSelector.tsx      # TouchableOpacity-based style picker
│   ├── ImageGrid.tsx          # FlatList-based grid for images
│   ├── ImageCard.tsx          # Dish card with loading states
│   └── icons/
│       ├── SparklesIcon.tsx   # SVG icon for generate button
│       └── LoaderIcon.tsx     # SVG loading spinner
│
├── services/
│   └── geminiService.ts       # AI API integration (mobile-compatible)
│       ├── parseMenu()        # Extract dish names from menu text
│       └── generateFoodImage() # Generate images via Imagen
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
1. **User Input** → Menu text pasted into TextInput (multiline)
2. **Style Selection** → Choose from 3 photography styles via TouchableOpacity
3. **Menu Parsing** → Gemini 2.5 Flash extracts dish names using structured JSON schema
4. **Image Generation** → For each dish, Imagen 4.0 generates an image based on style
5. **State Updates** → Each image transitions: pending → generating → completed/failed
6. **Display** → FlatList renders images in 2-column grid

### State Management
- **app/index.tsx** uses React hooks (useState, useCallback)
  - `menuText` - Raw menu input
  - `selectedStyle` - Active PhotoStyle enum value
  - `dishes` - Array of Dish objects with generation status
  - `isLoading` - Boolean for initial parsing phase
  - Alert API for error messages (instead of web alerts)

### Type System
**Dish Interface:**
```typescript
interface Dish {
  id: string;                           // UUID for unique identification
  name: string;                         // Extracted dish name
  imageUrl: string | null;              // Base64 data URL when completed
  status: 'pending' | 'generating' | 'completed' | 'failed'
}

enum PhotoStyle {
  RUSTIC = 'Rustic/Dark'
  MODERN = 'Bright/Modern'
  SOCIAL = 'Social Media'
}
```

### Component Breakdown
- **MenuInput** - TextInput with multiline prop, custom styling
- **StyleSelector** - TouchableOpacity-based radio buttons with custom radio UI
- **ImageGrid** - FlatList with numColumns={2} for grid layout
- **ImageCard** - View-based cards with Image component, handles four states
- **Icons** - react-native-svg based components (not web SVG)

### API Integration (services/geminiService.ts)
1. **parseMenu()** - Uses Gemini 2.5 Flash with responseSchema
   - Input: Raw menu text
   - Output: JSON array of dish names
   - Uses schema validation to ensure proper format

2. **generateFoodImage()** - Uses Imagen 4.0 image generation
   - Input: Dish name + PhotoStyle enum
   - Style prompts provide detailed photography direction
   - Output: Base64 JPEG image
   - Aspect ratio: 4:3 (landscape)

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
- No need for special Image conversion

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
| `app/index.tsx` | Main app screen, state management, generation flow |
| `app/_layout.tsx` | Root navigation layout, status bar config |
| `app.json` | Expo configuration, app metadata, build settings |
| `services/geminiService.ts` | Gemini API wrapper with mobile environment support |
| `types.ts` | Dish interface and PhotoStyle enum |
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

## Notes

- App uses Expo Router for navigation (file-based routing)
- Images embedded as base64 data URLs (no external files)
- API rate limits may affect rapid sequential generation
- Generation time depends on Gemini API response times
- Sequential image generation prevents API overload
- Uses React Native Animated API for spinner animations
