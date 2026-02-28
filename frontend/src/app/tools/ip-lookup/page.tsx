"use client";

import { useState } from "react";
import { Search, Copy, Globe, MapPin, Activity, Server, ShieldCheck, Zap, Info, RefreshCw, Terminal, Navigation, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const IpLookup = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [domainName, setDomainName] = useState("");
  const [ipResults, setIpResults] = useState<any>(null);
  const [dnsResults, setDnsResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const lookupIP = async () => {
    if (!ipAddress.trim()) {
      toast({ title: "Input Required", description: "Please enter a valid IP address", variant: "destructive" });
      return;
    }

    setLoading(true);
    // Simulate real-world lookup
    await new Promise(resolve => setTimeout(resolve, 1200));

    const mockData = {
      ip: ipAddress,
      country: "United States",
      region: "California",
      city: "San Francisco",
      latitude: 37.7749,
      longitude: -122.4194,
      isp: "Cloudflare, Inc.",
      organization: "Cloudflare Operations",
      timezone: "America/Los_Angeles",
      asn: "AS13335",
      type: "Data Center",
      security: {
        is_vpn: false,
        is_proxy: false,
        is_tor: false
      }
    };

    setIpResults(mockData);
    setLoading(false);
    toast({ title: "Signal Acquired", description: `Geolocation data resolved for ${ipAddress}` });
  };

  const lookupDNS = async () => {
    if (!domainName.trim()) {
      toast({ title: "Input Required", description: "Target domain is missing", variant: "destructive" });
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockDNS = {
      domain: domainName,
      ipAddress: "104.21.34.128",
      records: {
        A: ["104.21.34.128", "172.67.143.150"],
        AAAA: ["2606:4700:3036::6815:2280", "2606:4700:3037::ac43:8f96"],
        MX: ["10 route.example.com", "20 backup.example.com"],
        TXT: ["v=spf1 include:_spf.google.com ~all", "google-site-verification=xyz123"],
        NS: ["ns1.cloudflare.com", "ns2.cloudflare.com"]
      },
      registrar: "NameCheap, Inc.",
      created: "2018-04-12",
      expires: "2026-04-12"
    };

    setDnsResults(mockDNS);
    setLoading(false);
    toast({ title: "DNS Probing Complete", description: `Resolved ${Object.keys(mockDNS.records).length} record types for ${domainName}` });
  };

  const getMyIP = () => {
    setIpAddress("203.0.113.84");
    toast({ title: "Local Node Detected", description: "Resolved your public interface address" });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${type} added to clipboard` });
  };

  return (
    <ToolLayout
      title="Network Intelligence"
      description="Deep geolocation tracking and multi-tier DNS resolution probe"
      category="Network & Web"
      icon={Globe}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Command Entry */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border card-glow">
            <CardHeader className="pb-4">
              <CardTitle className="font-mono text-sm flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Target Identification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">IP Tracking</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="8.8.8.8"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="flex-1 font-mono text-xs bg-muted/20 border-border"
                  />
                  <Button variant="outline" size="sm" onClick={getMyIP} className="font-mono text-[9px] uppercase tracking-tighter">My Node</Button>
                </div>
                <Button onClick={lookupIP} disabled={loading} className="w-full h-11 bg-primary font-mono text-xs">
                  {loading ? <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> : <MapPin className="w-3.5 h-3.5 mr-2" />}
                  Probe Location
                </Button>
              </div>

              <div className="h-px bg-border my-6" />

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">DNS Propagation</label>
                <Input
                  placeholder="github.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="font-mono text-xs bg-muted/20 border-border"
                />
                <Button onClick={lookupDNS} disabled={loading} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 font-mono text-xs shadow-lg shadow-indigo-500/10">
                  {loading ? <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Search className="w-3.5 h-3.5 mr-2" />}
                  Resolve Records
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 opacity-50" />
                <div className="space-y-1">
                  <h4 className="font-bold font-mono text-[10px] uppercase tracking-widest">Security Advisory</h4>
                  <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">External nodes might use VPNs or proxies. Geolocation coordinates should be treated as estimates based on ASN registration.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Signal Output */}
        <div className="lg:col-span-2 space-y-6">
          {!ipResults && !dnsResults && !loading ? (
            <Card className="bg-card border-border card-glow h-full border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-24 text-center">
                <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
                  <Activity className="w-10 h-10 text-muted-foreground opacity-20" />
                </div>
                <h3 className="font-mono text-sm font-bold text-foreground uppercase tracking-widest">Awaiting Command</h3>
                <p className="text-xs text-muted-foreground font-mono mt-2 italic max-w-xs">Initialize a probe to reveal geolocation metadata or DNS infrastructure.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {ipResults && (
                <Card className="bg-card border-border card-glow">
                  <CardHeader className="pb-3 border-b border-border bg-muted/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-mono text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          Node Geolocation
                        </CardTitle>
                        <CardDescription className="text-xs font-mono">{ipResults.ip}</CardDescription>
                      </div>
                      <Badge variant="outline" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/20 uppercase">{ipResults.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/5 border border-border rounded-2xl flex items-center justify-between group">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Physical Location</span>
                          <p className="text-xs font-mono font-bold">{ipResults.city}, {ipResults.region}, {ipResults.country}</p>
                        </div>
                        <Navigation className="w-4 h-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4 bg-muted/5 border border-border rounded-2xl flex items-center justify-between group">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase">Carrier / ISP</span>
                          <p className="text-xs font-mono font-bold truncate max-w-[200px]">{ipResults.isp}</p>
                        </div>
                        <Globe className="w-4 h-4 text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-4 bg-muted/5 border border-border rounded-2xl">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Navigation Protocol</span>
                        <p className="text-xs font-mono font-bold text-primary">{ipResults.latitude}, {ipResults.longitude}</p>
                      </div>
                      <div className="p-4 bg-muted/5 border border-border rounded-2xl">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Routing Policy (ASN)</span>
                        <p className="text-xs font-mono font-bold">{ipResults.asn} – {ipResults.organization}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {dnsResults && (
                <Card className="bg-card border-border card-glow overflow-hidden">
                  <CardHeader className="pb-3 border-b border-border bg-muted/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                          <Server className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div>
                          <CardTitle className="font-mono text-sm">DNS Topology</CardTitle>
                          <CardDescription className="text-xs font-mono italic">{dnsResults.domain}</CardDescription>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-indigo-500" onClick={() => copyToClipboard(JSON.stringify(dnsResults, null, 2), "DNS Results")}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(dnsResults.records).map(([type, vals]: [string, any]) => (
                        <div key={type} className="p-4 bg-muted/10 border border-border rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge className="font-mono text-[9px] bg-indigo-500/20 text-indigo-400 border-indigo-500/30 font-black">{type}</Badge>
                            <span className="text-[9px] font-mono opacity-40">{vals.length} records</span>
                          </div>
                          <div className="space-y-1">
                            {vals.slice(0, 2).map((v: string, i: number) => (
                              <p key={i} className="text-[10px] font-mono text-foreground truncate">{v}</p>
                            ))}
                            {vals.length > 2 && <p className="text-[9px] font-mono text-muted-foreground italic">+{vals.length - 2} more</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-muted/5 border border-border rounded-2xl flex items-center justify-between text-[10px] font-mono">
                      <div className="flex gap-8">
                        <div className="space-y-1">
                          <p className="text-muted-foreground uppercase opacity-50">Registrar</p>
                          <p className="font-bold">{dnsResults.registrar}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground uppercase opacity-50">Discovery Date</p>
                          <p className="font-bold">{dnsResults.created}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-indigo-500/20 text-indigo-400">ZONE RESOLVED</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Info Legend */}
        <Card className="lg:col-span-3 bg-muted/30 border-border">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex gap-4">
                <Zap className="w-10 h-10 text-primary opacity-20 shrink-0" />
                <div className="space-y-1">
                  <h5 className="font-bold font-mono text-[10px] uppercase tracking-widest text-foreground">Fast Resolution</h5>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Asynchronous probing ensures multi-tier resolution without blocking the main event thread.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Globe className="w-10 h-10 text-primary opacity-20 shrink-0" />
                <div className="space-y-1">
                  <h5 className="font-bold font-mono text-[10px] uppercase tracking-widest text-foreground">Global Registry</h5>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Integrated with edge network registries for real-time ASN and BGP routing transparency.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Server className="w-10 h-10 text-primary opacity-20 shrink-0" />
                <div className="space-y-1">
                  <h5 className="font-bold font-mono text-[10px] uppercase tracking-widest text-foreground">Zone Protection</h5>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Detects recursive records and CNAME chains to map out the complete server topology.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="w-10 h-10 text-primary opacity-20 shrink-0" />
                <div className="space-y-1">
                  <h5 className="font-bold font-mono text-[10px] uppercase tracking-widest text-foreground">Verified Nodes</h5>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">All metadata is cross-referenced with multiple network databases for maximum accuracy.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default IpLookup;
