"use client";

import { useState, useEffect } from "react";
import { Copy, Clock, Calendar, Globe, Monitor, Zap, History, Info, Check, RefreshCw, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [humanDate, setHumanDate] = useState(new Date().toISOString().slice(0, 16));
  const [isLive, setIsLive] = useState(true);
  const [liveNow, setLiveNow] = useState(Math.floor(Date.now() / 1000));
  const { toast } = useToast();

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLiveNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  const convertFromTimestamp = (ts: string) => {
    try {
      const num = parseInt(ts);
      if (isNaN(num)) return null;
      // Heuristic: if > 10^12, assume milliseconds
      const date = num > 99999999999 ? new Date(num) : new Date(num * 1000);
      if (isNaN(date.getTime())) return null;

      return {
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        relative: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
          Math.floor((date.getTime() - Date.now()) / 1000 / 60 / 60 / 24), 'day'
        ),
        ms: date.getTime(),
        sec: Math.floor(date.getTime() / 1000)
      };
    } catch {
      return null;
    }
  };

  const convertFromHuman = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return null;
      return Math.floor(date.getTime() / 1000);
    } catch {
      return null;
    }
  };

  const setNow = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
    setHumanDate(new Date().toISOString().slice(0, 16));
    toast({ title: "Clock Synced", description: "Inputs updated to current system time" });
  };

  const formats = convertFromTimestamp(timestamp);
  const humanTimestamp = convertFromHuman(humanDate);

  const copyToClipboard = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: `${format} copied to clipboard`,
    });
  };

  return (
    <ToolLayout
      title="Epoch Projector"
      description="Bi-directional conversion between UNIX timestamps and human-readable temporal formats"
      category="Developer Tools"
      icon={Clock}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Clock Stats */}
        <Card className="lg:col-span-3 bg-primary/5 border-primary/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-32 h-32" />
          </div>
          <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Live Temporal Stream</h3>
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-mono font-bold tracking-tighter text-foreground tabular-nums">
                  {liveNow}
                </p>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse">
                  LIVE
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-mono">Current UNIX Epoch (Seconds)</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)} className="font-mono text-xs">
                {isLive ? "Pause Stream" : "Resume Stream"}
              </Button>
              <Button size="sm" onClick={setNow} className="font-mono text-xs bg-primary">
                Snap to Current
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border card-glow">
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <CardTitle className="font-mono text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Input Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <Tabs defaultValue="ts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-9 p-1 bg-muted/20 mb-6">
                  <TabsTrigger value="ts" className="text-[10px] font-bold uppercase tracking-wider">Epoch</TabsTrigger>
                  <TabsTrigger value="date" className="text-[10px] font-bold uppercase tracking-wider">Date</TabsTrigger>
                </TabsList>

                <TabsContent value="ts" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Unix Timestamp</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground opacity-50" />
                      <Input
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        className="pl-9 font-mono text-sm bg-muted/20 border-border"
                        placeholder="1740781200"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="date" className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Calendar Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground opacity-50" />
                      <Input
                        type="datetime-local"
                        value={humanDate}
                        onChange={(e) => setHumanDate(e.target.value)}
                        className="pl-9 font-mono text-sm bg-muted/20 border-border"
                      />
                    </div>
                  </div>
                  {humanTimestamp && (
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                      <p className="text-[10px] text-primary/70 font-mono italic mb-1 uppercase tracking-tighter">Resulting Epoch</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-primary">{humanTimestamp}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(humanTimestamp.toString(), "Timestamp")}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-muted/10 border-border">
            <CardContent className="p-6">
              <div className="flex gap-4 items-start text-muted-foreground">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[11px] font-mono leading-relaxed">
                  <strong>Auto-Detection:</strong> We automatically determine if your input is in <span className="text-foreground font-bold italic">seconds</span> or <span className="text-foreground font-bold italic">milliseconds</span> based on the digit count.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panels */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border card-glow flex flex-col h-full">
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <CardTitle className="font-mono text-sm flex items-center gap-2">
                <Monitor className="w-4 h-4 text-primary" />
                Temporal Projections
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {formats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "ISO-8601 String", val: formats.iso, icon: Globe },
                    { label: "Human Local", val: formats.local, icon: Clock },
                    { label: "UTC Representation", val: formats.utc, icon: Globe },
                    { label: "Relative Offset", val: formats.relative, icon: History },
                    { label: "Raw Milliseconds", val: formats.ms.toString(), icon: Hash },
                    { label: "Raw Seconds", val: formats.sec.toString(), icon: Hash }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-muted/5 border border-border rounded-2xl group hover:border-primary/30 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-3 h-3 text-primary opacity-50" />
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{item.label}</span>
                        </div>
                        <p className="font-mono text-xs text-foreground truncate max-w-[200px]">{item.val}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(item.val, item.label)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center h-[300px] opacity-20 italic font-mono text-sm">
                  <RefreshCw className="w-12 h-12 mb-4 animate-spin-slow" />
                  <p>Awaiting valid temporal sequence...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/5 border-border">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-mono text-muted-foreground">
                <div className="space-y-1">
                  <span className="text-foreground font-bold uppercase">Resolution</span>
                  <p>Precision is maintained down to the millisecond within the internal Date object.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-foreground font-bold uppercase">Timezones</span>
                  <p>All conversions assume UTC for ISO output and your system locale for Local output.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-foreground font-bold uppercase">Entropy</span>
                  <p>Standard Unix Epoch starts exactly at 1970-01-01T00:00:00Z.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default TimestampConverter;
