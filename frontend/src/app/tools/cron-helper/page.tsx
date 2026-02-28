"use client";

import { useState, useEffect } from "react";
import { Copy, Clock, Calendar, Hash, Info, RotateCcw, Settings, Zap, History, Layout, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const CronHelper = () => {
  const [cronExpression, setCronExpression] = useState("0 12 * * *");
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("12");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [description, setDescription] = useState("At 12:00 PM, every day");
  const { toast } = useToast();

  const presets = [
    { name: "Every minute", expression: "* * * * *", desc: "Minute-by-minute execution" },
    { name: "Hourly Start", expression: "0 * * * *", desc: "Top of every hour" },
    { name: "Daily Midnight", expression: "0 0 * * *", desc: "Every day at 12:00 AM" },
    { name: "Daily Noon", expression: "0 12 * * *", desc: "Every day at 12:00 PM" },
    { name: "Weekly Sunday", expression: "0 0 * * 0", desc: "Sundays at midnight" },
    { name: "Monthly Start", expression: "0 0 1 * *", desc: "1st day of every month" },
    { name: "Quarterly", expression: "0 0 1 */3 *", desc: "Every 3 months" },
    { name: "Workdays Only", expression: "0 9 * * 1-5", desc: "9 AM on weekdays" },
    { name: "Every 15 mins", expression: "*/15 * * * *", desc: "High frequency syncs" },
    { name: "Every 6 hours", expression: "0 */6 * * *", desc: "Quadratic execution" }
  ];

  const generateDescription = (expression: string) => {
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) {
      setDescription("Invalid Stream: Segment mismatch detected");
      return;
    }
    const [min, hr, dom, mon, dow] = parts;

    let descParts: string[] = [];

    // Day of week
    let dowDesc = "";
    if (dow !== "*") {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      if (dow.includes("-")) {
        const [start, end] = dow.split("-");
        dowDesc = `on ${days[parseInt(start)]} through ${days[parseInt(end)]}`;
      } else if (dow.includes(",")) {
        const daysList = dow.split(",").map(d => days[parseInt(d)]).join(", ");
        dowDesc = `on ${daysList}`;
      } else {
        dowDesc = `on ${days[parseInt(dow)]}`;
      }
    }

    // Time
    if (hr === "*" && min === "*") {
      descParts.push("every single minute");
    } else if (hr === "*") {
      descParts.push(min === "0" ? "at the start of every hour" : `at minute ${min} of every hour`);
    } else if (min === "*") {
      descParts.push(`every minute during hour ${hr}`);
    } else {
      descParts.push(`at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`);
    }

    if (dowDesc) descParts.push(dowDesc);
    if (dom !== "*") descParts.push(`on day ${dom} of the month`);
    if (mon !== "*") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      descParts.push(`in ${months[parseInt(mon) - 1]}`);
    }

    const finalDesc = descParts.join(", ");
    setDescription(finalDesc.charAt(0).toUpperCase() + finalDesc.slice(1));
  };

  const handleInputChange = (val: string) => {
    setCronExpression(val);
    const parts = val.trim().split(/\s+/);
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
      generateDescription(val);
    }
  };

  const syncFromFields = () => {
    const expr = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setCronExpression(expr);
    generateDescription(expr);
  };

  useEffect(() => {
    syncFromFields();
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression);
    toast({ title: "Copied!", description: "Schedule manifest copied to clipboard" });
  };

  return (
    <ToolLayout
      title="Cron Architect"
      description="Design, optimize, and decode complex job schedules for automation engines"
      category="Time & Schedule"
      icon={Terminal}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Display Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border card-glow overflow-hidden">
            <div className="p-8 bg-primary/5 border-b border-border flex flex-col items-center justify-center text-center gap-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono text-[9px] uppercase tracking-widest px-3">
                Active Expression Manifest
              </Badge>
              <h2 className="text-4xl md:text-5xl font-mono font-bold tracking-[0.15em] text-foreground p-4 bg-muted/20 border border-border/50 rounded-2xl w-full max-w-2xl select-all tabular-nums">
                {cronExpression}
              </h2>
              <div className="flex gap-3">
                <Button size="sm" onClick={copyToClipboard} className="bg-primary font-mono text-xs px-6">
                  <Copy className="w-3.5 h-3.5 mr-2" />
                  Copy Manifest
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleInputChange("0 0 * * *")} className="font-mono text-xs border-border">
                  <RotateCcw className="w-3.5 h-3.5 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            <CardContent className="p-6 bg-card/50">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Natural Intelligence Readout</p>
                  <p className="text-sm font-medium text-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Builder Interface */}
          <Card className="bg-card border-border card-glow">
            <CardHeader className="pb-3 border-b border-border bg-muted/5">
              <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                Structural Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-8">
                {[
                  { label: "Minute", val: minute, set: setMinute, range: "0-59" },
                  { label: "Hour", val: hour, set: setHour, range: "0-23" },
                  { label: "Day (M)", val: dayOfMonth, set: setDayOfMonth, range: "1-31" },
                  { label: "Month", val: month, set: setMonth, range: "1-12" },
                  { label: "Day (W)", val: dayOfWeek, set: setDayOfWeek, range: "0-6" },
                ].map((field) => (
                  <div key={field.label} className="space-y-3 group text-center">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">{field.label}</label>
                    <Input
                      value={field.val}
                      onChange={(e) => field.set(e.target.value)}
                      className="font-mono bg-muted/20 border-border h-14 text-xl text-center font-bold text-primary focus-visible:ring-primary focus-visible:bg-muted/10"
                    />
                    <div className="text-[9px] text-muted-foreground/60 font-mono italic opacity-40 group-hover:opacity-100 transition-opacity">{field.range}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Controls: Presets & Help */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border card-glow h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border bg-muted/5">
              <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Template Library
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto max-h-[500px] custom-scrollbar">
              <div className="divide-y divide-border">
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleInputChange(preset.expression)}
                    className="w-full p-4 flex flex-col gap-1 items-start hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{preset.name}</span>
                      <code className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded border border-border text-muted-foreground">{preset.expression}</code>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono italic">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/10 border-border">
            <CardContent className="p-6">
              <h4 className="text-[10px] font-bold text-foreground mb-4 font-mono uppercase tracking-widest flex items-center gap-2 border-b border-border pb-2">
                <Hash className="w-3.5 h-3.5 text-primary" />
                Logic Symbols
              </h4>
              <div className="space-y-3">
                {[
                  { char: "*", note: "Matches any value in the field segment." },
                  { char: ",", note: "Separation for multiple non-contiguous values." },
                  { char: "-", note: "Definition for a continuous range of values." },
                  { char: "/", note: "Incremental steps (e.g. */15 = every 15)." }
                ].map((s, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="font-mono text-primary font-bold text-xs shrink-0 w-4">{s.char}</span>
                    <p className="text-[10px] font-mono text-muted-foreground leading-snug">{s.note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Stats Footer */}
        <Card className="lg:col-span-3 bg-muted/30 border-border">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex gap-4">
                <History className="w-8 h-8 text-primary shrink-0 opacity-40" />
                <div className="space-y-1">
                  <h5 className="font-bold font-mono text-[10px] uppercase tracking-widest">History Limit</h5>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Cron schedules are typically evaluated in UTC unless the host engine specifies otherwise.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Layout className="w-8 h-8 text-primary shrink-0 opacity-40" />
                <div className="space-y-1">
                  <h5 className="font-bold font-mono text-[10px] uppercase tracking-widest">UI Integrity</h5>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">This builder strictly adheres to the standard 5-part POSIX crontab specification.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="w-8 h-8 text-primary shrink-0 opacity-40" />
                <div className="space-y-1">
                  <h5 className="font-bold font-mono text-[10px] uppercase tracking-widest">Verification</h5>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Natural language readout is generated in real-time to prevent faulty schedule deployment.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Terminal className="w-8 h-8 text-primary shrink-0 opacity-40" />
                <div className="space-y-1">
                  <h5 className="font-bold font-mono text-[10px] uppercase tracking-widest">Engine Ready</h5>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Copy output and paste directly into your system's crontab or job manifest.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CronHelper;
