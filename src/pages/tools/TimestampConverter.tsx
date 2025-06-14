
import { useState } from "react";
import { Copy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <a href="/" className="hover:text-slate-700">Home</a>
            <span>→</span>
            <a href="/tools" className="hover:text-slate-700">Tools</a>
            <span>→</span>
            <span className="text-slate-900">Timestamp Converter</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Timestamp Converter</h1>
              <p className="text-slate-600">Convert between UNIX timestamps and human-readable dates</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">Developer Tools</Badge>
            <Badge variant="outline">Popular</Badge>
          </div>
        </div>

        <Tabs defaultValue="to-human" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="to-human">Timestamp → Human</TabsTrigger>
            <TabsTrigger value="to-timestamp">Human → Timestamp</TabsTrigger>
          </TabsList>

          <TabsContent value="to-human" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>UNIX Timestamp Input</CardTitle>
                <CardDescription>Enter a UNIX timestamp (seconds since epoch)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="1672531200"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    className="font-mono flex-1"
                  />
                  <Button onClick={getCurrentTimestamp} variant="outline">
                    Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {formats && (
              <Card>
                <CardHeader>
                  <CardTitle>Human-Readable Formats</CardTitle>
                  <CardDescription>Various date and time representations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-1">ISO 8601</div>
                        <div className="font-mono text-sm text-slate-900">{formats.iso}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(formats.iso, "ISO 8601")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-1">Local Time</div>
                        <div className="font-mono text-sm text-slate-900">{formats.local}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(formats.local, "Local Time")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-1">UTC</div>
                        <div className="font-mono text-sm text-slate-900">{formats.utc}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(formats.utc, "UTC")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-slate-700 mb-1">Date Only</div>
                        <div className="font-mono text-sm text-slate-900">{formats.date}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(formats.date, "Date Only")}
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
            <Card>
              <CardHeader>
                <CardTitle>Date and Time Input</CardTitle>
                <CardDescription>Enter a date and time to convert to timestamp</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="datetime-local"
                  value={humanDate}
                  onChange={(e) => setHumanDate(e.target.value)}
                  className="font-mono"
                />
              </CardContent>
            </Card>

            {humanTimestamp && (
              <Card>
                <CardHeader>
                  <CardTitle>UNIX Timestamp</CardTitle>
                  <CardDescription>Timestamp in seconds since epoch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="font-mono text-lg text-slate-900">{humanTimestamp}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(humanTimestamp.toString(), "Timestamp")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>About UNIX Timestamps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 space-y-2">
              <p>
                UNIX timestamps represent the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC.
              </p>
              <p>
                They are commonly used in programming and databases for storing date and time information in a standardized format.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TimestampConverter;
