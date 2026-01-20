import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { useAppStore } from '../../lib/store';
import { api } from '../../lib/api';
import { toast } from 'sonner';
import { 
  Home, ArrowLeft, TrendingUp, DollarSign, FileText, 
  Users, Calendar, Loader2, AlertCircle 
} from 'lucide-react';

export default function DealRoom() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { currentDeal, setCurrentDeal, setLoading, isLoading } = useAppStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (dealId) {
      loadDeal();
    }
  }, [dealId]);

  const loadDeal = async () => {
    try {
      setLoading(true);
      const { deal } = await api.deals.getOne(dealId!);
      setCurrentDeal(deal);
    } catch (error: any) {
      console.error('Load deal error:', error);
      toast.error('Failed to load deal');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!currentDeal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Home className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Deal Room</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Deal Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentDeal.propertyAddress || 'Untitled Property'}
              </h1>
              <div className="flex items-center space-x-3">
                <Badge>{currentDeal.propertyUnits} Unit{currentDeal.propertyUnits > 1 ? 's' : ''}</Badge>
                <Badge variant="outline">
                  {currentDeal.programType === 'limited' ? 'Limited' : 'Standard'} 203(k)
                </Badge>
                <Badge variant={currentDeal.status === 'active' ? 'default' : 'secondary'}>
                  {currentDeal.status}
                </Badge>
              </div>
            </div>
            <Button>Export Deal Packet</Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Purchase Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentDeal.purchasePrice.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Rehab Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${currentDeal.rehabCosts.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Fit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentDeal.fitScore}/100</div>
                <Progress value={currentDeal.fitScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Stage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium capitalize">{currentDeal.stage.replace('-', ' ')}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="numbers">Numbers</TabsTrigger>
            <TabsTrigger value="scope">Scope & Bids</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Deal Overview</CardTitle>
                <CardDescription>Summary and next actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">What's Next?</h3>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Complete property details</p>
                        <p className="text-sm text-gray-600">Add listing URL, photos, and initial inspection notes</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Build your team</p>
                        <p className="text-sm text-gray-600">Invite realtor, lender, and 203(k) consultant</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Property Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Address:</span>
                      <p className="font-medium">{currentDeal.propertyAddress || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Units:</span>
                      <p className="font-medium">{currentDeal.propertyUnits}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <p className="font-medium">{new Date(currentDeal.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Updated:</span>
                      <p className="font-medium">{new Date(currentDeal.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="numbers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Financial Calculator
                </CardTitle>
                <CardDescription>Estimate your monthly payment and net housing cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-700">
                    <strong>Educational Tool:</strong> These are estimates based on assumptions. 
                    Actual loan terms, rates, and approval depend on lender underwriting.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Loan Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Purchase Price:</span>
                          <span className="font-medium">${currentDeal.purchasePrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rehab Costs:</span>
                          <span className="font-medium">${currentDeal.rehabCosts.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">Total Loan Amount (est):</span>
                          <span className="font-bold">${(currentDeal.purchasePrice + currentDeal.rehabCosts).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Down Payment (3.5%):</span>
                          <span className="font-medium">${Math.round((currentDeal.purchasePrice + currentDeal.rehabCosts) * 0.035).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Estimated Monthly Payment</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Principal & Interest:</span>
                          <span className="font-medium">$1,850</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Property Tax:</span>
                          <span className="font-medium">$350</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Insurance:</span>
                          <span className="font-medium">$150</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">PMI:</span>
                          <span className="font-medium">$125</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600">Total PITI:</span>
                          <span className="font-bold text-lg">$2,475</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Rent Offset Scenario</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      If you rent out additional units at market rates:
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Estimated Rent Income:</span>
                        <span className="font-medium">$2,000/mo</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Net Housing Cost:</span>
                        <span className="font-bold text-green-700">$475/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scope">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Scope of Work
                </CardTitle>
                <CardDescription>Define rehab work items and compare bids</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No work items yet</h3>
                  <p className="text-gray-600 mb-4">
                    Start building your scope of work to estimate rehab costs
                  </p>
                  <Button>Add Work Items</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Project Timeline
                </CardTitle>
                <CardDescription>Track stages and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Pre-qual', 'Team Assembly', 'Property Search', 'Offer', 'Inspection', 
                    'Scope & Bids', 'Appraisal', 'Underwriting', 'Closing', 'Rehab', 'Final'].map((stage, i) => (
                    <div key={stage} className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        stage.toLowerCase().replace(' ', '-') === currentDeal.stage 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium">{stage}</p>
                        {stage.toLowerCase().replace(' ', '-') === currentDeal.stage && (
                          <Badge variant="secondary" className="mt-1">Current</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Vault</CardTitle>
                <CardDescription>Secure storage for all deal documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-600 mb-4">
                    Upload contracts, inspections, bids, and other important files
                  </p>
                  <Button>Upload Documents</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Team Members
                </CardTitle>
                <CardDescription>Collaborate with your 203(k) team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {currentDeal.teamMembers?.map((member, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">User {member.userId.substring(0, 8)}</p>
                          <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                        </div>
                      </div>
                      <Badge>{member.role}</Badge>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Invite Team Member
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
