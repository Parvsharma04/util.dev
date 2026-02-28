"use client";


import { useState } from "react";
import { Copy, Download, Upload, RotateCcw, Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolLayout } from "@/components/ToolLayout";

const Base64Encoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to encode. Please check your input.",
        variant: "destructive",
      });
    }
  };

  const handleDecode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid Base64 string.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard",
    });
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
        <ToolLayout title="Base64 Encoder/Decoder" description="Encode and decode Base64 strings with ease" category="Text & String" icon={Terminal} popular>
<Tabs value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")} className="mb-6">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="encode" className="font-mono data-[state=active]:bg-card">Encode</TabsTrigger>
            <TabsTrigger value="decode" className="font-mono data-[state=active]:bg-card">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={mode === "encode" ? handleEncode : handleDecode}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono"
            >
              {mode === "encode" ? "Encode" : "Decode"}
            </Button>
            <Button onClick={clearAll} variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-border font-mono">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border card-glow h-[600px] flex flex-col">
            <CardHeader className="py-4 border-b border-border shrink-0">
              <CardTitle className="font-mono text-lg">Input</CardTitle>
              <CardDescription className="font-mono">
                {mode === "encode" ? "Enter text to encode" : "Enter Base64 string to decode"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <Textarea
                placeholder={mode === "encode" ? "Enter your text here..." : "Enter Base64 string here..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 w-full bg-transparent border-0 rounded-none resize-none px-4 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 h-full"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border card-glow h-[600px] flex flex-col">
            <CardHeader className="py-4 border-b border-border flex flex-row items-center justify-between shrink-0">
              <div>
                <CardTitle className="font-mono text-lg">Output</CardTitle>
                <CardDescription className="font-mono">
                  {mode === "encode" ? "Base64 encoded result" : "Decoded text result"}
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                disabled={!output}
                className="h-8 hover:bg-primary/10 hover:text-primary transition-colors -my-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0 relative">
              <Textarea
                value={output}
                readOnly
                className="flex-1 w-full bg-muted/30 border-0 rounded-none resize-none px-4 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/30 h-full"
                placeholder="Output will appear here..."
              />
            </CardContent>
          </Card>
        </div>
              </ToolLayout>
    );
};

export default Base64Encoder;
