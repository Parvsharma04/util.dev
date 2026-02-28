"use client";

import { useState } from "react";
import { Copy, RotateCcw, ShieldCheck, Fingerprint, Lock, Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const HashGenerator = () => {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateHashes = async () => {
    if (!input) {
      toast({
        title: "Input Required",
        description: "Please enter text to hash",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const newHashes: Record<string, string> = {};
      const msgUint8 = new TextEncoder().encode(input);

      // SHA-1
      const sha1Buffer = await crypto.subtle.digest("SHA-1", msgUint8);
      newHashes["SHA-1"] = Array.from(new Uint8Array(sha1Buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join("");

      // SHA-256
      const sha256Buffer = await crypto.subtle.digest("SHA-256", msgUint8);
      newHashes["SHA-256"] = Array.from(new Uint8Array(sha256Buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join("");

      // SHA-512
      const sha512Buffer = await crypto.subtle.digest("SHA-512", msgUint8);
      newHashes["SHA-512"] = Array.from(new Uint8Array(sha512Buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join("");

      setHashes(newHashes);
      toast({
        title: "Success",
        description: "Hashes generated locally using Web Crypto API",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hashes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
    <ToolLayout
      title="Secure Hash Generator"
      description="Generate cryptographically secure SHA-1, SHA-256, and SHA-512 hashes"
      category="Text & String"
      icon={Fingerprint}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Plaintext Input
            </CardTitle>
            <CardDescription className="font-mono">Enter the data you want to hash</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your sensitive data or text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[250px] font-mono text-sm bg-muted/10 border-border focus:ring-primary"
            />
            <div className="flex gap-2">
              <Button
                onClick={generateHashes}
                className="flex-1 font-mono bg-primary hover:bg-primary/90"
                disabled={isGenerating}
              >
                {isGenerating ? "Hashing..." : <Zap className="w-4 h-4 mr-2" />}
                Generate Hashes
              </Button>
              <Button variant="outline" onClick={clearAll} className="font-mono border-border">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Card */}
        <Card className="bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Secure Digests
            </CardTitle>
            <CardDescription className="font-mono">Hexadecimal representation of hashes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {["SHA-256", "SHA-512", "SHA-1"].map((algo) => (
              <div key={algo} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary">
                    {algo}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(hashes[algo] || "", algo)}
                    disabled={!hashes[algo]}
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="p-3 bg-muted/30 border border-border rounded-lg font-mono text-[11px] text-foreground break-all leading-tight shadow-inner">
                  {hashes[algo] || <span className="text-muted-foreground/40 italic">Waiting for input...</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card className="lg:col-span-2 bg-muted/30 border-border lg:mt-6">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <Lock className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Client-Side</h4>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">Your data never leaves your browser. Hashes are computed locally using the Web Crypto API.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Secure Algos</h4>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">We use SHA-256 and SHA-512, which are the standard for modern cryptographic security.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Info className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Immutable</h4>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">Hashing is a one-way function. You cannot reverse a hash to retrieve the original plaintext.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default HashGenerator;
