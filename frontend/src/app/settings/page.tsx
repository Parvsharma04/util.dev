"use client";

import { useState } from "react";
import { Sun, Moon, Monitor, ArrowLeft, Keyboard, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "dark",
      name: "Dark",
      description: "Easy on the eyes for night sessions",
      icon: Moon,
      preview: "bg-slate-900 border-slate-700",
      textColor: "text-muted-foreground",
    },
    {
      id: "light",
      name: "Light",
      description: "Clean and bright for daytime use",
      icon: Sun,
      preview: "bg-white border-slate-200",
      textColor: "text-muted-foreground",
    },
    {
      id: "system",
      name: "System",
      description: "Follows your OS preference",
      icon: Monitor,
      preview: "bg-gradient-to-r from-slate-900 to-white border-slate-400",
      textColor: "text-muted-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground transition-colors">Home</a>
            <span>→</span>
            <span className="text-foreground">Settings</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="/">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </a>
            <div>
              <h1 className="text-3xl font-bold text-foreground glow">Settings</h1>
              <p className="text-muted-foreground">Customize your util.dev experience</p>
            </div>
          </div>
        </div>

        {/* Theme Selection */}
        <Card className="mb-8 card-glow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Choose your preferred theme</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={theme}
              onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {themes.map((t) => (
                <div key={t.id}>
                  <RadioGroupItem
                    value={t.id}
                    id={t.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={t.id}
                    className="flex items-center gap-4 rounded-lg border-2 border-border p-4 cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                  >
                    <div className={`w-12 h-12 rounded-lg border-2 ${t.preview} flex items-center justify-center shrink-0`}>
                      <t.icon className={`w-6 h-6 ${t.textColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{t.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{t.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="card-glow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Keyboard Shortcuts</CardTitle>
                <CardDescription>Quick access to common actions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Open Command Palette</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">⌘</kbd>
                  <span className="text-muted-foreground">+</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">K</kbd>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-foreground">Toggle Sidebar</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">⌘</kbd>
                  <span className="text-muted-foreground">+</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">B</kbd>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-foreground">Go to Home</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">⌘</kbd>
                  <span className="text-muted-foreground">+</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">H</kbd>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-foreground">Copy Output</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">⌘</kbd>
                  <span className="text-muted-foreground">+</span>
                  <kbd className="px-2 py-1 text-xs font-mono bg-muted text-muted-foreground rounded border border-border">C</kbd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>util.dev • Fast tools. Clean UI. Zero nonsense.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
