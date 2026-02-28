"use client";


import { useState } from "react";
import { Play, Activity, Globe, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const NetworkTools = () => {
  const [target, setTarget] = useState("");
  const [pingResults, setPingResults] = useState<any[]>([]);
  const [tracerouteResults, setTracerouteResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runPing = async () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a hostname or IP address",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setPingResults([]);
    setProgress(0);

    // Simulate ping results
    const mockPingData = [];
    for (let i = 1; i <= 10; i++) {
      setTimeout(() => {
        const time = Math.random() * 100 + 10; // Random time between 10-110ms
        const newResult = {
          sequence: i,
          time: time.toFixed(1),
          status: Math.random() > 0.1 ? "success" : "timeout", // 90% success rate
          ttl: 64
        };
        
        mockPingData.push(newResult);
        setPingResults([...mockPingData]);
        setProgress((i / 10) * 100);
        
        if (i === 10) {
          setIsRunning(false);
          toast({
            title: "Ping Complete",
            description: `Sent 10 packets to ${target}`
          });
        }
      }, i * 500);
    }
  };

  const runTraceroute = async () => {
    if (!target.trim()) {
      toast({
        title: "Error",
        description: "Please enter a hostname or IP address",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    setTracerouteResults([]);
    setProgress(0);

    // Simulate traceroute results
    const mockHops = [
      { hop: 1, ip: "192.168.1.1", hostname: "router.local", time1: "1.2", time2: "1.1", time3: "1.3" },
      { hop: 2, ip: "10.0.0.1", hostname: "gateway.isp.com", time1: "5.4", time2: "5.2", time3: "5.6" },
      { hop: 3, ip: "203.0.113.1", hostname: "core1.isp.com", time1: "12.1", time2: "11.8", time3: "12.3" },
      { hop: 4, ip: "203.0.113.5", hostname: "peer.transit.net", time1: "25.4", time2: "24.9", time3: "25.1" },
      { hop: 5, ip: "198.51.100.1", hostname: "border.target.com", time1: "45.2", time2: "44.8", time3: "45.5" },
      { hop: 6, ip: "198.51.100.10", hostname: target, time1: "48.1", time2: "47.9", time3: "48.3" }
    ];

    mockHops.forEach((hop, index) => {
      setTimeout(() => {
        setTracerouteResults(prev => [...prev, hop]);
        setProgress(((index + 1) / mockHops.length) * 100);
        
        if (index === mockHops.length - 1) {
          setIsRunning(false);
          toast({
            title: "Traceroute Complete",
            description: `Traced route to ${target} in ${mockHops.length} hops`
          });
        }
      }, (index + 1) * 800);
    });
  };

  const getAverageTime = () => {
    const successfulPings = pingResults.filter(p => p.status === "success");
    if (successfulPings.length === 0) return "0";
    const avg = successfulPings.reduce((sum, ping) => sum + parseFloat(ping.time), 0) / successfulPings.length;
    return avg.toFixed(1);
  };

  const getPacketLoss = () => {
    if (pingResults.length === 0) return "0";
    const timeouts = pingResults.filter(p => p.status === "timeout").length;
    return (
        <ToolLayout title="Network Tools" description="Ping and traceroute visualization tools" category="Network & Web" icon={Badge}>
<Button 
                    onClick={runPing} 
                    disabled={isRunning}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {isRunning ? "Running Ping..." : "Ping"}
                  </Button>
                  
                  <Button 
                    onClick={runTraceroute} 
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    {isRunning ? "Running Traceroute..." : "Traceroute"}
                  </Button>
                </div>

                {isRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {pingResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ping Results</CardTitle>
                <CardDescription>Latency and packet loss statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{getAverageTime()}ms</div>
                      <div className="text-sm text-blue-600">Average Latency</div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {pingResults.filter(p => p.status === "success").length}
                      </div>
                      <div className="text-sm text-green-600">Successful Pings</div>
                    </div>
                    
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">{getPacketLoss()}%</div>
                      <div className="text-sm text-red-600">Packet Loss</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Ping Details</h4>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {pingResults.map((ping, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm font-mono">
                          <span>Ping #{ping.sequence}</span>
                          <span className={ping.status === "success" ? "text-green-600" : "text-red-600"}>
                            {ping.status === "success" ? `${ping.time}ms (TTL=${ping.ttl})` : "Request timeout"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {tracerouteResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Traceroute Results</CardTitle>
                <CardDescription>Network path visualization to {target}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tracerouteResults.map((hop, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                        {hop.hop}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium">{hop.hostname}</div>
                        <div className="text-sm text-muted-foreground font-mono">{hop.ip}</div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-mono">
                          {hop.time1}ms / {hop.time2}ms / {hop.time3}ms
                        </div>
                        <div className="text-xs text-muted-foreground">RTT</div>
                      </div>
                      
                      <Server className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Network Diagnostics Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Ping Tool</h4>
                  <p className="text-muted-foreground">
                    Measures round-trip time for packets sent to a destination host and shows packet loss statistics.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Traceroute Tool</h4>
                  <p className="text-muted-foreground">
                    Shows the path packets take through the network to reach a destination, displaying each hop along the route.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Latency</h4>
                  <p className="text-muted-foreground">
                    The time it takes for a packet to travel from source to destination and back, measured in milliseconds.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Packet Loss</h4>
                  <p className="text-muted-foreground">
                    The percentage of packets that fail to reach their destination, indicating network reliability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
              </ToolLayout>
    );
};

export default NetworkTools;
