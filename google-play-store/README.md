# Google Play Store Listing Assets

This directory contains all the necessary assets and information for publishing Food Photo to the Google Play Store.

## Required Assets Checklist

### 📝 Store Listing Text
- ✅ `short-description.txt` - Short description (80 characters max)
- ✅ `full-description.txt` - Full description (4000 characters max)

### 🖼️ Graphics Requirements

#### App Icon
- **Location**: `../assets/icon.png`
- **Size**: 512x512 px
- **Format**: 32-bit PNG with alpha
- **Current**: 1024x1024 (needs resizing for Play Store)

#### Feature Graphic (Required)
- **Size**: 1024 x 500 px
- **Format**: JPG or 24-bit PNG (no alpha)
- **Status**: ⚠️ TO CREATE
- **Purpose**: Displayed at top of store listing

#### Screenshots (Required - Minimum 2, Maximum 8)
- **Phone**:
  - Min: 320px
  - Max: 3840px
  - Aspect ratio between 16:9 and 9:16
- **Tablet** (Optional but recommended):
  - 7-inch: 1024 x 600, 1024 x 768, 1280 x 800
  - 10-inch: 1920 x 1200, 2560 x 1600
- **Status**: ⚠️ TO CREATE
- **Recommended**: 4-8 screenshots showing key features

#### Promotional Graphics (Optional)
- **Promo Graphic**: 180 x 120 px
- **TV Banner**: 1280 x 720 px (if targeting Android TV)
- **360-degree stereoscopic image**: (if targeting Daydream)

### 📱 What to Screenshot

Recommended screenshots to take:
1. Main screen with menu input and style selector
2. Generated food images in grid layout
3. Single dish detail/close-up
4. Favorites screen with saved images
5. Camera scanning feature in action
6. Example of different photography styles (Rustic/Modern/Social)

### 🎨 Feature Graphic Ideas

Create a 1024x500 px graphic that shows:
- App logo/icon on the left
- "Food Photo" title prominently
- Tagline: "AI-Powered Food Photography"
- Sample food images showing the app's capability
- Clean, modern design matching app's dark theme (#111827)

## Store Listing Information

### Category
Primary: **Photography** or **Food & Drink**
Secondary: Consider **Lifestyle** or **Productivity**

### Content Rating
- Complete the Google Play content rating questionnaire
- Expected rating: **Everyone** (no mature content)

### App Details
- **Title**: Food Photo
- **Package Name**: com.foodphoto.app
- **Version**: 1.0.5
- **Version Code**: 4
- **Minimum SDK**: 21 (Android 5.0)
- **Target SDK**: 35 (Android 15)

### Privacy & Permissions

Required Permissions:
- **Camera**: For scanning physical menus
- **Storage/Media Library**: For saving generated images
- **Internet**: For AI image generation

Privacy Policy URL: https://katelint.github.io/virtual-food-photographe/privacy-policy.html

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

4. Build production APK/AAB:
```bash
# For Google Play Store (AAB format)
eas build --platform android --profile production

# For testing (APK format)
eas build --platform android --profile preview
```

### Local Build

```bash
# Production APK
cd android
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Generate Signed Bundle (AAB) for Play Store

```bash
cd android
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

## Pre-Submission Checklist

- [ ] App icon created (512x512 px)
- [ ] Feature graphic created (1024x500 px)
- [ ] At least 2 screenshots captured
- [ ] Short description finalized (80 chars)
- [ ] Full description finalized (4000 chars)
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL verified
- [ ] App tested on multiple devices/screen sizes
- [ ] Signed release build (.aab) generated
- [ ] All permissions justified in listing
- [ ] Contact email configured
- [ ] Store listing graphics optimized
- [ ] Translations prepared (if multi-language)

## After Publication

- Monitor crash reports and user feedback
- Respond to user reviews
- Plan updates and feature improvements
- Track analytics and user engagement
- Keep privacy policy updated

## Resources

- [Google Play Console](https://play.google.com/console)
- [Google Play Store Listing Requirements](https://support.google.com/googleplay/android-developer/answer/9866151)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) - For generating icons
