# App Store Screenshot Guide

## Quick Start

Metro bundler is running! Follow these steps to create your App Store screenshots.

---

## Required Screenshots

You need screenshots for these device sizes:

1. **6.9" Display (iPhone 16 Pro Max)** - REQUIRED
   - Resolution: 1320 x 2868 pixels
   - Aspect ratio: 19.5:9
   - Required: 3-10 screenshots

2. **6.7" Display (iPhone 15 Pro Max, 14 Pro Max)** - REQUIRED
   - Resolution: 1290 x 2796 pixels
   - Aspect ratio: 19.5:9
   - Required: 3-10 screenshots

---

## Step-by-Step Screenshot Process

### Step 1: Launch iOS Simulator

The Metro bundler is already running. Now open the iOS Simulator:

**In your terminal where Metro is running, press:**
```
i
```

This will:
1. Open Xcode Simulator
2. Launch the app automatically
3. Connect to Metro bundler

**If prompted to select a device:**
- Choose: **iPhone 16 Pro Max** (6.9" display)
- Or: **iPhone 15 Pro Max** (6.7" display)

### Step 2: Prepare Sample Content

Before taking screenshots, you'll want to have good sample content displayed. Here's what to prepare for each screenshot:

#### Screenshot 1: Main Screen with Menu Input
**What to show:**
- Menu text input with sample dishes
- All three style options visible
- Generate button

**Sample menu text to use:**
```
Margherita Pizza
Grilled Salmon with Herbs
Caesar Salad
Chocolate Lava Cake
Lobster Bisque
```

**How to set up:**
1. In the simulator, type the sample menu text
2. Make sure all three style options are visible
3. Don't tap generate yet - just show the input screen

#### Screenshot 2: Camera Scanning (Optional if you can simulate it)
**What to show:**
- Camera view (if possible to simulate)
- Or: Show the camera button prominently

**Alternative:**
Skip this and focus on the generated images instead.

#### Screenshot 3: Generated Images Grid
**What to show:**
- Multiple generated food photos in the grid
- Different dishes visible
- Clean, professional presentation

**How to set up:**
1. Select "Bright/Modern" style
2. Tap "Generate Photos"
3. Wait 10-15 seconds for images to generate
4. Take screenshot when all images are loaded

#### Screenshot 4: Style Comparison
**What to show:**
- Same dish in different styles (requires multiple generations)

**How to set up:**
1. Generate images with "Rustic/Dark" style first
2. Take note of one dish
3. Clear and regenerate same dish with "Bright/Modern" style
4. Use photo editing to show side-by-side comparison

**Alternative:**
Skip this and take another screenshot of the grid with different dishes.

#### Screenshot 5: Favorites Screen
**What to show:**
- Saved favorites
- Download buttons
- Multiple favorite images

**How to set up:**
1. From the main screen, tap heart icons on several images
2. Navigate to "Favorites" tab at bottom
3. Take screenshot showing the favorites grid

### Step 3: Take Screenshots

**For each screen you want to capture:**

1. **Set up the screen** as described above
2. **Take screenshot:** Press `Cmd + S` in simulator
3. **Screenshots save to:** Your Desktop
4. **Filename format:** `Simulator Screenshot - iPhone XX Pro Max - 2026-01-05 at XX.XX.XX.png`

**Recommended 5 screenshots (in order):**
1. Main screen with menu input
2. Generated images grid (Bright/Modern style)
3. Generated images grid (different dishes or style)
4. Favorites screen with saved images
5. Favorites with download options

### Step 4: Verify Screenshot Sizes

After taking screenshots, verify they're the correct size:

```bash
# Check screenshot dimensions
cd ~/Desktop
sips -g pixelWidth -g pixelHeight "Simulator Screenshot"*.png
```

**Expected output:**
- iPhone 16 Pro Max: `pixelWidth: 1320`, `pixelHeight: 2868`
- iPhone 15 Pro Max: `pixelWidth: 1290`, `pixelHeight: 2796`

### Step 5: Rename Screenshots

Rename your screenshots to make them easier to upload:

```bash
# Example renaming
cd ~/Desktop
mv "Simulator Screenshot - iPhone 16 Pro Max - 2026-01-05 at XX.XX.XX.png" "AppStore-6.9-01-Main.png"
mv "Simulator Screenshot - iPhone 16 Pro Max - 2026-01-05 at YY.YY.YY.png" "AppStore-6.9-02-Grid.png"
# ... etc
```

**Naming convention:**
- `AppStore-6.9-01-Main.png` (iPhone 16 Pro Max, Screenshot 1)
- `AppStore-6.9-02-Grid.png` (iPhone 16 Pro Max, Screenshot 2)
- `AppStore-6.7-01-Main.png` (iPhone 15 Pro Max, Screenshot 1)
- etc.

---

## Alternative: Create Screenshots on Different Device Sizes

### For 6.7" Display (iPhone 15 Pro Max)

1. **Stop current simulator:** Press `Ctrl+C` in Metro terminal
2. **Kill simulator:** Close Simulator app
3. **Restart Metro:** `npx expo start`
4. **Press 'i'** and select **iPhone 15 Pro Max**
5. **Repeat screenshot process** from Step 2

### Shortcut: Resize Existing Screenshots

If you only took screenshots on one device, you can resize them:

```bash
# Resize from 6.9" to 6.7"
cd ~/Desktop
sips -z 2796 1290 AppStore-6.9-01-Main.png --out AppStore-6.7-01-Main.png
sips -z 2796 1290 AppStore-6.9-02-Grid.png --out AppStore-6.7-02-Grid.png
# etc.
```

**Note:** This is acceptable but taking native screenshots on each device size is better quality.

---

## Pro Tips for Great Screenshots

### 1. Add Text Overlays (Optional)

You can enhance your screenshots with text overlays using:
- **Keynote/PowerPoint:** Import screenshot, add text boxes
- **Figma:** Import and add promotional text
- **Preview:** Use markup tools to add text

**Example text overlays:**
- Screenshot 1: "Type or Scan Any Menu"
- Screenshot 2: "AI Creates Professional Food Photography"
- Screenshot 3: "Choose from 3 Professional Styles"
- Screenshot 4: "Save & Download Your Favorites"

### 2. Show Status Bar

Include the iPhone status bar (time, battery, signal) for authenticity. The simulator includes this by default.

### 3. Use Realistic Content

- Use diverse dish names (appetizers, mains, desserts)
- Show variety in generated images
- Make sure favorites screen isn't empty

### 4. Clean UI

- No error states or loading spinners in final screenshots
- All images fully loaded
- No placeholder content

---

## Troubleshooting

### Simulator Won't Launch
```bash
# Kill all simulators
killall Simulator

# Restart Metro
npx expo start

# Press 'i' again
```

### Wrong Device Size
In Simulator app:
- Menu → Device → Choose correct iPhone model
- Or: Hardware → Device → iOS 17.5 → iPhone 16 Pro Max

### Screenshots Not Saving
- Check Desktop for files
- Ensure Simulator is in focus when pressing Cmd+S
- Try: File → Save Screen in Simulator menu

### App Not Loading
```bash
# Clear cache and restart
npx expo start --clear

# Press 'i' to reload
```

---

## Checklist Before Upload

- [ ] Minimum 3 screenshots for 6.9" display
- [ ] Minimum 3 screenshots for 6.7" display
- [ ] Verified sizes with `sips` command
- [ ] Screenshots show actual app functionality
- [ ] No placeholder or test content visible
- [ ] All images are PNG or JPEG format
- [ ] Files are under 8MB each
- [ ] Screenshots are in the correct order (1-5)

---

## Upload to App Store Connect

Once screenshots are ready:

1. **Go to:** https://appstoreconnect.apple.com
2. **Navigate to:** My Apps → Virtual Food Photographer → iOS App → 1.0 Prepare for Submission
3. **Find:** App Previews and Screenshots section
4. **For 6.9" Display:**
   - Click ➕ to add screenshots
   - Upload in order: 01, 02, 03, 04, 05
5. **For 6.7" Display:**
   - Same process
   - Upload corresponding screenshots

**Drag to reorder** if needed after upload.

---

## Current Metro Status

Metro bundler is running at: http://localhost:8081

**Next command to run:**
In your Metro terminal, press **`i`** to open iOS Simulator.

---

## Sample Test Data

Use these sample menus for realistic screenshots:

**Italian Restaurant:**
```
Margherita Pizza
Spaghetti Carbonara
Tiramisu
Caprese Salad
Osso Buco
```

**Upscale Dining:**
```
Grilled Lobster Tail
Pan-Seared Duck Breast
Truffle Risotto
Crème Brûlée
Wagyu Beef Tartare
```

**Casual Café:**
```
Avocado Toast
Blueberry Pancakes
Caesar Wrap
Chocolate Brownie
Iced Matcha Latte
```

Choose one that matches the photography style you're demonstrating.

---

**Ready to begin? Press 'i' in your Metro terminal to launch the iOS Simulator!**
