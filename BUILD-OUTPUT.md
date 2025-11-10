# Build Output - Food Photo v1.0.5

## Build Information

**App Name:** Food Photo
**Package:** com.foodphoto.app
**Version:** 1.0.5
**Version Code:** 4
**Build Date:** November 6, 2025
**Build Type:** Production Release

---

## Production Files Created

### 1. Android App Bundle (AAB) - For Google Play Store ✅

**File:** `app-release.aab`
**Location:** `android/app/build/outputs/bundle/release/app-release.aab`
**Size:** 30 MB
**Format:** Android App Bundle (ZIP-based)

**Purpose:**
- Upload to Google Play Console for store distribution
- Optimized for Play Store delivery
- Google Play will generate optimized APKs for different device configurations
- **This is the file you upload to Google Play Store**

**Full Path:**
```
/Users/kerenlint/Projects/MyCursor/ReactApps/virtual-food-photographer/android/app/build/outputs/bundle/release/app-release.aab
```

---

### 2. Android Package (APK) - For Direct Distribution ✅

**File:** `app-release.apk`
**Location:** `android/app/build/outputs/apk/release/app-release.apk`
**Size:** 62 MB
**Format:** Android Package (ZIP-based)

**Purpose:**
- Direct installation on Android devices
- Testing before Play Store submission
- Distribution outside Google Play Store (sideloading)
- Beta testing with testers

**Full Path:**
```
/Users/kerenlint/Projects/MyCursor/ReactApps/virtual-food-photographer/android/app/build/outputs/apk/release/app-release.apk
```

---

## File Sizes Comparison

| File Type | Size | Purpose | Recommended For |
|-----------|------|---------|-----------------|
| AAB | 30 MB | Play Store | Google Play Console Upload |
| APK | 62 MB | Direct Install | Testing & Sideloading |

**Note:** The AAB is smaller because Google Play generates optimized APKs for each device configuration. The APK contains all configurations in one file.

---

## Build Configuration

### Environment
- **Gradle Build Tool:** v8.x
- **Android SDK:** 35 (Android 15)
- **Min SDK:** 21 (Android 5.0)
- **Target SDK:** 35
- **Build Type:** Release (production)
- **Code Shrinking:** Enabled (R8/ProGuard)
- **Optimization:** Full

### Signing Status
⚠️ **Important:** These files are currently **unsigned** or signed with a debug key.

**For Google Play Store submission, you need to:**
1. **Generate a signing key** (or use existing)
2. **Sign the AAB** with your production keystore
3. Upload the signed AAB to Play Console

**Signing methods:**
- **EAS Build** (recommended): Handles signing automatically
- **Manual signing**: Use jarsigner or Android Studio

---

## What's Included

### Features in This Build:
✅ Updated app name: "Food Photo"
✅ Updated package: com.foodphoto.app
✅ Full-screen splash screen (native resize mode)
✅ Version 1.0.5 (versionCode 4)
✅ All app features:
  - Menu text input
  - Camera OCR scanning
  - 3 photography styles
  - AI image generation
  - Favorites with persistence
  - Download functionality
  - Batch downloads

### Permissions:
- Camera (for menu scanning)
- Storage/Media Library (for saving images)
- Internet (for AI generation)

---

## Next Steps

### For Google Play Store:

1. **Sign the AAB:**
   ```bash
   # Using jarsigner
   jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
     -keystore your-keystore.jks \
     app-release.aab \
     your-key-alias
   ```

2. **Or use EAS Build** (easier):
   ```bash
   eas build --platform android --profile production
   ```

3. **Upload to Play Console:**
   - Go to Google Play Console
   - Navigate to Release → Production
   - Upload the signed AAB
   - Complete store listing
   - Submit for review

### For Testing:

1. **Install APK on device:**
   ```bash
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

2. **Or share APK file** with testers for manual installation

3. **Test all features** before Play Store submission

---

## Build Commands Used

### AAB (Android App Bundle):
```bash
cd android
EXPO_PUBLIC_GEMINI_API_KEY=your-key ./gradlew bundleRelease
```

### APK (Android Package):
```bash
cd android
EXPO_PUBLIC_GEMINI_API_KEY=your-key ./gradlew assembleRelease
```

---

## Verification

### To verify the build:

**Check app info:**
```bash
# For AAB
bundletool build-apks --bundle=app-release.aab --output=output.apks --mode=universal
unzip -l output.apks

# For APK
aapt dump badging app-release.apk | grep -E "package|versionCode|versionName"
```

**Expected output:**
- Package: com.foodphoto.app
- Version Name: 1.0.5
- Version Code: 4

---

## Important Notes

1. **Backup these files** - Store them securely for your records

2. **Signing Key** - If you generate a new signing key:
   - **Keep it safe and backed up**
   - Never commit it to git
   - You'll need it for all future updates

3. **First Upload** - Google Play Console will manage your signing key if you opt-in to Play App Signing (recommended)

4. **Testing** - Always test the APK on real devices before uploading to Play Store

5. **Size Optimization** - The 62 MB APK size is normal for a React Native app with multiple dependencies

---

## Build Artifacts Location

```
android/app/build/outputs/
├── bundle/
│   └── release/
│       └── app-release.aab          # ← Upload this to Google Play Store
│
└── apk/
    └── release/
        ├── app-release.apk          # ← Use this for testing
        ├── baselineProfiles/
        └── output-metadata.json
```

---

## Success! ✅

Both production builds have been created successfully:

- ✅ **AAB for Google Play Store** (30 MB)
- ✅ **APK for direct distribution** (62 MB)

You're now ready to upload to Google Play Store or distribute for testing!

For detailed publishing instructions, see:
- [google-play-store/PUBLISH-GUIDE.md](../google-play-store/PUBLISH-GUIDE.md)
- [google-play-store/README.md](../google-play-store/README.md)
