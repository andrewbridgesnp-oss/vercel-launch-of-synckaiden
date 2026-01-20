// KAIDEN CAPITAL™ - Readiness Plan Component

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  ArrowRight,
  Download,
  ExternalLink,
  Play,
  DollarSign,
} from 'lucide-react';
import { Checkbox } from './ui/checkbox';

export const ReadinessPlan: React.FC = () => {
  const { readinessScore, fundingProfile, setCurrentView } = useApp();
  const [selectedTab, setSelectedTab] = useState('overview');

  if (!readinessScore) {
    return <div>Loading...</div>;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'credit': return <TrendingUp className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="kaiden-heading-lg mb-2">Funding Readiness Plan</h1>
        <p className="text-muted-foreground">
          Fix-first approach to maximize your approval odds
        </p>
      </div>

      {/* Readiness Score Overview */}
      <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">Current Readiness Score</h3>
                <div className="text-4xl font-bold text-blue-600">
                  {readinessScore.score}/100
                </div>
              </div>
              <Progress value={readinessScore.score} className="h-4 mb-2" />
              <p className="text-sm text-muted-foreground">
                {readinessScore.score >= 80
                  ? 'Excellent - Ready to apply to most lenders'
                  : readinessScore.score >= 60
                  ? 'Good - Some improvements recommended before applying'
                  : readinessScore.score >= 40
                  ? 'Fair - Focus on key blockers first'
                  : 'Needs work - Complete priority tasks before applying'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Projected Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {readinessScore.score + readinessScore.projectedImprovement}/100
                </p>
                <p className="text-xs text-muted-foreground">
                  +{readinessScore.projectedImprovement} after completing tasks
                </p>
              </div>
              <Button className="w-full" onClick={() => setCurrentView('funding-map')}>
                View Funding Map
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blockers">
            Blockers ({readinessScore.blockers.length})
          </TabsTrigger>
          <TabsTrigger value="tasks">
            Tasks ({readinessScore.tasks.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Critical Blockers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Critical Blockers
              </CardTitle>
              <CardDescription>
                High-impact issues that significantly reduce approval odds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {readinessScore.blockers
                .filter(b => b.severity === 'critical' || b.severity === 'high')
                .map((blocker) => (
                  <div
                    key={blocker.id}
                    className="p-4 rounded-lg border-2 border-orange-200 bg-orange-50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(blocker.category)}
                        <h4 className="font-semibold">{blocker.title}</h4>
                      </div>
                      <Badge className={getSeverityColor(blocker.severity)}>
                        {blocker.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {blocker.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-red-600">
                        <TrendingUp className="w-3 h-3" />
                        Impact: -{blocker.impact}% approval odds
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {blocker.estimatedTimeToFix}
                      </span>
                    </div>
                  </div>
                ))}
              {readinessScore.blockers.filter(b => b.severity === 'critical' || b.severity === 'high').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p>No critical blockers - great job!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Priority Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                Priority Tasks
              </CardTitle>
              <CardDescription>
                Complete these tasks to improve your readiness score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {readinessScore.tasks
                .filter(t => t.priority === 'critical' || t.priority === 'high')
                .map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Blockers Tab */}
        <TabsContent value="blockers" className="space-y-4 mt-6">
          {readinessScore.blockers.map((blocker) => (
            <Card key={blocker.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${blocker.severity === 'critical' ? 'bg-red-100' : blocker.severity === 'high' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                      {getCategoryIcon(blocker.category)}
                    </div>
                    <div>
                      <CardTitle className="mb-1">{blocker.title}</CardTitle>
                      <CardDescription>{blocker.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(blocker.severity)}>
                    {blocker.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Approval Impact</p>
                    <p className="text-lg font-bold text-red-600">-{blocker.impact}%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Time to Fix</p>
                    <p className="text-lg font-bold text-blue-600">{blocker.estimatedTimeToFix}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  View Related Tasks
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-bold">
                  {readinessScore.tasks.filter(t => t.status === 'pending').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {readinessScore.tasks.filter(t => t.status === 'in-progress').length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {readinessScore.tasks.filter(t => t.status === 'completed').length}
                </p>
              </CardContent>
            </Card>
          </div>

          {readinessScore.tasks.map((task) => (
            <TaskCard key={task.id} task={task} detailed />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TaskCardProps {
  task: any;
  detailed?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, detailed = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setCurrentView } = useApp();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className={task.status === 'completed' ? 'opacity-60' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === 'completed'}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className={`font-semibold mb-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                  {task.title}
                </h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                {task.status === 'in-progress' && (
                  <Badge variant="outline" className="border-blue-500 text-blue-500">
                    <Play className="w-3 h-3 mr-1" />
                    In Progress
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.estimatedTime}
              </span>
              <span className="capitalize">{task.category}</span>
            </div>

            {(detailed || isExpanded) && task.resources && task.resources.length > 0 && (
              <div className="mt-4 space-y-2">
                <h5 className="text-sm font-semibold">Resources</h5>
                {task.resources.map((resource: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-lg flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {resource.type === 'template' && <FileText className="w-4 h-4 text-blue-500" />}
                        {resource.type === 'service' && <DollarSign className="w-4 h-4 text-green-500" />}
                        {resource.type === 'guide' && <ExternalLink className="w-4 h-4 text-purple-500" />}
                        <p className="text-sm font-medium">{resource.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {resource.isPaid && (
                        <Badge variant="outline" className="text-green-600">
                          ${resource.price}
                        </Badge>
                      )}
                      <Button size="sm" variant="ghost">
                        {resource.type === 'template' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!detailed && task.resources && task.resources.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2"
              >
                {isExpanded ? 'Hide' : 'Show'} Resources ({task.resources.length})
              </Button>
            )}

            {detailed && (
              <div className="flex gap-2 mt-4">
                {task.status === 'pending' && (
                  <Button size="sm">Start Task</Button>
                )}
                {task.status === 'in-progress' && (
                  <Button size="sm" variant="outline">Mark Complete</Button>
                )}
                {task.resources.some((r: any) => r.isPaid) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentView('services')}
                  >
                    Purchase Service
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
