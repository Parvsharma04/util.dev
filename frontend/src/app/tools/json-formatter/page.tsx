"use client";


import { useState } from "react";
import { Copy, Download, Upload, RotateCcw, CheckCircle, AlertCircle, Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolLayout } from "@/components/ToolLayout";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();

  const formatJson = (indent: number = 2) => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError("");
      setIsValid(true);
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message);
      setOutput("");
      setIsValid(false);
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");
      setIsValid(true);
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message);
      setOutput("");
      setIsValid(false);
    }
  };

  const validateJson = () => {
    try {
      JSON.parse(input);
      setError("");
      setIsValid(true);
      toast({
        title: "Valid JSON",
        description: "Your JSON is properly formatted",
      });
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message);
      setIsValid(false);
      toast({
        title: "Invalid JSON",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "JSON copied to clipboard",
    });
  };

  const downloadJson = () => {
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
    setIsValid(null);
  };

  return (
        <ToolLayout title="JSON Formatter" description="Prettify, minify, and validate JSON with syntax highlighting" category="Text & String" icon={Terminal} popular>
<div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => formatJson(2)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono">
              Format (2 spaces)
            </Button>
            <Button onClick={() => formatJson(4)} variant="outline" className="border-border hover:border-primary/50 font-mono">
              Format (4 spaces)
            </Button>
            <Button onClick={minifyJson} variant="outline" className="border-border hover:border-primary/50 font-mono">
              Minify
            </Button>
            <Button onClick={validateJson} variant="outline" className="border-border hover:border-primary/50 font-mono">
              Validate
            </Button>
            <Button onClick={clearAll} variant="outline" className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50 font-mono">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="bg-card border-border card-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground font-mono">Input JSON</CardTitle>
                  <CardDescription className="text-muted-foreground">Paste your JSON here</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isValid === true && (
                    <div className="flex items-center gap-1 text-emerald-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-mono">Valid</span>
                    </div>
                  )}
                  {isValid === false && (
                    <div className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-mono">Invalid</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="// Paste your JSON here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm bg-input border-border focus:border-primary"
              />
              {error && (
                <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-sm text-destructive font-mono">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="bg-card border-border card-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground font-mono">Formatted Output</CardTitle>
                  <CardDescription className="text-muted-foreground">Your formatted result</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    disabled={!output}
                    className="border-border hover:border-primary/50"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadJson}
                    disabled={!output}
                    className="border-border hover:border-primary/50"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-muted border-border"
                placeholder="// Formatted JSON will appear here..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-6 font-mono glow flex items-center gap-2">
            <span className="text-muted-foreground">&gt;</span> Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-card border-border card-glow">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2 font-mono">Pretty Print</h3>
                <p className="text-sm text-muted-foreground">Format JSON with proper indentation and spacing</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border card-glow">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2 font-mono">Minify</h3>
                <p className="text-sm text-muted-foreground">Remove whitespace to reduce file size</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border card-glow">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2 font-mono">Validate</h3>
                <p className="text-sm text-muted-foreground">Check if your JSON syntax is correct</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border card-glow">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2 font-mono">Error Detection</h3>
                <p className="text-sm text-muted-foreground">Get detailed error messages for invalid JSON</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border card-glow">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2 font-mono">Copy & Download</h3>
                <p className="text-sm text-muted-foreground">Easy copy to clipboard or download as file</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border card-glow">
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-2 font-mono">Keyboard Shortcuts</h3>
                <p className="text-sm text-muted-foreground">Ctrl+Enter to format, Ctrl+S to download</p>
              </CardContent>
            </Card>
          </div>
        </div>
              </ToolLayout>
    );
};

export default JsonFormatter;
