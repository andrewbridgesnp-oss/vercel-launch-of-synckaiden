import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🌱 Seeding database with ALL 66 apps from Complete Capability List...\n');

try {
  // Clear existing data
  console.log('Clearing existing data...');
  await connection.execute('DELETE FROM prices');
  await connection.execute('DELETE FROM appRegistry');
  await connection.execute('DELETE FROM products');
  
  // Insert Sync Bundle
  console.log('Creating Sync Bundle...');
  const [bundleResult] = await connection.execute(`
    INSERT INTO products (name, slug, description, type, status, metadata)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [
    'Sync Bundle',
    'sync-bundle',
    'Unlock unlimited access to all 66 Synckaiden apps. Complete business operating system in one subscription.',
    'bundle',
    'active',
    JSON.stringify({ featured: true, badge: 'BEST VALUE', appsIncluded: 66 })
  ]);
  const bundleId = bundleResult.insertId;

  // Insert Sync Bundle Price
  await connection.execute(
    'INSERT INTO prices (productId, amount, currency, `interval`, active, stripePriceId) VALUES (?, ?, ?, ?, ?, ?)',
    [bundleId, 7999, 'USD', 'month', true, 'price_sync_bundle_monthly']
  );

  // Define ALL 66 apps organized by category
  const apps = [
    // ============= AI & CHAT (5 apps) =============
    {
      name: 'AI Chat Assistant',
      slug: 'ai-chat',
      description: 'Intelligent AI chat interface with voice support. Get instant answers and assistance powered by advanced AI.',
      category: 'AI & Automation',
      icon: '💬',
      price: 999,
      features: ['Voice Recognition', 'Streaming Responses', 'Context Memory', 'Multi-Language', 'File Analysis']
    },
    {
      name: 'AI Arena',
      slug: 'ai-arena',
      description: 'Multi-AI debate platform. Get consensus recommendations from multiple AI perspectives on complex questions.',
      category: 'AI & Automation',
      icon: '🤺',
      price: 1499,
      features: ['Multi-AI Debate', 'Consensus Building', 'Expert Perspectives', 'Decision Support', 'Argument Analysis']
    },
    {
      name: 'Voice Authentication',
      slug: 'voice-auth',
      description: 'Secure voice-based authentication system. Protect sensitive data with verified voice prompts.',
      category: 'AI & Automation',
      icon: '🎤',
      price: 1999,
      features: ['Voice Biometrics', 'Multi-Factor Auth', 'Fraud Detection', 'Real-Time Verification', 'Secure Access']
    },
    {
      name: 'Agent Swarm',
      slug: 'agent-swarm',
      description: 'Deploy multiple AI agents to handle complex workflows. Coordinate tasks across teams and automate processes.',
      category: 'AI & Automation',
      icon: '🤖',
      price: 1999,
      features: ['Multi-Agent Coordination', 'Workflow Automation', 'Task Delegation', 'Performance Analytics', 'Custom Agents']
    },
    {
      name: 'Creative Content Engine',
      slug: 'creative-content-engine',
      description: 'AI-powered content generation for all formats. Create blog posts, social media, videos, and more instantly.',
      category: 'AI & Automation',
      icon: '✨',
      price: 1499,
      features: ['Multi-Format Generation', 'Brand Voice Training', 'SEO Optimization', 'Batch Processing', 'Content Calendar']
    },

    // ============= BUSINESS TOOLS (10 apps) =============
    {
      name: 'Business Hub',
      slug: 'business-hub',
      description: 'Central command center for all business operations. Unified dashboard for managing your entire business.',
      category: 'Business',
      icon: '🏢',
      price: 1999,
      features: ['Unified Dashboard', 'KPI Tracking', 'Team Management', 'Document Center', 'Quick Actions']
    },
    {
      name: 'Business Credit Builder',
      slug: 'business-credit',
      description: 'Build and monitor business credit scores. Access credit repair tools and track improvement over time.',
      category: 'Business',
      icon: '📊',
      price: 1499,
      features: ['Credit Monitoring', 'Dispute Letters', 'Score Tracking', 'Lender Matching', 'Credit Strategy']
    },
    {
      name: 'Cost Reduction Analyzer',
      slug: 'cost-reduction',
      description: 'AI-powered cost optimization tool. Identify savings opportunities and reduce business expenses.',
      category: 'Business',
      icon: '💸',
      price: 1299,
      features: ['Expense Analysis', 'Savings Recommendations', 'Vendor Comparison', 'Contract Review', 'ROI Tracking']
    },
    {
      name: 'New Business Guide',
      slug: 'new-business-guide',
      description: 'Step-by-step business formation wizard. Complete guide from idea to launch with templates and checklists.',
      category: 'Business',
      icon: '🚀',
      price: 999,
      features: ['Business Planning', 'Legal Structure Guide', 'Registration Help', 'Tax Setup', 'Launch Checklist']
    },
    {
      name: 'LLC Formation Wizard',
      slug: 'llc-formation',
      description: 'Automated LLC formation with state-specific guidance. Generate documents and file your LLC in minutes.',
      category: 'Business',
      icon: '📜',
      price: 1999,
      features: ['State-Specific Forms', 'Document Generation', 'Filing Assistance', 'Registered Agent Info', 'Operating Agreement']
    },
    {
      name: 'Employee OS',
      slug: 'employee-os',
      description: 'Complete HR management system. Handle hiring, onboarding, time tracking, payroll, and performance reviews.',
      category: 'Business',
      icon: '👥',
      price: 1999,
      features: ['Applicant Tracking', 'Onboarding Workflows', 'Time & Attendance', 'Payroll Integration', 'Performance Management']
    },
    {
      name: 'Business Analyzer',
      slug: 'business-analyzer',
      description: 'Comprehensive business intelligence and analytics. Get insights from your data with AI-powered recommendations.',
      category: 'Business',
      icon: '📈',
      price: 1499,
      features: ['Real-Time Dashboards', 'Predictive Analytics', 'Custom Reports', 'Data Integration', 'AI Insights']
    },
    {
      name: 'Project Nexus',
      slug: 'project-nexus',
      description: 'Advanced project management with AI assistance. Plan, track, and deliver projects on time and budget.',
      category: 'Business',
      icon: '📋',
      price: 1299,
      features: ['Gantt Charts', 'Resource Allocation', 'Time Tracking', 'Budget Management', 'Team Collaboration']
    },
    {
      name: 'Workflows Builder',
      slug: 'workflows-builder',
      description: 'Visual workflow automation platform. Connect tools, automate processes, and eliminate manual work.',
      category: 'Business',
      icon: '⚙️',
      price: 1999,
      features: ['Drag-Drop Canvas', 'Tool Chaining', 'Approval Gates', 'Trigger Types', 'Execution History']
    },
    {
      name: 'Team Hub',
      slug: 'team-hub',
      description: 'Team collaboration and communication center. Chat, share files, and coordinate work in one place.',
      category: 'Business',
      icon: '🤝',
      price: 1299,
      features: ['Team Chat', 'File Sharing', 'Task Assignment', 'Video Calls', 'Activity Feed']
    },

    // ============= CRM & SALES (5 apps) =============
    {
      name: 'Sales CRM',
      slug: 'sales-crm',
      description: 'Complete customer relationship management system. Manage contacts, deals, and sales pipeline with AI insights.',
      category: 'CRM & Sales',
      icon: '🎯',
      price: 1999,
      features: ['Contact Management', 'Deal Pipeline', 'Lead Scoring', 'Activity Tracking', 'Sales Forecasting']
    },
    {
      name: 'Lead Management',
      slug: 'lead-management',
      description: 'Capture, qualify, and nurture leads automatically. AI-powered lead scoring and automated follow-ups.',
      category: 'CRM & Sales',
      icon: '🔍',
      price: 1499,
      features: ['Lead Capture', 'Auto-Qualification', 'Nurture Sequences', 'Lead Scoring', 'Conversion Tracking']
    },
    {
      name: 'Sales Pipeline',
      slug: 'sales-pipeline',
      description: 'Visual sales pipeline management. Track deals from prospect to close with automated workflows.',
      category: 'CRM & Sales',
      icon: '📊',
      price: 1499,
      features: ['Pipeline Visualization', 'Stage Automation', 'Win/Loss Analysis', 'Forecasting', 'Team Performance']
    },
    {
      name: 'Customer Insights',
      slug: 'customer-insights',
      description: 'Deep customer analytics and behavior tracking. Understand your audience and improve retention.',
      category: 'CRM & Sales',
      icon: '👥',
      price: 1499,
      features: ['Behavior Tracking', 'Cohort Analysis', 'Churn Prediction', 'Sentiment Analysis', 'Custom Segments']
    },
    {
      name: 'Proposals & Quotes',
      slug: 'proposals-quotes',
      description: 'Professional proposal and quote generator. Create, send, and track proposals with e-signature support.',
      category: 'CRM & Sales',
      icon: '📝',
      price: 1299,
      features: ['Template Library', 'E-Signature', 'Tracking', 'Version Control', 'Approval Workflow']
    },

    // ============= FINANCE & ACCOUNTING (8 apps) =============
    {
      name: 'Financial Co-Pilot',
      slug: 'financial-copilot',
      description: 'AI-powered financial management and planning. Track accounts, budgets, and get intelligent financial advice.',
      category: 'Finance',
      icon: '💰',
      price: 1999,
      features: ['Account Aggregation', 'Budget Planning', 'Transaction Tracking', 'AI Advisor', 'Financial Reports']
    },
    {
      name: 'Comprehensive Tax App',
      slug: 'comprehensive-tax-app',
      description: 'Automated tax preparation and filing for businesses. Stay compliant with real-time tax calculations and reporting.',
      category: 'Finance',
      icon: '📊',
      price: 1499,
      features: ['Automated Filing', 'Deduction Finder', 'Multi-State Support', 'Audit Protection', 'Quarterly Estimates']
    },
    {
      name: 'Dynasty Trust Workbook',
      slug: 'dynasty-trust',
      description: 'Estate planning and trust management tool. Plan dynasty trusts with jurisdiction comparison and attorney review.',
      category: 'Finance',
      icon: '🏛️',
      price: 1999,
      features: ['Trust Planning', 'Jurisdiction Comparison', 'Beneficiary Management', 'Asset Protection', 'Attorney Review']
    },
    {
      name: 'Invoice & Billing',
      slug: 'invoice-billing',
      description: 'Professional invoicing and billing automation. Create, send, and track invoices with payment processing.',
      category: 'Finance',
      icon: '🧾',
      price: 1299,
      features: ['Invoice Creation', 'Recurring Billing', 'Payment Processing', 'Expense Tracking', 'Financial Reports']
    },
    {
      name: 'AI Funding Brokerage',
      slug: 'ai-funding-brokerage',
      description: 'Connect with investors and secure funding using AI-powered matching. Prepare pitch decks and track applications.',
      category: 'Finance',
      icon: '💰',
      price: 1999,
      features: ['Investor Matching', 'Pitch Deck Generator', 'Application Tracking', 'Due Diligence Tools', 'Term Sheet Analysis']
    },
    {
      name: 'BuildWealth Pro',
      slug: 'buildwealth-pro',
      description: 'Comprehensive wealth building and investment planning. Create financial plans and track net worth growth.',
      category: 'Finance',
      icon: '💎',
      price: 1999,
      features: ['Wealth Planning', 'Investment Strategies', 'Net Worth Tracking', 'Retirement Planning', 'Tax Optimization']
    },
    {
      name: 'HouseHack 203K',
      slug: 'househack-203k',
      description: 'FHA 203K loan calculator and property analysis tool. Analyze renovation projects and calculate financing.',
      category: 'Finance',
      icon: '🏠',
      price: 1499,
      features: ['Loan Calculator', 'Property Analysis', 'Renovation Budgeting', 'Cash Flow Projections', 'Deal Analyzer']
    },
    {
      name: 'Expense Management',
      slug: 'expense-management',
      description: 'Smart expense tracking and reimbursement system. OCR receipt capture and automated categorization.',
      category: 'Finance',
      icon: '💳',
      price: 999,
      features: ['Receipt Scanning', 'Auto-Categorization', 'Reimbursement Workflow', 'Mileage Tracking', 'Expense Reports']
    },

    // ============= E-COMMERCE & MARKETPLACE (7 apps) =============
    {
      name: 'Bougie Boutique',
      slug: 'bougie-boutique',
      description: 'Premium e-commerce platform with Printful integration. Sell custom branded merchandise with automated fulfillment.',
      category: 'E-commerce',
      icon: '🛍️',
      price: 1999,
      features: ['Printful Integration', 'Custom Branding', 'Automated Fulfillment', 'Inventory Management', 'Order Tracking']
    },
    {
      name: 'Marketplace Manager',
      slug: 'marketplace-manager',
      description: 'Multi-vendor marketplace platform. Manage vendors, products, orders, and commissions in one system.',
      category: 'E-commerce',
      icon: '🏪',
      price: 1999,
      features: ['Vendor Management', 'Commission Tracking', 'Product Catalog', 'Order Processing', 'Analytics Dashboard']
    },
    {
      name: 'Inventory Master',
      slug: 'inventory-master',
      description: 'Enterprise inventory management system. Track stock across multiple locations with real-time updates.',
      category: 'E-commerce',
      icon: '📦',
      price: 1699,
      features: ['Multi-Location', 'Barcode Scanning', 'Low Stock Alerts', 'Purchase Orders', 'Supplier Management']
    },
    {
      name: 'Pantry Inventory',
      slug: 'pantry-inventory',
      description: 'Smart inventory management for restaurants and food businesses. Track stock, reduce waste, and optimize ordering.',
      category: 'E-commerce',
      icon: '🍽️',
      price: 999,
      features: ['Real-Time Tracking', 'Expiration Alerts', 'Auto-Reordering', 'Waste Analytics', 'Recipe Costing']
    },
    {
      name: 'Order Management',
      slug: 'order-management',
      description: 'Centralized order processing and fulfillment system. Manage orders from multiple channels in one place.',
      category: 'E-commerce',
      icon: '📋',
      price: 1499,
      features: ['Multi-Channel Orders', 'Fulfillment Automation', 'Shipping Integration', 'Return Management', 'Order Tracking']
    },
    {
      name: 'Product Catalog',
      slug: 'product-catalog',
      description: 'Comprehensive product information management. Organize, enrich, and sync product data across channels.',
      category: 'E-commerce',
      icon: '📚',
      price: 1299,
      features: ['Product Database', 'Bulk Import/Export', 'Image Management', 'Variant Handling', 'Channel Sync']
    },
    {
      name: 'Shopify Integration',
      slug: 'shopify-integration',
      description: 'Seamless Shopify store integration. Sync products, orders, and inventory with your Shopify store.',
      category: 'E-commerce',
      icon: '🛒',
      price: 999,
      features: ['Product Sync', 'Order Import', 'Inventory Updates', 'Customer Data', 'Analytics Integration']
    },

    // ============= MARKETING & CONTENT (8 apps) =============
    {
      name: 'Marketing OS',
      slug: 'marketing-os',
      description: 'Complete marketing automation platform. Plan campaigns, manage content, and track performance across all channels.',
      category: 'Marketing',
      icon: '📢',
      price: 1999,
      features: ['Campaign Management', 'Content Calendar', 'Email Marketing', 'Social Media', 'Analytics Dashboard']
    },
    {
      name: 'YouTube Automation',
      slug: 'youtube-automation',
      description: 'AI-powered YouTube content creation and optimization. Automate video ideas, scripts, thumbnails, and analytics.',
      category: 'Marketing',
      icon: '🎥',
      price: 1499,
      features: ['AI Script Generation', 'Thumbnail Creator', 'SEO Optimization', 'Analytics Dashboard', 'Scheduling']
    },
    {
      name: 'Social Media Autopilot',
      slug: 'social-media-autopilot',
      description: 'Multi-platform social media automation with AI-generated content. Schedule, post, and analyze across all channels.',
      category: 'Marketing',
      icon: '📱',
      price: 1499,
      features: ['Multi-Platform Posting', 'AI Content Generation', 'Trend Analysis', 'Engagement Tracking', 'Approval Workflow']
    },
    {
      name: 'Copy of SYNDICA FORGE: Kayden Distribution Engine',
      slug: 'syndica-forge-copy',
      description: 'An ultra-premium automated vertical video distribution engine. Features AI trend scanning, automated script and voice generation, and a multi-platform approval/scheduling workflow for Facebook, TikTok, Instagram, and more.',
      category: 'Marketing',
      icon: '🎞️',
      price: 1499,
      features: ['AI Trend Scanning', 'Automated Script + Voice Generation', 'Vertical Video Assembly', 'Approval Workflow', 'Multi-Platform Scheduling'],
      prompt: `SYNDICA FORGE: Kayden Distribution Engine Mission Every morning, wake up to 3-5 fully rendered vertical videos (9:16) aligned to synckaiden.com's premium SYNDICA aesthetic. Approve/reject workflow before automated scheduling and posting to Facebook, YouTube Shorts, TikTok, Snapchat, and Instagram. Current Status: MVP v1.0 ✅ What's Been Built Backend (FastAPI + MongoDB) Complete REST API with all endpoints Authentication System (register/login) Database Models: Users, VideoDrafts, PostPlans, TrendItems, AffiliateOffers, Capabilities, PlatformCredentials, BrandSettings, DailyDirectives Core Routes: /api/auth - User authentication /api/dashboard - Status overview /api/trends - Trend scanning and retrieval /api/videos - Video draft approval workflow /api/schedule - Post scheduling /api/affiliates - Affiliate catalog CRUD /api/capabilities - Kayden capabilities library /api/settings - Brand settings + platform credentials /api/directive - Daily focus/avoid topics Frontend (React + Tailwind) Professional Dark Theme matching SYNDICA aesthetic (Azeret Mono + Manrope fonts) Complete Navigation with sidebar layout Pages Implemented: Login/Register with auth flow Dashboard with system status Trend Brief (daily trends display + scan trigger) Video Queue (approval workflow - placeholder) Scheduler (calendar view - placeholder) Affiliates (catalog management) Capabilities Library (searchable index - placeholder) Settings (brand + credentials - placeholder) Design System Ultra-professional encrypted/corporate aesthetic Dark theme (#050505 background, #0EA5E9 cyber blue primary) Monospace headings (Azeret Mono) + clean body text (Manrope) Minimal rounded corners, terminal-style UI High-contrast for readability 🚧 What Still Needs Implementation 1. Video Generation Pipeline (CRITICAL) Current: Placeholder endpoints exist Needed: Script generation using OpenAI GPT-5.2 (emergentintegrations library ready) Voice generation using ElevenLabs with 2+ voice profiles Visual assembly using A2E.ai (unlimited free) or stock footage APIs Caption burning with premium styling Thumbnail generation Storage (local or cloud) Files to Create: /app/backend/services/script_generator.py /app/backend/services/voice_generator.py /app/backend/services/video_assembler.py 2. Trend Scanner (CRITICAL) Current: Placeholder with sample trends Needed: YouTube Trends API integration TikTok trends (official/approved sources) Google Trends API Risk flag detection (copyright, sensitive topics) Audience fit scoring algorithm Files to Create: /app/backend/services/trend_scanner.py 3. Platform Publishing (CRITICAL) Current: Schedule storage only Needed: YouTube Shorts API (YouTube Data API v3) TikTok Content Posting API Facebook/Instagram Graph API (Reels publishing) Snapchat API (assisted publish workflow) Rate limit handling Retry logic Status tracking Files to Create: /app/backend/services/publishers/youtube_publisher.py /app/backend/services/publishers/tiktok_publisher.py /app/backend/services/publishers/meta_publisher.py /app/backend/services/publishers/snapchat_publisher.py 4. Daily Automation Pipeline (CRITICAL) Current: Manual trigger endpoints Needed: APScheduler job running at 5 AM daily Sequential execution: trend scan → script gen → voice gen → video assembly → queue for approval Error handling and notifications Directive integration Files to Create: /app/backend/services/daily_pipeline.py 5. Best-Time Scheduler (HIGH PRIORITY) Current: Basic scheduling Needed: Platform analytics integration Historical performance tracking Optimal time calculation Fallback heuristics 6. Affiliate Link Engine (MEDIUM PRIORITY) Current: CRUD operations for offers Needed: Smart selection algorithm (category match, EPC priority) FTC disclosure insertion Link tracking (optional) 7. Analytics & Monitoring (MEDIUM PRIORITY) Current: None Needed: Views, watch time, retention tracking per platform Performance drop detection (>30% decline alert) Audit logs Export capabilities 8. Embed Widget (LOW PRIORITY) Current: None Needed: Standalone React component for synckaiden.com Today's trend brief summary Approval queue interface Directive input box Latest approved videos display 9. Platform Credentials UI (MEDIUM PRIORITY) Current: API endpoints ready, UI placeholder Needed: Secure form inputs for each platform Credential validation Masked display Platform connection status indicators 10. Video Queue UI Enhancement (HIGH PRIORITY) Current: Placeholder Needed: Video preview player (9:16 aspect ratio) Platform-specific caption display Approve/Reject/Edit controls Regeneration with notes Affiliate offer display Setup Instructions Prerequisites API Keys Required: OpenAI API Key (or use EMERGENT_LLM_KEY - already configured) ElevenLabs API Key (for voice generation) YouTube API Credentials (Client ID, Client Secret) TikTok Developer Account (for Content Posting API) Meta/Facebook API Credentials (for Graph API) Snapchat API Credentials (if available) Local Setup Backend is already running on http://0.0.0.0:8001 Frontend runs on http://localhost:3000 MongoDB connected at mongodb://localhost:27017 First Run Register an account at /login Navigate to Dashboard - see system status Go to Trends - click "SCAN TRENDS" to populate sample trends Configure Platform Credentials in Settings (when UI is built) Environment Variables Already configured in /app/backend/.env: MONGO_URL=mongodb://localhost:27017 DB_NAME=syndica_forge CORS_ORIGINS=* EMERGENT_LLM_KEY=sk-emergent-52dCa033268Bd9bDb1 Add your API keys: ELEVENLABS_API_KEY=your_key_here YOUTUBE_CLIENT_ID=your_id_here YOUTUBE_CLIENT_SECRET=your_secret_here # ... other platform credentials Tech Stack Backend FastAPI - Modern Python web framework Motor - Async MongoDB driver Pydantic - Data validation emergentintegrations - LLM integration (GPT-5.2) ElevenLabs SDK - Voice generation APScheduler - Task scheduling Google API Client - YouTube integration Frontend React 19 - UI framework React Router - Navigation Tailwind CSS - Styling Shadcn UI - Component library Axios - HTTP client Sonner - Toast notifications Lucide React - Icons Database MongoDB - Document store for flexible schema API Documentation Authentication POST /api/auth/register - Create new user POST /api/auth/login - Login and get token Dashboard GET /api/dashboard/status - Get system status overview Trends GET /api/trends/daily - Get today's trends POST /api/trends/scan - Trigger trend scanning Videos GET /api/videos/queue - Get videos pending approval POST /api/videos/approve/{video_id} - Approve video POST /api/videos/reject/{video_id} - Reject video POST /api/videos/generate - Trigger video generation Schedule GET /api/schedule/posts - Get all scheduled posts POST /api/schedule/create - Schedule a new post Affiliates GET /api/affiliates - Get all offers POST /api/affiliates - Create offer PUT /api/affiliates/{id} - Update offer DELETE /api/affiliates/{id} - Delete offer Capabilities GET /api/capabilities?search=query - Search capabilities POST /api/capabilities - Add capability Settings GET /api/settings/brand - Get brand settings PUT /api/settings/brand - Update brand settings GET /api/settings/credentials - Get platform credentials (masked) POST /api/settings/credentials - Save platform credentials Directive GET /api/directive/today - Get today's directive POST /api/directive - Save new directive Database Collections users - User accounts video_drafts - Generated videos awaiting approval post_plans - Scheduled posts trends - Daily trend briefs affiliate_offers - Affiliate catalog capabilities - Kayden capabilities library platform_credentials - API keys (encrypted storage recommended) brand_settings - Visual brand configuration directives - Daily focus/avoid topics Deployment Guide Option 1: Docker (Recommended) Create Dockerfile: FROM python:3.11-slim WORKDIR /app COPY backend/requirements.txt . RUN pip install -r requirements.txt COPY backend . CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"] Create docker-compose.yml: version: '3.8' services: backend: build: ./backend ports: - "8001:8001" environment: - MONGO_URL=mongodb://mongo:27017 - DB_NAME=syndica_forge depends_on: - mongo mongo: image: mongo:7 ports: - "27017:27017" volumes: - mongodb_data:/data/db frontend: build: ./frontend ports: - "3000:3000" environment: - REACT_APP_BACKEND_URL=http://localhost:8001 volumes: mongodb_data: Run: docker-compose up -d Option 2: Cloud Deployment Backend: Deploy to Heroku, Railway, or AWS EC2 Frontend: Deploy to Vercel, Netlify, or Cloudflare Pages Database: MongoDB Atlas (free tier available) Day 1 Test Plan Checklist 1. Authentication (5 min) Register new account Logout Login with credentials Verify redirect to dashboard 2. Dashboard (5 min) Check stat cards display Verify system status indicators Confirm no errors in console 3. Trends (10 min) Click "SCAN TRENDS" button Wait 3 seconds and verify trends appear Check trend cards show source, title, summary Verify suggested angles display Confirm audience fit scores visible 4. Navigation (5 min) Test all sidebar links Verify active state highlighting Check responsive behavior (if mobile) Test logout button 5. Affiliates (10 min) View empty state message Click "ADD OFFER" (placeholder) Verify page loads without errors 6. API Testing (10 min) API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2) # Register curl -X POST "$API_URL/api/auth/register" \\ -H "Content-Type: application/json" \\ -d '{"email":"test@example.com","password":"test123"}' # Login curl -X POST "$API_URL/api/auth/login" \\ -H "Content-Type: application/json" \\ -d '{"email":"test@example.com","password":"test123"}' # Dashboard Status curl "$API_URL/api/dashboard/status" # Trigger Trend Scan curl -X POST "$API_URL/api/trends/scan" 7. Console & Network (5 min) Open browser DevTools Check for no errors in Console tab Verify API calls return 200/201 status codes Confirm MongoDB connections successful Next Steps & Priorities Phase 1: Core Automation (Week 1-2) Implement video generation pipeline Integrate OpenAI GPT-5.2 for scripts Integrate ElevenLabs for voice Connect A2E.ai or stock footage for visuals Build approval UI with video player Phase 2: Publishing (Week 3) Implement YouTube Shorts publishing Add TikTok Content API integration Connect Meta Graph API for Facebook/Instagram Build scheduler with best-time logic Phase 3: Intelligence (Week 4) Real trend scanner with API integrations Analytics tracking per platform Performance monitoring and alerts Affiliate selection algorithm Phase 4: Polish & Scale (Week 5+) Embed widget for synckaiden.com Enhanced UI/UX with animations Bulk operations Export capabilities Mobile optimization Troubleshooting Backend Not Starting tail -100 /var/log/supervisor/backend.err.log Frontend Not Loading cd /app/frontend yarn start MongoDB Connection Issues sudo systemctl status mongod sudo systemctl start mongod API Key Issues Verify .env file has correct format (no quotes for most keys) Restart backend after adding new keys: sudo supervisorctl restart backend Support & Resources Emergent LLM Key: Already configured for OpenAI/Gemini/Claude text generation Design Guidelines: /app/design_guidelines.json Backend Logs: /var/log/supervisor/backend.*.log Frontend Port: http://localhost:3000 Backend Port: http://localhost:8001 API Docs: http://localhost:8001/docs (FastAPI auto-generated) Contact & Feedback This MVP provides the foundation for SYNDICA FORGE. All core infrastructure, routing, and data models are in place. The next critical step is implementing the video generation pipeline and platform publishing integrations. What's Working Now: ✅ Full authentication flow ✅ Dashboard with system status ✅ Trend scanning (sample data) ✅ Database models for all entities ✅ REST API for all operations ✅ Professional UI with SYNDICA aesthetic What Needs Your Input: 🔑 API keys for platforms (YouTube, TikTok, Meta, ElevenLabs) 🎨 Brand assets (logo, watermark) 📝 Kayden capabilities CSV/JSON (300-400 items) 🔗 Affiliate offers you want to promote Once you test the MVP and provide API keys, I can implement the video generation and publishing pipelines to make this fully automated! About No description, website, or topics provided. Resources Readme Activity Stars 0 stars Watchers 0 watching Forks 0 forks Releases No releases published Create a new release Packages No packages published Publish your first package Languages JavaScript 74.8% Python 21.4% HTML 3.5% CSS 0.3% Suggested workflows Based on your tech stack Django logo Django Build and Test a Django Project Pylint logo Pylint Lint a Python application with pylint. Deno logo Deno Test your Deno project More workflows Footer © 2026 GitHub, Inc. Footer navigation Terms Privacy Security`
    },
    {
      name: 'Email Marketing Pro',
      slug: 'email-marketing-pro',
      description: 'Professional email marketing automation. Design campaigns, segment audiences, and track performance.',
      category: 'Marketing',
      icon: '✉️',
      price: 1299,
      features: ['Drag-Drop Builder', 'A/B Testing', 'Segmentation', 'Automation Workflows', 'Analytics']
    },
    {
      name: 'Video Production Suite',
      slug: 'video-production',
      description: 'Complete video creation and editing platform. AI-powered video generation, editing, and optimization.',
      category: 'Marketing',
      icon: '🎬',
      price: 1999,
      features: ['AI Video Generation', 'Template Library', 'Auto-Editing', 'Subtitle Generation', 'Multi-Format Export']
    },
    {
      name: 'Website Builder',
      slug: 'website-builder',
      description: 'Drag-and-drop website builder with AI assistance. Create professional websites without coding.',
      category: 'Marketing',
      icon: '🌐',
      price: 1499,
      features: ['Drag-Drop Editor', 'AI Design Assistant', 'Template Library', 'SEO Tools', 'Mobile Responsive']
    },
    {
      name: 'Template Library',
      slug: 'template-library',
      description: 'Extensive collection of business document templates. Contracts, proposals, forms, and more.',
      category: 'Marketing',
      icon: '📄',
      price: 999,
      features: ['1000+ Templates', 'Customizable', 'Legal Reviewed', 'Industry Specific', 'Version Control']
    },
    {
      name: 'Creative Clash Live',
      slug: 'creative-clash-live',
      description: 'Live streaming platform for creative competitions and events. Engage audiences with real-time voting and rewards.',
      category: 'Marketing',
      icon: '🎨',
      price: 1499,
      features: ['Live Streaming', 'Audience Voting', 'Prize Management', 'Analytics', 'Multi-Camera Support']
    },

    // ============= CUSTOMER SERVICE (4 apps) =============
    {
      name: 'AI Receptionist (Avery)',
      slug: 'ai-receptionist',
      description: 'Intelligent virtual receptionist powered by AI. Handle calls, schedule appointments, and manage inquiries 24/7.',
      category: 'Customer Service',
      icon: '📞',
      price: 1999,
      features: ['24/7 Availability', 'Call Routing', 'Appointment Scheduling', 'Multi-Language Support', 'CRM Integration']
    },
    {
      name: 'Help Desk',
      slug: 'help-desk',
      description: 'Customer support ticket management system. Track, prioritize, and resolve customer issues efficiently.',
      category: 'Customer Service',
      icon: '🎫',
      price: 1499,
      features: ['Ticket Management', 'Knowledge Base', 'Live Chat', 'SLA Tracking', 'Customer Portal']
    },
    {
      name: 'Live Chat Support',
      slug: 'live-chat',
      description: 'Real-time chat support with AI assistance. Engage website visitors and convert them into customers.',
      category: 'Customer Service',
      icon: '💬',
      price: 1299,
      features: ['Real-Time Chat', 'AI Suggestions', 'Canned Responses', 'Visitor Tracking', 'Chat History']
    },
    {
      name: 'Feedback Manager',
      slug: 'feedback-manager',
      description: 'Collect and analyze customer feedback. Surveys, reviews, and sentiment analysis in one platform.',
      category: 'Customer Service',
      icon: '⭐',
      price: 999,
      features: ['Survey Builder', 'Review Management', 'Sentiment Analysis', 'Response Automation', 'Insights Dashboard']
    },

    // ============= HEALTH & WELLNESS (3 apps) =============
    {
      name: 'VitalSync Health',
      slug: 'vitalsync-health',
      description: 'Personal health tracking and wellness management. Monitor vitals, medications, and appointments in one place.',
      category: 'Health',
      icon: '❤️',
      price: 999,
      features: ['Vital Monitoring', 'Medication Reminders', 'Appointment Tracking', 'Health Reports', 'Doctor Portal']
    },
    {
      name: 'HealthSync Scribe',
      slug: 'healthsync-scribe',
      description: 'Medical transcription and documentation assistant. Convert patient conversations into structured SOAP notes.',
      category: 'Health',
      icon: '🏥',
      price: 1999,
      features: ['Voice Transcription', 'SOAP Note Generation', 'ICD-10 Coding', 'EHR Integration', 'HIPAA Compliant']
    },
    {
      name: 'Medical Billing',
      slug: 'medical-billing',
      description: 'Healthcare billing and claims management. Automate medical billing, coding, and insurance claims.',
      category: 'Health',
      icon: '💊',
      price: 1999,
      features: ['Claims Processing', 'Insurance Verification', 'Coding Assistance', 'Payment Tracking', 'Compliance Tools']
    },

    // ============= EDUCATION & LEARNING (2 apps) =============
    {
      name: 'Atlas Academy',
      slug: 'atlas-academy',
      description: 'Online learning platform for entrepreneurs. Access courses, workshops, and mentorship programs.',
      category: 'Education',
      icon: '🎓',
      price: 1499,
      features: ['Video Courses', 'Live Workshops', 'Mentorship Matching', 'Progress Tracking', 'Certificates']
    },
    {
      name: 'Grant Finder & Writer',
      slug: 'grant-finder',
      description: 'Find and apply for business grants with AI assistance. Match with grants and generate winning applications.',
      category: 'Education',
      icon: '📝',
      price: 1999,
      features: ['Grant Database', 'Matching Algorithm', 'Application Writer', 'Deadline Tracking', 'Success Analytics']
    },

    // ============= LEGAL & PROFESSIONAL (4 apps) =============
    {
      name: 'Professional Directory',
      slug: 'professional-directory',
      description: 'Search and connect with verified attorneys and CPAs by state. Find legal and financial professionals.',
      category: 'Legal',
      icon: '⚖️',
      price: 999,
      features: ['Attorney Search', 'CPA Search', 'Bar Verification', 'Ratings & Reviews', 'Free Consultation Matching']
    },
    {
      name: 'Virtual Notary',
      slug: 'virtual-notary',
      description: 'Online notary services with video verification. Notarize documents remotely with legal validity.',
      category: 'Legal',
      icon: '📜',
      price: 1499,
      features: ['Video Notarization', 'Document Upload', 'Identity Verification', 'Digital Seal', 'Audit Trail']
    },
    {
      name: 'Contract Manager',
      slug: 'contract-manager',
      description: 'Contract lifecycle management system. Create, negotiate, sign, and manage all business contracts.',
      category: 'Legal',
      icon: '📋',
      price: 1699,
      features: ['Contract Templates', 'E-Signature', 'Version Control', 'Renewal Alerts', 'Compliance Tracking']
    },
    {
      name: 'Credit Repair Tools',
      slug: 'credit-repair',
      description: 'Comprehensive credit repair and dispute management. Generate dispute letters and track credit improvement.',
      category: 'Legal',
      icon: '🔧',
      price: 1299,
      features: ['Dispute Letter Generator', 'Bureau Tracking', 'Credit Monitoring', 'Action Plans', 'Success Tracking']
    },

    // ============= COMMUNITY & SOCIAL (2 apps) =============
    {
      name: "Where's My Tribe",
      slug: 'wheres-my-tribe',
      description: 'Community matching and event platform. Find your people, create events, and build meaningful connections.',
      category: 'Community',
      icon: '🌟',
      price: 999,
      features: ['Member Matching', 'Event Creation', 'Real-Time Chat', 'Location-Based Discovery', 'Rating System']
    },
    {
      name: 'Kaiden Sync Onboarding',
      slug: 'kaiden-sync',
      description: 'Personalized onboarding with psychological profiling. Complete personality assessment and get tailored recommendations.',
      category: 'Community',
      icon: '🧠',
      price: 1499,
      features: ['Personality Assessment', 'AI Analysis', 'Custom Recommendations', 'Progress Tracking', 'Smith Personality Integration']
    },

    // ============= PRODUCTIVITY & TOOLS (5 apps) =============
    {
      name: 'Scheduler Pro',
      slug: 'scheduler-pro',
      description: 'Advanced appointment scheduling and calendar management. Sync calendars and automate booking.',
      category: 'Productivity',
      icon: '📅',
      price: 1299,
      features: ['Calendar Sync', 'Booking Pages', 'Automated Reminders', 'Time Zone Support', 'Team Scheduling']
    },
    {
      name: 'Audio Mastering',
      slug: 'audio-mastering',
      description: 'AI-powered audio enhancement and mastering. Professional audio quality with one-click processing.',
      category: 'Productivity',
      icon: '🎵',
      price: 1499,
      features: ['AI Mastering', 'Noise Reduction', 'EQ Optimization', 'Loudness Normalization', 'Batch Processing']
    },
    {
      name: 'SpamSlayer',
      slug: 'spamslayer',
      description: 'Advanced email spam filtering and protection. AI-powered spam detection with whitelist/blacklist management.',
      category: 'Productivity',
      icon: '🛡️',
      price: 999,
      features: ['AI Spam Detection', 'Whitelist/Blacklist', 'Phishing Protection', 'Bulk Actions', 'Learning Algorithm']
    },
    {
      name: 'Security Scanner',
      slug: 'security-scanner',
      description: 'Comprehensive security threat scanning and monitoring. Protect your business from cyber threats.',
      category: 'Productivity',
      icon: '🔒',
      price: 1999,
      features: ['Threat Detection', 'Vulnerability Scanning', 'Real-Time Monitoring', 'Compliance Checks', 'Security Reports']
    },
    {
      name: 'Analytics Dashboard',
      slug: 'analytics-dashboard',
      description: 'Unified analytics dashboard for all business metrics. Track KPIs and performance across all systems.',
      category: 'Productivity',
      icon: '📊',
      price: 1699,
      features: ['Multi-Source Data', 'Custom Dashboards', 'Real-Time Updates', 'Export Reports', 'Alert System']
    },

    // ============= INTEGRATIONS & SETTINGS (2 apps) =============
    {
      name: 'Integrations Hub',
      slug: 'integrations-hub',
      description: 'Manage all third-party integrations in one place. Connect with 1000+ tools and services.',
      category: 'Integrations',
      icon: '🔌',
      price: 999,
      features: ['1000+ Integrations', 'API Management', 'Webhook Configuration', 'OAuth Setup', 'Connection Monitoring']
    },
    {
      name: 'Subscription Manager',
      slug: 'subscription-manager',
      description: 'Manage all your Synckaiden subscriptions and billing. View usage, update payment methods, and track spending.',
      category: 'Integrations',
      icon: '💳',
      price: 0, // Free - included with platform
      features: ['Billing History', 'Usage Analytics', 'Payment Methods', 'Plan Management', 'Invoice Download']
    }
  ];

  console.log(`Creating ${apps.length} apps...\n`);

  for (const app of apps) {
    // Insert product
    const [productResult] = await connection.execute(`
      INSERT INTO products (name, slug, description, type, category, status, features, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      app.name,
      app.slug,
      app.description,
      'app',
      app.category,
      'active',
      JSON.stringify(app.features),
      JSON.stringify({ 
        icon: app.icon
      })
    ]);
    const productId = productResult.insertId;

    // Insert price (skip for free apps)
    if (app.price > 0) {
      await connection.execute(
        'INSERT INTO prices (productId, amount, currency, `interval`, active, stripePriceId) VALUES (?, ?, ?, ?, ?, ?)',
        [productId, app.price, 'USD', 'month', true, `price_${app.slug}_monthly`]
      );
    }

    // Insert app registry entry
    const metadata = {
      features: app.features,
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      ...(app.prompt ? { prompt: app.prompt } : {})
    };

    await connection.execute(`
      INSERT INTO appRegistry (name, slug, description, category, icon, productId, status, dashboardPath, setupPath, tutorialPath, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      app.name,
      app.slug,
      app.description,
      app.category,
      app.icon,
      productId,
      'active',
      `/apps/${app.slug}/dashboard`,
      `/apps/${app.slug}/setup`,
      `/apps/${app.slug}/tutorial`,
      JSON.stringify(metadata)
    ]);

    const priceDisplay = app.price > 0 ? `$${(app.price / 100).toFixed(2)}/mo` : 'FREE';
    console.log(`✅ Created: ${app.name} (${priceDisplay}) - ${app.category}`);
  }

  console.log('\n✨ Database seeding completed successfully!\n');
  console.log('Summary:');
  console.log(`- 1 Bundle: Sync Bundle ($39.99/mo)`);
  console.log(`- ${apps.length} Apps across ${new Set(apps.map(a => a.category)).size} categories`);
  console.log(`- Total products: ${apps.length + 1}`);
  console.log('\nCategories:');
  const categories = {};
  apps.forEach(app => {
    categories[app.category] = (categories[app.category] || 0) + 1;
  });
  Object.entries(categories).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count} apps`);
  });

} catch (error) {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
} finally {
  await connection.end();
}
