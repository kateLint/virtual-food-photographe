# iOS Build Error - Fix Guide

## 🔴 Problem
Your iOS build failed with: "Unknown error. See logs of the Bundle JavaScript build phase"

## 🔍 Root Causes Identified

1. **Missing Apple Credentials** - EAS needs your Apple Developer account
2. **Environment Variables Not Set** - API key not configured as EAS secret
3. **Interactive Prompt Failed** - Build tried to prompt for input in non-interactive mode

## ✅ SOLUTION: Follow These Steps

### Step 1: Set Your API Key as EAS Secret

```bash
# You already have the key in START-HERE.md, now run:
eas secret:create --scope project \
  --name EXPO_PUBLIC_GEMINI_API_KEY \
  --value AIzaSyANpK0NQGoI4k_lb519Qk-zsFLGX8TZ7EQ

# Verify it was created:
eas secret:list
```

You should see:
```
✔ Loaded secrets for @ktlint/virtual-food-photographer
┌────────────────────────────────┬────────┐
│ Name                           │ Scope  │
├────────────────────────────────┼────────┤
│ EXPO_PUBLIC_GEMINI_API_KEY     │ project│
└────────────────────────────────┴────────┘
```

### Step 2: Configure Apple Credentials

You have two options:

#### Option A: Let EAS Manage Credentials (Recommended)

```bash
# This will prompt for your Apple ID and handle everything
eas build --platform ios --profile production
```

When prompted:
- **"Do you want to log in to your Apple account?"** → Answer: `y` (yes)
- Enter your **Apple ID** (the one for your Apple Developer account)
- Enter your **Apple ID password**
- If you have 2FA: Enter the **6-digit code** from your iPhone/Mac

EAS will:
- Generate signing certificates
- Create provisioning profiles
- Store them securely
- Use them for all future builds

#### Option B: Use Existing Credentials (Advanced)

If you already have certificates and provisioning profiles:

```bash
eas credentials
# Follow prompts to upload your existing certificates
```

### Step 3: Rebuild with Non-Interactive Flag

```bash
# Build without interactive prompts
eas build --platform ios --profile production --non-interactive
```

If this still fails, you'll need to provide credentials first (use Option A above).

## 🎯 RECOMMENDED: Complete Setup Flow

```bash
# 1. Set API secret (if not already done)
eas secret:create --scope project \
  --name EXPO_PUBLIC_GEMINI_API_KEY \
  --value AIzaSyANpK0NQGoI4k_lb519Qk-zsFLGX8TZ7EQ

# 2. Build with Apple credential setup
eas build --platform ios --profile production

# When prompted:
# - Log in to Apple account: YES
# - Enter Apple ID: your@email.com
# - Enter password: [your Apple Developer password]
# - 2FA code: [from your device]
```

## 📋 Prerequisites for iOS Build

Before building, ensure you have:

- ✅ **Apple Developer Account** ($99/year)
  - Sign up at: https://developer.apple.com/programs/
  - You MUST have this to build for iOS

- ✅ **Paid Enrollment Status**
  - Your account must be in "Active" status
  - Can take 24-48 hours after payment

- ✅ **Bundle ID Available**
  - `com.foodphoto.app` should be unique
  - If taken, you'll need to change it in app.json

## ⚠️ Common Issues & Fixes

### "Apple Developer account not found"
**Fix**: You need to enroll in Apple Developer Program first
- Go to: https://developer.apple.com/programs/enroll/
- Pay $99 annual fee
- Wait for approval (usually 24-48 hours)

### "Invalid credentials"
**Fix**:
1. Verify your Apple ID at https://appleid.apple.com
2. Make sure 2FA is enabled
3. Use an app-specific password if you have advanced security

### "Bundle identifier is taken"
**Fix**: Change in `app.json`:
```json
"ios": {
  "bundleIdentifier": "com.yourdomain.foodphoto"
}
```

### "Could not find any valid code signing identity"
**Fix**: Let EAS create certificates for you:
```bash
eas credentials --platform ios
# Select: "Set up new credentials"
```

## 🔄 Alternative: Start with Android First

If you're having iOS issues, you can submit to Play Store first:

```bash
# Android is simpler and doesn't require paid developer account to build
eas build --platform android --profile production
```

Then come back to iOS once you have:
- Active Apple Developer account
- Apple credentials configured in EAS

## 📞 Still Having Issues?

1. **Check EAS Build Logs**:
   ```bash
   eas build:list --platform ios
   # Click the URL to see detailed logs
   ```

2. **View the actual error**:
   - Go to the logs URL from the command above
   - Look for "Bundle JavaScript build phase" section
   - The real error will be there

3. **Common log errors**:
   - "Module not found" → Missing dependency, run `npm install`
   - "Duplicate symbols" → Conflicting native modules
   - "Code signing error" → Apple credentials issue

## ✅ Expected Success Output

When build succeeds, you'll see:

```
✔ Build finished
  Build URL: https://expo.dev/accounts/...
  Application archive (IPA): https://...

  You can now submit this build to Apple App Store:
  eas submit --platform ios
```

Then you can proceed with [APP-STORE-GUIDE.md](./APP-STORE-GUIDE.md) Step 4.

---

**TL;DR**: Run these commands:

```bash
# 1. Set secret
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value AIzaSyANpK0NQGoI4k_lb519Qk-zsFLGX8TZ7EQ

# 2. Build (will prompt for Apple ID)
eas build --platform ios --profile production
```
