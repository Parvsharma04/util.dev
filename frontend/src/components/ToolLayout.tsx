"use client";

import { ReactNode } from "react";
import { ArrowLeft, Terminal, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  icon: LucideIcon | React.FC<any>;
  children: ReactNode;
  popular?: boolean;
}

export function ToolLayout({ title, description, category, icon: Icon, children, popular }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-background matrix-bg animate-fade-in">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <a href="/">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </a>
              <a href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-foreground font-mono glow text-sm">util.dev</span>
              </a>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-mono">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span className="text-primary">→</span>
            <a href="/tools" className="hover:text-primary transition-colors">Tools</a>
            <span className="text-primary">→</span>
            <span className="text-foreground">{title}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-mono glow">{title}</h1>
              <p className="text-muted-foreground font-mono">{description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-border font-mono">{category}</Badge>
            {popular && <Badge variant="outline" className="border-yellow-500/30 text-yellow-500 font-mono">Popular</Badge>}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
