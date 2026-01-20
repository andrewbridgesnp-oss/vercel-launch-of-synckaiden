# 🎥 Video Recording Guide - Avery AI Demo

## Quick Start Recording Instructions

### Step 1: Setup Your Environment
\`\`\`bash
# Start the app
npm run dev

# Open browser to http://localhost:5173
# Navigate to: Demo → Interactive Demo
\`\`\`

### Step 2: Screen Recording Settings

#### macOS (QuickTime/ScreenFlow)
1. Open QuickTime Player
2. File → New Screen Recording
3. Settings:
   - Resolution: 1080p or 4K
   - Frame Rate: 60 FPS
   - Audio: System Audio + Microphone
   - Cursor: Hide cursor for cleaner look

#### Windows (OBS Studio)
1. Download OBS Studio (free)
2. Create new Scene:
   - Source → Display Capture
   - Resolution: 1920x1080
   - FPS: 60
3. Audio settings:
   - Desktop Audio: Enabled
   - Microphone: Optional

### Step 3: Record the Interactive Demo

#### Recording Sequence:

**Part 1: Homepage Hero (15 seconds)**
\`\`\`
1. Navigate to: http://localhost:5173
2. Let hero animation play
3. Scroll down to show features
4. Click "Try Interactive Demo" button
\`\`\`

**Part 2: Interactive Demo (2 minutes)**
\`\`\`
1. Click "Play Demo" button
2. Let it auto-play through all 6 steps:
   - Incoming Call
   - AI Conversation
   - Booking
   - Payment Link
   - Dashboard Update
   - Results
3. Show progress bar advancing
4. Highlight key metrics appearing
\`\`\`

**Part 3: Dashboard Overview (30 seconds)**
\`\`\`
1. Navigate to Dashboard
2. Show live metrics
3. Point to recent calls
4. Show appointment calendar
\`\`\`

**Part 4: Call Detail (30 seconds)**
\`\`\`
1. Navigate to Calls & Messages
2. Click on a recent call
3. Show transcript
4. Show recording player (even if mock)
\`\`\`

**Part 5: Settings/Setup (20 seconds)**
\`\`\`
1. Navigate to Settings
2. Show business configuration
3. Show integration options (Twilio, Stripe)
\`\`\`

---

## 🎬 Professional Recording Tips

### Before Recording

✅ **Clear browser cache** - Fresh load for smooth animations  
✅ **Close unnecessary tabs** - Better performance  
✅ **Full screen mode** (F11) - No browser UI  
✅ **Disable notifications** - No interruptions  
✅ **Charge laptop** - Prevent performance throttling  
✅ **Test audio** - Make sure microphone works  
✅ **Zoom to 100%** - Proper scaling  

### During Recording

✅ **Move mouse slowly** - Easier to follow  
✅ **Pause on key screens** - 2-3 seconds for emphasis  
✅ **Let animations complete** - Don't rush  
✅ **Avoid sudden movements** - Smooth transitions  
✅ **Record multiple takes** - Pick the best  

### After Recording

✅ **Trim dead space** - Start and end clean  
✅ **Add fade in/out** - Professional touch  
✅ **Stabilize any shaky footage**  
✅ **Add music** (optional) - Subtle background  
✅ **Export at high quality** - 1080p minimum  

---

## 🎤 Voice-Over Recording

### Option 1: Record Live While Demoing
- Use the DEMO_SCRIPT.md narration
- Read naturally while clicking through
- Multiple takes recommended

### Option 2: Record Separately (Recommended)
1. Record demo silently
2. Record voice-over separately following DEMO_SCRIPT.md
3. Sync in editing software
4. Allows for perfect timing

### Option 3: Use AI Voice (ElevenLabs)
\`\`\`typescript
// Use the built-in API
import { api } from '@/lib/api';

const script = "It's 2:47 AM. A potential customer calls...";
const audioBlob = await api.synthesizeVoice(script);

// Download the audio file
const url = URL.createObjectURL(audioBlob);
const a = document.createElement('a');
a.href = url;
a.download = 'avery-voiceover.mp3';
a.click();
\`\`\`

---

## 📐 Video Dimensions

### Recommended Sizes

| Platform | Dimensions | Aspect Ratio |
|----------|-----------|--------------|
| YouTube | 1920x1080 | 16:9 |
| LinkedIn | 1920x1080 | 16:9 |
| Instagram Feed | 1080x1080 | 1:1 |
| Instagram Story | 1080x1920 | 9:16 |
| TikTok | 1080x1920 | 9:16 |
| Twitter | 1280x720 | 16:9 |

### Export Settings
- **Format**: MP4 (H.264)
- **Bitrate**: 8-10 Mbps (high quality)
- **Frame Rate**: 60 FPS (or 30 FPS minimum)
- **Audio**: 192 kbps AAC

---

## 🎨 Post-Production Enhancements

### Add These Elements:

#### 1. **Lower Third Graphics**
- Company name: "Avery AI"
- Website: "avery-ai.com"
- Appears at 0:05, stays for 5 seconds

#### 2. **Callout Arrows/Circles**
- Highlight important UI elements
- Use cyan (#00d9ff) color
- Subtle animation (fade in/out)

#### 3. **Text Overlays**
Show key metrics as they appear:
\`\`\`
- "Call answered in 0.8s"
- "Appointment booked"
- "$150 deposit secured"
- "100% automated"
\`\`\`

#### 4. **Progress Indicator**
- Show step numbers (1/6, 2/6, etc.)
- Or timeline bar at bottom

#### 5. **Background Music**
Genre: Modern Tech/Corporate
Mood: Energetic but subtle
Volume: -20dB (background only)

**Suggested Tracks:**
- Epidemic Sound: "Tech Future"
- Artlist: "Innovation"
- YouTube Audio Library: "Cipher"

---

## 🔊 Audio Mixing

### Levels:
- **Voice-Over**: -6dB to -3dB (loudest)
- **Background Music**: -20dB to -18dB (subtle)
- **UI Sound Effects**: -12dB to -10dB (if added)

### Tips:
- Compress voice for consistency
- EQ to remove low rumble (< 80Hz)
- Add subtle reverb for warmth
- Duck music when voice-over plays

---

## 📱 Platform-Specific Versions

### YouTube (Full Version - 2-3 min)
- Full script
- Detailed walkthrough
- Show all features
- Add chapters/timestamps
- Include end screen with links

### LinkedIn (Business Focus - 60s)
- Cut straight to ROI
- Focus on metrics
- Professional tone
- CTA: "Learn More" link in description

### Instagram/TikTok (Hook-Heavy - 30s)
\`\`\`
0:00 - 0:03: Hook ("2:47 AM call")
0:03 - 0:15: Quick demo
0:15 - 0:25: Results/ROI
0:25 - 0:30: CTA
\`\`\`

### Twitter (Teaser - 30s)
- Hook + one key feature
- Drive to full YouTube video
- Captions required (auto-play muted)

---

## ✅ Quality Checklist

Before publishing, verify:

- [ ] Video is 1080p or higher
- [ ] Frame rate is smooth (30fps minimum)
- [ ] Audio is clear with no background noise
- [ ] Music volume is appropriate
- [ ] All text is readable
- [ ] Animations play smoothly
- [ ] No typos in text overlays
- [ ] Colors match brand (cyan accents)
- [ ] CTA is clear and prominent
- [ ] End screen has clickable links
- [ ] Video length is appropriate for platform
- [ ] Thumbnail is eye-catching
- [ ] Description includes links
- [ ] Tags/keywords added

---

## 🎯 Distribution Strategy

### Week 1:
- Day 1: YouTube (full version)
- Day 2: LinkedIn (60s cut)
- Day 3: Twitter thread with video
- Day 4: Instagram feed (1:1)
- Day 5: TikTok/Reels (9:16)

### Ongoing:
- Pin to top of social profiles
- Add to website hero
- Include in email campaigns
- Use in sales presentations
- Share in relevant communities

---

## 🛠️ Tools & Software

### Free Options:
- **Recording**: OBS Studio
- **Editing**: DaVinci Resolve
- **Audio**: Audacity
- **Captions**: YouTube Auto-Caption → Edit
- **Thumbnails**: Canva

### Professional Options:
- **Recording**: ScreenFlow, Camtasia
- **Editing**: Premiere Pro, Final Cut Pro
- **Audio**: Adobe Audition
- **Motion Graphics**: After Effects
- **Captions**: Descript, Rev.com
- **Music**: Epidemic Sound, Artlist

---

## 📞 Need Help?

If you need professional video production:
- Fiverr: Search "product demo video"
- Upwork: Hire video editor
- 99designs: For thumbnails
- Rev.com: For transcription/captions

---

## 🚀 Ready to Record?

**Recommended Order:**

1. ✅ Read DEMO_SCRIPT.md thoroughly
2. ✅ Practice clicking through interactive demo
3. ✅ Set up screen recording software
4. ✅ Record 3 takes (pick best)
5. ✅ Add voice-over (live or separate)
6. ✅ Edit and add graphics
7. ✅ Export multiple formats
8. ✅ Create thumbnails
9. ✅ Write descriptions
10. ✅ Schedule/publish

**Time Estimate:**
- Recording: 30 minutes
- Editing: 2-3 hours
- Rendering: 30 minutes
- Total: 3-4 hours for polished video

---

**Let's make Avery famous! 🎬**
