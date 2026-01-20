import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Home, ArrowLeft, Search, MapPin, Star, Shield } from 'lucide-react';

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const partnerRoles = [
    { value: 'all', label: 'All Partners' },
    { value: 'realtor', label: 'Realtors' },
    { value: 'loan_officer', label: 'Loan Officers' },
    { value: 'consultant', label: '203(k) Consultants' },
    { value: 'contractor', label: 'Contractors' },
    { value: 'appraiser', label: 'Appraisers' }
  ];

  const mockPartners = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'loan_officer',
      company: 'Premier FHA Lending',
      serviceArea: 'California',
      specialties: ['FHA 203(k)', 'First-time buyers', 'Multi-family'],
      verified: true,
      rating: 4.9,
      reviewCount: 47
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'consultant',
      company: 'Rehab Experts LLC',
      serviceArea: 'Texas',
      specialties: ['HUD Consultant Roster', 'Commercial', 'Historical properties'],
      verified: true,
      rating: 4.8,
      reviewCount: 32
    },
    {
      id: 3,
      name: 'Jennifer Martinez',
      role: 'realtor',
      company: 'Urban Properties Group',
      serviceArea: 'Florida',
      specialties: ['Multi-family', 'Investment properties', 'FHA transactions'],
      verified: true,
      rating: 4.9,
      reviewCount: 89
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'contractor',
      company: 'Wilson Construction',
      serviceArea: 'New York',
      specialties: ['Structural work', 'Code compliance', 'Historic renovations'],
      verified: true,
      rating: 4.7,
      reviewCount: 56
    }
  ];

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
              <span className="text-lg font-bold text-gray-900">Partner Marketplace</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your 203(k) Team</h1>
          <p className="text-gray-600">
            Connect with verified professionals who specialize in FHA 203(k) financing
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, company, or specialty..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {partnerRoles.map((role) => (
              <Button
                key={role.value}
                variant={roleFilter === role.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRoleFilter(role.value)}
              >
                {role.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-700">
            <Shield className="w-4 h-4 inline mr-2" />
            <strong>User-Directed Selection:</strong> This marketplace helps you find professionals. 
            You choose who to work with. We don't receive referral fees or steer you to specific partners.
          </p>
        </div>

        {/* Partner Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {mockPartners
            .filter(p => roleFilter === 'all' || p.role === roleFilter)
            .filter(p => 
              searchTerm === '' || 
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-600">
                          {partner.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {partner.name}
                          {partner.verified && (
                            <Shield className="w-4 h-4 text-green-600 ml-2" />
                          )}
                        </CardTitle>
                        <CardDescription>{partner.company}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {partner.role.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{partner.serviceArea}</span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-2">
                        {partner.specialties.map((specialty, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{partner.rating}</span>
                        <span className="text-sm text-gray-600">({partner.reviewCount} reviews)</span>
                      </div>
                      <Button size="sm">View Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* HUD Consultant Lookup */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>HUD 203(k) Consultant Roster</CardTitle>
            <CardDescription>
              Verify consultant credentials on the official HUD roster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input placeholder="Enter consultant name or roster ID..." />
              <Button>
                Search HUD Roster
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Note:</strong> For Standard 203(k) loans, a HUD-approved consultant is required. 
              Use this tool to verify credentials or find consultants in your area.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
