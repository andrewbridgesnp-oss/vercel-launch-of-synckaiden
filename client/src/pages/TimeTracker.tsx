import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Play, Square, Clock, Calendar, DollarSign } from "lucide-react";

export default function TimeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTask, setCurrentTask] = useState("");
  const [elapsedTime, setElapsedTime] = useState(0);

  const [timeEntries] = useState([
    {
      id: 1,
      task: "Website Design",
      project: "Client Website",
      duration: 3.5,
      date: "2026-01-28",
      billable: true
    },
    {
      id: 2,
      task: "Code Review",
      project: "Internal",
      duration: 1.25,
      date: "2026-01-28",
      billable: false
    },
    {
      id: 3,
      task: "Client Meeting",
      project: "Client Website",
      duration: 1.0,
      date: "2026-01-27",
      billable: true
    },
  ]);

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const billableHours = timeEntries.filter(e => e.billable).reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/business-hub">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Business Hub
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Time Tracker</h1>
          <p className="text-muted-foreground">Track your time and manage billable hours</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(totalHours)}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(billableHours)}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((billableHours / totalHours) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(billableHours * 100).toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">At $100/hour</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Timer</CardTitle>
            <CardDescription>Start tracking time for a task</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Task Description</Label>
                  <Input
                    placeholder="What are you working on?"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    disabled={isTracking}
                  />
                </div>
                <div>
                  <Label>Project</Label>
                  <Select disabled={isTracking}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client-website">Client Website</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isTracking ? (
                  <>
                    <div className="flex-1 text-3xl font-mono font-bold">
                      {Math.floor(elapsedTime / 3600)}:{String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0')}:{String(elapsedTime % 60).padStart(2, '0')}
                    </div>
                    <Button variant="destructive" onClick={() => setIsTracking(false)}>
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsTracking(true)} disabled={!currentTask}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="recent">
          <TabsList>
            <TabsTrigger value="recent">Recent Entries</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {timeEntries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{entry.task}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.project} • {new Date(entry.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={entry.billable ? "default" : "secondary"}>
                        {entry.billable ? "Billable" : "Non-billable"}
                      </Badge>
                      <div className="text-lg font-mono font-semibold">
                        {formatTime(entry.duration)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Time tracking reports coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
