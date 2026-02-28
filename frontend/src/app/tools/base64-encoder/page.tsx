"use client";

import { useState } from "react";
import { Copy, RotateCcw, FileText, Binary, ArrowRightLeft, Info, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const Base64Converter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();

  const processBase64 = () => {
    if (!input.trim()) {
      toast({ title: "Input Required", description: "Please enter text to process", variant: "destructive" });
      return;
    }

    try {
      if (mode === "encode") {
        // Handle Unicode properly: btoa only supports Latin-1
        const bytes = new TextEncoder().encode(input);
        const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
        const result = btoa(binString);
        setOutput(result);
        toast({ title: "Encoded", description: "Text successfully converted to Base64" });
      } else {
        const binString = atob(input.trim());
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
        const result = new TextDecoder().decode(bytes);
        setOutput(result);
        toast({ title: "Decoded", description: "Base64 successfully converted to text" });
      }
    } catch (err) {
      toast({
        title: "Processing Error",
        description: mode === "encode" ? "Failed to encode input" : "Invalid Base64 sequence",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Result copied to your clipboard" });
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <ToolLayout
      title="Base64 Binary Transformer"
      description="Securely encode and decode text strings for data transmission"
      category="Text & String"
      icon={Binary}
    >
      <div className="space-y-6">
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50 border border-border p-1">
              <TabsTrigger value="encode" className="font-mono text-xs gap-2">
                <FileText className="w-3.5 h-3.5" />
                Text → Base64
              </TabsTrigger>
              <TabsTrigger value="decode" className="font-mono text-xs gap-2">
                <Binary className="w-3.5 h-3.5" />
                Base64 → Text
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={clear} className="font-mono text-xs text-destructive hover:bg-destructive/10 border-border h-8">
              <RotateCcw className="w-3.5 h-3.5 mr-2" />
              Reset Workspace
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Area */}
            <Card className="bg-card border-border card-glow h-full flex flex-col">
              <CardHeader className="pb-3 border-b border-border bg-muted/10">
                <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Input Buffer</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <Textarea
                  placeholder={mode === "encode" ? "Paste raw text here..." : "Paste Base64 string here..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[400px] h-full border-0 rounded-none font-mono text-xs bg-transparent p-6 leading-relaxed resize-none focus-visible:ring-0"
                />
              </CardContent>
              <div className="p-4 border-t border-border bg-card">
                <Button onClick={processBase64} className="w-full font-mono bg-primary">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  {mode === "encode" ? "Execute Encoding" : "Execute Decoding"}
                </Button>
              </div>
            </Card>

            {/* Output Area */}
            <Card className="bg-card border-border card-glow h-full flex flex-col">
              <CardHeader className="pb-3 border-b border-border bg-muted/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Output Result</CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={copyToClipboard}
                    disabled={!output}
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 relative">
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[400px] h-full border-0 rounded-none font-mono text-xs bg-muted/5 p-6 leading-relaxed resize-none focus-visible:ring-0"
                  placeholder="The result will be projected here..."
                />
              </CardContent>
              {output && (
                <div className="p-4 border-t border-border bg-card">
                  <Button onClick={copyToClipboard} variant="outline" className="w-full font-mono">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Result
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </Tabs>

        {/* Footer Info */}
        <Card className="bg-muted/30 border-border">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <Check className="w-8 h-8 text-primary shrink-0 opacity-50" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">UTF-8 Support</h4>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Our converter correctly handles multi-byte characters (emojis, non-latin scripts) using TextEncoder APIs.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <AlertCircle className="w-8 h-8 text-primary shrink-0 opacity-50" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Safe & Local</h4>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Encoding and decoding occur purely on the client-side. No data is ever transmitted to our infrastructure.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Info className="w-8 h-8 text-primary shrink-0 opacity-50" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Binary Data</h4>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">For binary files (images, PDFs), please use our upcoming specialized Binary-to-Base64 uploader tool.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default Base64Converter;
