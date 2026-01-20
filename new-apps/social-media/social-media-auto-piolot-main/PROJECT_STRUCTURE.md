# SYNDICA FORGE - Project Structure

## Root Directory
```
/app/
├── backend/                # FastAPI Backend
├── frontend/              # React Frontend
├── tests/                 # Test directory
├── scripts/               # Utility scripts
├── design_guidelines.json # UI/UX design system
└── README.md             # Main documentation
```

## Backend Structure
```
/app/backend/
├── server.py             # Main FastAPI application
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
└── services/            # (To be created)
    ├── script_generator.py      # GPT-5.2 script generation
    ├── voice_generator.py       # ElevenLabs TTS
    ├── video_assembler.py       # A2E.ai + caption burning
    ├── trend_scanner.py         # Multi-platform trend scanning
    ├── daily_pipeline.py        # APScheduler automation
    └── publishers/              # Platform publishing
        ├── youtube_publisher.py
        ├── tiktok_publisher.py
        ├── meta_publisher.py
        └── snapchat_publisher.py
```

## Frontend Structure
```
/app/frontend/
├── public/               # Static assets
├── src/
│   ├── App.js           # Main app component with routing
│   ├── App.css          # App-specific styles
│   ├── index.js         # React entry point
│   ├── index.css        # Global styles + Tailwind
│   │
│   ├── components/      # Reusable components
│   │   ├── Layout.js           # Main layout with sidebar
│   │   └── ui/                 # Shadcn UI components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       └── ... (20+ components)
│   │
│   ├── pages/           # Route pages
│   │   ├── Login.js            # Auth page
│   │   ├── Dashboard.js        # System overview
│   │   ├── TrendBrief.js       # Daily trends
│   │   ├── VideoQueue.js       # Approval workflow
│   │   ├── Scheduler.js        # Post calendar
│   │   ├── Affiliates.js       # Offer catalog
│   │   ├── Capabilities.js     # Kayden library
│   │   └── Settings.js         # Configuration
│   │
│   ├── context/         # React context
│   │   └── AuthContext.js      # Auth state management
│   │
│   └── utils/           # Utilities
│       └── api.js              # API client & helpers
│
├── package.json         # Node dependencies
├── tailwind.config.js   # Tailwind configuration
└── .env                 # Frontend env vars
```

## Database Collections (MongoDB)

### users
```javascript
{
  id: "uuid",
  email: "string",
  password_hash: "string",
  created_at: "datetime"
}
```

### video_drafts
```javascript
{
  id: "uuid",
  script: "string",
  voice_profile: "calm|direct",
  scenes: [{ type: "stock|ai", url: "string", duration: number }],
  captions: { platform: "string" },
  affiliate_offer_ids: ["uuid"],
  video_url: "string",
  thumbnail_url: "string",
  status: "pending_approval|approved|rejected|published",
  created_at: "datetime",
  updated_at: "datetime"
}
```

### post_plans
```javascript
{
  id: "uuid",
  video_draft_id: "uuid",
  platform: "youtube|tiktok|facebook|instagram|snapchat",
  scheduled_time: "datetime",
  caption: "string",
  media_url: "string",
  status: "scheduled|publishing|published|failed",
  posted_at: "datetime?",
  platform_post_id: "string?",
  created_at: "datetime"
}
```

### trends
```javascript
{
  id: "uuid",
  date: "YYYY-MM-DD",
  source: "youtube|tiktok|google|twitter",
  title: "string",
  summary: "string",
  tags: ["string"],
  risk_flags: ["string"],
  audience_fit_score: number,
  suggested_angles: ["string"],
  created_at: "datetime"
}
```

### affiliate_offers
```javascript
{
  id: "uuid",
  name: "string",
  category: "string",
  network: "string",
  commission: "string?",
  epc: number?,
  url: "string",
  rules: "string?",
  reputation_score: number,
  enabled: boolean,
  created_at: "datetime"
}
```

### capabilities
```javascript
{
  id: "uuid",
  name: "string",
  problem_solved: "string",
  use_cases: ["string"],
  proof_points: ["string"],
  tags: ["string"],
  created_at: "datetime"
}
```

### platform_credentials
```javascript
{
  id: "uuid",
  platform: "youtube|tiktok|facebook|instagram|snapchat|elevenlabs|openai",
  credentials: { key: "value" },
  enabled: boolean,
  created_at: "datetime",
  updated_at: "datetime"
}
```

### brand_settings
```javascript
{
  id: "uuid",
  primary_color: "string",
  secondary_color: "string",
  font_heading: "string",
  font_body: "string",
  logo_url: "string?",
  watermark_enabled: boolean,
  cta_enabled: boolean,
  cta_text: "string?",
  disclosure_template: "string",
  caption_style: "string",
  updated_at: "datetime"
}
```

### directives
```javascript
{
  id: "uuid",
  date: "YYYY-MM-DD",
  focus_topics: ["string"],
  avoid_topics: ["string"],
  created_at: "datetime"
}
```

## API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/auth/login` | Login and receive token |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/status` | System status overview |

### Trends
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trends/daily` | Get today's trend brief |
| POST | `/api/trends/scan` | Trigger trend scanning |

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos/queue` | Get pending approval videos |
| POST | `/api/videos/approve/{id}` | Approve a video |
| POST | `/api/videos/reject/{id}` | Reject a video |
| POST | `/api/videos/generate` | Trigger video generation |

### Schedule
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schedule/posts` | Get all scheduled posts |
| POST | `/api/schedule/create` | Create new scheduled post |

### Affiliates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/affiliates` | List all offers |
| POST | `/api/affiliates` | Create new offer |
| PUT | `/api/affiliates/{id}` | Update offer |
| DELETE | `/api/affiliates/{id}` | Delete offer |

### Capabilities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/capabilities` | Search/list capabilities |
| POST | `/api/capabilities` | Add new capability |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/brand` | Get brand settings |
| PUT | `/api/settings/brand` | Update brand settings |
| GET | `/api/settings/credentials` | Get credentials (masked) |
| POST | `/api/settings/credentials` | Save credentials |

### Directive
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/directive/today` | Get today's directive |
| POST | `/api/directive` | Save new directive |

## Environment Variables

### Backend (.env)
```env
# Database
MONGO_URL=mongodb://localhost:27017
DB_NAME=syndica_forge

# CORS
CORS_ORIGINS=*

# LLM Integration (Emergent Universal Key)
EMERGENT_LLM_KEY=sk-emergent-52dCa033268Bd9bDb1

# Voice Generation
ELEVENLABS_API_KEY=your_key_here

# YouTube
YOUTUBE_CLIENT_ID=your_id
YOUTUBE_CLIENT_SECRET=your_secret
YOUTUBE_REFRESH_TOKEN=your_token

# TikTok
TIKTOK_CLIENT_KEY=your_key
TIKTOK_CLIENT_SECRET=your_secret
TIKTOK_ACCESS_TOKEN=your_token

# Meta (Facebook/Instagram)
META_APP_ID=your_id
META_APP_SECRET=your_secret
META_ACCESS_TOKEN=your_token

# Snapchat
SNAPCHAT_CLIENT_ID=your_id
SNAPCHAT_CLIENT_SECRET=your_secret
SNAPCHAT_REFRESH_TOKEN=your_token
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

## Dependencies

### Backend (requirements.txt)
- fastapi==0.110.1
- uvicorn==0.25.0
- motor==3.3.1 (MongoDB async driver)
- pydantic>=2.6.4
- python-dotenv>=1.0.1
- emergentintegrations (LLM integration)
- elevenlabs (Voice generation)
- google-api-python-client (YouTube)
- apscheduler (Task scheduling)
- ffmpeg-python (Video processing)
- python-multipart (File uploads)

### Frontend (package.json - key deps)
- react: 19.2.3
- react-router-dom: 7.11.0
- axios: 1.13.2
- tailwindcss: 3.4.19
- @radix-ui/react-* (Shadcn components)
- lucide-react: 0.507.0 (Icons)
- sonner: 2.0.7 (Toasts)
- @fontsource/azeret-mono
- @fontsource/manrope
- framer-motion: 12.23.26

## Design Tokens (from design_guidelines.json)

### Colors
- Background: `#050505`
- Surface: `#0A0A0A`
- Card: `#0F0F0F`
- Foreground: `#FAFAFA`
- Muted: `#A1A1AA`
- Border: `#27272A`
- Primary: `#0EA5E9` (Cyber Blue)
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`

### Typography
- Headings: Azeret Mono (monospace)
- Body: Manrope (sans-serif)
- Code: JetBrains Mono

### Spacing
- Container padding: `p-6 md:p-8`
- Section gap: `gap-8`
- Component gap: `gap-4`

## Scripts & Commands

### Development
```bash
# Backend
cd /app/backend
python server.py

# Frontend
cd /app/frontend
yarn start

# Both (using supervisor)
sudo supervisorctl status
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Database
```bash
# MongoDB shell
mongosh

# Use database
use syndica_forge

# List collections
show collections

# Query examples
db.users.find()
db.video_drafts.find({status: "pending_approval"})
db.trends.find({date: "2025-12-22"})
```

### Testing
```bash
# Backend logs
tail -f /var/log/supervisor/backend.err.log

# Test API
curl http://localhost:8001/api/dashboard/status

# Frontend build
cd /app/frontend
yarn build
```

## Integration Points

### OpenAI GPT-5.2 (Script Generation)
- Library: `emergentintegrations`
- Model: `gpt-5.2`
- Purpose: Generate 3-5 daily scripts based on trends
- Configuration: System prompt with tone/voice guidelines

### ElevenLabs (Voice Generation)
- SDK: `elevenlabs`
- Purpose: Convert scripts to audio
- Voices: 2+ profiles (Calm, Direct)
- Output: MP3/WAV

### A2E.ai (Video Generation)
- API: Unlimited free tier
- Purpose: Generate visuals from prompts
- Alternative: Stock footage APIs (Pexels, Unsplash)

### YouTube Data API v3
- Purpose: Upload Shorts, manage metadata
- Auth: OAuth 2.0
- Rate Limit: 10,000 units/day

### TikTok Content Posting API
- Purpose: Upload videos directly
- Auth: OAuth 2.0
- Limitation: Requires app review

### Meta Graph API
- Purpose: Post Reels to Facebook/Instagram
- Auth: OAuth 2.0
- Endpoints: `/me/video_reels`, `/instagram_business_account/media`

### Snapchat API
- Purpose: Assisted publish workflow
- Auth: OAuth 2.0
- Limitation: May require manual steps

## File Size Guidelines
- Videos: 9:16 aspect ratio, 1080x1920px
- Max file size: 100MB (platform dependent)
- Duration: 20-40 seconds
- Format: MP4 (H.264 + AAC)
- Thumbnails: 1080x1920px, JPG/PNG

## Security Best Practices
1. **Never commit .env files** (already in .gitignore)
2. **Encrypt API keys** at rest in MongoDB
3. **Use HTTPS** in production
4. **Implement rate limiting** on API endpoints
5. **Rotate credentials** regularly
6. **Audit logs** for all publishing actions

## Performance Optimization
1. **Video caching**: Store generated videos in CDN
2. **Database indexing**: Index on `status`, `created_at`, `date`
3. **API response caching**: Cache trend data for 1 hour
4. **Lazy loading**: Implement pagination for large lists
5. **Background jobs**: Use APScheduler for heavy tasks

## Monitoring & Alerts
1. **Health checks**: `/api/health` endpoint
2. **Error tracking**: Sentry or similar
3. **Performance monitoring**: Track API response times
4. **Publishing metrics**: Track success/failure rates
5. **User notifications**: Email/SMS for critical errors

---

**Last Updated**: December 22, 2025
**Version**: MVP v1.0
**Status**: Foundation Complete - Video Pipeline & Publishing Pending
