import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('🌱 Seeding database with products, apps, and prices...\n');

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
    'Unlock unlimited access to all Synckaiden apps. Save over 50% compared to individual subscriptions.',
    'bundle',
    'active',
    JSON.stringify({ featured: true, badge: 'BEST VALUE' })
  ]);
  const bundleId = bundleResult.insertId;

  // Insert Sync Bundle Price
  await connection.execute(
    'INSERT INTO prices (productId, amount, currency, `interval`, active, stripePriceId) VALUES (?, ?, ?, ?, ?, ?)',
    [bundleId, 3999, 'USD', 'month', true, 'price_sync_bundle_monthly']
  );

  // Define all apps
  const apps = [
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
      name: 'YouTube Automation',
      slug: 'youtube-automation',
      description: 'AI-powered YouTube content creation and optimization. Automate video ideas, scripts, thumbnails, and analytics.',
      category: 'Content Creation',
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
      name: 'AI Receptionist',
      slug: 'ai-receptionist',
      description: 'Intelligent virtual receptionist powered by AI. Handle calls, schedule appointments, and manage inquiries 24/7.',
      category: 'Customer Service',
      icon: '📞',
      price: 1999,
      features: ['24/7 Availability', 'Call Routing', 'Appointment Scheduling', 'Multi-Language Support', 'CRM Integration']
    },
    {
      name: 'Pantry Inventory',
      slug: 'pantry-inventory',
      description: 'Smart inventory management for restaurants and food businesses. Track stock, reduce waste, and optimize ordering.',
      category: 'Operations',
      icon: '🍽️',
      price: 999,
      features: ['Real-Time Tracking', 'Expiration Alerts', 'Auto-Reordering', 'Waste Analytics', 'Recipe Costing']
    },
    {
      name: 'Creative Clash Live',
      slug: 'creative-clash-live',
      description: 'Live streaming platform for creative competitions and events. Engage audiences with real-time voting and rewards.',
      category: 'Entertainment',
      icon: '🎨',
      price: 1499,
      features: ['Live Streaming', 'Audience Voting', 'Prize Management', 'Analytics', 'Multi-Camera Support']
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
      name: 'Comprehensive Tax App',
      slug: 'comprehensive-tax-app',
      description: 'Automated tax preparation and filing for businesses. Stay compliant with real-time tax calculations and reporting.',
      category: 'Finance',
      icon: '📊',
      price: 1499,
      features: ['Automated Filing', 'Deduction Finder', 'Multi-State Support', 'Audit Protection', 'Quarterly Estimates']
    },
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
      name: 'Agent Swarm',
      slug: 'agent-swarm',
      description: 'Deploy multiple AI agents to handle complex workflows. Coordinate tasks across teams and automate processes.',
      category: 'Automation',
      icon: '🤖',
      price: 1999,
      features: ['Multi-Agent Coordination', 'Workflow Automation', 'Task Delegation', 'Performance Analytics', 'Custom Agents']
    },
    {
      name: 'Kaiden Academy',
      slug: 'kaiden-academy',
      description: 'Online learning platform for entrepreneurs. Access courses, workshops, and mentorship programs.',
      category: 'Education',
      icon: '🎓',
      price: 1499,
      features: ['Video Courses', 'Live Workshops', 'Mentorship Matching', 'Progress Tracking', 'Certificates']
    },
    {
      name: 'Business Analyzer',
      slug: 'business-analyzer',
      description: 'Comprehensive business intelligence and analytics. Get insights from your data with AI-powered recommendations.',
      category: 'Analytics',
      icon: '📈',
      price: 1499,
      features: ['Real-Time Dashboards', 'Predictive Analytics', 'Custom Reports', 'Data Integration', 'AI Insights']
    },
    {
      name: 'Project Nexus',
      slug: 'project-nexus',
      description: 'Advanced project management with AI assistance. Plan, track, and deliver projects on time and budget.',
      category: 'Productivity',
      icon: '📋',
      price: 1299,
      features: ['Gantt Charts', 'Resource Allocation', 'Time Tracking', 'Budget Management', 'Team Collaboration']
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
      name: 'Customer Insights',
      slug: 'customer-insights',
      description: 'Deep customer analytics and behavior tracking. Understand your audience and improve retention.',
      category: 'Analytics',
      icon: '👥',
      price: 1499,
      features: ['Behavior Tracking', 'Cohort Analysis', 'Churn Prediction', 'Sentiment Analysis', 'Custom Segments']
    },
    {
      name: 'Inventory Master',
      slug: 'inventory-master',
      description: 'Enterprise inventory management system. Track stock across multiple locations with real-time updates.',
      category: 'Operations',
      icon: '📦',
      price: 1699,
      features: ['Multi-Location', 'Barcode Scanning', 'Low Stock Alerts', 'Purchase Orders', 'Supplier Management']
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

    // Insert price
    await connection.execute(
      'INSERT INTO prices (productId, amount, currency, `interval`, active, stripePriceId) VALUES (?, ?, ?, ?, ?, ?)',
      [productId, app.price, 'USD', 'month', true, `price_${app.slug}_monthly`]
    );

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

    console.log(`✅ Created: ${app.name} ($${(app.price / 100).toFixed(2)}/mo)`);
  }

  console.log('\n✨ Database seeding completed successfully!\n');
  console.log('Summary:');
  console.log(`- 1 Bundle: Sync Bundle ($39.99/mo)`);
  console.log(`- ${apps.length} Apps: $9.99 - $19.99/mo each`);
  console.log(`- Total products: ${apps.length + 1}`);

} catch (error) {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
} finally {
  await connection.end();
}
