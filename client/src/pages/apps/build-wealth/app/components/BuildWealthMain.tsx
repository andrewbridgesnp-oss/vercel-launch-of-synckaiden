import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Target, PiggyBank, LineChart, BookOpen } from "lucide-react";

export default function BuildWealthMain() {
  const [netWorth] = useState(125000);
  const [savingsRate] = useState(35);
  const [investmentReturn] = useState(8.5);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">BuildWealth Pro</h1>
          <p className="text-muted-foreground text-lg">
            Your comprehensive wealth building platform
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${netWorth.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{savingsRate}%</div>
              <Progress value={savingsRate} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Return</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{investmentReturn}%</div>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="goals">Financial Goals</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wealth Building Dashboard</CardTitle>
                <CardDescription>Track your progress toward financial freedom</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Emergency Fund</span>
                    <Badge variant="default">Complete</Badge>
                  </div>
                  <Progress value={100} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Retirement Savings</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Investment Portfolio</span>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <Progress value={60} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Investment Portfolio
                </CardTitle>
                <CardDescription>Manage your investment accounts and allocations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Investment tracking and portfolio management features coming soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Financial Goals
                </CardTitle>
                <CardDescription>Set and track your wealth building goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-semibold">Retirement</h3>
                    <p className="text-sm text-muted-foreground">Target: $2,000,000 by age 65</p>
                  </div>
                  <div className="border-l-4 border-secondary pl-4">
                    <h3 className="font-semibold">House Down Payment</h3>
                    <p className="text-sm text-muted-foreground">Target: $100,000 in 3 years</p>
                  </div>
                  <Button className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Add New Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Financial Education
                </CardTitle>
                <CardDescription>Learn strategies to build and protect your wealth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <h4 className="font-semibold mb-1">Introduction to Investing</h4>
                    <p className="text-sm text-muted-foreground">Learn the basics of building an investment portfolio</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <h4 className="font-semibold mb-1">Tax-Advantaged Accounts</h4>
                    <p className="text-sm text-muted-foreground">Maximize your savings with 401(k), IRA, and HSA accounts</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <h4 className="font-semibold mb-1">Asset Allocation Strategies</h4>
                    <p className="text-sm text-muted-foreground">Build a diversified portfolio based on your risk tolerance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
