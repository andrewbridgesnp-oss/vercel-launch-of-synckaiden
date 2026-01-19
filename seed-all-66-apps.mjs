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
    [bundleId, 3999, 'USD', 'month', true, 'price_sync_bundle_monthly']
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
      price: 2499,
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
      price: 2499,
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
      price: 2499,
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
      price: 2499,
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
      JSON.stringify({ 
        features: app.features,
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      })
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
