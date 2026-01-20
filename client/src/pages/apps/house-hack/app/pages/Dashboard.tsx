import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useAppStore } from '../../lib/store';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { 
  Home, Plus, Building, DollarSign, Users, FileText, 
  LogOut, TrendingUp, AlertCircle, CheckCircle, Loader2 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, deals, setDeals, setLoading, isLoading } = useAppStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const { deals: fetchedDeals } = await api.deals.getAll();
      setDeals(fetchedDeals);
    } catch (error: any) {
      console.error('Load deals error:', error);
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await api.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleCreateDeal = () => {
    if (user?.plan === 'free' && deals.length >= 1) {
      toast.error('Free plan limited to 1 Deal Room', {
        description: 'Upgrade to Pro for unlimited deals',
        action: {
          label: 'Upgrade',
          onClick: () => navigate('/pricing')
        }
      });
      return;
    }
    setShowCreateModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Home className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">KAIDEN HouseHack 203K</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={user?.plan === 'free' ? 'secondary' : 'default'}>
                {user?.plan?.toUpperCase()} PLAN
              </Badge>
              {user?.plan === 'free' && (
                <Link to="/pricing">
                  <Button variant="outline" size="sm">
                    Upgrade
                  </Button>
                </Link>
              )}
              <Link to="/marketplace">
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Partners
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Manage your FHA 203(k) deals and track your progress
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deals.filter(d => d.status === 'active').length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {user?.plan === 'free' && 'Max 1 on Free plan'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${deals.reduce((sum, d) => sum + d.purchasePrice, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Combined purchase price</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Rehab Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${deals.reduce((sum, d) => sum + d.rehabCosts, 0).toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total planned rehab</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Fit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deals.length > 0 
                  ? Math.round(deals.reduce((sum, d) => sum + d.fitScore, 0) / deals.length)
                  : 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Out of 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Deal Rooms */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Deal Rooms</h2>
            <Button onClick={handleCreateDeal} disabled={isLoading}>
              <Plus className="w-4 h-4 mr-2" />
              New Deal Room
            </Button>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </CardContent>
            </Card>
          ) : deals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No deals yet</h3>
                <p className="text-gray-600 mb-4 text-center max-w-md">
                  Create your first Deal Room to start organizing your FHA 203(k) project
                </p>
                <Button onClick={handleCreateDeal}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Deal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {deals.map((deal) => (
                <Card key={deal.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/deals/${deal.id}`)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {deal.propertyAddress || 'Untitled Property'}
                        </CardTitle>
                        <CardDescription>
                          {deal.propertyUnits} Unit{deal.propertyUnits > 1 ? 's' : ''} • {deal.programType === 'limited' ? 'Limited' : 'Standard'} 203(k)
                        </CardDescription>
                      </div>
                      <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                        {deal.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Purchase Price:</span>
                        <span className="font-medium">${deal.purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rehab Budget:</span>
                        <span className="font-medium">${deal.rehabCosts.toLocaleString()}</span>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Fit Score:</span>
                          <span className="font-medium">{deal.fitScore}/100</span>
                        </div>
                        <Progress value={deal.fitScore} />
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm text-gray-600">Stage: {deal.stage}</span>
                        <Button variant="ghost" size="sm">
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* What's Next Section */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>Recommended actions to move your deals forward</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deals.length === 0 ? (
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Create your first Deal Room</p>
                    <p className="text-sm text-gray-600">Start by adding a property you're interested in</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Complete property details</p>
                      <p className="text-sm text-gray-600">Add address, units, and initial numbers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Build your team</p>
                      <p className="text-sm text-gray-600">Invite realtor, lender, and 203(k) consultant</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Create scope of work</p>
                      <p className="text-sm text-gray-600">Detail the rehab items needed for your property</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Deal Modal */}
      {showCreateModal && (
        <CreateDealModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={(deal) => {
            setDeals([...deals, deal]);
            setShowCreateModal(false);
            navigate(`/deals/${deal.id}`);
          }}
        />
      )}
    </div>
  );
}

function CreateDealModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (deal: any) => void }) {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    propertyUnits: 1,
    purchasePrice: 0,
    rehabCosts: 0,
    programType: 'limited'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.propertyAddress) {
      toast.error('Property address is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const { deal } = await api.deals.create(formData);
      toast.success('Deal room created successfully!');
      onSuccess(deal);
    } catch (error: any) {
      console.error('Create deal error:', error);
      toast.error(error.message || 'Failed to create deal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle>Create New Deal Room</CardTitle>
          <CardDescription>Start tracking a new FHA 203(k) property</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Property Address</label>
              <input
                type="text"
                placeholder="123 Main St, City, ST 12345"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.propertyAddress}
                onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Units</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.propertyUnits}
                  onChange={(e) => setFormData({ ...formData, propertyUnits: parseInt(e.target.value) })}
                >
                  <option value="1">1 Unit</option>
                  <option value="2">2 Units</option>
                  <option value="3">3 Units</option>
                  <option value="4">4 Units</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Program Type</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.programType}
                  onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                >
                  <option value="limited">Limited (up to $75k rehab)</option>
                  <option value="standard">Standard (over $75k rehab)</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Deal Room'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
