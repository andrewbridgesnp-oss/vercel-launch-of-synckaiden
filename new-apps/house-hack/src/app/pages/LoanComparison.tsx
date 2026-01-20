import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, CheckCircle, XCircle, Info, TrendingUp, AlertTriangle, Shield } from 'lucide-react';
import { loanTypes, recommendLoanTypes, BuyerProfile, LEGAL_DISCLAIMER, STATE_DATA } from '../../lib/loanTypes';

export default function LoanComparison() {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [profile, setProfile] = useState<BuyerProfile>({
    creditScore: 680,
    downPaymentPercent: 3.5,
    monthlyIncome: 5000,
    monthlyDebts: 1000,
    isVeteran: false,
    isFirstTimeBuyer: true,
    propertyNeedsWork: true,
    renovationBudget: 50000,
    units: 2,
    propertyValue: 250000,
    location: {
      state: 'OH',
      isRural: false
    }
  });

  const recommendations = showRecommendations ? recommendLoanTypes(profile) : [];

  return (
    <div className="min-h-screen bg-[#0a1128]">
      {/* Header */}
      <div className="bg-[#1a2238] border-b border-[#c0c5ce]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4 text-[#c0c5ce] hover:text-[#e8ecf4]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#e8ecf4] mb-2">
                Loan Type Comparison
              </h1>
              <p className="text-[#c0c5ce]">
                Compare 8 loan types to find your perfect financing strategy
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Recommendation Engine */}
        <Card className="mb-8 bg-[#1a2238] border-[#c0c5ce]/20">
          <CardHeader>
            <CardTitle className="text-[#e8ecf4] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#98c1d9]" />
              Find Your Best Loan Type
            </CardTitle>
            <CardDescription className="text-[#c0c5ce]">
              Answer a few questions to get personalized loan recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="creditScore" className="text-[#c0c5ce]">Credit Score</Label>
                <Input
                  id="creditScore"
                  type="number"
                  value={profile.creditScore}
                  onChange={(e) => setProfile({ ...profile, creditScore: parseInt(e.target.value) })}
                  className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]"
                />
              </div>
              <div>
                <Label htmlFor="downPayment" className="text-[#c0c5ce]">Down Payment %</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={profile.downPaymentPercent}
                  onChange={(e) => setProfile({ ...profile, downPaymentPercent: parseFloat(e.target.value) })}
                  className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]"
                />
              </div>
              <div>
                <Label htmlFor="propertyValue" className="text-[#c0c5ce]">Property Value</Label>
                <Input
                  id="propertyValue"
                  type="number"
                  value={profile.propertyValue}
                  onChange={(e) => setProfile({ ...profile, propertyValue: parseInt(e.target.value) })}
                  className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]"
                />
              </div>
              <div>
                <Label htmlFor="monthlyIncome" className="text-[#c0c5ce]">Monthly Income</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={profile.monthlyIncome}
                  onChange={(e) => setProfile({ ...profile, monthlyIncome: parseInt(e.target.value) })}
                  className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]"
                />
              </div>
              <div>
                <Label htmlFor="monthlyDebts" className="text-[#c0c5ce]">Monthly Debts</Label>
                <Input
                  id="monthlyDebts"
                  type="number"
                  value={profile.monthlyDebts}
                  onChange={(e) => setProfile({ ...profile, monthlyDebts: parseInt(e.target.value) })}
                  className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]"
                />
              </div>
              <div>
                <Label htmlFor="units" className="text-[#c0c5ce]">Number of Units</Label>
                <Select value={profile.units.toString()} onValueChange={(v) => setProfile({ ...profile, units: parseInt(v) })}>
                  <SelectTrigger className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Unit</SelectItem>
                    <SelectItem value="2">2 Units</SelectItem>
                    <SelectItem value="3">3 Units</SelectItem>
                    <SelectItem value="4">4 Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="needsWork" className="text-[#c0c5ce]">Property Needs Work?</Label>
                <Select value={profile.propertyNeedsWork.toString()} onValueChange={(v) => setProfile({ ...profile, propertyNeedsWork: v === 'true' })}>
                  <SelectTrigger className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No (Move-in Ready)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="renovationBudget" className="text-[#c0c5ce]">Renovation Budget</Label>
                <Input
                  id="renovationBudget"
                  type="number"
                  value={profile.renovationBudget}
                  onChange={(e) => setProfile({ ...profile, renovationBudget: parseInt(e.target.value) })}
                  className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]"
                  disabled={!profile.propertyNeedsWork}
                />
              </div>
              <div>
                <Label htmlFor="isVeteran" className="text-[#c0c5ce]">Are You a Veteran?</Label>
                <Select value={profile.isVeteran.toString()} onValueChange={(v) => setProfile({ ...profile, isVeteran: v === 'true' })}>
                  <SelectTrigger className="bg-[#0a1128] border-[#c0c5ce]/30 text-[#e8ecf4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={() => setShowRecommendations(true)}
              className="bg-[#c0c5ce] text-[#0a1128] hover:bg-[#e8ecf4]"
            >
              Get Personalized Recommendations
            </Button>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {showRecommendations && recommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">Your Top Recommendations</h2>
            <div className="grid gap-4">
              {recommendations.map((rec, idx) => (
                <Card key={rec.loanType.id} className="bg-[#1a2238] border-[#c0c5ce]/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{rec.loanType.icon}</span>
                          <div>
                            <CardTitle className="text-[#e8ecf4]">
                              {idx === 0 && <Badge className="mr-2 bg-[#98c1d9] text-[#0a1128]">Best Match</Badge>}
                              {rec.loanType.name}
                            </CardTitle>
                            <CardDescription className="text-[#c0c5ce]">
                              {rec.loanType.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[#98c1d9]">{rec.score}</div>
                        <div className="text-xs text-[#c0c5ce]">Match Score</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-[#e8ecf4] mb-2">Why This Loan Fits You:</h4>
                      <ul className="space-y-1">
                        {rec.reasoning.map((reason, i) => (
                          <li key={i} className="text-sm text-[#c0c5ce] flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-[#98c1d9] mt-0.5 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {rec.warnings && rec.warnings.length > 0 && (
                      <div className="mb-4 p-3 bg-[#ee6c4d]/10 border border-[#ee6c4d]/30 rounded-lg">
                        <h4 className="text-sm font-semibold text-[#ee6c4d] mb-2 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          Important Considerations:
                        </h4>
                        <ul className="space-y-1">
                          {rec.warnings.map((warning, i) => (
                            <li key={i} className="text-sm text-[#c0c5ce] flex items-start gap-2">
                              <span className="text-[#ee6c4d]">•</span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#0a1128] rounded-lg">
                      <div>
                        <div className="text-xs text-[#c0c5ce]">Down Payment</div>
                        <div className="text-lg font-bold text-[#e8ecf4]">{rec.loanType.minDownPayment}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#c0c5ce]">Min Credit</div>
                        <div className="text-lg font-bold text-[#e8ecf4]">{rec.loanType.minCreditScore}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#c0c5ce]">Max DTI</div>
                        <div className="text-lg font-bold text-[#e8ecf4]">{rec.loanType.maxDTI}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#c0c5ce]">Renovation</div>
                        <div className="text-lg font-bold text-[#e8ecf4]">
                          {rec.loanType.allowsRenovation ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Loan Types */}
        <h2 className="text-2xl font-bold text-[#e8ecf4] mb-4">Compare All Loan Types</h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {Object.values(loanTypes).map(loan => (
            <Card key={loan.id} className="bg-[#1a2238] border-[#c0c5ce]/20">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{loan.icon}</span>
                  <div className="flex-1">
                    <CardTitle className="text-[#e8ecf4] mb-2">{loan.name}</CardTitle>
                    <CardDescription className="text-[#c0c5ce]">{loan.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#0a1128] rounded-lg">
                  <div>
                    <div className="text-xs text-[#c0c5ce]">Down Payment</div>
                    <div className="text-sm font-bold text-[#e8ecf4]">{loan.minDownPayment}% min</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#c0c5ce]">Credit Score</div>
                    <div className="text-sm font-bold text-[#e8ecf4]">{loan.minCreditScore}+ min</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#c0c5ce]">Max Units</div>
                    <div className="text-sm font-bold text-[#e8ecf4]">{loan.maxUnits} units</div>
                  </div>
                  <div>
                    <div className="text-xs text-[#c0c5ce]">Renovation</div>
                    <div className="text-sm font-bold text-[#e8ecf4]">
                      {loan.allowsRenovation ? '✅ Yes' : '❌ No'}
                    </div>
                  </div>
                </div>

                {/* Pros */}
                <div>
                  <h4 className="text-sm font-semibold text-[#e8ecf4] mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#98c1d9]" />
                    Advantages
                  </h4>
                  <ul className="space-y-1">
                    {loan.pros.slice(0, 3).map((pro, i) => (
                      <li key={i} className="text-xs text-[#c0c5ce] flex items-start gap-2">
                        <span className="text-[#98c1d9]">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div>
                  <h4 className="text-sm font-semibold text-[#e8ecf4] mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#ee6c4d]" />
                    Considerations
                  </h4>
                  <ul className="space-y-1">
                    {loan.cons.slice(0, 3).map((con, i) => (
                      <li key={i} className="text-xs text-[#c0c5ce] flex items-start gap-2">
                        <span className="text-[#ee6c4d]">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best For */}
                <div>
                  <h4 className="text-sm font-semibold text-[#e8ecf4] mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#98c1d9]" />
                    Best For
                  </h4>
                  <ul className="space-y-1">
                    {loan.bestFor.slice(0, 2).map((use, i) => (
                      <li key={i} className="text-xs text-[#c0c5ce] flex items-start gap-2">
                        <span className="text-[#98c1d9]">→</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="mt-8 bg-gradient-to-r from-[#1a2238] to-[#2d3e5f] border-[#c0c5ce]/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-[#e8ecf4] mb-4">
              Ready to Start Your House-Hacking Journey?
            </h3>
            <p className="text-[#c0c5ce] mb-6 max-w-2xl mx-auto">
              Create a free KAIDEN account to access personalized deal rooms, financial calculators, 
              and expert guidance for your chosen loan type.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-[#c0c5ce] text-[#0a1128] hover:bg-[#e8ecf4]">
                Create Free Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Legal Disclaimer */}
        <Card className="mt-8 bg-[#1a2238] border-[#ee6c4d]/30">
          <CardHeader>
            <CardTitle className="text-[#ee6c4d] flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Important Legal Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-[#c0c5ce]">
              <p>
                <strong className="text-[#e8ecf4]">Educational Purposes Only:</strong> The information provided by KAIDEN HouseHack 
                is for educational and informational purposes only and does not constitute financial, legal, or tax advice.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Loan terms, interest rates, and eligibility requirements vary by lender, location, credit profile, and market conditions</li>
                <li>All data is subject to change based on HUD, FHA, FHFA, VA, and USDA updates</li>
                <li>Information is accurate as of January 2025 but should be verified with licensed mortgage professionals</li>
                <li>This is not a commitment to lend or an advertisement for credit</li>
                <li>Actual loan approval and terms depend on full underwriting review</li>
              </ul>
              <p className="text-[#e8ecf4] font-semibold">
                Consult with licensed mortgage brokers, real estate attorneys, CPAs, and financial advisors for personalized guidance.
              </p>
              <p className="text-xs text-[#c0c5ce]/70 mt-4">
                KAIDEN HouseHack is a software tool and educational platform. We are not a lender, broker, or financial advisor. 
                All calculations are estimates and should be verified with your lender.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card className="mt-4 mb-8 bg-[#1a2238] border-[#c0c5ce]/20">
          <CardHeader>
            <CardTitle className="text-[#e8ecf4] text-lg">Data Sources & References</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-xs text-[#c0c5ce]">
              <div>
                <h4 className="font-semibold text-[#e8ecf4] mb-2">Government Sources:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>HUD Handbook 4000.1 (FHA Single Family Housing Policy)</li>
                  <li>HUD Mortgagee Letter 2024-17 (2025 Loan Limits)</li>
                  <li>FHFA 2025 Conforming Loan Limits (November 2024)</li>
                  <li>VA Lender Handbook & VA Pamphlet 26-7</li>
                  <li>USDA RD Handbook HB-1-3555</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#e8ecf4] mb-2">GSE & Industry Sources:</h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Fannie Mae Selling Guide (HomeStyle & Conventional)</li>
                  <li>Freddie Mac Seller/Servicer Guide</li>
                  <li>HUD 203(k) Consultant Handbook</li>
                  <li>FHA 203(k) Limited Program Guide (ML 2024-14)</li>
                  <li>Various jumbo lender guidelines</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-[#c0c5ce]/70 mt-4">
              Last Updated: January 11, 2025 | South Carolina and Georgia use floor loan limits statewide. 
              Verify current rates and terms with licensed lenders in your area.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}