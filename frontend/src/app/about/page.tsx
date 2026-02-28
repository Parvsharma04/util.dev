"use client";

import { Terminal, ArrowLeft, Github, Heart, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

const About = () => {
  const principles = [
    {
      icon: Zap,
      title: "Speed Is the Feature",
      description: "Instant load times. Tools usable without sign-in. Zero unnecessary clicks."
    },
    {
      icon: Shield,
      title: "Local-First & Private",
      description: "Inputs stay in the browser by default. Offline support where possible. No silent data collection."
    },
    {
      icon: Clock,
      title: "Minimal UI, Maximum Utility",
      description: "One tool, one job. No nested complexity. Keyboard-first interactions."
    }
  ];

  return (
    <div className="min-h-screen bg-background matrix-bg">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/30 font-mono">
            &gt; About util.dev
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 font-mono glow">
            Fast tools. Clean UI.
            <br />
            <span className="text-primary">Zero nonsense.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            util.dev is a developer-first utility hub — fast, minimal, offline-capable, and opinionated. 
            It brings together the tools developers reach for every day, without ads, auth walls, or unnecessary abstraction.
          </p>
        </div>

        {/* Vision */}
        <Card className="mb-12 bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="text-foreground font-mono glow">🧠 Product Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>
              Developers constantly context-switch between random one-off websites, terminal scripts, 
              browser extensions, and outdated tools with bad UX.
            </p>
            <p>
              <strong className="text-foreground">util.dev exists to centralize essential developer utilities 
              into a single, clean workspace that feels instant, trustworthy, and calm.</strong>
            </p>
            <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
              <p className="text-center font-mono text-primary glow">
                "Finish the task before your coffee cools."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Principles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8 font-mono glow flex items-center gap-2">
            <span className="text-muted-foreground">&gt;</span> Product Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {principles.map((principle) => (
              <Card key={principle.title} className="bg-card border-border card-glow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center mb-4">
                    <principle.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 font-mono">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ethics */}
        <Card className="mb-12 bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="text-foreground font-mono glow">🔒 Boundaries & Ethics</CardTitle>
            <CardDescription>What util.dev will NEVER do</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-destructive font-mono">✕</span>
                Force login to use tools
              </li>
              <li className="flex items-center gap-2">
                <span className="text-destructive font-mono">✕</span>
                Store private inputs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-destructive font-mono">✕</span>
                Inject ads or affiliate links
              </li>
              <li className="flex items-center gap-2">
                <span className="text-destructive font-mono">✕</span>
                Obscure simple tasks
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="mb-12 bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="text-foreground font-mono glow">🛠️ Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="outline" className="justify-center py-2 font-mono border-border">React</Badge>
              <Badge variant="outline" className="justify-center py-2 font-mono border-border">TypeScript</Badge>
              <Badge variant="outline" className="justify-center py-2 font-mono border-border">Vite</Badge>
              <Badge variant="outline" className="justify-center py-2 font-mono border-border">Tailwind CSS</Badge>
              <Badge variant="outline" className="justify-center py-2 font-mono border-border">shadcn/ui</Badge>
              <Badge variant="outline" className="justify-center py-2 font-mono border-border">Radix</Badge>
              <Badge variant="outline" className="justify-center py-2 font-mono border-border">Node.js</Badge>
              <Badge variant="outline" className="justify-center py-2 font-mono border-border">Express</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6 font-mono">
            Built with <Heart className="w-4 h-4 inline text-red-500" /> for developers
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-border hover:border-primary/50 font-mono">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
