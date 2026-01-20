import { useState } from 'react';
import { Search, Star, Download, Play, Eye, GitBranch, TrendingUp, Filter, Grid3x3, List } from 'lucide-react';

interface N8nTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  nodes: number;
  downloads: number;
  rating: number;
  tags: string[];
  featured: boolean;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  useCase: string;
}

export function N8nTemplates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock n8n templates (representing top 100)
  const templates: N8nTemplate[] = [
    {
      id: 1,
      name: 'Customer Onboarding Automation',
      description: 'Automate customer onboarding with email sequences, CRM updates, and task assignments',
      category: 'Sales & Marketing',
      nodes: 12,
      downloads: 8547,
      rating: 4.8,
      tags: ['CRM', 'Email', 'Automation'],
      featured: true,
      complexity: 'intermediate',
      useCase: 'Streamline new customer setup and first impressions'
    },
    {
      id: 2,
      name: 'Data Sync: CRM to Data Warehouse',
      description: 'Real-time synchronization of CRM data to your analytics warehouse',
      category: 'Data & Analytics',
      nodes: 8,
      downloads: 12234,
      rating: 4.9,
      tags: ['Database', 'CRM', 'ETL'],
      featured: true,
      complexity: 'advanced',
      useCase: 'Keep analytics data fresh for business intelligence'
    },
    {
      id: 3,
      name: 'Lead Scoring & Qualification',
      description: 'Automatically score and qualify leads based on behavior and demographics',
      category: 'Sales & Marketing',
      nodes: 15,
      downloads: 6789,
      rating: 4.7,
      tags: ['Sales', 'AI', 'Scoring'],
      featured: true,
      complexity: 'intermediate',
      useCase: 'Prioritize high-value leads for sales team'
    },
    {
      id: 4,
      name: 'Invoice Processing & Payment Tracking',
      description: 'Automate invoice generation, sending, and payment status tracking',
      category: 'Finance & Accounting',
      nodes: 10,
      downloads: 5432,
      rating: 4.6,
      tags: ['Finance', 'Payments', 'Automation'],
      featured: false,
      complexity: 'beginner',
      useCase: 'Reduce manual billing and improve cash flow'
    },
    {
      id: 5,
      name: 'Social Media Content Pipeline',
      description: 'Schedule, post, and analyze social media content across platforms',
      category: 'Marketing',
      nodes: 18,
      downloads: 9876,
      rating: 4.8,
      tags: ['Social Media', 'Marketing', 'Analytics'],
      featured: true,
      complexity: 'intermediate',
      useCase: 'Manage multi-platform social presence'
    },
    {
      id: 6,
      name: 'Customer Support Ticket Routing',
      description: 'Intelligently route support tickets based on content and priority',
      category: 'Customer Support',
      nodes: 14,
      downloads: 7654,
      rating: 4.7,
      tags: ['Support', 'AI', 'Routing'],
      featured: false,
      complexity: 'advanced',
      useCase: 'Improve response times and customer satisfaction'
    },
    {
      id: 7,
      name: 'Inventory Management & Alerts',
      description: 'Monitor inventory levels and trigger reorder alerts automatically',
      category: 'Operations',
      nodes: 9,
      downloads: 4321,
      rating: 4.5,
      tags: ['Inventory', 'Alerts', 'Operations'],
      featured: false,
      complexity: 'beginner',
      useCase: 'Prevent stockouts and optimize inventory'
    },
    {
      id: 8,
      name: 'Email Campaign with A/B Testing',
      description: 'Create, send, and optimize email campaigns with automated A/B testing',
      category: 'Marketing',
      nodes: 20,
      downloads: 11543,
      rating: 4.9,
      tags: ['Email', 'Marketing', 'Testing'],
      featured: true,
      complexity: 'advanced',
      useCase: 'Maximize email campaign performance'
    },
    {
      id: 9,
      name: 'Employee Onboarding Workflow',
      description: 'Automate HR tasks for new employee setup and orientation',
      category: 'HR & Operations',
      nodes: 13,
      downloads: 6234,
      rating: 4.6,
      tags: ['HR', 'Onboarding', 'Automation'],
      featured: false,
      complexity: 'intermediate',
      useCase: 'Streamline new hire experience'
    },
    {
      id: 10,
      name: 'Financial Reporting Dashboard',
      description: 'Aggregate financial data and generate automated reports',
      category: 'Finance & Accounting',
      nodes: 16,
      downloads: 8901,
      rating: 4.8,
      tags: ['Finance', 'Reporting', 'Dashboard'],
      featured: true,
      complexity: 'advanced',
      useCase: 'Real-time financial insights for executives'
    },
    {
      id: 11,
      name: 'Meeting Scheduler & Reminder System',
      description: 'Automate meeting scheduling, confirmations, and reminders',
      category: 'Productivity',
      nodes: 7,
      downloads: 9432,
      rating: 4.7,
      tags: ['Calendar', 'Meetings', 'Automation'],
      featured: false,
      complexity: 'beginner',
      useCase: 'Reduce scheduling conflicts and no-shows'
    },
    {
      id: 12,
      name: 'Product Launch Checklist',
      description: 'Coordinate cross-functional tasks for product launches',
      category: 'Product Management',
      nodes: 22,
      downloads: 5678,
      rating: 4.6,
      tags: ['Product', 'Project Management', 'Coordination'],
      featured: false,
      complexity: 'intermediate',
      useCase: 'Ensure successful product launches'
    },
    {
      id: 13,
      name: 'Website Form to CRM Integration',
      description: 'Capture website leads and sync to CRM automatically',
      category: 'Sales & Marketing',
      nodes: 6,
      downloads: 13456,
      rating: 4.9,
      tags: ['Forms', 'CRM', 'Lead Generation'],
      featured: true,
      complexity: 'beginner',
      useCase: 'Never miss a lead from your website'
    },
    {
      id: 14,
      name: 'Competitive Intelligence Monitor',
      description: 'Track competitor activities, pricing, and market movements',
      category: 'Strategy & Intelligence',
      nodes: 19,
      downloads: 4567,
      rating: 4.7,
      tags: ['Intelligence', 'Monitoring', 'Strategy'],
      featured: false,
      complexity: 'advanced',
      useCase: 'Stay ahead of market competition'
    },
    {
      id: 15,
      name: 'Compliance Document Management',
      description: 'Automate compliance document tracking, reviews, and renewals',
      category: 'Legal & Compliance',
      nodes: 11,
      downloads: 3456,
      rating: 4.5,
      tags: ['Compliance', 'Documents', 'Legal'],
      featured: false,
      complexity: 'intermediate',
      useCase: 'Maintain regulatory compliance effortlessly'
    },
    {
      id: 16,
      name: 'Customer Feedback Analysis',
      description: 'Collect, analyze, and act on customer feedback automatically',
      category: 'Customer Success',
      nodes: 14,
      downloads: 7890,
      rating: 4.8,
      tags: ['Feedback', 'NLP', 'Customer Success'],
      featured: true,
      complexity: 'advanced',
      useCase: 'Turn feedback into actionable insights'
    },
  ];

  // Generate more templates to reach 100
  const allTemplates = [...templates];
  for (let i = 17; i <= 100; i++) {
    const categories = ['Sales & Marketing', 'Data & Analytics', 'Finance & Accounting', 'Operations', 'Customer Support', 'HR & Operations'];
    const complexities: ('beginner' | 'intermediate' | 'advanced')[] = ['beginner', 'intermediate', 'advanced'];
    allTemplates.push({
      id: i,
      name: `Workflow Template ${i}`,
      description: `Automated workflow solution for business process optimization and efficiency`,
      category: categories[Math.floor(Math.random() * categories.length)],
      nodes: Math.floor(Math.random() * 20) + 5,
      downloads: Math.floor(Math.random() * 10000) + 1000,
      rating: 4.0 + Math.random() * 0.9,
      tags: ['Automation', 'Business', 'Efficiency'],
      featured: Math.random() > 0.8,
      complexity: complexities[Math.floor(Math.random() * 3)],
      useCase: 'Streamline business operations and reduce manual work'
    });
  }

  const categories = ['all', ...Array.from(new Set(allTemplates.map(t => t.category)))];

  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredTemplates = filteredTemplates.filter(t => t.featured);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'red';
      default: return 'blue';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white flex items-center gap-2">
            <img src="https://n8n.io/favicon.ico" alt="n8n" className="w-6 h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
            n8n Workflow Templates
          </h2>
          <p className="text-blue-300">100 pre-built automation templates from n8n.io</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-900/50 text-blue-400 border border-blue-800/30'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-900/50 text-blue-400 border border-blue-800/30'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-blue-800/30 rounded-lg text-white placeholder-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-slate-900/50 border border-blue-800/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Templates', value: allTemplates.length, icon: GitBranch },
          { label: 'Featured', value: allTemplates.filter(t => t.featured).length, icon: Star },
          { label: 'Total Downloads', value: `${Math.floor(allTemplates.reduce((sum, t) => sum + t.downloads, 0) / 1000)}K`, icon: Download },
          { label: 'Avg Rating', value: (allTemplates.reduce((sum, t) => sum + t.rating, 0) / allTemplates.length).toFixed(1), icon: TrendingUp },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-blue-300 text-sm">{stat.label}</span>
            </div>
            <div className="text-white text-2xl">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Featured Templates */}
      {featuredTemplates.length > 0 && (
        <div>
          <h3 className="text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Featured Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTemplates.slice(0, 6).map((template) => (
              <TemplateCard key={template.id} template={template} viewMode="grid" />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div>
        <h3 className="text-white mb-4">
          All Templates ({filteredTemplates.length})
        </h3>
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
        }>
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, viewMode }: { template: N8nTemplate; viewMode: 'grid' | 'list' }) {
  const complexityColor = template.complexity === 'beginner' ? 'green' : template.complexity === 'intermediate' ? 'yellow' : 'red';

  if (viewMode === 'list') {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg border border-blue-800/30 p-4 hover:border-blue-600/50 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-white">{template.name}</h4>
              {template.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
              <span className={`px-2 py-0.5 rounded-full text-xs border bg-${complexityColor}-500/20 text-${complexityColor}-400 border-${complexityColor}-500/50`}>
                {template.complexity}
              </span>
            </div>
            <p className="text-blue-300 text-sm mb-2">{template.description}</p>
            <div className="flex items-center gap-4 text-xs text-blue-400">
              <span>{template.nodes} nodes</span>
              <span>{template.downloads.toLocaleString()} downloads</span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {template.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Use Template
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-5 hover:border-blue-600/50 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {template.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
            <span className="text-blue-400 text-xs">{template.category}</span>
          </div>
          <h4 className="text-white mb-2">{template.name}</h4>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs border bg-${complexityColor}-500/20 text-${complexityColor}-400 border-${complexityColor}-500/50`}>
          {template.complexity}
        </span>
      </div>

      <p className="text-blue-300 text-sm mb-4 line-clamp-2">{template.description}</p>

      <div className="flex items-center gap-3 mb-4 text-xs text-blue-400">
        <span className="flex items-center gap-1">
          <GitBranch className="w-3 h-3" />
          {template.nodes} nodes
        </span>
        <span className="flex items-center gap-1">
          <Download className="w-3 h-3" />
          {template.downloads > 1000 ? `${(template.downloads / 1000).toFixed(1)}K` : template.downloads}
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          {template.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {template.tags.slice(0, 3).map((tag, i) => (
          <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
          <Eye className="w-3 h-3" />
          Preview
        </button>
        <button className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
          <Download className="w-3 h-3" />
          Use
        </button>
      </div>
    </div>
  );
}
