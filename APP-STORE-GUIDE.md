# Complete App Store Upload Guide
**App**: Virtual Food Photographer v1.0.6
**Last Updated**: 2025-12-31

---

## ✅ Production Verification Complete

Your app has been verified and is production-ready:
- ✅ TypeScript compiles with 0 errors
- ✅ All console statements wrapped in `__DEV__`
- ✅ iOS Privacy Manifest created (iOS 17+ requirement)
- ✅ Accessibility labels added to key interactive elements
- ✅ EAS configuration updated with appVersionSource
- ✅ Security issues fixed (API keys removed, keystore protected)

---

## 🚨 CRITICAL: BEFORE YOU START

### 1. Rotate Your Android Keystore (REQUIRED)
Your current keystore credentials were exposed in git. You MUST rotate them:

```bash
# Generate a new keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore upload-keystore.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias upload-key

# Save the keystore in android/app/
# Update android/keystore.properties with NEW credentials
# NEVER commit keystore.properties to git!
```

### 2. Clean Git History (REQUIRED)
Remove sensitive data from git history:

```bash
# WARNING: This rewrites history - backup everything first!
# If you have collaborators, coordinate with them

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch android/keystore.properties eas.json .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (discuss with team first if collaborative project)
git push origin --force --all
git push origin --force --tags
```

### 3. Set EAS Secret for API Key (REQUIRED)
Never hardcode API keys. Use EAS secrets:

```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Login to Expo
eas login

# Set your Gemini API key as a secret
eas secret:create --scope project \
  --name EXPO_PUBLIC_GEMINI_API_KEY \
  --value YOUR_ACTUAL_API_KEY_HERE

# Verify it was set
eas secret:list
```

---

## 📱 iOS APP STORE SUBMISSION

### Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com/programs/

2. **App Store Connect Access**
   - Go to: https://appstoreconnect.apple.com/

3. **Required Materials**:
   - App icon (1024x1024px) - ✅ Already have it in `assets/icon.png`
   - Screenshots (required sizes - see below)
   - App description
   - Privacy policy URL - ✅ Already configured
   - Keywords
   - App category

### Step 1: Prepare App Store Assets

#### Screenshots Required (for iPhone):
- **6.7" Display** (iPhone 14 Pro Max, 15 Pro Max): 1290 x 2796 pixels (3-10 screenshots)
- **6.5" Display** (iPhone 11 Pro Max, XS Max): 1284 x 2778 pixels (3-10 screenshots)
- **5.5" Display** (iPhone 8 Plus): 1242 x 2208 pixels (if supporting older devices)

#### Screenshots Tips:
```bash
# Use iOS Simulator to capture screenshots
# Run your app:
npm run ios

# In simulator: Device → Screenshot (⌘S)
# Screenshots save to Desktop
```

**What to Screenshot**:
1. Home screen with menu input
2. Generated food photos in grid
3. Favorites screen with saved photos
4. Camera scanning feature (optional)
5. Close-up of a generated photo

#### App Description (4000 characters max):
```
Virtual Food Photographer - Transform Your Menu into Stunning Food Photography

Turn any restaurant menu into professional, magazine-quality food photos in seconds. No camera, no photoshoot, no problem!

🎨 FEATURES:
• AI-Powered Generation: Simply paste or scan your menu
• 3 Professional Styles: Rustic/Dark, Bright/Modern, Social Media
• Camera Scanning: OCR technology extracts text from physical menus
• Save Favorites: Keep your best photos organized
• Easy Downloads: Save photos directly to your device
• Share Anywhere: Export photos to social media instantly

📸 PERFECT FOR:
• Restaurant owners showcasing their menu
• Food bloggers needing quick content
• Social media managers creating engaging posts
• Menu designers visualizing dishes
• Catering businesses presenting options

✨ HOW IT WORKS:
1. Paste your menu or scan it with your camera
2. Choose your preferred photography style
3. Let AI generate stunning, professional food photos
4. Save favorites and download for use anywhere

🔒 PRIVACY FIRST:
• No account required
• All data stored locally on your device
• Photos generated on-demand, not stored on servers

Transform your menu items into mouth-watering visuals that drive engagement and sales!

Keywords: Food Photography, AI, Restaurant, Menu, Social Media, Food Blogger
```

### Step 2: Create App Store Listing

1. **Go to App Store Connect**: https://appstoreconnect.apple.com/

2. **Create New App**:
   - Click "My Apps" → "+" → "New App"
   - Platform: iOS
   - Name: "Virtual Food Photographer" or "Food Photo AI"
   - Primary Language: English (U.S.)
   - Bundle ID: `com.foodphoto.app`
   - SKU: `virtual-food-photographer-001` (unique identifier)

3. **App Information**:
   - **Category**:
     - Primary: Photo & Video
     - Secondary: Food & Drink (optional)
   - **Content Rights**: Check if you have necessary rights
   - **Age Rating**: 4+ (No objectionable content)
   - **Privacy Policy URL**: `https://katelint.github.io/virtual-food-photographe/privacy-policy.html`

4. **Pricing**:
   - Free or Paid (recommend starting with Free)

### Step 3: Build iOS App with EAS

```bash
# Make sure you're logged in
eas login

# Configure EAS for iOS (if not done)
eas build:configure

# Build for iOS production
eas build --platform ios --profile production

# This will:
# - Prompt for Apple Developer credentials
# - Generate signing certificates
# - Build the IPA file
# - Take 15-30 minutes
```

**During Build**:
- EAS will ask for Apple ID credentials
- It may create provisioning profiles automatically
- Or you can provide existing certificates

### Step 4: Download & Upload to App Store

After build completes:

**Option A: Automatic Submission (Recommended)**
```bash
# Submit directly to App Store
eas submit --platform ios --profile production
```

**Option B: Manual Upload**
```bash
# Download the IPA from EAS dashboard
# Or get the URL from build output

# Install Transporter app from Mac App Store
# Open Transporter
# Drag and drop the IPA file
# Click "Deliver"
```

### Step 5: Complete App Store Information

In App Store Connect:

1. **Version Information** (1.0.6):
   - **What's New**: "Initial release - Transform menus into AI-generated food photos"
   - **Promotional Text** (optional): Highlighted feature
   - **Description**: Use the description from Step 1
   - **Keywords**: "food, photography, AI, restaurant, menu, social media, photos"
   - **Support URL**: Your website or GitHub repo
   - **Marketing URL** (optional): Landing page

2. **App Previews and Screenshots**:
   - Upload screenshots for each required size
   - Add captions describing each screen

3. **App Icon**:
   - Upload 1024x1024 icon (automatically pulled from build)

4. **Build**:
   - Select the build you just uploaded
   - It should appear after processing (10-60 minutes)

5. **App Review Information**:
   - **First Name, Last Name, Email, Phone**: Your contact info
   - **Sign-In Required**: No
   - **Demo Account** (if needed): N/A
   - **Notes**:
     ```
     This app generates AI food photos from menu text.

     To test:
     1. Enter sample menu text (or use the provided example)
     2. Select a photography style
     3. Tap "Generate Photos"
     4. Wait for AI to generate images (30-60 seconds)

     API key is configured via environment variables.
     No login required.
     ```

6. **Version Release**:
   - **Manually release this version**: Recommended for first release
   - OR **Automatically release**: After app review approval

7. **App Privacy**:
   - Click "Edit" next to "App Privacy"
   - **Data Types Collected**:
     - Photos/Videos: Used for app functionality only (camera scanning)
     - User Content: Saved locally for favorites
   - **Data Usage**: All data is used only for app functionality
   - **Data Retention**: Data stored locally on device
   - **Tracking**: We do not track users

### Step 6: Submit for Review

1. **Review Submission Checklist**:
   - [ ] All required screenshots uploaded
   - [ ] App description complete
   - [ ] Privacy policy URL working
   - [ ] Build selected
   - [ ] Age rating set
   - [ ] Content rights confirmed
   - [ ] Test notes provided

2. **Click "Add for Review"** → **"Submit to App Review"**

3. **Wait for Review**:
   - Initial review: 24-48 hours typically
   - You'll receive email updates
   - Check status in App Store Connect

### Step 7: After Approval

Once approved:
1. App will be "Ready for Sale"
2. If manual release: Click "Release This Version"
3. App appears on App Store within 24 hours
4. Share your App Store link!

---

## 🤖 ANDROID PLAY STORE SUBMISSION

### Prerequisites

1. **Google Play Developer Account** ($25 one-time fee)
   - Sign up at: https://play.google.com/console

2. **Required Materials**:
   - App icon (512x512px)
   - Feature graphic (1024x500px) - ✅ Already in `google-play-assets/`
   - Screenshots
   - Privacy policy URL

### Step 1: Prepare Play Store Assets

You already have most assets in `google-play-assets/` and `google-play-store/`!

#### Screenshots Required:
- **Phone**: 16:9 or 9:16 aspect ratio
  - Minimum: 320px
  - Maximum: 3840px
  - At least 2 screenshots required

#### Use Existing Assets:
- Feature graphic: ✅ `google-play-assets/feature-graphic-1024x500.png`
- App icon: ✅ `google-play-assets/app-icon-512.png`
- Description: ✅ `google-play-store/full-description.txt`
- Short description: ✅ `google-play-store/short-description.txt`

### Step 2: Build Android App with EAS

```bash
# Build Android App Bundle for Play Store
eas build --platform android --profile production

# This creates an AAB file (Android App Bundle)
# Build takes 10-20 minutes
```

### Step 3: Create Play Store Listing

1. **Go to Play Console**: https://play.google.com/console

2. **Create Application**:
   - Click "Create app"
   - App name: "Virtual Food Photographer"
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
   - Accept declarations

3. **Set Up Your App**:

#### Main Store Listing:
- **App name**: Virtual Food Photographer
- **Short description** (80 chars): Use `google-play-store/short-description.txt`
- **Full description** (4000 chars): Use `google-play-store/full-description.txt`
- **App icon**: Upload `google-play-assets/app-icon-512.png`
- **Feature graphic**: Upload `google-play-assets/feature-graphic-1024x500.png`
- **Screenshots**: Upload at least 2 phone screenshots
- **Phone screenshots**: Upload screenshots you captured from app

#### App Category:
- Category: Photography
- Tags: Select relevant tags

#### Contact Details:
- Email: Your support email
- Phone: Optional
- Website: Your website or GitHub repo

#### Privacy Policy:
- URL: `https://katelint.github.io/virtual-food-photographe/privacy-policy.html`

### Step 4: Content Rating

1. Click "Content rating" in left menu
2. Enter email address
3. Fill out questionnaire:
   - Does app contain violence? No
   - Does app contain sexual content? No
   - Does app contain profanity? No
   - etc.
4. Get rating (likely Everyone)

### Step 5: App Content

Fill out required sections:
- **Privacy policy**: Already entered
- **Ads**: No (unless you add ads)
- **App access**: All functionality available without restrictions
- **Content ratings**: Completed in Step 4
- **Target audience**: All ages
- **News app**: No
- **COVID-19 contact tracing**: No
- **Data safety**: Fill out data collection form
  - Photos collected: Yes (for camera scanning feature)
  - Data usage: Functionality only
  - Data sharing: None
  - Data storage: Local only

### Step 6: Upload App Bundle

1. Click "Production" → "Create new release"

2. **App signing by Google Play** (Recommended):
   - Let Google manage your app signing key
   - Upload your AAB file

3. **Upload the AAB**:
   - Download AAB from EAS dashboard
   - Or submit directly via EAS:
     ```bash
     eas submit --platform android --profile production
     ```

4. **Release name**: 1.0.6 (matches version in app.json)

5. **Release notes**:
   ```
   Initial release of Virtual Food Photographer!

   • Transform menus into AI-generated food photos
   • 3 professional photography styles
   • Camera scanning with OCR
   • Save and download your favorite photos
   • No account required
   ```

### Step 7: Review and Rollout

1. **Choose rollout**:
   - **Internal testing**: Limited users (recommended first)
   - **Closed testing**: Specific testers
   - **Open testing**: Public beta
   - **Production**: Everyone

2. **For production rollout**:
   - Review all sections (must be complete)
   - Click "Start rollout to Production"
   - Confirm

3. **Wait for review**:
   - Usually 1-3 days
   - May be faster for first release
   - Check status in Play Console

### Step 8: After Approval

1. App published on Google Play Store
2. Available within hours
3. Share your Play Store link!

---

## 🔧 TROUBLESHOOTING

### iOS Build Fails

**"No profiles found"**:
```bash
# Clear credentials and try again
eas credentials --platform ios
# Select "Remove all credentials"
# Then rebuild
eas build --platform ios --profile production --clear-cache
```

**"Code signing error"**:
- Ensure Apple Developer account is active
- Check that Bundle ID matches exactly
- Let EAS manage certificates automatically

### Android Build Fails

**"Keystore error"**:
- Ensure you've created a new keystore (see Step 1)
- Verify keystore.properties has correct paths
- Never commit keystore files to git

**"Build timeout"**:
```bash
# Try again with cache cleared
eas build --platform android --profile production --clear-cache
```

### App Rejected - Common Reasons

**iOS**:
1. **Missing privacy policy**: Ensure URL is accessible
2. **Crashing on launch**: Test thoroughly before submission
3. **Missing features**: App must work as described
4. **Guideline 4.3 (Spam)**: Make sure app is unique/useful
5. **Missing accessibility**: We added labels, should be OK

**Android**:
1. **Privacy policy missing**: Check URL works
2. **Unsafe content**: App should be safe for all ages
3. **Broken functionality**: Test all features
4. **Missing permissions explanation**: Should be OK (configured in manifest)

### EAS Secret Not Working

```bash
# Verify secret is set
eas secret:list

# If not there, create it
eas secret:create --scope project \
  --name EXPO_PUBLIC_GEMINI_API_KEY \
  --value YOUR_KEY

# Then rebuild
eas build --platform ios --profile production
```

---

## ✅ FINAL CHECKLIST

### Before Building:
- [ ] Rotated Android keystore
- [ ] Cleaned git history
- [ ] Set EAS secret for API key
- [ ] Verified TypeScript compiles (`npx tsc --noEmit`)
- [ ] Tested app thoroughly on physical device
- [ ] Screenshots captured
- [ ] App descriptions ready

### iOS Submission:
- [ ] Apple Developer account active
- [ ] App Store listing created
- [ ] All screenshots uploaded
- [ ] Privacy policy URL working
- [ ] Build uploaded to App Store Connect
- [ ] App review information completed
- [ ] Data privacy questionnaire filled
- [ ] Submitted for review

### Android Submission:
- [ ] Google Play Developer account active
- [ ] Play Store listing created
- [ ] All assets uploaded (icon, feature graphic, screenshots)
- [ ] Content rating completed
- [ ] Data safety form filled
- [ ] AAB file uploaded
- [ ] Release notes added
- [ ] Submitted for review

---

## 📞 SUPPORT

If you encounter issues:

1. **EAS Build Issues**: https://docs.expo.dev/build/introduction/
2. **App Store Connect Help**: https://developer.apple.com/support/app-store-connect/
3. **Google Play Console Help**: https://support.google.com/googleplay/android-developer/
4. **Community**: https://forums.expo.dev/

---

## 🎉 SUCCESS!

Once your app is approved and live:

1. **Share your app**:
   - App Store: `https://apps.apple.com/app/your-app-id`
   - Play Store: `https://play.google.com/store/apps/details?id=com.foodphoto.app`

2. **Monitor**:
   - Check reviews regularly
   - Respond to user feedback
   - Monitor crash reports in app stores

3. **Update**:
   - Increment version in `app.json`
   - Increment `versionCode` for Android
   - Build and submit updates

**Congratulations on launching your app! 🚀**
