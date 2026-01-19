import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, AlertCircle, Search, TrendingUp, Package, Code, Database, Loader2 } from "lucide-react";

export default function AppDevelopmentDashboard() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allApps = [], isLoading } = trpc.appAudit.getAllApps.useQuery();
  const { data: summary } = trpc.appAudit.getSummary.useQuery();

  // Filter apps
  const filteredApps = allApps.filter(app => {
    if (filterStatus !== "all" && app.completionStatus !== filterStatus) return false;
    if (filterTier !== "all" && app.roiTier !== filterTier) return false;
    if (filterCategory !== "all" && app.category !== filterCategory) return false;
    if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Get unique categories
  const categories = Array.from(new Set(allApps.map(app => app.category)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background luxury-gradient flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      {/* Hero */}
      <div className="border-b border-border/50 glass">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-border/30">
              <TrendingUp className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold cyan-shimmer mb-2">App Development Dashboard</h1>
              <p className="text-muted-foreground text-lg">
                Track completion status of all 66 Synckaiden apps
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass premium-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Package className="w-8 h-8 text-primary" />
                <Badge variant="default">{summary?.overallPercentage}%</Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">{summary?.complete}/{summary?.total}</h3>
              <p className="text-sm text-muted-foreground">Apps Complete</p>
              <Progress value={summary?.overallPercentage} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="glass premium-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <Badge variant="default" className="bg-green-500/20 text-green-500 border-green-500/30">
                  Tier 1
                </Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">{summary?.tier1.complete}/{summary?.tier1.total}</h3>
              <p className="text-sm text-muted-foreground">High ROI Apps</p>
              <Progress value={summary?.tier1.percentage} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="glass premium-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
                <Badge variant="secondary">{summary?.partial}</Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">{summary?.partial}</h3>
              <p className="text-sm text-muted-foreground">Partial Apps</p>
              <p className="text-xs text-muted-foreground mt-2">Backend or Frontend missing</p>
            </CardContent>
          </Card>

          <Card className="glass premium-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Circle className="w-8 h-8 text-red-500" />
                <Badge variant="destructive">{summary?.missing}</Badge>
              </div>
              <h3 className="text-3xl font-bold mb-1">{summary?.missing}</h3>
              <p className="text-sm text-muted-foreground">Not Started</p>
              <p className="text-xs text-muted-foreground mt-2">No backend or frontend</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass premium-card border-border/50 mb-8">
          <CardHeader>
            <CardTitle>Filter Apps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                  <SelectItem value="Missing">Missing</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterTier} onValueChange={setFilterTier}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="Tier 1">Tier 1 (High ROI)</SelectItem>
                  <SelectItem value="Tier 2">Tier 2 (Mid ROI)</SelectItem>
                  <SelectItem value="Tier 3">Tier 3 (Supporting)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* ROI Tier Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="glass border border-border/50">
            <TabsTrigger value="all">All Apps ({filteredApps.length})</TabsTrigger>
            <TabsTrigger value="tier1">Tier 1 ({allApps.filter(a => a.roiTier === 'Tier 1').length})</TabsTrigger>
            <TabsTrigger value="tier2">Tier 2 ({allApps.filter(a => a.roiTier === 'Tier 2').length})</TabsTrigger>
            <TabsTrigger value="tier3">Tier 3 ({allApps.filter(a => a.roiTier === 'Tier 3').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredApps.map(app => (
              <AppCard key={app.slug} app={app} />
            ))}
          </TabsContent>

          <TabsContent value="tier1" className="space-y-4">
            {filteredApps.filter(a => a.roiTier === 'Tier 1').map(app => (
              <AppCard key={app.slug} app={app} />
            ))}
          </TabsContent>

          <TabsContent value="tier2" className="space-y-4">
            {filteredApps.filter(a => a.roiTier === 'Tier 2').map(app => (
              <AppCard key={app.slug} app={app} />
            ))}
          </TabsContent>

          <TabsContent value="tier3" className="space-y-4">
            {filteredApps.filter(a => a.roiTier === 'Tier 3').map(app => (
              <AppCard key={app.slug} app={app} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface AppCardProps {
  app: {
    name: string;
    slug: string;
    category: string;
    price: number;
    roiTier: string;
    hasBackend: boolean;
    hasFrontend: boolean;
    hasDatabase: boolean;
    completionStatus: string;
    completionPercentage: number;
    missingComponents: string[];
  };
}

function AppCard({ app }: AppCardProps) {
  const statusColors = {
    Complete: "bg-green-500/20 text-green-500 border-green-500/30",
    Partial: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    Missing: "bg-red-500/20 text-red-500 border-red-500/30",
  };

  const tierColors = {
    'Tier 1': "bg-purple-500/20 text-purple-500 border-purple-500/30",
    'Tier 2': "bg-blue-500/20 text-blue-500 border-blue-500/30",
    'Tier 3': "bg-gray-500/20 text-gray-500 border-gray-500/30",
  };

  return (
    <Card className="glass premium-card border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold">{app.name}</h3>
              <Badge className={statusColors[app.completionStatus as keyof typeof statusColors]}>
                {app.completionStatus}
              </Badge>
              <Badge className={tierColors[app.roiTier as keyof typeof tierColors]}>
                {app.roiTier}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{app.category}</span>
              <span>•</span>
              <span>${(app.price / 100).toFixed(2)}/mo</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold mb-1">{app.completionPercentage}%</div>
            <Progress value={app.completionPercentage} className="w-24" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            {app.hasBackend ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-red-500" />
            )}
            <div>
              <div className="text-sm font-medium">Backend</div>
              <div className="text-xs text-muted-foreground">
                {app.hasBackend ? "Complete" : "Missing"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {app.hasFrontend ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-red-500" />
            )}
            <div>
              <div className="text-sm font-medium">Frontend</div>
              <div className="text-xs text-muted-foreground">
                {app.hasFrontend ? "Complete" : "Missing"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {app.hasDatabase ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-red-500" />
            )}
            <div>
              <div className="text-sm font-medium">Database</div>
              <div className="text-xs text-muted-foreground">
                {app.hasDatabase ? "Complete" : "Missing"}
              </div>
            </div>
          </div>
        </div>

        {app.missingComponents.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Missing: {app.missingComponents.join(", ")}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
