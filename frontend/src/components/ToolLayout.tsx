import { ReactNode } from "react";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface ToolLayoutProps {
  children: ReactNode;
}

export function ToolLayout({ children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-background matrix-bg">
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

      {children}
    </div>
  );
}
