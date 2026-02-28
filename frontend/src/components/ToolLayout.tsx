"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/AppShell";


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
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">

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
    </AppShell>

  );
}

