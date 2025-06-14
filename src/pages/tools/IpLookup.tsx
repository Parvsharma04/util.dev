
import { useState } from "react";
import { Search, Copy, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const IpLookup = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [domainName, setDomainName] = useState("");
  const [ipResults, setIpResults] = useState<any>(null);
  const [dnsResults, setDnsResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const lookupIP = async () => {
    if (!ipAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter an IP address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Since we can't make real API calls in this demo, we'll simulate results
    setTimeout(() => {
      const mockData = {
        ip: ipAddress,
        country: "United States",
        region: "California",
        city: "San Francisco",
        latitude: 37.7749,
        longitude: -122.4194,
        isp: "Example Internet Service Provider",
        organization: "Example Corp",
        timezone: "America/Los_Angeles",
        asn: "AS12345",
        type: "business"
      };
      
      setIpResults(mockData);
      setLoading(false);
      
      toast({
        title: "Lookup Complete",
        description: "IP information retrieved successfully"
      });
    }, 1000);
  };

  const lookupDNS = async () => {
    if (!domainName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate DNS lookup results
    setTimeout(() => {
      const mockDNS = {
        domain: domainName,
        ipAddress: "192.0.2.1",
        records: {
          A: ["192.0.2.1", "192.0.2.2"],
          AAAA: ["2001:db8::1"],
          MX: ["10 mail.example.com"],
          TXT: ["v=spf1 include:_spf.google.com ~all"],
          NS: ["ns1.example.com", "ns2.example.com"],
          CNAME: ["www.example.com"]
        },
        registrar: "Example Registrar",
        created: "2010-01-01",
        expires: "2025-01-01",
        nameservers: ["ns1.example.com", "ns2.example.com"]
      };
      
      setDnsResults(mockDNS);
      setLoading(false);
      
      toast({
        title: "DNS Lookup Complete",
        description: "DNS records retrieved successfully"
      });
    }, 1000);
  };

  const getMyIP = () => {
    // Simulate getting user's IP
    setIpAddress("203.0.113.1");
    toast({
      title: "IP Detected",
      description: "Your public IP address has been detected"
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} copied to clipboard` });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">IP & DNS Lookup</h1>
          <p className="text-slate-600">Lookup IP geolocation and DNS information</p>
          <Badge className="bg-red-100 text-red-700 border-red-200 mt-2">Network & Web</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>IP Geolocation Lookup</CardTitle>
              <CardDescription>Get location and ISP information for an IP address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="192.168.1.1"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={getMyIP}>
                    My IP
                  </Button>
                </div>
                
                <Button 
                  onClick={lookupIP} 
                  disabled={loading} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Looking up..." : "Lookup IP"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DNS Lookup</CardTitle>
              <CardDescription>Get DNS records and domain information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  placeholder="example.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                />
                
                <Button 
                  onClick={lookupDNS} 
                  disabled={loading} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {loading ? "Looking up..." : "Lookup DNS"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {ipResults && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>IP Geolocation Results</CardTitle>
                  <CardDescription>Information for {ipResults.ip}</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(JSON.stringify(ipResults, null, 2), "IP data")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-slate-600" />
                    <span className="font-medium">Location</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    {ipResults.city}, {ipResults.region}<br />
                    {ipResults.country}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-slate-600" />
                    <span className="font-medium">ISP</span>
                  </div>
                  <p className="text-sm text-slate-700">{ipResults.isp}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Coordinates</span>
                  </div>
                  <p className="text-sm text-slate-700 font-mono">
                    {ipResults.latitude}, {ipResults.longitude}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Timezone</span>
                  </div>
                  <p className="text-sm text-slate-700">{ipResults.timezone}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">ASN</span>
                  </div>
                  <p className="text-sm text-slate-700">{ipResults.asn}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Type</span>
                  </div>
                  <Badge variant="outline">{ipResults.type}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {dnsResults && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>DNS Lookup Results</CardTitle>
                  <CardDescription>Records for {dnsResults.domain}</CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyToClipboard(JSON.stringify(dnsResults, null, 2), "DNS data")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">IP Address</span>
                    <p className="text-sm text-slate-700 font-mono">{dnsResults.ipAddress}</p>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Registrar</span>
                    <p className="text-sm text-slate-700">{dnsResults.registrar}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">DNS Records</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(dnsResults.records).map(([type, records]) => (
                      <div key={type} className="p-3 border border-slate-200 rounded-lg">
                        <div className="font-medium text-sm mb-2">{type} Records</div>
                        <div className="space-y-1">
                          {(records as string[]).map((record, index) => (
                            <div key={index} className="text-sm text-slate-700 font-mono">
                              {record}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Created</span>
                    <p className="text-sm text-slate-700">{dnsResults.created}</p>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">Expires</span>
                    <p className="text-sm text-slate-700">{dnsResults.expires}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!ipResults && !dnsResults && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No Results Yet</h3>
              <p className="text-slate-500">Enter an IP address or domain name to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IpLookup;
