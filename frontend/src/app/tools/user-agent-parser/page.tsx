"use client";

import { useState } from "react";
import { Search, Copy, Monitor, Smartphone, Globe, Info, Zap, Chrome, Apple, Terminal, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const UserAgentParser = () => {
  const [userAgent, setUserAgent] = useState("");
  const [parsedResult, setParsedResult] = useState<any>(null);
  const { toast } = useToast();

  const commonUserAgents = [
    {
      name: "Chrome (Windows)",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    },
    {
      name: "Firefox (macOS)",
      ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/120.0"
    },
    {
      name: "Safari (iOS)",
      ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    },
    {
      name: "Chrome (Android)",
      ua: "Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
    },
    {
      name: "Googlebot",
      ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    }
  ];

  const parseUserAgent = (ua: string) => {
    const result: any = {
      browser: { name: "Unknown", version: "Unknown" },
      os: { name: "Unknown", version: "Unknown" },
      device: { type: "Desktop", vendor: "Unknown" },
      engine: { name: "Unknown" }
    };

    // Very basic parsing logic
    if (ua.includes("Firefox")) result.browser.name = "Firefox";
    else if (ua.includes("Edg")) result.browser.name = "Edge";
    else if (ua.includes("Chrome")) result.browser.name = "Chrome";
    else if (ua.includes("Safari")) result.browser.name = "Safari";
    else if (ua.includes("Googlebot")) result.browser.name = "Googlebot";

    if (ua.includes("Windows NT 10.0")) result.os.name = "Windows 10/11";
    else if (ua.includes("Mac OS X")) result.os.name = "macOS";
    else if (ua.includes("Android")) { result.os.name = "Android"; result.device.type = "Mobile"; }
    else if (ua.includes("iPhone")) { result.os.name = "iOS"; result.device.type = "Mobile"; result.device.vendor = "Apple"; }
    else if (ua.includes("Linux")) result.os.name = "Linux";

    if (ua.includes("WebKit")) result.engine.name = "WebKit / Blink";
    else if (ua.includes("Gecko")) result.engine.name = "Gecko";

    return result;
  };

  const handleParse = () => {
    if (!userAgent.trim()) {
      toast({ title: "Input Required", description: "Please enter a user agent string", variant: "destructive" });
      return;
    }
    setParsedResult(parseUserAgent(userAgent));
    toast({ title: "Analyzed", description: "User agent details extracted" });
  };

  const setCurrentUserAgent = () => {
    setUserAgent(navigator.userAgent);
  };

  return (
    <ToolLayout
      title="User Agent Inspector"
      description="Deconstruct user agent strings into browser, OS, and device details"
      category="Network & Web"
      icon={Globe}
    >
      <div className="space-y-6">
        {/* Input Card */}
        <Card className="bg-card border-border card-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-mono text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  Agent String
                </CardTitle>
                <CardDescription className="font-mono text-[10px]">Paste a string or use current browser</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={setCurrentUserAgent} className="font-mono text-[10px] h-8">
                Use My Browser
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              className="min-h-[100px] font-mono text-xs bg-muted/10 border-border"
            />
            <Button onClick={handleParse} className="w-full font-mono bg-primary">
              <Search className="w-4 h-4 mr-2" />
              Analyze String
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Samples */}
          <Card className="lg:col-span-1 bg-card border-border card-glow">
            <CardHeader className="pb-3 border-b border-border mb-4">
              <CardTitle className="font-mono text-xs flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Common Presets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {commonUserAgents.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => { setUserAgent(sample.ua); setParsedResult(parseUserAgent(sample.ua)); }}
                  className="w-full p-3 text-left border border-border rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-all group"
                >
                  <div className="font-bold font-mono text-[10px] text-foreground group-hover:text-primary">{sample.name}</div>
                  <div className="text-[9px] text-muted-foreground truncate font-mono mt-1">{sample.ua}</div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Results Display */}
          <div className="lg:col-span-2 space-y-6">
            {parsedResult ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Browser", val: parsedResult.browser.name, icon: Chrome, color: "text-blue-500" },
                  { label: "Operating System", val: parsedResult.os.name, icon: Apple, color: "text-zinc-400" },
                  { label: "Device Type", val: parsedResult.device.type, icon: parsedResult.device.type === "Mobile" ? Smartphone : Monitor, color: "text-indigo-500" },
                  { label: "Rendering Engine", val: parsedResult.engine.name, icon: Settings2, color: "text-emerald-500" },
                ].map((item) => (
                  <Card key={item.label} className="bg-card border-border card-glow overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</div>
                        <div className="text-sm font-bold font-mono text-foreground">{item.val}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="sm:col-span-2 bg-muted/20 border-border">
                  <CardHeader className="py-3">
                    <CardTitle className="text-xs font-mono uppercase tracking-widest">Full Analysis Object</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-[10px] font-mono text-muted-foreground bg-muted/40 p-4 rounded-lg overflow-auto max-h-[200px]">
                      {JSON.stringify(parsedResult, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full min-h-[300px] border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-mono text-xs italic">Enter a user-agent string above to see the structural breakdown of the device and browser.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default UserAgentParser;
