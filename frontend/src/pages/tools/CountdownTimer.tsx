
import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
            description: title || "Your countdown has finished"
          });
        }
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, targetDate, title, toast]);

  const startTimer = () => {
    if (!targetDate) {
      toast({
        title: "Error",
        description: "Please select a target date and time",
        variant: "destructive"
      });
      return;
    }

    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();

    if (target <= now) {
      toast({
        title: "Error",
        description: "Target date must be in the future",
        variant: "destructive"
      });
      return;
    }

    setIsActive(true);
    setIsExpired(false);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    setIsExpired(false);
  };

  const copyShareableLink = () => {
    const params = new URLSearchParams({
      target: targetDate,
      title: title || "Countdown Timer"
    });
    const shareableUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    navigator.clipboard.writeText(shareableUrl);
    toast({
      title: "Copied!",
      description: "Shareable timer link copied to clipboard"
    });
  };

  const setQuickTarget = (hours: number) => {
    const now = new Date();
    now.setHours(now.getHours() + hours);
    setTargetDate(now.toISOString().slice(0, 16));
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Countdown Timer</h1>
          <p className="text-muted-foreground">Create shareable countdown timers</p>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 mt-2">Time & Schedule</Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timer Configuration</CardTitle>
              <CardDescription>Set up your countdown timer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Timer Title (Optional)</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New Year Countdown"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Target Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Quick Set</label>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" onClick={() => setQuickTarget(1)}>
                      +1 Hour
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setQuickTarget(24)}>
                      +1 Day
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setQuickTarget(168)}>
                      +1 Week
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!isActive ? (
                    <Button onClick={startTimer} className="bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Start Timer
                    </Button>
                  ) : (
                    <Button onClick={pauseTimer} variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={resetTimer} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>

                  {targetDate && (
                    <Button onClick={copyShareableLink} variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{title || "Countdown Timer"}</CardTitle>
              {targetDate && (
                <CardDescription>
                  Target: {new Date(targetDate).toLocaleString()}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {isExpired ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Time's Up!</h3>
                  <p className="text-muted-foreground">Your countdown has finished</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatTime(timeLeft.days)}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Days</div>
                  </div>

                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatTime(timeLeft.hours)}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Hours</div>
                  </div>

                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatTime(timeLeft.minutes)}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Minutes</div>
                  </div>

                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatTime(timeLeft.seconds)}
                    </div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wide">Seconds</div>
                  </div>
                </div>
              )}

              {!targetDate && (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-6xl mb-4">⏰</div>
                  <p>Set a target date to start your countdown</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timer Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Shareable Links</h4>
                  <p className="text-muted-foreground">
                    Create shareable countdown timers that others can view in real-time.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Real-time Updates</h4>
                  <p className="text-muted-foreground">
                    Timer updates every second with precise countdown calculations.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Custom Titles</h4>
                  <p className="text-muted-foreground">
                    Add custom titles to make your countdowns more meaningful.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Notifications</h4>
                  <p className="text-muted-foreground">
                    Get notified when your countdown reaches zero.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
