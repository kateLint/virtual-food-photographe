# Splash Screen Configuration - Food Photo

## Understanding Your Splash Screen Issue

### The Problem

You have a splash image (944x2048 px) but it appears **small/centered** on Android devices instead of filling the entire screen.

### Why This Happens

**Android 12+** changed how splash screens work:

| Android Version | Splash Screen Behavior |
|-----------------|------------------------|
| **Android 11 and below** | Full-screen image possible |
| **Android 12+ (API 31+)** | New splash screen API - shows a **centered logo/icon** |

Your app targets **Android SDK 35 (Android 15)**, so it uses the **new Android 12+ splash screen system**.

---

## Current Configuration

### Your Splash Image
- **File:** `assets/splash.png`
- **Size:** 944x2048 pixels
- **Aspect Ratio:** ~1:2.17 (portrait)

### What Android Does With It
Android 12+ **converts** your full-screen image into:
- **864x864 px square logo** (centered on screen)
- **Background color:** #111827 (your dark color)
- **Result:** Logo appears small in the center, not full-screen

---

## ResizeMode Options Explained

### 1. **"contain"** (Default)
- Scales image to fit within bounds
- Maintains aspect ratio
- May show background color around image
- **Best for logos/icons**

### 2. **"cover"** (Currently Set)
- Scales image to cover entire area
- Maintains aspect ratio
- May crop parts of image
- **Best for full-screen images**

### 3. **"native"** (What You Tried)
- On Android 12+: Same as centered logo approach
- On Android 11-: Native full-screen rendering
- **Not truly full-screen on modern Android**

---

## The Truth About Android 12+ Splash Screens

### What You CAN'T Do:
❌ Show a true full-screen image on Android 12+
❌ Use the entire 944x2048 image
❌ Have different splash for different Android versions easily

### What You CAN Do:
✅ Accept the centered logo approach (Google's design guideline)
✅ Design your splash image with important content in the center
✅ Use a large, prominent logo that looks good centered

---

## Solutions & Recommendations

### Option 1: Accept Android 12+ Design (Recommended)

**Design a new splash image that works as a centered logo:**

1. **Create a square image** (2048x2048 px or 1024x1024 px)
2. **Place your logo/branding in the center**
3. **Use transparent or matching background**
4. **Keep important elements in center ~60% of image**

Example structure:
```
┌─────────────────────┐
│                     │
│    [Empty Space]    │
│                     │
│   ┌──────────┐     │
│   │   FOOD   │     │  ← Your logo/text
│   │   PHOTO  │     │     (centered)
│   └──────────┘     │
│                     │
│    [Empty Space]    │
│                     │
└─────────────────────┘
```

**Configuration:** (Already set in app.json)
```json
"splash": {
  "image": "./assets/splash.png",
  "resizeMode": "cover",
  "backgroundColor": "#111827"
}
```

---

### Option 2: Keep Current Image But Optimize

Since your current 944x2048 image is being converted to 864x864:

**Steps:**
1. Open your splash.png in an image editor
2. Ensure the **most important content is in the center square**
3. The center 864x864 area will be visible
4. Outer areas will be cropped

**Visualization of what's visible:**
```
Your 944x2048 image:
┌────────────┐
│  cropped   │ ← Top cropped
├────────────┤
│            │
│  VISIBLE   │ ← Center 864x864 shown
│   864x864  │
│            │
├────────────┤
│  cropped   │ ← Bottom cropped
└────────────┘
```

---

### Option 3: Implement Legacy Splash (Advanced)

For **true full-screen on Android 12+**, you need to:

1. **Downgrade target SDK to 30 or below** (NOT recommended - violates Play Store requirements)
2. **Use custom native Android code** to bypass the new splash API
3. **Maintain two splash systems** (complex)

**Why NOT recommended:**
- Google Play Store requires targetSdkVersion 31+ (Android 12+)
- Goes against Android design guidelines
- More maintenance burden
- Will be deprecated eventually

---

## How to Test Your Splash Screen

### Test on Emulator:
```bash
npx expo run:android
```

### Test on Real Device:
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### What to Look For:
1. **Launch the app** (cold start)
2. **Splash shows for 1-2 seconds**
3. **Check if logo is:**
   - Centered on screen
   - Appropriate size
   - Clear and visible
   - Background color matches

---

## Recommended Action

### Immediate Steps:

1. **Create a new splash image optimized for centered display:**
   - **Size:** 1200x1200 px (square)
   - **Format:** PNG with transparency
   - **Content:** Your "Food Photo" branding in center
   - **Safe area:** Keep important elements in center 800x800 px

2. **Replace current splash.png** with new image

3. **Rebuild app:**
```bash
cd android
./gradlew clean
EXPO_PUBLIC_GEMINI_API_KEY=your-key ./gradlew assembleRelease
```

4. **Test on device** to verify appearance

---

## Examples of Good Splash Design for Android 12+

### Good ✅
```
- Simple logo centered
- Clean, minimal design
- Text/logo easily readable
- Works at any size
- Matches app branding
```

### Bad ❌
```
- Complex full-screen artwork
- Important content in corners
- Text at top/bottom edges
- Detailed backgrounds
- Horizontal-oriented designs
```

---

## Current Settings Summary

**Your Current Configuration:**

| Setting | Value |
|---------|-------|
| Splash Image | assets/splash.png (944x2048) |
| Resize Mode | "cover" |
| Background | #111827 (dark) |
| Platform | Android 12+ (SDK 35) |
| Behavior | Centered 864x864 logo |

**Result:**
- Center portion of your image shown as 864x864 logo
- Dark background (#111827) fills rest of screen
- Modern Android 12+ splash screen experience

---

## Conclusion

**The "small" splash screen is actually correct Android 12+ behavior.**

**To "fix" it:**
- Design a square splash image meant to be displayed as a centered logo
- OR ensure your current image's center content looks good when cropped to square

**You cannot:**
- Make a true full-screen splash on Android 12+ without violating Play Store policies
- Use your entire 944x2048 image as originally intended

This is **by design** from Google, and all modern Android apps work this way.

---

## Additional Resources

- [Android 12 Splash Screen API](https://developer.android.com/develop/ui/views/launch/splash-screen)
- [Expo Splash Screen Documentation](https://docs.expo.dev/develop/user-interface/splash-screen/)
- [Google Play Target API Requirements](https://support.google.com/googleplay/android-developer/answer/11926878)

---

**Need Help?**

If you want to redesign your splash screen for the centered logo approach, I can help you:
1. Create design guidelines
2. Optimize your current image
3. Generate different variations for testing
