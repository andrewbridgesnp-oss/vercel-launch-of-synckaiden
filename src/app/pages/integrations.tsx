import { useState } from 'react';
import { 
  Check, 
  X, 
  Settings,
  Zap,
  Calendar as CalendarIcon,
  CreditCard,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Database,
  Cloud,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'communication' | 'payment' | 'calendar' | 'crm' | 'ai';
  status: 'connected' | 'available' | 'premium';
  config?: {
    apiKey?: string;
    enabled?: boolean;
    [key: string]: any;
  };
}

const integrations: Integration[] = [
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'Voice calls and SMS messaging',
    icon: Phone,
    category: 'communication',
    status: 'connected',
    config: {
      apiKey: 'sk_live_••••••••••••2h4k',
      enabled: true,
      phoneNumber: '+1 (555) 123-4567'
    }
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing and invoicing',
    icon: CreditCard,
    category: 'payment',
    status: 'connected',
    config: {
      apiKey: 'sk_live_••••••••••••8f2a',
      enabled: true,
      currency: 'USD'
    }
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Calendar sync and booking management',
    icon: CalendarIcon,
    category: 'calendar',
    status: 'connected',
    config: {
      email: 'studio@example.com',
      enabled: true,
      syncInterval: '5min'
    }
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'AI voice cloning and synthesis',
    icon: Zap,
    category: 'ai',
    status: 'connected',
    config: {
      apiKey: 'sk_live_••••••••••••9k1m',
      enabled: true,
      voiceId: 'voice_clone_2h4k8f'
    }
  },
  {
    id: 'google-speech',
    name: 'Google Cloud Speech',
    description: 'Speech-to-text transcription',
    icon: Database,
    category: 'ai',
    status: 'connected',
    config: {
      apiKey: 'AIza••••••••••••Xy2',
      enabled: true,
      language: 'en-US'
    }
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email notifications and confirmations',
    icon: Mail,
    category: 'communication',
    status: 'connected',
    config: {
      apiKey: 'SG.••••••••••••.h7k',
      enabled: true,
      fromEmail: 'hello@studio.com'
    }
  },
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Video consultations and meetings',
    icon: Video,
    category: 'communication',
    status: 'available'
  },
  {
    id: 'square',
    name: 'Square',
    description: 'Alternative payment processing',
    icon: CreditCard,
    category: 'payment',
    status: 'available'
  },
  {
    id: 'microsoft-teams',
    name: 'Microsoft Teams',
    description: 'Team collaboration and video calls',
    icon: MessageSquare,
    category: 'communication',
    status: 'premium'
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Enterprise CRM integration',
    icon: Cloud,
    category: 'crm',
    status: 'premium'
  }
];

export function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [integrationConfigs, setIntegrationConfigs] = useState<Record<string, any>>(
    integrations.reduce((acc, int) => ({
      ...acc,
      [int.id]: int.config || {}
    }), {})
  );

  const categories = [
    { id: 'all', label: 'All Integrations', count: integrations.length },
    { id: 'communication', label: 'Communication', count: integrations.filter(i => i.category === 'communication').length },
    { id: 'payment', label: 'Payment', count: integrations.filter(i => i.category === 'payment').length },
    { id: 'calendar', label: 'Calendar', count: integrations.filter(i => i.category === 'calendar').length },
    { id: 'ai', label: 'AI Services', count: integrations.filter(i => i.category === 'ai').length },
    { id: 'crm', label: 'CRM', count: integrations.filter(i => i.category === 'crm').length },
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const handleConnect = (id: string) => {
    toast.success(`Connected to ${integrations.find(i => i.id === id)?.name}`);
    // In production, this would trigger OAuth flow or API key setup
  };

  const handleDisconnect = (id: string) => {
    toast.success(`Disconnected from ${integrations.find(i => i.id === id)?.name}`);
    // In production, this would revoke access
  };

  const handleToggle = (id: string, enabled: boolean) => {
    setIntegrationConfigs(prev => ({
      ...prev,
      [id]: { ...prev[id], enabled }
    }));
    toast.success(enabled ? 'Integration enabled' : 'Integration paused');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-light mb-2">Integrations</h1>
        <p className="text-luxury-stone">
          Connect your tools and automate your workflow
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover-luxury">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">{connectedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Active integrations</p>
          </CardContent>
        </Card>

        <Card className="hover-luxury">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">
              {integrations.filter(i => i.status === 'available').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ready to connect</p>
          </CardContent>
        </Card>

        <Card className="hover-luxury">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-light">
              {integrations.filter(i => i.status === 'premium').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Enterprise features</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          const config = integrationConfigs[integration.id] || {};
          
          return (
            <Card key={integration.id} className="hover-luxury">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent-rose-gold" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-light">{integration.name}</CardTitle>
                      <CardDescription className="text-sm">{integration.description}</CardDescription>
                    </div>
                  </div>
                  
                  {integration.status === 'connected' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      <Check className="w-3 h-3" />
                      Connected
                    </div>
                  )}
                  {integration.status === 'premium' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent-rose-gold rounded-full text-sm">
                      <Lock className="w-3 h-3" />
                      Premium
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {integration.status === 'connected' && config && (
                  <div className="space-y-4">
                    {/* Configuration Details */}
                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                      {config.apiKey && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">API Key</span>
                          <span className="font-mono">{config.apiKey}</span>
                        </div>
                      )}
                      {config.phoneNumber && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Phone Number</span>
                          <span>{config.phoneNumber}</span>
                        </div>
                      )}
                      {config.email && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Account</span>
                          <span>{config.email}</span>
                        </div>
                      )}
                      {config.voiceId && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Voice ID</span>
                          <span className="font-mono text-xs">{config.voiceId}</span>
                        </div>
                      )}
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={config.enabled}
                          onCheckedChange={(enabled) => handleToggle(integration.id, enabled)}
                        />
                        <div>
                          <div className="text-sm font-medium">
                            {config.enabled ? 'Active' : 'Paused'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {config.enabled ? 'Integration is running' : 'Integration is paused'}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                )}

                {integration.status === 'available' && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Connect {integration.name} to unlock powerful automation features.
                    </p>
                    <Button 
                      className="w-full" 
                      onClick={() => handleConnect(integration.id)}
                    >
                      Connect {integration.name}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {integration.status === 'premium' && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This integration is available on the Elite plan.
                    </p>
                    <Button className="w-full" variant="outline">
                      Upgrade to Elite
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Card */}
      <Card className="border-accent-rose-gold/30 bg-gradient-to-br from-accent/5 to-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-light">Need Help?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Our integration guides make setup simple. Each integration comes with:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent-rose-gold" />
              Step-by-step setup instructions
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent-rose-gold" />
              Video tutorials and documentation
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent-rose-gold" />
              24/7 support from our team
            </li>
          </ul>
          <Button variant="outline" className="mt-4">
            View Documentation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default IntegrationsPage;
