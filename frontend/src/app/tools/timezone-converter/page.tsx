"use client";

import { useState, useEffect } from "react";
import { Copy, Clock, Globe, Calendar, RefreshCw, Info, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const TimezoneConverter = () => {
  const [sourceTime, setSourceTime] = useState("");
  const [sourceTimezone, setSourceTimezone] = useState("UTC");
  const [targetTimezone, setTargetTimezone] = useState("America/New_York");
  const [convertedTime, setConvertedTime] = useState("");
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "Eastern Time (New York)" },
    { value: "America/Chicago", label: "Central Time (Chicago)" },
    { value: "America/Denver", label: "Mountain Time (Denver)" },
    { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles)" },
    { value: "Europe/London", label: "GMT (London)" },
    { value: "Europe/Paris", label: "CET (Paris)" },
    { value: "Europe/Berlin", label: "CET (Berlin)" },
    { value: "Asia/Tokyo", label: "JST (Tokyo)" },
    { value: "Asia/Shanghai", label: "CST (Shanghai)" },
    { value: "Asia/Kolkata", label: "IST (India)" },
    { value: "Australia/Sydney", label: "AEST (Sydney)" },
    { value: "Pacific/Auckland", label: "NZST (Auckland)" }
  ];

  const majorTimezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Asia/Tokyo",
    "Asia/Kolkata",
    "Australia/Sydney"
  ];

  useEffect(() => {
    const updateCurrentTimes = () => {
      const times: { [key: string]: string } = {};
      majorTimezones.forEach(tz => {
        const now = new Date();
        times[tz] = now.toLocaleTimeString("en-US", {
          timeZone: tz,
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      });
      setCurrentTimes(times);
    };

    updateCurrentTimes();
    const interval = setInterval(updateCurrentTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    setSourceTime(`${year}-${month}-${day}T${hours}:${mins}`);
  };

  const convertTime = () => {
    if (!sourceTime) {
      toast({ title: "Input Required", description: "Please select a date and time", variant: "destructive" });
      return;
    }

    try {
      const date = new Date(sourceTime);
      // This is a bit tricky with raw JS Date. 
      // We'll use Intl.DateTimeFormat to get the string in the target timezone.
      const targetStr = date.toLocaleString("en-US", {
        timeZone: targetTimezone,
        dateStyle: "full",
        timeStyle: "long",
      });
      setConvertedTime(targetStr);
      toast({ title: "Converted", description: "Time converted successfully" });
    } catch (e) {
      toast({ title: "Error", description: "Invalid date or timezone", variant: "destructive" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Converted time copied" });
  };

  const getTimezoneLabel = (val: string) => timezones.find(t => t.value === val)?.label || val;

  return (
    <ToolLayout
      title="Timezone Converter"
      description="Convert times between global timezones with real-time world clocks"
      category="Time & Schedule"
      icon={Globe}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Converter Card */}
        <Card className="lg:col-span-2 bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Converter
            </CardTitle>
            <CardDescription className="font-mono">Adjust source and target zones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">From Timezone</label>
                <Select value={sourceTimezone} onValueChange={setSourceTimezone}>
                  <SelectTrigger className="bg-muted/20 border-border font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="font-mono text-xs">
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">To Timezone</label>
                <Select value={targetTimezone} onValueChange={setTargetTimezone}>
                  <SelectTrigger className="bg-muted/20 border-border font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="font-mono text-xs">
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Source Date & Time</label>
              <div className="flex gap-2">
                <Input
                  type="datetime-local"
                  value={sourceTime}
                  onChange={(e) => setSourceTime(e.target.value)}
                  className="flex-1 font-mono bg-muted/20 border-border h-12"
                />
                <Button variant="outline" onClick={handleNow} className="font-mono h-12 px-6 border-border">
                  Now
                </Button>
              </div>
            </div>

            <Button onClick={convertTime} className="w-full h-12 font-mono bg-primary hover:bg-primary/90 text-lg">
              <Clock className="w-5 h-5 mr-2" />
              Convert Time
            </Button>

            {convertedTime && (
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Converted Outcome</p>
                    <p className="text-xl font-bold font-mono text-foreground leading-tight">{convertedTime}</p>
                    <p className="text-xs text-muted-foreground font-mono italic">{getTimezoneLabel(targetTimezone)}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => copyToClipboard(convertedTime)} className="hover:bg-primary/10 hover:text-primary">
                    <Copy className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* World Clock Sidebar */}
        <div className="space-y-6">
          <Card className="bg-card border-border card-glow">
            <CardHeader>
              <CardTitle className="font-mono flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                World Clock
              </CardTitle>
              <CardDescription className="font-mono text-xs">Major tech hubs & global zones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {majorTimezones.map((tz) => (
                <div key={tz} className="group p-3 border border-border rounded-xl bg-muted/10 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between font-mono">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold group-hover:text-primary transition-colors">
                      {tz.split("/").pop()?.replace("_", " ")}
                    </div>
                    <div className="text-sm font-bold text-foreground tabular-nums">
                      {currentTimes[tz] || "--:--:--"}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-border">
            <CardContent className="p-6 space-y-4 text-xs font-mono text-muted-foreground">
              <div className="flex gap-3">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <p>Calculations use your browser's local Intl libraries for high precision.</p>
              </div>
              <div className="flex gap-3">
                <Timer className="w-4 h-4 text-primary shrink-0" />
                <p>The world clock updates in real-time every second.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TimezoneConverter;
