// KAIDEN CAPITAL™ - Funding Map Component

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Target,
  Info,
  Filter,
} from 'lucide-react';
import { Progress } from './ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const FundingMap: React.FC = () => {
  const { recommendations, fundingProfile, engineMode, setEngineMode, generateFundingMap, isLoading } = useApp();
  const [selectedTab, setSelectedTab] = useState('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDays = (days: number) => {
    if (days < 1) return `${Math.round(days * 24)} hours`;
    if (days < 7) return `${Math.round(days)} days`;
    if (days < 30) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getProbabilityBadge = (probability: number) => {
    const percent = Math.round(probability * 100);
    if (percent >= 80) return <Badge className="bg-green-500">High: {percent}%</Badge>;
    if (percent >= 65) return <Badge className="bg-blue-500">Good: {percent}%</Badge>;
    if (percent >= 50) return <Badge className="bg-yellow-500">Fair: {percent}%</Badge>;
    return <Badge className="bg-orange-500">Low: {percent}%</Badge>;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="kaiden-heading-lg mb-2">Funding Map</h1>
          <p className="text-muted-foreground">
            Ranked funding sources optimized for your profile
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={engineMode} onValueChange={(value: any) => setEngineMode(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Balanced
                </div>
              </SelectItem>
              <SelectItem value="fastest-money">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Fastest Money
                </div>
              </SelectItem>
              <SelectItem value="lowest-cost">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Lowest Cost
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateFundingMap} disabled={isLoading}>
            {isLoading ? 'Calculating...' : 'Regenerate Map'}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Options</p>
                <p className="text-2xl font-bold mt-1">{recommendations.length}</p>
              </div>
              <Filter className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Best Approval</p>
                <p className="text-2xl font-bold mt-1">
                  {recommendations[0]
                    ? Math.round(recommendations[0].approvalProbability * 100) + '%'
                    : 'N/A'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fastest Option</p>
                <p className="text-2xl font-bold mt-1">
                  {recommendations[0] ? formatDays(recommendations[0].speed) : 'N/A'}
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="kaiden-glass-card border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Target Amount</p>
                <p className="text-2xl font-bold mt-1">
                  {fundingProfile ? formatCurrency(fundingProfile.targetAmount) : 'N/A'}
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Options ({recommendations.length})</TabsTrigger>
          <TabsTrigger value="high-approval">
            High Approval ({recommendations.filter(r => r.approvalProbability >= 0.75).length})
          </TabsTrigger>
          <TabsTrigger value="fast">
            Fast Track ({recommendations.filter(r => r.speed <= 5).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </TabsContent>

        <TabsContent value="high-approval" className="space-y-4 mt-6">
          {recommendations
            .filter(r => r.approvalProbability >= 0.75)
            .map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
        </TabsContent>

        <TabsContent value="fast" className="space-y-4 mt-6">
          {recommendations
            .filter(r => r.speed <= 5)
            .map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
        </TabsContent>
      </Tabs>

      {recommendations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete your intake to generate personalized funding recommendations
            </p>
            <Button onClick={generateFundingMap}>Generate Funding Map</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface RecommendationCardProps {
  recommendation: any;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [expanded, setExpanded] = useState(false);
  const { setCurrentView } = useApp();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDays = (days: number) => {
    if (days < 1) return `${Math.round(days * 24)} hours`;
    if (days < 7) return `${Math.round(days)} days`;
    if (days < 30) return `${Math.round(days / 7)} weeks`;
    return `${Math.round(days / 30)} months`;
  };

  const getProbabilityBadge = (probability: number) => {
    const percent = Math.round(probability * 100);
    if (percent >= 80) return <Badge className="bg-green-500">High: {percent}%</Badge>;
    if (percent >= 65) return <Badge className="bg-blue-500">Good: {percent}%</Badge>;
    if (percent >= 50) return <Badge className="bg-yellow-500">Fair: {percent}%</Badge>;
    return <Badge className="bg-orange-500">Low: {percent}%</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`text-4xl font-bold ${getScoreColor(recommendation.score)}`}>
                #{recommendation.rank}
              </div>
              <div>
                <CardTitle className="mb-1">{recommendation.source.name}</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{recommendation.source.type}</Badge>
                  {getProbabilityBadge(recommendation.approvalProbability)}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDays(recommendation.speed)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Match Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(recommendation.score)}`}>
              {recommendation.score}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(recommendation.confidence * 100)}% confidence
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Approval Odds</p>
            <p className="text-lg font-bold text-blue-600">
              {Math.round(recommendation.approvalProbability * 100)}%
            </p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Est. Amount</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(recommendation.estimatedAmount)}
            </p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Cost</p>
            <p className="text-lg font-bold text-purple-600">
              {formatCurrency(recommendation.netCost)}
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>{recommendation.explanation}</span>
          </p>
        </div>

        {/* Cost Structure */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Cost Structure</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {recommendation.source.costStructure.apr && (
              <div>
                <span className="text-muted-foreground">APR: </span>
                <span className="font-medium">{recommendation.source.costStructure.apr}</span>
              </div>
            )}
            {recommendation.source.costStructure.fees && (
              <div>
                <span className="text-muted-foreground">Fees: </span>
                <span className="font-medium">{recommendation.source.costStructure.fees}</span>
              </div>
            )}
            {recommendation.source.costStructure.equityStake && (
              <div>
                <span className="text-muted-foreground">Equity: </span>
                <span className="font-medium">{recommendation.source.costStructure.equityStake}</span>
              </div>
            )}
          </div>
        </div>

        {/* Next Actions */}
        {recommendation.nextActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Next Actions
            </h4>
            <ul className="space-y-1">
              {recommendation.nextActions.map((action: string, idx: number) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0 text-blue-500" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Blockers */}
        {recommendation.blockers.length > 0 && (
          <div className="space-y-2 p-3 bg-orange-50 rounded-lg">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-4 h-4" />
              Considerations
            </h4>
            <ul className="space-y-1">
              {recommendation.blockers.map((blocker: string, idx: number) => (
                <li key={idx} className="text-sm text-orange-700">{blocker}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tradeoffs (Expandable) */}
        {recommendation.tradeoffs.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="w-full justify-between"
            >
              <span className="font-semibold text-sm">View Tradeoffs</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </Button>
            {expanded && (
              <ul className="space-y-1 pl-4">
                {recommendation.tradeoffs.map((tradeoff: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground">• {tradeoff}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Requirements */}
        {expanded && (
          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-semibold text-sm">Requirements</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recommendation.source.requirements.map((req: string, idx: number) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0 text-gray-400" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button className="flex-1" onClick={() => setCurrentView('readiness')}>
            Check Readiness
          </Button>
          <Button variant="outline" className="flex-1">
            Start Application
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
