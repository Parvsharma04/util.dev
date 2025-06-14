
import { useState } from "react";
import { Copy, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CronHelper = () => {
  const [cronExpression, setCronExpression] = useState("0 0 * * *");
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("0");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const presets = [
    { name: "Every minute", expression: "* * * * *", desc: "Runs every minute" },
    { name: "Every hour", expression: "0 * * * *", desc: "Runs at the start of every hour" },
    { name: "Daily at midnight", expression: "0 0 * * *", desc: "Runs every day at 12:00 AM" },
    { name: "Daily at noon", expression: "0 12 * * *", desc: "Runs every day at 12:00 PM" },
    { name: "Weekly (Sunday)", expression: "0 0 * * 0", desc: "Runs every Sunday at midnight" },
    { name: "Monthly", expression: "0 0 1 * *", desc: "Runs on the 1st day of every month" },
    { name: "Yearly", expression: "0 0 1 1 *", desc: "Runs on January 1st every year" },
    { name: "Weekdays only", expression: "0 9 * * 1-5", desc: "Runs at 9 AM on weekdays" },
    { name: "Every 15 minutes", expression: "*/15 * * * *", desc: "Runs every 15 minutes" },
    { name: "Every 6 hours", expression: "0 */6 * * *", desc: "Runs every 6 hours" }
  ];

  const generateCronExpression = () => {
    const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setCronExpression(expression);
    generateDescription(expression);
  };

  const generateDescription = (expression: string) => {
    const parts = expression.split(' ');
    const [min, hr, dom, mon, dow] = parts;
    
    let desc = "Runs ";
    
    // Day of week
    if (dow !== "*") {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      if (dow.includes("-")) {
        const [start, end] = dow.split("-");
        desc += `${days[parseInt(start)]}-${days[parseInt(end)]} `;
      } else if (dow.includes(",")) {
        const daysList = dow.split(",").map(d => days[parseInt(d)]).join(", ");
        desc += `${daysList} `;
      } else {
        desc += `${days[parseInt(dow)]} `;
      }
    }
    
    // Time
    if (hr === "*" && min === "*") {
      desc += "every minute";
    } else if (hr === "*") {
      desc += min === "0" ? "every hour" : `at minute ${min} of every hour`;
    } else if (min === "*") {
      desc += `every minute during hour ${hr}`;
    } else {
      desc += `at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;
    }
    
    // Day of month
    if (dom !== "*") {
      desc += ` on day ${dom} of the month`;
    }
    
    // Month
    if (mon !== "*") {
      const months = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"];
      desc += ` in ${months[parseInt(mon) - 1]}`;
    }
    
    setDescription(desc);
  };

  const parseCronExpression = (expression: string) => {
    const parts = expression.split(' ');
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
      generateDescription(expression);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cronExpression);
    toast({ title: "Copied!", description: "Cron expression copied to clipboard" });
  };

  const selectPreset = (preset: typeof presets[0]) => {
    setCronExpression(preset.expression);
    parseCronExpression(preset.expression);
    setDescription(preset.desc);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Cron Expression Helper</h1>
          <p className="text-slate-600">Create and understand cron expressions</p>
          <Badge className="bg-orange-100 text-orange-700 border-orange-200 mt-2">Time & Schedule</Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cron Expression</CardTitle>
                  <CardDescription>Format: minute hour day-of-month month day-of-week</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Input
                    value={cronExpression}
                    onChange={(e) => {
                      setCronExpression(e.target.value);
                      parseCronExpression(e.target.value);
                    }}
                    className="font-mono text-lg"
                    placeholder="0 0 * * *"
                  />
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                
                {description && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-900 font-medium">{description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Build Expression</CardTitle>
              <CardDescription>Customize each field of the cron expression</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-sm font-medium">Minute (0-59)</label>
                  <Input
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    placeholder="0"
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Hour (0-23)</label>
                  <Input
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    placeholder="0"
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Day (1-31)</label>
                  <Input
                    value={dayOfMonth}
                    onChange={(e) => setDayOfMonth(e.target.value)}
                    placeholder="*"
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Month (1-12)</label>
                  <Input
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="*"
                    className="font-mono"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Day of Week (0-6)</label>
                  <Input
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    placeholder="*"
                    className="font-mono"
                  />
                </div>
              </div>
              
              <Button onClick={generateCronExpression} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Generate Expression
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common Presets</CardTitle>
              <CardDescription>Quick selection of commonly used cron expressions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {presets.map((preset, index) => (
                  <div
                    key={index}
                    onClick={() => selectPreset(preset)}
                    className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-slate-900">{preset.name}</div>
                        <div className="text-sm text-slate-600">{preset.desc}</div>
                      </div>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded font-mono">
                        {preset.expression}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cron Syntax Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Special Characters</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li><code>*</code> - Any value</li>
                      <li><code>,</code> - Value list separator</li>
                      <li><code>-</code> - Range of values</li>
                      <li><code>/</code> - Step values</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Examples</h4>
                    <ul className="space-y-1 text-slate-600">
                      <li><code>*/15</code> - Every 15 units</li>
                      <li><code>1-5</code> - Range from 1 to 5</li>
                      <li><code>1,3,5</code> - On 1st, 3rd, and 5th</li>
                      <li><code>0</code> - Only on 0</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CronHelper;
