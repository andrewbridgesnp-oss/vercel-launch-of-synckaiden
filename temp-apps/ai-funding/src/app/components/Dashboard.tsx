// KAIDEN CAPITAL™ - Main Dashboard

import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrustScoreBadge } from './TrustScoreBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  TrendingUp,
  Target,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  Sparkles,
  FileText,
  Users,
} from 'lucide-react';
import { Badge } from './ui/badge';

export const Dashboard: React.FC = () => {
  const { user, dashboardStats, setCurrentView, fundingProfile } = useApp();

  if (!user || !dashboardStats) {
    return <div>Loading...</div>;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="kaiden-heading-lg mb-2">
            Welcome back, {user.profile.firstName}
          </h1>
          <p className="text-muted-foreground">
            {user.profile.businessName || 'Your funding journey'}
          </p>
        </div>
        <TrustScoreBadge trustScore={user.trustScore} size="lg" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Funding Target</p>
                <p className="text-2xl font-bold mt-1">
                  {fundingProfile ? formatCurrency(fundingProfile.targetAmount) : '$0'}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Odds</p>
                <p className="text-2xl font-bold mt-1">
                  {Math.round(dashboardStats.estimatedApprovalOdds * 100)}%
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recommendations</p>
                <p className="text-2xl font-bold mt-1">
                  {dashboardStats.recommendationsCount}
                </p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-full">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold mt-1">
                  {dashboardStats.applicationsInProgress}
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-full">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-500" />
            Your Next Steps
          </CardTitle>
          <CardDescription>
            Priority actions to accelerate your funding timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardStats.nextSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm flex-1">{step}</p>
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <Button onClick={() => setCurrentView('readiness')} className="flex-1">
              View Readiness Plan
            </Button>
            <Button
              onClick={() => setCurrentView('funding-map')}
              variant="outline"
              className="flex-1"
            >
              Explore Funding Map
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Funding Readiness</CardTitle>
            <CardDescription>Your current readiness to apply for funding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Score</span>
                <span className="text-2xl font-bold">
                  {fundingProfile?.readinessScore || 0}/100
                </span>
              </div>
              <Progress value={fundingProfile?.readinessScore || 0} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                {fundingProfile && fundingProfile.readinessScore >= 70
                  ? 'Good readiness - you can apply to most lenders'
                  : fundingProfile && fundingProfile.readinessScore >= 50
                  ? 'Fair readiness - some improvements recommended'
                  : 'Needs work - focus on readiness tasks first'}
              </p>
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={() => setCurrentView('readiness')}
                variant="outline"
                className="w-full"
              >
                View Full Readiness Report
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardStats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 bg-blue-500/10 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            Fast Path to Income
          </CardTitle>
          <CardDescription>
            Professional services to accelerate your funding journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <h4 className="font-semibold mb-2">Readiness Audit</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Professional analysis + action plan
              </p>
              <Button size="sm" variant="outline" onClick={() => setCurrentView('services')}>
                $199 - Learn More
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
              <h4 className="font-semibold mb-2">Application Concierge</h4>
              <p className="text-sm text-muted-foreground mb-3">
                White-glove packaging & submission
              </p>
              <Button size="sm" variant="outline" onClick={() => setCurrentView('services')}>
                $499 - Learn More
              </Button>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
              <h4 className="font-semibold mb-2">Credit Build Plan</h4>
              <p className="text-sm text-muted-foreground mb-3">
                90-day business credit program
              </p>
              <Button size="sm" variant="outline" onClick={() => setCurrentView('services')}>
                $299 - Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Showcase */}
      {user.role === 'partner' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Partner Portal
            </CardTitle>
            <CardDescription>Manage your leads and offers</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setCurrentView('partner-portal')}>
              Access Partner Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
