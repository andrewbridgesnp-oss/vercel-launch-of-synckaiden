import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, Home, Users, FileText, TrendingUp, Shield, Zap, MapPin } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1128] via-[#1a2238] to-[#0a1128]">
      {/* Navigation */}
      <nav className="border-b border-[#c0c5ce]/20 bg-[#1a2238]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="w-8 h-8 text-[#c0c5ce]" />
              <span className="text-xl font-bold text-[#e8ecf4]">KAIDEN HouseHack 203K</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/loan-comparison">
                <Button variant="ghost" className="text-[#c0c5ce] hover:text-[#e8ecf4] hover:bg-[#2d3e5f]">Loan Types</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" className="text-[#c0c5ce] hover:text-[#e8ecf4] hover:bg-[#2d3e5f]">Pricing</Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="border-[#c0c5ce] text-[#c0c5ce] hover:bg-[#2d3e5f]">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-[#c0c5ce] text-[#0a1128] hover:bg-[#e8ecf4]">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1128] via-[#1a2238] to-[#0a1128]"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#c0c5ce] rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#98c1d9] rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-[#98c1d9] text-sm font-semibold tracking-wider uppercase">
              Powered by KAIDEN
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-[#c0c5ce]">KAIDEN</span> HouseHack
            <br />
            <span className="bg-gradient-to-r from-[#c0c5ce] to-[#98c1d9] bg-clip-text text-transparent">
              Your Complete Mortgage Navigator
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Compare all loan types, find your perfect financing strategy, and master house-hacking 
            with guided workflows for FHA 203(k), Conventional, VA, USDA, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-[#c0c5ce] text-[#0a1128] hover:bg-[#e8ecf4] text-lg px-8 py-6"
              onClick={() => navigate('/auth')}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#c0c5ce] text-[#c0c5ce] hover:bg-[#c0c5ce] hover:text-[#0a1128] text-lg px-8 py-6"
              onClick={() => navigate('/pricing')}
            >
              View Pricing
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-[#c0c5ce]">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#98c1d9]" />
              <span>Bank-Grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#98c1d9]" />
              <span>All 50 States</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#98c1d9]" />
              <span>8 Loan Types</span>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types Showcase */}
      <section className="py-20 px-4 bg-[#1a2238]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#e8ecf4] mb-4">
              Compare 8 Loan Types - Find Your Perfect Fit
            </h2>
            <p className="text-xl text-[#c0c5ce] max-w-3xl mx-auto mb-8">
              Not every deal needs FHA 203(k). KAIDEN helps you compare all financing options 
              to find the loan that maximizes your house-hacking returns.
            </p>
            <Link to="/loan-comparison">
              <Button size="lg" className="bg-[#98c1d9] text-[#0a1128] hover:bg-[#c0c5ce]">
                Compare All Loan Types →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-[#0a1128] border-[#c0c5ce]/20 hover:border-[#98c1d9] transition-all">
              <CardHeader>
                <div className="text-4xl mb-3">🏗️</div>
                <CardTitle className="text-[#e8ecf4]">FHA 203(k)</CardTitle>
                <CardDescription className="text-[#c0c5ce]">
                  3.5% down • Finance renovations • 1-4 units
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-[#0a1128] border-[#c0c5ce]/20 hover:border-[#98c1d9] transition-all">
              <CardHeader>
                <div className="text-4xl mb-3">🏦</div>
                <CardTitle className="text-[#e8ecf4]">Conventional</CardTitle>
                <CardDescription className="text-[#c0c5ce]">
                  5% down • Best rates • Turnkey properties
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-[#0a1128] border-[#c0c5ce]/20 hover:border-[#98c1d9] transition-all">
              <CardHeader>
                <div className="text-4xl mb-3">🎖️</div>
                <CardTitle className="text-[#e8ecf4]">VA Loan</CardTitle>
                <CardDescription className="text-[#c0c5ce]">
                  0% down • Veterans only • No MI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-[#0a1128] border-[#c0c5ce]/20 hover:border-[#98c1d9] transition-all">
              <CardHeader>
                <div className="text-4xl mb-3">🌾</div>
                <CardTitle className="text-[#e8ecf4]">USDA Rural</CardTitle>
                <CardDescription className="text-[#c0c5ce]">
                  0% down • Rural areas • Low MI
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-8 p-6 bg-[#0a1128] rounded-lg border border-[#98c1d9]/30">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div>
                <h3 className="text-lg font-bold text-[#e8ecf4] mb-2">Smart Loan Selection Saves Money</h3>
                <p className="text-[#c0c5ce]">
                  KAIDEN's recommendation engine analyzes your credit, down payment, property condition, 
                  and goals to suggest the best loan type. Get personalized guidance instead of one-size-fits-all advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Everything You Need in One Platform
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Eligibility Wizard</CardTitle>
                <CardDescription>
                  Understand your 203(k) eligibility with step-by-step guidance based on HUD rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Income & credit pre-check
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Limited vs Standard recommendation
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Action plan generation
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>203(k) Fit Score</CardTitle>
                <CardDescription>
                  Data-driven scoring with transparent breakdown of deal viability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Property type compatibility
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Scope & timeline analysis
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Deal killer identification
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Numbers Calculator</CardTitle>
                <CardDescription>
                  Conservative financial modeling with rent-offset scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Payment + PITI calculator
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Rent offset modeling
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Cash-to-close estimates
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Scope & Bid Tracker</CardTitle>
                <CardDescription>
                  Organize rehab plans and compare contractor bids side-by-side
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Categorized work items
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Bid comparison tool
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Contractor portal access
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Partner Marketplace</CardTitle>
                <CardDescription>
                  Connect with verified realtors, lenders, consultants, and contractors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Searchable directory
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    HUD consultant roster
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Team invite system
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Document Vault</CardTitle>
                <CardDescription>
                  Secure storage with required-docs checklist and version tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Organized by category
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    Share links & permissions
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    PDF export with watermark
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your 203(k) Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of house-hackers who trust KAIDEN for their FHA 203(k) deals.
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Create Free Account
            </Button>
          </Link>
          <p className="mt-4 text-sm text-blue-100">
            Free plan includes 1 Deal Room. No credit card required.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">
            © 2026 KAIDEN HouseHack 203K. Educational platform for FHA 203(k) financing.
          </p>
          <div className="flex justify-center gap-6 mb-4">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <a href="mailto:support@kaiden203k.com" className="hover:text-white transition-colors">
              Contact Support
            </a>
          </div>
          <p className="text-sm">
            This platform provides educational resources and organizational tools only. 
            Not financial or legal advice. No guarantees of loan approval or outcomes.
          </p>
        </div>
      </footer>
    </div>
  );
}