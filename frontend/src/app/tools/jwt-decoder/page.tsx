"use client";

import { useState } from "react";
import { Copy, RotateCcw, ShieldCheck, Key, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const JwtDecoder = () => {
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState<{ header: any; payload: any; signature: string } | null>(null);
  const { toast } = useToast();

  const decodeJwt = () => {
    if (!jwt.trim()) return;
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format: Tokens must have 3 parts separated by dots.');
      }

      const decodeBase64 = (str: string) => {
        try {
          // Add padding if needed
          const padded = str.padEnd(str.length + (4 - str.length % 4) % 4, '=');
          return JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')));
        } catch (e) {
          throw new Error('Failed to decode base64 part.');
        }
      };

      const header = decodeBase64(parts[0]);
      const payload = decodeBase64(parts[1]);
      const signature = parts[2];

      setDecoded({ header, payload, signature });
      toast({
        title: "Success",
        description: "JWT decoded successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Invalid JWT token",
        variant: "destructive",
      });
      setDecoded(null);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const clearAll = () => {
    setJwt("");
    setDecoded(null);
  };

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode JSON Web Tokens and inspect header, payload, and signature data"
      category="Text & String"
      icon={ShieldCheck}
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Button onClick={decodeJwt} className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono">
          Decode JWT
        </Button>
        <Button onClick={clearAll} variant="outline" className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50 font-mono">
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="text-foreground font-mono">Input Token</CardTitle>
            <CardDescription className="text-muted-foreground">Paste your encoded JWT here</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
              className="min-h-[400px] font-mono text-sm bg-input border-border focus:border-primary break-all"
            />
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {!decoded ? (
            <Card className="bg-card border-border card-glow h-full flex flex-col justify-center items-center p-12 text-center text-muted-foreground border-dashed">
              <Key className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-mono">Decoded result will appear here</p>
            </Card>
          ) : (
            <>
              {/* Header */}
              <Card className="bg-card border-border card-glow">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-border">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-primary" />
                    <CardTitle className="text-base font-mono">Header</CardTitle>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "Header")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-4 bg-muted/30 text-xs font-mono overflow-x-auto text-primary">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Payload */}
              <Card className="bg-card border-border card-glow">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-border">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <CardTitle className="text-base font-mono">Payload</CardTitle>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "Payload")}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="p-4 bg-muted/30 text-xs font-mono overflow-x-auto text-primary">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              {/* Signature */}
              <Card className="bg-card border-border card-glow">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-border">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <CardTitle className="text-base font-mono">Signature</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="p-3 bg-muted/50 rounded border border-border font-mono text-[10px] break-all text-muted-foreground">
                    {decoded.signature}
                  </div>
                  <p className="mt-2 text-[10px] text-muted-foreground/60 italic font-mono">
                    Note: This tool only decodes tokens. It does not verify signatures against secrets.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
};

export default JwtDecoder;
