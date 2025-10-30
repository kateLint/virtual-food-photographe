# Virtual Food Photographer - Mobile App

A React Native mobile application (Android & iOS) that transforms restaurant menus into stunning AI-generated food photography using Google's Gemini AI.

## Features

- 📱 **Cross-Platform**: Runs on both iOS and Android devices
- 🤖 **AI-Powered**: Uses Gemini 2.5 Flash for menu parsing and Imagen 4.0 for image generation
- 🎨 **3 Photography Styles**: Modern, Rustic, and Social Media-ready
- 📸 **Professional Results**: Magazine-quality food photography
- 🌙 **Dark Theme**: Beautiful dark UI with amber/orange accents

## Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**
- For iOS development: **macOS** with **Xcode**
- For Android development: **Android Studio** with Android SDK
- **Expo Go** app on your phone (for quick testing)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the project root and add your Gemini API key:
```bash
echo "EXPO_PUBLIC_GEMINI_API_KEY=your-api-key-here" > .env
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 3. Start the Development Server
```bash
npm start
```

This will open the Expo Dev Tools in your browser.

### 4. Run on Device/Emulator

**Option A: Run on Physical Device (Easiest)**
1. Install the **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan the QR code from the terminal with:
   - iOS: Camera app
   - Android: Expo Go app

**Option B: Run on iOS Simulator (macOS only)**
```bash
npm run ios
```

**Option C: Run on Android Emulator**
```bash
npm run android
```

**Option D: Run in Web Browser (for testing)**
```bash
npm run web
```

## Project Structure

```
virtual-food-photographer/
├── app/                      # Expo Router screens
│   ├── _layout.tsx           # Root layout
│   └── index.tsx             # Main app screen
├── components/               # Reusable React Native components
│   ├── MenuInput.tsx
│   ├── StyleSelector.tsx
│   ├── ImageGrid.tsx
│   ├── ImageCard.tsx
│   └── icons/
├── services/                 # API integration
│   └── geminiService.ts
├── types.ts                  # TypeScript interfaces
├── app.json                  # Expo configuration
└── .env                      # Environment variables
```

## How It Works

1. **Input Menu**: Paste your restaurant menu text into the input field
2. **Select Style**: Choose from Modern, Rustic, or Social Media photography style
3. **Generate**: Tap the "Generate Photos" button
4. **View Results**: AI-generated images appear in a beautiful grid layout

The app uses:
- **Gemini 2.5 Flash** to parse menu items from your text
- **Imagen 4.0** to generate professional food photography for each dish

## Building for Production

### Using EAS Build (Recommended)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure build:
```bash
eas build:configure
```

4. Build for Android:
```bash
eas build --platform android
```

5. Build for iOS:
```bash
eas build --platform ios
```

### Local Builds

**Android:**
```bash
npx expo run:android --variant release
```

**iOS:**
```bash
npx expo run:ios --configuration Release
```

## Technology Stack

- **React Native 0.76.5** - Mobile framework
- **Expo ~52.0.0** - Development platform
- **TypeScript** - Type safety
- **Google Gemini AI** - Menu parsing and image generation
- **react-native-svg** - Icon rendering
- **expo-linear-gradient** - Beautiful gradients

## Troubleshooting

### App won't start
- Make sure you've run `npm install`
- Check that your `.env` file has the correct API key
- Try clearing the cache: `npx expo start -c`

### API errors
- Verify your Gemini API key is valid
- Check your internet connection
- Ensure the API key is set18 in the `.env` file with the `EXPO_PUBLIC_` prefix

### Build errors
- Make sure you have the latest version of Expo CLI
- For iOS: Ensure Xcode is installed and updated
- For Android: Ensure Android Studio and SDK are properly configured

## Contributing

This project was created using Google AI Studio and converted to a React Native mobile app.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Check the [CLAUDE.md](./CLAUDE.md) file for detailed documentation
- Visit [Expo Documentation](https://docs.expo.dev/)
- Visit [React Native Documentation](https://reactnative.dev/)

---

Built with ❤️ using React Native, Expo, and Google Gemini AI
