import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Megaphone, Plus, TrendingUp, Target, DollarSign, Eye, MousePointerClick, BarChart3, Play, Pause } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

export default function AdsSuite() {
  const [campaignName, setCampaignName] = useState('');
  const [campaignBudget, setCampaignBudget] = useState('');
  const [campaignPlatform, setCampaignPlatform] = useState('');
  const [adCopy, setAdCopy] = useState('');

  // Mock campaign data
  const campaigns = [
    {
      id: 1,
      name: 'Executive Suite Launch',
      platform: 'YouTube',
      status: 'active',
      budget: 500,
      spent: 342,
      impressions: 45234,
      clicks: 1234,
      conversions: 89,
      ctr: 2.73,
      cpc: 0.28
    },
    {
      id: 2,
      name: 'Creative Clash Promo',
      platform: 'Instagram',
      status: 'active',
      budget: 300,
      spent: 187,
      impressions: 32456,
      clicks: 892,
      conversions: 45,
      ctr: 2.75,
      cpc: 0.21
    },
    {
      id: 3,
      name: 'Bougie Boutique Sale',
      platform: 'Facebook',
      status: 'paused',
      budget: 400,
      spent: 400,
      impressions: 56789,
      clicks: 1567,
      conversions: 123,
      ctr: 2.76,
      cpc: 0.26
    }
  ];

  const handleCreateCampaign = () => {
    if (!campaignName || !campaignBudget || !campaignPlatform) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Campaign created successfully!');
    setCampaignName('');
    setCampaignBudget('');
    setCampaignPlatform('');
    setAdCopy('');
  };

  return (
    <DashboardLayout title="Ads Suite">
      <div className="space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total Spend</span>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-white">$929</div>
            <div className="text-xs text-slate-400 mt-1">of $1,200 budget</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Impressions</span>
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-white">134K</div>
            <div className="text-xs text-green-500 mt-1">+23% vs last week</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Clicks</span>
              <MousePointerClick className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-white">3,693</div>
            <div className="text-xs text-green-500 mt-1">2.75% CTR</div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Conversions</span>
              <Target className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-white">257</div>
            <div className="text-xs text-green-500 mt-1">$3.61 CPA</div>
          </Card>
        </div>

        {/* Create Campaign */}
        <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Campaign</h2>
              <p className="text-slate-400">Launch a new advertising campaign across platforms</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Campaign Name *
              </label>
              <Input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g., Spring Sale 2026"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Platform *
              </label>
              <Select value={campaignPlatform} onValueChange={setCampaignPlatform}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="google">Google Ads</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Daily Budget *
              </label>
              <Input
                type="number"
                value={campaignBudget}
                onChange={(e) => setCampaignBudget(e.target.value)}
                placeholder="50"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Objective
              </label>
              <Select defaultValue="conversions">
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                  <SelectItem value="traffic">Website Traffic</SelectItem>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="conversions">Conversions</SelectItem>
                  <SelectItem value="leads">Lead Generation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Ad Copy
              </label>
              <Textarea
                value={adCopy}
                onChange={(e) => setAdCopy(e.target.value)}
                placeholder="Write your ad copy here..."
                rows={4}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <Button
            onClick={handleCreateCampaign}
            className="w-full mt-6 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
          >
            <Megaphone className="mr-2 w-5 h-5" />
            Launch Campaign
          </Button>
        </Card>

        {/* Active Campaigns */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Active Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-lg flex items-center justify-center">
                      <Megaphone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{campaign.name}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-slate-400">{campaign.platform}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          campaign.status === 'active' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-orange-500/20 text-orange-500'
                        }`}>
                          {campaign.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {campaign.status === 'active' ? (
                      <Button variant="outline" size="sm" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="border-green-500 text-green-500 hover:bg-green-500/10">
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Budget</div>
                    <div className="text-lg font-bold text-white">${campaign.budget}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Spent</div>
                    <div className="text-lg font-bold text-white">${campaign.spent}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Impressions</div>
                    <div className="text-lg font-bold text-white">{campaign.impressions.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Clicks</div>
                    <div className="text-lg font-bold text-white">{campaign.clicks.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">CTR</div>
                    <div className="text-lg font-bold text-green-500">{campaign.ctr}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">CPC</div>
                    <div className="text-lg font-bold text-white">${campaign.cpc}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Conversions</div>
                    <div className="text-lg font-bold text-amber-500">{campaign.conversions}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Budget Usage</span>
                    <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-amber-600 to-yellow-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Optimization Suggestions */}
        <Card className="p-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-white">AI Optimization Suggestions</h3>
          </div>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Increase budget for "Executive Suite Launch" by 20% - showing 3.2x ROAS</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Adjust targeting for "Creative Clash Promo" to 25-34 age group for better engagement</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-500 mr-2">•</span>
              <span>Test new ad creative for "Bougie Boutique Sale" - current CTR below average</span>
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
