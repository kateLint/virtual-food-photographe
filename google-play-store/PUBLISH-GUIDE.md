# Google Play Store Publishing Guide for Food Photo

This guide will walk you through the complete process of publishing Food Photo to the Google Play Store.

## Prerequisites

- [ ] Google Play Developer account ($25 one-time fee)
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Expo account (free)
- [ ] All required assets prepared (see README.md)

## Step-by-Step Publishing Process

### 1. Prepare Your Assets

Before building, ensure you have:

**Required Graphics:**
- [ ] App icon (512x512 px PNG)
- [ ] Feature graphic (1024x500 px JPG/PNG)
- [ ] At least 2 screenshots (phone)
- [ ] Screenshots optimized and cropped

**Text Content:**
- [ ] Short description (ready in `short-description.txt`)
- [ ] Full description (ready in `full-description.txt`)
- [ ] Privacy policy URL verified

### 2. Build the Production Release

#### Option A: Using EAS Build (Recommended - Easiest)

1. **Login to Expo:**
```bash
eas login
```

2. **Configure the build (if not already done):**
```bash
eas build:configure
```

3. **Build production AAB for Google Play:**
```bash
eas build --platform android --profile production
```

This will:
- Build an Android App Bundle (.aab)
- Sign it automatically
- Upload to EAS servers
- Provide a download link when complete

4. **Download the .aab file** from the link provided or EAS dashboard

#### Option B: Local Build with Android Studio

1. **Generate a signing key (first time only):**
```bash
cd android/app
keytool -genkey -v -keystore food-photo-release-key.keystore -alias food-photo-key -keyalg RSA -keysize 2048 -validity 10000
```

Save the keystore file securely and remember the passwords!

2. **Configure signing** in `android/gradle.properties`:
```properties
FOOD_PHOTO_UPLOAD_STORE_FILE=food-photo-release-key.keystore
FOOD_PHOTO_UPLOAD_KEY_ALIAS=food-photo-key
FOOD_PHOTO_UPLOAD_STORE_PASSWORD=your_store_password
FOOD_PHOTO_UPLOAD_KEY_PASSWORD=your_key_password
```

3. **Update** `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('FOOD_PHOTO_UPLOAD_STORE_FILE')) {
                storeFile file(FOOD_PHOTO_UPLOAD_STORE_FILE)
                storePassword FOOD_PHOTO_UPLOAD_STORE_PASSWORD
                keyAlias FOOD_PHOTO_UPLOAD_KEY_ALIAS
                keyPassword FOOD_PHOTO_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

4. **Build the signed bundle:**
```bash
cd android
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyCfD2Hel11oKwtuH13z55J_WEEveLD-GYA ./gradlew bundleRelease
```

5. **Find your .aab file:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

### 3. Create Google Play Console Listing

1. **Go to Google Play Console:**
   - Visit: https://play.google.com/console
   - Sign in with your developer account

2. **Create a new app:**
   - Click "Create app"
   - App name: **Food Photo**
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
   - Accept declarations

3. **Set up your app:**

#### Store Presence → Main store listing

**App details:**
- App name: `Food Photo`
- Short description: Copy from `short-description.txt`
- Full description: Copy from `full-description.txt`

**Graphics:**
- App icon: Upload 512x512 icon
- Feature graphic: Upload 1024x500 graphic
- Phone screenshots: Upload 2-8 screenshots
- Tablet screenshots (optional): Upload if available

**Categorization:**
- App category: `Photography` or `Food & Drink`
- Tags: Food, Photography, AI, Restaurant, Menu

**Contact details:**
- Email: Your support email
- Website: Your website URL (optional)
- Privacy policy: `https://katelint.github.io/virtual-food-photographe/privacy-policy.html`

#### Store Presence → Store settings

- App category: Choose primary and secondary
- Tags: Add relevant tags

#### Policy → App content

**Privacy policy:**
- URL: `https://katelint.github.io/virtual-food-photographe/privacy-policy.html`

**App access:**
- All or some features are restricted: No
- (All features are available to all users)

**Ads:**
- Does your app contain ads? No

**Content ratings:**
- Complete the questionnaire
- Expected rating: Everyone

**Target audience:**
- Select age groups (13+)

**News app:**
- Is this a news app? No

**COVID-19 contact tracing and status apps:**
- No

**Data safety:**
Complete the data safety section:
- Collects data: Yes (if using analytics)
  - Camera: Used for menu scanning
  - Photos/Media: Used for saving images
  - Internet: Used for AI generation
- Shares data: No
- Data is encrypted: Yes
- Users can request deletion: Yes

**Government apps:**
- Is this a government app? No

### 4. Production Release

#### Release → Production → Create new release

1. **Upload your app bundle:**
   - Click "Upload" and select your .aab file
   - Wait for upload and processing

2. **Release name:**
   - Version: `1.0.5 (4)`

3. **Release notes:**
```
Initial release of Food Photo!

Features:
• Transform restaurant menus into AI-generated food photography
• Smart menu parsing with Google Gemini AI
• Camera scanning with OCR
• Multiple photography styles (Rustic, Modern, Social Media)
• Save favorites and download images
• Clean, intuitive interface

Perfect for food bloggers, restaurant owners, and food enthusiasts!
```

4. **Review and rollout:**
   - Review all information
   - Click "Save"
   - Click "Review release"
   - Submit for review

### 5. Alternative: Internal Testing First (Recommended)

Before going to production, test with internal testers:

1. **Release → Internal testing → Create new release**
2. **Create tester list:**
   - Add email addresses of testers
   - Testers receive invite email
3. **Upload .aab and release notes**
4. **Submit**
5. **Test thoroughly**
6. **Promote to production when ready**

### 6. Automated Submission with EAS (Optional)

To automate submissions:

1. **Create a service account:**
   - In Google Play Console: Setup → API access
   - Create service account
   - Grant "Release Manager" permission
   - Download JSON key

2. **Save the key:**
```bash
mv ~/Downloads/pc-api-*.json ./google-play-service-account.json
```

3. **Add to .gitignore:**
```bash
echo "google-play-service-account.json" >> .gitignore
```

4. **Submit automatically:**
```bash
eas submit --platform android --profile production
```

## Post-Publication

### Monitor Your App

1. **Check review status:**
   - Usually takes 1-3 days for initial review
   - Monitor in Play Console dashboard

2. **After approval:**
   - App goes live automatically
   - Check app listing on Play Store
   - Test downloading and installing

3. **Monitor analytics:**
   - Track installs, ratings, crashes
   - Respond to user reviews
   - Plan updates based on feedback

### Marketing

- Share Play Store link on social media
- Create promotional materials
- Engage with early users
- Gather feedback for improvements

## Updating the App

For future updates:

1. **Increment version in app.json:**
```json
{
  "version": "1.0.6",
  "android": {
    "versionCode": 5
  }
}
```

2. **Build new version:**
```bash
eas build --platform android --profile production
```

3. **Create new release in Play Console**
4. **Upload new .aab**
5. **Add release notes**
6. **Submit for review**

## Troubleshooting

### Build fails
- Check error logs in EAS dashboard
- Ensure all dependencies are installed
- Verify API keys are set

### App rejected
- Review rejection reason carefully
- Common issues: privacy policy, content rating, permissions
- Fix issues and resubmit

### Signing issues
- Ensure keystore is backed up
- Never commit keystore to git
- Keep passwords secure

## Important Files

- **eas.json** - Build configuration
- **app.json** - App metadata
- **google-play-service-account.json** - API credentials (never commit!)
- **android/app/build.gradle** - Android build config
- **google-play-store/** - All listing assets

## Resources

- [Google Play Console](https://play.google.com/console)
- [Play Store Listing Requirements](https://support.google.com/googleplay/android-developer/answer/9866151)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Android App Bundles](https://developer.android.com/guide/app-bundle)

## Need Help?

- EAS Documentation: https://docs.expo.dev
- Expo Forums: https://forums.expo.dev
- Google Play Developer Support: https://support.google.com/googleplay/android-developer

---

**Good luck with your publication! 🚀**
