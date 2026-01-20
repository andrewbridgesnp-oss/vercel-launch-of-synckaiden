import { Bell, Plus, ChevronDown, Sparkles, Target, Users } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface TopBarProps {
  onNewCampaign: () => void;
  onNewContent: () => void;
}

export function TopBar({ onNewCampaign, onNewContent }: TopBarProps) {
  return (
    <div className="border-b border-border bg-[rgba(15,23,42,0.6)] backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            KAIDEN MARKETING OS™
          </h1>
          <div className="hidden sm:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <span>My Brand</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem>My Brand</DropdownMenuItem>
                <DropdownMenuItem>Second Brand</DropdownMenuItem>
                <DropdownMenuItem>Agency Client A</DropdownMenuItem>
                <DropdownMenuItem className="text-primary">
                  + Add New Brand
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">AI Active</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Notifications</p>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-accent/50 text-sm">
                    <p className="font-medium">New lead: John Smith</p>
                    <p className="text-muted-foreground">From Facebook Ad Campaign</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/50 text-sm">
                    <p className="font-medium">Campaign performing well</p>
                    <p className="text-muted-foreground">Summer Sale +34% CTR</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Action</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={onNewCampaign}>
                <Target className="h-4 w-4 mr-2" />
                New Campaign
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onNewContent}>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                Add Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}