# Production Deployment Guide

This guide covers how to build and deploy the Virtual Food Photographer app to production.

## Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI**: Install globally
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. **API Key**: Get a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Environment Setup

### 1. Configure Environment Variables

The app requires the `EXPO_PUBLIC_GEMINI_API_KEY` environment variable. This can be set in two ways:

#### Option A: Using EAS Secrets (Recommended for Production)
```bash
# Set the API key as an EAS secret
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value your-api-key-here

# Verify it was set
eas secret:list
```

#### Option B: Using .env file (Development Only)
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your API key
echo "EXPO_PUBLIC_GEMINI_API_KEY=your-api-key-here" > .env
```

**⚠️ IMPORTANT**: Never commit your `.env` file or hardcode API keys in `eas.json` or any other tracked files.

### 2. Verify Configuration

Check that your API key is properly configured:
```bash
# Development
npm start

# The app should load without errors
```

## Building for Production

### Android

#### Build App Bundle (for Google Play Store)
```bash
# Production build
eas build --platform android --profile production

# This will:
# - Build an AAB file optimized for Google Play
# - Use the Hermes JavaScript engine
# - Strip out development code and console.logs
# - Minify the bundle
```

#### Build APK (for testing or sideloading)
```bash
# Preview build (generates APK)
eas build --platform android --profile preview
```

### iOS

```bash
# Production build
eas build --platform ios --profile production

# This will:
# - Build an IPA file for App Store
# - Require Apple Developer Program membership
# - Need provisioning profiles and certificates
```

## Submitting to Stores

### Google Play Store

1. **First Time Setup**:
   - Create a Google Play Console account
   - Create a new app listing
   - Generate a service account key
   - Save as `google-play-service-account.json` (git-ignored)

2. **Submit Build**:
   ```bash
   # Submit to internal testing track
   eas submit --platform android --profile production
   ```

3. **Manual Upload** (if automated submission fails):
   - Download the AAB from EAS build dashboard
   - Upload manually to Google Play Console
   - Follow the review process

### Apple App Store

```bash
# Submit to App Store
eas submit --platform ios --profile production
```

## Version Management

Before each production release:

1. **Update Version Numbers**:
   ```json
   // app.json
   {
     "expo": {
       "version": "1.0.7",  // Increment version
       "android": {
         "versionCode": 6   // Increment versionCode
       }
     }
   }
   ```

2. **Update package.json**:
   ```json
   {
     "version": "1.0.7"  // Match app.json version
   }
   ```

3. **Current Versions**:
   - App version: 1.0.6
   - Android versionCode: 5

## Pre-Release Checklist

Before building for production:

- [ ] All console.log statements wrapped in `__DEV__` checks
- [ ] API keys removed from eas.json and all tracked files
- [ ] API key configured as EAS secret
- [ ] Version numbers incremented
- [ ] Tested on physical devices (Android and iOS)
- [ ] Error boundary tested
- [ ] Privacy policy URL is accessible
- [ ] Assets (icon, splash screen) are optimized
- [ ] Build configuration verified in eas.json

## Testing Production Builds

### Android
```bash
# Install preview build on device
eas build --platform android --profile preview
# Download and install the APK on your device
```

### iOS
```bash
# Build for simulator testing
eas build --platform ios --profile preview
```

## Monitoring

After release:

1. **Check Crash Reports**: Monitor EAS dashboard for crash reports
2. **User Feedback**: Monitor app store reviews
3. **API Usage**: Monitor Gemini API usage in Google Cloud Console
4. **Performance**: Check for any performance issues

## Troubleshooting

### Build Fails

1. **Check EAS build logs**:
   ```bash
   eas build:list
   # Click on the failed build for detailed logs
   ```

2. **Common issues**:
   - Missing environment variables
   - Invalid signing credentials
   - Dependency conflicts

### Runtime Errors

1. **Check device logs**:
   ```bash
   # Android
   adb logcat | grep ReactNativeJS

   # iOS
   xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "Expo"'
   ```

2. **Enable __DEV__ mode temporarily** to see console.logs

### API Key Issues

If the app shows "API key not found":
1. Verify EAS secret is set: `eas secret:list`
2. Rebuild the app after setting the secret
3. Check that the secret name matches exactly: `EXPO_PUBLIC_GEMINI_API_KEY`

## Security Best Practices

1. **Never commit**:
   - `.env` files
   - API keys
   - Service account credentials
   - Keystore files

2. **Use EAS Secrets** for all sensitive data in production builds

3. **Rotate API keys** if they're ever exposed

4. **Monitor API usage** to detect unauthorized use

## Rollback Strategy

If a production build has critical issues:

1. **Quick fix**: Submit a new build with hotfix
2. **Rollback**: Promote a previous working version in Play Console
3. **Communication**: Update app description with known issues

## Additional Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Gemini API Documentation](https://ai.google.dev/docs)

## Support

For issues or questions:
- Check the [README.md](./README.md) for general app information
- Review [CLAUDE.md](./CLAUDE.md) for development guidelines
- See the `google-play-store/` directory for store listing materials
