-- GATE 8 Platforms and Subscriptions Schema

-- Platforms table
CREATE TABLE IF NOT EXISTS platforms (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_pro DECIMAL(10, 2) NOT NULL,
  price_enterprise DECIMAL(10, 2) NOT NULL,
  app_count INTEGER NOT NULL,
  features JSONB,
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Platform apps mapping
CREATE TABLE IF NOT EXISTS platform_apps (
  id SERIAL PRIMARY KEY,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
  app_slug VARCHAR(255) NOT NULL,
  app_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User platform subscriptions
CREATE TABLE IF NOT EXISTS user_platform_subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('pro', 'enterprise')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, platform_id)
);

-- Platform usage tracking (for API call limits)
CREATE TABLE IF NOT EXISTS platform_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  platform_id INTEGER REFERENCES platforms(id) ON DELETE CASCADE,
  app_slug VARCHAR(255) NOT NULL,
  usage_type VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_platform_subs_user_id ON user_platform_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_platform_subs_platform_id ON user_platform_subscriptions(platform_id);
CREATE INDEX IF NOT EXISTS idx_user_platform_subs_status ON user_platform_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_platform_apps_platform_id ON platform_apps(platform_id);
CREATE INDEX IF NOT EXISTS idx_platform_usage_user_platform ON platform_usage(user_id, platform_id);

-- Insert the 8 GATE platforms
INSERT INTO platforms (slug, name, description, price_pro, price_enterprise, app_count, is_free, features) VALUES
('ai-intelligence-suite', 'AI Intelligence Suite', 'Advanced AI tools for chat, content generation, and voice authentication', 39.99, 99.99, 5, FALSE, '["AI Chat", "Agent Swarm", "Content Engine", "AI Arena", "Voice Auth"]'),
('sales-marketing-command', 'Sales & Marketing Command Center', 'Complete CRM, marketing automation, and social media management', 49.99, 99.99, 13, FALSE, '["CRM", "Marketing OS", "Social Media", "YouTube", "Email Marketing", "Video Marketing", "Ads Suite", "Website Builder", "Templates", "Lead Management", "Sales Pipeline", "YouTube Channel", "YouTube Manager"]'),
('financial-command', 'Financial Command Center', 'Comprehensive financial management, tax planning, and wealth building', 49.99, 99.99, 8, FALSE, '["Financial Co-Pilot", "Tax App", "Estate Planning", "Invoicing", "Funding", "Wealth Building", "Grants", "Cost Optimization"]'),
('business-operations', 'Business Operations Hub', 'Complete business management, analytics, and workflow automation', 49.99, 99.99, 10, FALSE, '["Business Hub", "Analytics", "Project Management", "LLC Formation", "Business Tools", "Business Command", "New Business Guide", "Workspace Management", "Integrations", "Team Hub"]'),
('hr-people-management', 'HR & People Management', 'Employee management and psychological profiling tools', 39.99, 99.99, 2, FALSE, '["Employee OS", "Psychological Profiling (FREE with login)"]'),
('ecommerce-marketplace', 'E-Commerce & Marketplace', 'Full e-commerce platform with inventory and order management', 49.99, 99.99, 7, FALSE, '["Boutique", "Marketplace", "Inventory", "Orders", "Shop", "Products", "Shopify Integration"]'),
('customer-experience', 'Customer Experience Suite', 'AI receptionist, help desk, and customer feedback management', 39.99, 99.99, 4, FALSE, '["AI Receptionist", "Help Desk", "Live Chat", "Feedback Manager"]'),
('professional-services', 'Professional Services Suite', 'Healthcare, education, legal, and professional service tools', 49.99, 99.99, 13, FALSE, '["Healthcare Scribe", "Healthcare Billing", "Health Sync Scribe", "Education/Academy", "Notary", "Legal Professionals", "Community", "VIP Directory", "Side Hustle", "Creative Clash Live", "Pantry Inventory", "Audio Mastering", "Spam Slayer"]'),
('security-infrastructure', 'Security & Infrastructure', 'Security tools and infrastructure management (FREE with any platform)', 0.00, 0.00, 5, TRUE, '["Security", "Threat Scan", "Secrets Management", "Settings", "Capability Store"]');

-- Insert platform app mappings
-- AI Intelligence Suite
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'ai-intelligence-suite'), 'chat', 'AI Chat'),
((SELECT id FROM platforms WHERE slug = 'ai-intelligence-suite'), 'agent-swarm', 'Agent Swarm'),
((SELECT id FROM platforms WHERE slug = 'ai-intelligence-suite'), 'creative-engine', 'Content Engine'),
((SELECT id FROM platforms WHERE slug = 'ai-intelligence-suite'), 'ai-arena', 'AI Arena'),
((SELECT id FROM platforms WHERE slug = 'ai-intelligence-suite'), 'voice-auth', 'Voice Auth');

-- Sales & Marketing Command Center
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'crm', 'CRM'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'marketing-os', 'Marketing OS'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'social-media', 'Social Media'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'youtube', 'YouTube'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'marketing', 'Email Marketing'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'videos', 'Video Marketing'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'ads', 'Ads Suite'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'websites', 'Website Builder'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'templates', 'Templates'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'leads', 'Lead Management'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'sales', 'Sales Pipeline'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'youtube-channel', 'YouTube Channel'),
((SELECT id FROM platforms WHERE slug = 'sales-marketing-command'), 'youtube-manager', 'YouTube Manager');

-- Financial Command Center
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'financial-command'), 'finance', 'Financial Co-Pilot'),
((SELECT id FROM platforms WHERE slug = 'financial-command'), 'tax', 'Tax App'),
((SELECT id FROM platforms WHERE slug = 'financial-command'), 'dynasty-trust', 'Estate Planning'),
((SELECT id FROM platforms WHERE slug = 'financial-command'), 'contracts', 'Invoicing'),
((SELECT id FROM platforms WHERE slug = 'financial-command'), 'ai-funding', 'Funding'),
((SELECT id FROM platforms WHERE slug = 'financial-command'), 'business-credit', 'Wealth Building'),
((SELECT id FROM platforms WHERE slug = 'financial-command'), 'grants', 'Grants'),
((SELECT id FROM platforms WHERE slug = 'financial-command'), 'cost-reduction', 'Cost Optimization');

-- Business Operations Hub
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'business', 'Business Hub'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'analytics', 'Analytics'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'workflows', 'Project Management'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'llc-formation', 'LLC Formation'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'business-tools', 'Business Tools'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'business-command', 'Business Command'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'new-business', 'New Business Guide'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'workspaces', 'Workspace Management'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'integrations', 'Integrations'),
((SELECT id FROM platforms WHERE slug = 'business-operations'), 'team', 'Team Hub');

-- HR & People Management
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'hr-people-management'), 'employees', 'Employee OS'),
((SELECT id FROM platforms WHERE slug = 'hr-people-management'), 'personality-sync', 'Psychological Profiling');

-- E-Commerce & Marketplace
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'ecommerce-marketplace'), 'boutique', 'Boutique'),
((SELECT id FROM platforms WHERE slug = 'ecommerce-marketplace'), 'marketplace', 'Marketplace'),
((SELECT id FROM platforms WHERE slug = 'ecommerce-marketplace'), 'inventory', 'Inventory'),
((SELECT id FROM platforms WHERE slug = 'ecommerce-marketplace'), 'orders', 'Orders'),
((SELECT id FROM platforms WHERE slug = 'ecommerce-marketplace'), 'shop', 'Shop'),
((SELECT id FROM platforms WHERE slug = 'ecommerce-marketplace'), 'products', 'Products'),
((SELECT id FROM platforms WHERE slug = 'ecommerce-marketplace'), 'shopify-settings', 'Shopify Integration');

-- Customer Experience Suite
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'customer-experience'), 'chat', 'AI Receptionist'),
((SELECT id FROM platforms WHERE slug = 'customer-experience'), 'contact', 'Help Desk'),
((SELECT id FROM platforms WHERE slug = 'customer-experience'), 'scheduler', 'Live Chat'),
((SELECT id FROM platforms WHERE slug = 'customer-experience'), 'request-app', 'Feedback Manager');

-- Professional Services Suite
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'medical-billing', 'Healthcare Billing'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'healthsync-scribe', 'Health Sync Scribe'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'atlas-academy', 'Education/Academy'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'virtual-notary', 'Notary'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'professionals', 'Legal Professionals'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'coxandco', 'Community'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'vip-directory', 'VIP Directory'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'side-hustle', 'Side Hustle'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'creative-clash', 'Creative Clash Live'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'pantry', 'Pantry Inventory'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'audio-mastering', 'Audio Mastering'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'spam-slayer', 'Spam Slayer'),
((SELECT id FROM platforms WHERE slug = 'professional-services'), 'avery-ai', 'Avery AI');

-- Security & Infrastructure (FREE)
INSERT INTO platform_apps (platform_id, app_slug, app_name) VALUES
((SELECT id FROM platforms WHERE slug = 'security-infrastructure'), 'security', 'Security'),
((SELECT id FROM platforms WHERE slug = 'security-infrastructure'), 'threat-scan', 'Threat Scan'),
((SELECT id FROM platforms WHERE slug = 'security-infrastructure'), 'admin/secrets', 'Secrets Management'),
((SELECT id FROM platforms WHERE slug = 'security-infrastructure'), 'settings', 'Settings'),
((SELECT id FROM platforms WHERE slug = 'security-infrastructure'), 'store', 'Capability Store');
