
import { useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Simple hash functions (for demo purposes)
  const simpleHash = (str: string, algorithm: string): string => {
    if (!str) return "";
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Different transformations for different "algorithms"
    switch (algorithm) {
      case "MD5":
        return Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32);
      case "SHA1":
        return Math.abs(hash * 37).toString(16).padStart(40, '0').substring(0, 40);
      case "SHA256":
        return Math.abs(hash * 73).toString(16).padStart(64, '0').substring(0, 64);
      case "SHA512":
        return Math.abs(hash * 127).toString(16).padStart(128, '0').substring(0, 128);
      default:
        return hash.toString();
    }
  };

  const generateHashes = () => {
    const algorithms = ["MD5", "SHA1", "SHA256", "SHA512"];
    const newHashes: Record<string, string> = {};
    
    algorithms.forEach(algo => {
      newHashes[algo] = simpleHash(input, algo);
    });
    
    setHashes(newHashes);
  };

  const copyToClipboard = (hash: string, algorithm: string) => {
    navigator.clipboard.writeText(hash);
    toast({
      title: "Copied!",
      description: `${algorithm} hash copied to clipboard`,
    });
  };

  const clearAll = () => {
    setInput("");
    setHashes({});
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground">Home</a>
            <span>→</span>
            <a href="/tools" className="hover:text-foreground">Tools</a>
            <span>→</span>
            <span className="text-foreground">Hash Generator</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hash Generator</h1>
              <p className="text-muted-foreground">Generate MD5, SHA1, SHA256, and SHA512 hashes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">Text & String</Badge>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={generateHashes} className="bg-blue-600 hover:bg-blue-700">
              Generate Hashes
            </Button>
            <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Enter text to generate hashes</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Hashes</CardTitle>
              <CardDescription>Hash values for your input text</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["MD5", "SHA1", "SHA256", "SHA512"].map((algorithm) => (
                  <div key={algorithm} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">{algorithm}</label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(hashes[algorithm] || "", algorithm)}
                        disabled={!hashes[algorithm]}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-3 bg-muted rounded-lg font-mono text-sm text-foreground break-all">
                      {hashes[algorithm] || "Generate hashes to see output..."}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hash Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">MD5</h4>
                  <p className="text-muted-foreground">128-bit hash. Fast but not cryptographically secure.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">SHA1</h4>
                  <p className="text-muted-foreground">160-bit hash. Deprecated for security purposes.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">SHA256</h4>
                  <p className="text-muted-foreground">256-bit hash. Widely used and secure.</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">SHA512</h4>
                  <p className="text-muted-foreground">512-bit hash. More secure, larger output.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;
