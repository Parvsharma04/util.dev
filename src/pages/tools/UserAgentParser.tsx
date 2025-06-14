
import { useState } from "react";
import { Search, Copy, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
      name: "Edge (Windows)",
      ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
    }
  ];

  const parseUserAgent = (ua: string) => {
    // Simple user agent parsing (basic implementation)
    const result: any = {
      raw: ua,
      browser: { name: "Unknown", version: "Unknown" },
      os: { name: "Unknown", version: "Unknown" },
      device: { type: "Unknown", vendor: "Unknown", model: "Unknown" },
      engine: { name: "Unknown", version: "Unknown" }
    };

    // Browser detection
    if (ua.includes("Chrome") && !ua.includes("Edg")) {
      result.browser.name = "Chrome";
      const chromeMatch = ua.match(/Chrome\/(\d+\.\d+)/);
      if (chromeMatch) result.browser.version = chromeMatch[1];
    } else if (ua.includes("Firefox")) {
      result.browser.name = "Firefox";
      const firefoxMatch = ua.match(/Firefox\/(\d+\.\d+)/);
      if (firefoxMatch) result.browser.version = firefoxMatch[1];
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      result.browser.name = "Safari";
      const safariMatch = ua.match(/Version\/(\d+\.\d+)/);
      if (safariMatch) result.browser.version = safariMatch[1];
    } else if (ua.includes("Edg")) {
      result.browser.name = "Edge";
      const edgeMatch = ua.match(/Edg\/(\d+\.\d+)/);
      if (edgeMatch) result.browser.version = edgeMatch[1];
    }

    // Operating System detection
    if (ua.includes("Windows NT")) {
      result.os.name = "Windows";
      if (ua.includes("Windows NT 10.0")) result.os.version = "10/11";
      else if (ua.includes("Windows NT 6.3")) result.os.version = "8.1";
      else if (ua.includes("Windows NT 6.1")) result.os.version = "7";
    } else if (ua.includes("Mac OS X")) {
      result.os.name = "macOS";
      const macMatch = ua.match(/Mac OS X (\d+_\d+)/);
      if (macMatch) result.os.version = macMatch[1].replace(/_/g, ".");
    } else if (ua.includes("iPhone OS")) {
      result.os.name = "iOS";
      const iosMatch = ua.match(/iPhone OS (\d+_\d+)/);
      if (iosMatch) result.os.version = iosMatch[1].replace(/_/g, ".");
    } else if (ua.includes("Android")) {
      result.os.name = "Android";
      const androidMatch = ua.match(/Android (\d+\.\d+)/);
      if (androidMatch) result.os.version = androidMatch[1];
    } else if (ua.includes("Linux")) {
      result.os.name = "Linux";
    }

    // Device detection
    if (ua.includes("Mobile") || ua.includes("iPhone") || ua.includes("Android")) {
      result.device.type = "Mobile";
      if (ua.includes("iPhone")) {
        result.device.vendor = "Apple";
        result.device.model = "iPhone";
      } else if (ua.includes("iPad")) {
        result.device.type = "Tablet";
        result.device.vendor = "Apple";
        result.device.model = "iPad";
      } else if (ua.includes("Samsung") || ua.includes("SM-")) {
        result.device.vendor = "Samsung";
        const samsungMatch = ua.match(/SM-([A-Z0-9]+)/);
        if (samsungMatch) result.device.model = samsungMatch[1];
      }
    } else {
      result.device.type = "Desktop";
    }

    // Engine detection
    if (ua.includes("WebKit")) {
      result.engine.name = "WebKit";
      const webkitMatch = ua.match(/WebKit\/(\d+\.\d+)/);
      if (webkitMatch) result.engine.version = webkitMatch[1];
    } else if (ua.includes("Gecko")) {
      result.engine.name = "Gecko";
      const geckoMatch = ua.match(/rv:(\d+\.\d+)/);
      if (geckoMatch) result.engine.version = geckoMatch[1];
    }

    return result;
  };

  const handleParse = () => {
    if (!userAgent.trim()) {
      toast({
        title: "Error",
        description: "Please enter a user agent string",
        variant: "destructive"
      });
      return;
    }

    const result = parseUserAgent(userAgent);
    setParsedResult(result);
    
    toast({
      title: "Parsed!",
      description: "User agent string has been analyzed"
    });
  };

  const setCurrentUserAgent = () => {
    setUserAgent(navigator.userAgent);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} copied to clipboard` });
  };

  const loadSample = (sample: typeof commonUserAgents[0]) => {
    setUserAgent(sample.ua);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">User Agent Parser</h1>
          <p className="text-slate-600">Parse browser and device information from user agent strings</p>
          <Badge className="bg-red-100 text-red-700 border-red-200 mt-2">Network & Web</Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Agent String</CardTitle>
              <CardDescription>Enter or paste a user agent string to analyze</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={setCurrentUserAgent}>
                    My Browser
                  </Button>
                </div>
                
                <Textarea
                  placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  className="min-h-[100px] font-mono text-sm"
                />
                
                <Button onClick={handleParse} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Search className="w-4 h-4 mr-2" />
                  Parse User Agent
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common User Agents</CardTitle>
              <CardDescription>Click to load popular user agent strings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {commonUserAgents.map((sample, index) => (
                  <div
                    key={index}
                    onClick={() => loadSample(sample)}
                    className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {sample.name.includes("iOS") || sample.name.includes("Android") ? (
                        <Smartphone className="w-5 h-5 text-slate-600" />
                      ) : (
                        <Monitor className="w-5 h-5 text-slate-600" />
                      )}
                      <div>
                        <div className="font-medium">{sample.name}</div>
                        <div className="text-sm text-slate-600 truncate">
                          {sample.ua.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {parsedResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Parsed Information</CardTitle>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => copyToClipboard(JSON.stringify(parsedResult, null, 2), "Parsed data")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Browser</h4>
                      <p className="text-blue-800">
                        {parsedResult.browser.name} {parsedResult.browser.version}
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Operating System</h4>
                      <p className="text-green-800">
                        {parsedResult.os.name} {parsedResult.os.version}
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Device</h4>
                      <p className="text-purple-800">
                        {parsedResult.device.type}
                        {parsedResult.device.vendor !== "Unknown" && (
                          <span> - {parsedResult.device.vendor}</span>
                        )}
                        {parsedResult.device.model !== "Unknown" && (
                          <span> {parsedResult.device.model}</span>
                        )}
                      </p>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Engine</h4>
                      <p className="text-orange-800">
                        {parsedResult.engine.name} {parsedResult.engine.version}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Raw Data</CardTitle>
                  <CardDescription>Complete parsed information in JSON format</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto max-h-96">
                    {JSON.stringify(parsedResult, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>About User Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">What is a User Agent?</h4>
                  <p className="text-slate-600">
                    A user agent string identifies the browser, operating system, and device making a web request.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Why Parse User Agents?</h4>
                  <p className="text-slate-600">
                    Helps websites deliver appropriate content and track visitor demographics and preferences.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Privacy Considerations</h4>
                  <p className="text-slate-600">
                    User agents can be used for fingerprinting, which is why some browsers limit the information they provide.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Evolution</h4>
                  <p className="text-slate-600">
                    User agent strings have become increasingly complex due to compatibility requirements and legacy support.
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

export default UserAgentParser;
