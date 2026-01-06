# App Store Connect Setup Guide

## Complete Step-by-Step Instructions for Submitting to the App Store

---

## Prerequisites

Before you begin, ensure you have:
- ✅ iOS build completed (IPA file available)
- ✅ Apple Developer account ($99/year)
- ✅ App Store Connect access
- ✅ Screenshots prepared (see screenshot guide below)
- ✅ App icon (1024x1024 px)
- ✅ Privacy policy hosted online

**Build Information:**
- Build ID: `27426cf4-64ef-4350-8091-ab9967691459`
- IPA Download: https://expo.dev/artifacts/eas/5RbqNr4EnxXRPiZDkNhzTF.ipa
- Version: 1.0.6
- Build Number: 1
- Bundle ID: com.virtualfoodphotographer.app

---

## Part 1: Upload Your IPA

### Option A: Using EAS Submit (Recommended)

```bash
# Run this in your terminal
eas submit --platform ios --id 27426cf4-64ef-4350-8091-ab9967691459
```

You'll be prompted for:
1. Apple ID email
2. App-specific password (or authenticate)

### Option B: Using Transporter App

1. **Download the IPA:**
   - Open: https://expo.dev/artifacts/eas/5RbqNr4EnxXRPiZDkNhzTF.ipa
   - Save to your Downloads folder

2. **Open Transporter:**
   - macOS: Search for "Transporter" in Spotlight (Cmd+Space)
   - Or download from: https://apps.apple.com/app/transporter/id1450874784

3. **Upload:**
   - Drag and drop the .ipa file into Transporter
   - Click "Deliver"
   - Sign in with your Apple ID if prompted
   - Wait for upload to complete (5-10 minutes)

4. **Verify Upload:**
   - Go to App Store Connect → My Apps
   - Select your app (or create new app if first time)
   - Go to TestFlight tab → iOS Builds
   - Your build should appear within 5-15 minutes after "Processing" completes

---

## Part 2: Create Your App in App Store Connect

### Step 1: Access App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. Sign in with your Apple ID
3. Click "My Apps"

### Step 2: Create New App

1. Click the ➕ button in the top left
2. Select "New App"
3. Fill in the form:

   **Platforms:** ✅ iOS

   **Name:** Virtual Food Photographer

   **Primary Language:** English (U.S.)

   **Bundle ID:** Select `com.virtualfoodphotographer.app` from dropdown

   **SKU:** `virtual-food-photographer-001` (unique identifier for your records)

   **User Access:** Full Access

4. Click "Create"

---

## Part 3: Fill Out App Information

### General Information

Navigate to: **App Information** (in sidebar)

**Name:** Virtual Food Photographer

**Subtitle:** AI Menu to Food Photography
(30 characters max - appears below app name)

**Category:**
- Primary: Food & Drink
- Secondary: Productivity (optional)

**Content Rights:**
✅ "I have all rights to use this content"

**Age Rating:**
Click "Edit" → Answer all questions with "No" → Save
Result should be: **4+**

**Privacy Policy URL:**
```
https://kerenlint.github.io/virtual-food-photographer/privacy-policy.html
```
(You'll need to host PRIVACY_POLICY.md on GitHub Pages - see instructions below)

---

### App Privacy

Navigate to: **App Privacy** (in sidebar)

1. Click "Get Started"

2. **Data Collection:**
   - Select: "No, we do not collect data from this app"

   (Even though we send data to APIs, we don't *collect* or *store* it, which is what this section asks about)

3. Click "Save"

Note: If App Store review asks about the APIs, refer to the privacy policy that explains temporary processing.

---

### Pricing and Availability

Navigate to: **Pricing and Availability** (in sidebar)

**Price:** Free (select from dropdown)

**Availability:**
- ✅ Make this app available in all territories
- Or manually select specific countries

**Pre-order:** No

---

## Part 4: Prepare for Submission

Navigate to: **iOS App** → **1.0 Prepare for Submission**

### App Store Previews and Screenshots

**REQUIRED: Upload screenshots for these sizes**

1. **6.9" Display (iPhone 16 Pro Max)**
   - Size: 1320 x 2868 pixels
   - Upload 3-10 screenshots

2. **6.7" Display (iPhone 15 Pro Max, 14 Pro Max)**
   - Size: 1290 x 2796 pixels
   - Upload 3-10 screenshots

**How to create screenshots:**
See the "Screenshot Creation Guide" section below.

---

### Promotional Text (Optional)

```
Turn any menu into stunning food photos! Scan menus with your camera, choose a style, and watch AI create professional food photography in seconds. Free, no account needed.
```
(170 characters max - can be updated without new app submission)

---

### Description

Copy from [APP_STORE_LISTING.md](./APP_STORE_LISTING.md) - the full description section (4000 characters max).

**Preview:**
```
Transform Any Menu Into Beautiful Food Photography

Virtual Food Photographer is the ultimate AI-powered tool that brings restaurant menus to life with professional, mouth-watering food photography...
```

---

### Keywords

```
food,photography,menu,restaurant,AI,dishes,camera,scanner,OCR,images,cooking,dining
```
(100 characters max, comma-separated, no spaces after commas)

---

### Support URL

```
https://github.com/kerenlint/virtual-food-photographer
```

---

### Marketing URL (Optional)

```
https://github.com/kerenlint/virtual-food-photographer
```

---

### Version Information

**What's New in This Version:**
```
Version 1.0.6 - Initial Release

Welcome to Virtual Food Photographer! 🎉

Transform restaurant menus into stunning AI-generated food photography with just a few taps.

Features in this release:
• Camera menu scanning with OCR
• AI-powered food image generation
• Three professional photography styles
• Favorites management with local storage
• Download images to photo library
• Clean, dark-themed interface
• Fast and responsive performance

We're excited to bring you this innovative tool for food visualization. Start creating beautiful food photography today!
```

---

### Build

1. Click the ➕ button next to "Build"
2. Select your uploaded build (Version 1.0.6, Build 1)
3. If build isn't showing yet, wait 10-15 minutes for App Store Connect to process it
4. If prompted about export compliance:
   - Select "Yes, uses encryption"
   - Select "No, doesn't use proprietary encryption"
   - This is for HTTPS which is standard

---

### App Review Information

**Sign-in Required:** No

**Contact Information:**
- First Name: Keren
- Last Name: Lint
- Phone: [Your phone number]
- Email: kerenlint@gmail.com

**Notes:**
```
Thank you for reviewing Virtual Food Photographer!

HOW TO TEST THE APP:

1. Launch the app - you'll see the main screen with a text input area

2. TEST MENU SCANNING:
   - Tap the camera icon in the menu input box
   - Grant camera permission when prompted
   - Point at any menu or text with food dish names
   - The app will extract the text via OCR

3. TEST MANUAL INPUT:
   - Or type dish names manually, like:
     "Margherita Pizza
     Caesar Salad
     Chocolate Lava Cake"

4. SELECT STYLE:
   - Choose one of three photography styles

5. GENERATE IMAGES:
   - Tap "Generate Photos" button
   - Wait 10-15 seconds for AI to create images
   - Images will appear in a grid

6. TEST FAVORITES:
   - Tap heart icon to save favorites
   - Navigate to "Favorites" tab
   - Verify saved images appear

7. TEST DOWNLOAD:
   - In Favorites, tap "Download All"
   - Grant photo library permission
   - Check Photos app to verify saved

PERMISSIONS:
- Camera: For menu scanning (OCR)
- Photo Library: To save generated images

INTERNET REQUIRED:
Active connection needed for AI generation.

NO ACCOUNT REQUIRED:
App works immediately without sign-up.
```

**Attachment (Optional):** You can attach a demo video if you want

---

### Version Release

**Automatically release this version:** No (recommended for first release)

**After approval, manually release:** Yes

This gives you control over when the app goes live.

---

## Part 5: Submit for Review

1. **Review all information** one more time
2. Click "Add for Review" button (top right)
3. Review the App Store Review Guidelines checklist
4. Check all boxes confirming compliance
5. Click "Submit for Review"

---

## What Happens Next?

### Review Timeline

1. **In Review** (1-3 days typically)
   - Apple reviews your app
   - They test functionality
   - They check compliance with guidelines

2. **Possible Outcomes:**

   **✅ Approved:**
   - You'll receive an email
   - App is "Pending Developer Release" if you chose manual release
   - Click "Release this version" when ready
   - App goes live in ~24 hours

   **⚠️ Metadata Rejected:**
   - Minor issues with description/screenshots
   - Fix and resubmit quickly

   **❌ Rejected:**
   - App has functionality issues
   - You'll receive detailed explanation
   - Fix issues, submit new build, start review again

### After Approval

1. **Release the app:**
   - If manual release: Click "Release this version" in App Store Connect
   - If automatic: App goes live immediately

2. **Monitor:**
   - Check App Analytics in App Store Connect
   - Respond to user reviews
   - Monitor crash reports

3. **Updates:**
   - For future updates, repeat the process
   - Approval typically faster for updates

---

## Screenshot Creation Guide

### Required Sizes

You need screenshots for:
1. **6.9" Display:** 1320 x 2868 pixels
2. **6.7" Display:** 1290 x 2796 pixels

### How to Create Screenshots

#### Method 1: Use iOS Simulator

1. **Start the app:**
```bash
npx expo start
# Press 'i' for iOS simulator
```

2. **Select correct device:**
   - In Simulator: Device → Choose iPhone 16 Pro Max (6.9")
   - Or: iPhone 15 Pro Max (6.7")

3. **Take screenshots:**
   - Navigate to each screen you want to capture
   - Press `Cmd + S` to save screenshot
   - Screenshots save to Desktop

4. **Verify size:**
```bash
# Check screenshot dimensions
sips -g pixelWidth -g pixelHeight ~/Desktop/Simulator*.png
```

#### Method 2: Use Physical iPhone

If you have iPhone 15 Pro Max or newer:

1. Run app on your device
2. Take screenshots (Volume Up + Power button)
3. Transfer to computer via AirDrop

#### Method 3: Design Tool (Figma/Sketch)

1. Create artboards:
   - 1320 x 2868 px (for 6.9")
   - 1290 x 2796 px (for 6.7")

2. Place screenshot of app
3. Add promotional text overlays (optional)
4. Export as PNG

### Recommended Screenshots (in order)

1. **Main Screen** - Show menu input and style options
   Caption: "Type or Scan Any Menu"

2. **Camera Scanning** - Show camera view with menu
   Caption: "Scan Menus Instantly"

3. **Generated Images** - Grid of food photos
   Caption: "AI Creates Professional Food Photography"

4. **Style Comparison** - Same dish, different styles
   Caption: "Choose from 3 Professional Styles"

5. **Favorites** - Favorites screen with download
   Caption: "Save & Download Your Favorites"

---

## Hosting Privacy Policy on GitHub Pages

Your privacy policy needs to be accessible at a URL. Here's how:

### Step 1: Create GitHub Repository (if not exists)

```bash
# If you haven't already
git remote -v
# Should show: https://github.com/kerenlint/virtual-food-photographer
```

### Step 2: Enable GitHub Pages

1. Go to: https://github.com/kerenlint/virtual-food-photographer
2. Click "Settings" tab
3. Scroll to "Pages" in left sidebar
4. Under "Source": Select "Deploy from branch"
5. Branch: Select "main" and "/(root)"
6. Click "Save"

### Step 3: Convert Privacy Policy to HTML

Create a simple HTML version:

```bash
# In your project directory
cat > privacy-policy.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Virtual Food Photographer</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 { color: #F59E0B; }
        h2 { color: #111827; margin-top: 30px; }
        a { color: #F59E0B; }
    </style>
</head>
<body>
EOF

# Convert markdown to HTML (you can use pandoc or online converter)
# Or manually paste the privacy policy content

cat >> privacy-policy.html << 'EOF'
<!-- Paste your PRIVACY_POLICY.md content here, formatted as HTML -->
</body>
</html>
EOF
```

### Step 4: Commit and Push

```bash
git add privacy-policy.html
git commit -m "Add privacy policy for App Store"
git push origin main
```

### Step 5: Verify URL

Wait 2-5 minutes, then visit:
```
https://kerenlint.github.io/virtual-food-photographer/privacy-policy.html
```

Use this URL in App Store Connect.

---

## Troubleshooting

### Build Not Showing in App Store Connect

- **Wait:** Processing can take 10-30 minutes
- **Check email:** Apple sends notification when ready
- **Verify upload:** Check Transporter app for errors
- **Re-upload:** If stuck >1 hour, try uploading again

### Screenshots Rejected

- **Size must be exact:** Use `sips` command to verify
- **No transparent areas:** Fill entire canvas
- **Good quality:** No pixelation or blur
- **Status bar:** Can include or exclude (be consistent)

### Privacy Policy Issues

- **Must be accessible:** Test URL in incognito browser
- **Must be specific:** Can't just link to generic policy
- **Must match functionality:** Describe actual data usage

### Metadata Rejected

Common reasons:
- **Keywords spam:** Don't repeat words, use competitors' names
- **Description too promotional:** Avoid "best", "#1", excessive caps
- **Screenshots misleading:** Must show actual app functionality
- **Contact info invalid:** Must be reachable email

---

## Checklist Before Submitting

Use this final checklist:

- [ ] IPA uploaded and processed in App Store Connect
- [ ] Build selected in "Prepare for Submission"
- [ ] All required screenshots uploaded (6.9" and 6.7")
- [ ] App icon is correct (1024x1024 px, no alpha channel)
- [ ] Description entered and proofread
- [ ] Keywords entered (100 chars max)
- [ ] Privacy policy URL works (test in incognito)
- [ ] Support URL works
- [ ] App review notes completed
- [ ] Contact email is correct (kerenlint@gmail.com)
- [ ] Age rating confirmed (4+)
- [ ] Export compliance answered
- [ ] Pricing set to Free
- [ ] All territories selected (or specific ones chosen)
- [ ] Copyright info: © 2026 Keren Lint

---

## After Launch

### Monitor Performance

- **App Analytics:** App Store Connect → Analytics
- **User Reviews:** Respond to reviews (especially negative ones)
- **Crash Reports:** Check Xcode Organizer or App Store Connect
- **Search Rankings:** Monitor keyword performance

### Prepare for Updates

When you have updates:
1. Increment version in app.json (e.g., 1.0.6 → 1.0.7)
2. Build new IPA with EAS
3. Upload to App Store Connect
4. Update "What's New" text
5. Submit for review (usually faster than initial)

---

## Support

If you need help:
- **App Store Connect Help:** https://developer.apple.com/support/app-store-connect/
- **Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Expo Documentation:** https://docs.expo.dev/distribution/app-stores/

---

## Summary

You're ready to submit! Here's the quick version:

1. ✅ Upload IPA via `eas submit` or Transporter
2. ✅ Create app in App Store Connect
3. ✅ Fill out all metadata using APP_STORE_LISTING.md
4. ✅ Upload screenshots (create with simulator)
5. ✅ Host privacy policy on GitHub Pages
6. ✅ Add app review notes
7. ✅ Submit for review
8. ✅ Wait 1-3 days for approval
9. ✅ Release when ready!

**Good luck with your App Store launch! 🚀**
