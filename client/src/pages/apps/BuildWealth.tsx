import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import PlatformAccessGate from '../../components/PlatformAccessGate';

export default function BuildWealth() {
  return (
    <PlatformAccessGate platformSlug="financial-command-center">
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link href="/dashboard">
              <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </a>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">BuildWealth Pro</h1>
            <p className="text-lg text-muted-foreground">
              Investment tracking and wealth building platform
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                This feature is currently under development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                BuildWealth Pro will help you track investments, build wealth, and manage your financial growth.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PlatformAccessGate>
  );
}
