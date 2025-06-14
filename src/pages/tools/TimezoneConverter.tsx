
import { useState, useEffect } from "react";
import { Copy, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
    "Australia/Sydney"
  ];

  useEffect(() => {
    const updateCurrentTimes = () => {
      const times: { [key: string]: string } = {};
      majorTimezones.forEach(tz => {
        const now = new Date();
        times[tz] = now.toLocaleString("en-US", {
          timeZone: tz,
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          year: "numeric",
          month: "short",
          day: "2-digit"
        });
      });
      setCurrentTimes(times);
    };

    updateCurrentTimes();
    const interval = setInterval(updateCurrentTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTime = () => {
    if (!sourceTime) {
      toast({
        title: "Error",
        description: "Please enter a time to convert",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a date object from the input time
      const inputDate = new Date(sourceTime);
      
      if (isNaN(inputDate.getTime())) {
        throw new Error("Invalid date format");
      }

      // Convert to target timezone
      const converted = inputDate.toLocaleString("en-US", {
        timeZone: targetTimezone,
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        year: "numeric",
        month: "short",
        day: "2-digit",
        weekday: "short"
      });

      setConvertedTime(converted);
      
      toast({
        title: "Converted!",
        description: "Time has been converted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid time format. Use YYYY-MM-DD HH:MM format",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Time copied to clipboard" });
  };

  const setCurrentTime = () => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);
    setSourceTime(formatted);
  };

  const getTimezoneLabel = (tz: string) => {
    const timezone = timezones.find(t => t.value === tz);
    return timezone ? timezone.label : tz;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Timezone Converter</h1>
          <p className="text-slate-600">Convert times between different timezones</p>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 mt-2">Time & Schedule</Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Time Conversion</CardTitle>
              <CardDescription>Convert a specific time between timezones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">From Timezone</label>
                    <Select value={sourceTimezone} onValueChange={setSourceTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">To Timezone</label>
                    <Select value={targetTimezone} onValueChange={setTargetTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Date and Time</label>
                  <div className="flex gap-2">
                    <Input
                      type="datetime-local"
                      value={sourceTime}
                      onChange={(e) => setSourceTime(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={setCurrentTime}>
                      Now
                    </Button>
                  </div>
                </div>

                <Button onClick={convertTime} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Clock className="w-4 h-4 mr-2" />
                  Convert Time
                </Button>

                {convertedTime && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium">Converted Time</p>
                        <p className="text-lg font-bold text-blue-900">{convertedTime}</p>
                        <p className="text-sm text-blue-600">{getTimezoneLabel(targetTimezone)}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(convertedTime)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>World Clock</CardTitle>
              <CardDescription>Current time in major timezones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {majorTimezones.map((tz) => (
                  <div key={tz} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">
                          {getTimezoneLabel(tz)}
                        </div>
                        <div className="text-lg font-mono text-slate-700">
                          {currentTimes[tz] || "Loading..."}
                        </div>
                      </div>
                      <Globe className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timezone Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">UTC (Coordinated Universal Time)</h4>
                  <p className="text-slate-600">
                    The primary time standard by which the world regulates clocks and time.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Daylight Saving Time</h4>
                  <p className="text-slate-600">
                    Some timezones automatically adjust for daylight saving time changes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Time Zones</h4>
                  <p className="text-slate-600">
                    Earth is divided into 24 time zones, each representing one hour of the day.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">ISO 8601</h4>
                  <p className="text-slate-600">
                    International standard for date and time representation.
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

export default TimezoneConverter;
