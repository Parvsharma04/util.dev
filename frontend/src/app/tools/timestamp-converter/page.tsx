"use client";


import { useState } from "react";
import { Copy, Clock, Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolLayout } from "@/components/ToolLayout";

const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [humanDate, setHumanDate] = useState(new Date().toISOString().slice(0, 16));
  const { toast } = useToast();

  const convertFromTimestamp = (ts: string) => {
    try {
      const num = parseInt(ts);
      const date = new Date(num * 1000);
      return {
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        date: date.toDateString(),
        time: date.toTimeString(),
      };
    } catch {
      return null;
    }
  };

  const convertFromHuman = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return Math.floor(date.getTime() / 1000);
    } catch {
      return null;
    }
  };

  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
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
        <ToolLayout title="Timestamp Converter" description="Convert between UNIX timestamps and human-readable dates" category="Developer Tools" icon={Terminal} popular>
<Tabs defaultValue="to-human" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 border border-border">
            <TabsTrigger value="to-human" className="font-mono data-[state=active]:bg-card">Timestamp → Human</TabsTrigger>
            <TabsTrigger value="to-timestamp" className="font-mono data-[state=active]:bg-card">Human → Timestamp</TabsTrigger>
          </TabsList>

          <TabsContent value="to-human" className="space-y-6">
            <Card className="bg-card border-border card-glow">
              <CardHeader>
                <CardTitle className="font-mono">UNIX Timestamp Input</CardTitle>
                <CardDescription className="font-mono">Enter a UNIX timestamp (seconds since epoch)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="1672531200"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    className="font-mono flex-1 bg-input"
                  />
                  <Button onClick={getCurrentTimestamp} variant="outline" className="border-border hover:border-primary/50 font-mono">
                    Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {formats && (
              <Card className="bg-card border-border card-glow">
                <CardHeader>
                  <CardTitle className="font-mono">Human-Readable Formats</CardTitle>
                  <CardDescription className="font-mono">Various date and time representations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1 font-mono">ISO 8601</div>
                        <div className="font-mono text-sm text-foreground">{formats.iso}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(formats.iso, "ISO 8601")}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1 font-mono">Local Time</div>
                        <div className="font-mono text-sm text-foreground">{formats.local}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(formats.local, "Local Time")}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1 font-mono">UTC</div>
                        <div className="font-mono text-sm text-foreground">{formats.utc}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(formats.utc, "UTC")}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1 font-mono">Date Only</div>
                        <div className="font-mono text-sm text-foreground">{formats.date}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(formats.date, "Date Only")}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="to-timestamp" className="space-y-6">
            <Card className="bg-card border-border card-glow">
              <CardHeader>
                <CardTitle className="font-mono">Date and Time Input</CardTitle>
                <CardDescription className="font-mono">Enter a date and time to convert to timestamp</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="datetime-local"
                  value={humanDate}
                  onChange={(e) => setHumanDate(e.target.value)}
                  className="font-mono bg-input"
                />
              </CardContent>
            </Card>

            {humanTimestamp && (
              <Card className="bg-card border-border card-glow">
                <CardHeader>
                  <CardTitle className="font-mono">UNIX Timestamp</CardTitle>
                  <CardDescription className="font-mono">Timestamp in seconds since epoch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg">
                    <div className="font-mono text-lg text-foreground">{humanTimestamp}</div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(humanTimestamp.toString(), "Timestamp")}
                      className="hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="font-mono">About UNIX Timestamps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-2 font-mono">
              <p>
                UNIX timestamps represent the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC.
              </p>
              <p>
                They are commonly used in programming and databases for storing date and time information in a standardized format.
              </p>
            </div>
          </CardContent>
        </Card>
              </ToolLayout>
    );
};

export default TimestampConverter;
