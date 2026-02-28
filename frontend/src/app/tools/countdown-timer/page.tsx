"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Copy, Timer, Calendar, Bell, Share2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState("");
  const [title, setTitle] = useState("");
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && targetDate) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
          setIsExpired(false);
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setIsExpired(true);
          setIsActive(false);
          toast({
            title: "Timer Expired!",
            description: title || "Your countdown has finished",
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, targetDate, title, toast]);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  const startTimer = () => {
    if (!targetDate) {
      toast({
        title: "Error",
        description: "Please set a target date and time",
        variant: "destructive",
      });
      return;
    }
    const target = new Date(targetDate).getTime();
    if (target <= new Date().getTime()) {
      toast({
        title: "Error",
        description: "Target date must be in the future",
        variant: "destructive",
      });
      return;
    }
    setIsActive(true);
    setIsExpired(false);
  };

  const pauseTimer = () => setIsActive(false);

  const resetTimer = () => {
    setIsActive(false);
    setIsExpired(false);
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  };

  const setQuickTarget = (hours: number) => {
    const now = new Date();
    now.setHours(now.getHours() + hours);
    // Format to YYYY-MM-DDTHH:mm
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hoursStr = String(now.getHours()).padStart(2, '0');
    const minsStr = String(now.getMinutes()).padStart(2, '0');
    setTargetDate(`${year}-${month}-${day}T${hoursStr}:${minsStr}`);
  };

  const copyShareableLink = () => {
    const url = new URL(window.location.href);
    if (targetDate) url.searchParams.set("date", targetDate);
    if (title) url.searchParams.set("title", title);
    navigator.clipboard.writeText(url.toString());
    toast({ title: "Link Copied!", description: "Share this link with others" });
  };

  return (
    <ToolLayout
      title="Countdown Timer"
      description="Create and share precise countdown timers for events"
      category="Time & Schedule"
      icon={Timer}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Setup Card */}
        <Card className="lg:col-span-1 bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Setup Timer
            </CardTitle>
            <CardDescription className="font-mono">Set your target deadline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Event Title</label>
              <Input
                placeholder="Product Launch, Deadline, etc."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-mono bg-muted/20 border-border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target Date & Time</label>
              <Input
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="font-mono bg-muted/20 border-border h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quick Presets</label>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => setQuickTarget(1)} className="font-mono text-[10px]">
                  +1 Hour
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuickTarget(24)} className="font-mono text-[10px]">
                  +1 Day
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQuickTarget(168)} className="font-mono text-[10px]">
                  +1 Week
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <Button
                onClick={isActive ? pauseTimer : startTimer}
                className={`h-12 font-mono ${isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary/90'}`}
              >
                {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isActive ? "Pause Timer" : "Start Countdown"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={resetTimer} className="font-mono">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" onClick={copyShareableLink} className="font-mono">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Card */}
        <Card className="lg:col-span-2 bg-card border-border card-glow flex flex-col justify-center min-h-[400px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-mono glow">{title || "Countdown"}</CardTitle>
            {targetDate && <CardDescription className="font-mono">Ends at: {new Date(targetDate).toLocaleString()}</CardDescription>}
          </CardHeader>
          <CardContent>
            {isExpired ? (
              <div className="text-center py-12 animate-bounce-slow">
                <div className="text-8xl mb-6">🎉</div>
                <h3 className="text-4xl font-bold font-mono glow-strong text-primary">Time's Up!</h3>
                <p className="text-muted-foreground font-mono mt-4">The event has reached its deadline.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Days", val: timeLeft.days },
                  { label: "Hours", val: timeLeft.hours },
                  { label: "Minutes", val: timeLeft.minutes },
                  { label: "Seconds", val: timeLeft.seconds },
                ].map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center shadow-inner mb-3">
                      <span className="text-4xl md:text-6xl font-black font-mono text-primary glow">
                        {formatTime(unit.val)}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{unit.label}</span>
                  </div>
                ))}
              </div>
            )}

            {!targetDate && !isExpired && (
              <div className="text-center py-12 opacity-50">
                <div className="text-6xl mb-4">⏳</div>
                <p className="font-mono italic text-muted-foreground">Waiting for a target date to be set...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Card className="lg:col-span-3 bg-muted/30 border-border">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <Share2 className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-sm mb-1 uppercase tracking-wider">Shareable</h4>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">The URL automatically updates. Copy it and send it to teammates for a synced countdown.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Bell className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-sm mb-1 uppercase tracking-wider">Browser Alerts</h4>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">A visual toast notification triggers as soon as the clock hits zero.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Plus className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-sm mb-1 uppercase tracking-wider">Quick Select</h4>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">Instantly add an hour, day, or week with a single click for rapid timer creation.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CountdownTimer;
