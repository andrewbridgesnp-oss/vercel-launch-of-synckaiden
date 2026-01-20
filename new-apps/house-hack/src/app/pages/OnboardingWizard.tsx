import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    state: '',
    county: '',
    timeline: '',
    targetUnits: 1,
    incomeRange: '',
    creditRange: '',
    cashOnHand: '',
    priorOwnership: false,
    firstTime: false
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="p-4 border-b bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">203(k) Eligibility Wizard</span>
          </div>
          <Button variant="ghost" onClick={handleSkip}>
            Skip for now
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-600">Step {step} of {totalSteps}</p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Location & Timeline</CardTitle>
              <CardDescription>Where are you looking to buy?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">State</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={data.state}
                  onChange={(e) => setData({ ...data, state: e.target.value })}
                >
                  <option value="">Select state...</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="NY">New York</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Timeline</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={data.timeline}
                  onChange={(e) => setData({ ...data, timeline: e.target.value })}
                >
                  <option value="">Select timeline...</option>
                  <option value="now">Ready now</option>
                  <option value="3months">Within 3 months</option>
                  <option value="6months">Within 6 months</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Target Units</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((units) => (
                    <button
                      key={units}
                      type="button"
                      className={`py-2 px-4 border rounded-md ${
                        data.targetUnits === units 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'border-gray-300 hover:border-blue-600'
                      }`}
                      onClick={() => setData({ ...data, targetUnits: units })}
                    >
                      {units}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleNext} className="w-full mt-6">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Profile</CardTitle>
              <CardDescription>Help us understand your financial readiness</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Annual Income Range</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={data.incomeRange}
                  onChange={(e) => setData({ ...data, incomeRange: e.target.value })}
                >
                  <option value="">Select range...</option>
                  <option value="<50k">Under $50k</option>
                  <option value="50-75k">$50k - $75k</option>
                  <option value="75-100k">$75k - $100k</option>
                  <option value="100k+">$100k+</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Credit Score Range</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={data.creditRange}
                  onChange={(e) => setData({ ...data, creditRange: e.target.value })}
                >
                  <option value="">Select range...</option>
                  <option value="<580">Under 580 (may be challenging)</option>
                  <option value="580-619">580-619 (Minimum FHA)</option>
                  <option value="620-679">620-679 (Good)</option>
                  <option value="680+">680+ (Excellent)</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Cash Available for Down Payment & Closing</label>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  value={data.cashOnHand}
                  onChange={(e) => setData({ ...data, cashOnHand: e.target.value })}
                >
                  <option value="">Select range...</option>
                  <option value="<10k">Under $10k</option>
                  <option value="10-25k">$10k - $25k</option>
                  <option value="25-50k">$25k - $50k</option>
                  <option value="50k+">$50k+</option>
                </select>
              </div>

              <Button onClick={handleNext} className="w-full mt-6">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Homeownership Background</CardTitle>
              <CardDescription>Your experience with property ownership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                  <input
                    type="checkbox"
                    checked={data.priorOwnership}
                    onChange={(e) => setData({ ...data, priorOwnership: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">I've owned a home before</p>
                    <p className="text-sm text-gray-600">Previous homeownership experience</p>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:border-blue-600">
                  <input
                    type="checkbox"
                    checked={data.firstTime}
                    onChange={(e) => setData({ ...data, firstTime: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">First-time home buyer</p>
                    <p className="text-sm text-gray-600">May qualify for special programs</p>
                  </div>
                </label>
              </div>

              <Button onClick={handleNext} className="w-full mt-6">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Eligibility Assessment</CardTitle>
              <CardDescription>Based on the information you provided</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Likely Eligible</h3>
                  <p className="text-gray-600">You appear to meet basic FHA 203(k) requirements</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium">Recommended Next Steps:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Create your first Deal Room to track a property</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Connect with FHA-approved lenders in the marketplace</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Review HUD 203(k) consultant directory</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> This is an educational assessment only. 
                  Final loan approval depends on lender underwriting, property appraisal, 
                  and additional factors not captured here.
                </p>
              </div>

              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
