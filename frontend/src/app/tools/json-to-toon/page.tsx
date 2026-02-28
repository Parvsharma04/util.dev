"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Download, ArrowRightLeft, Zap, Settings2 } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { encode, decode } from "@toon-format/toon";

type Delimiter = "," | "\t" | "|";

const JsonToToon = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"json-to-toon" | "toon-to-json">("json-to-toon");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [keyFolding, setKeyFolding] = useState(true);
  const [indent, setIndent] = useState(2);
  const { toast } = useToast();

  const [stats, setStats] = useState({
    inputSize: 0,
    outputSize: 0,
    savings: 0,
    savingsPercent: 0,
  });

  const convert = () => {
    if (!input.trim()) {
      setError("Please enter some input");
      return;
    }

    try {
      if (mode === "json-to-toon") {
        const parsed = JSON.parse(input);
        const toon = encode(parsed, {
          indent,
          delimiter,
          keyFolding: keyFolding ? "safe" : "off",
        });
        setOutput(toon);
        
        const inputSize = new Blob([input]).size;
        const outputSize = new Blob([toon]).size;
        const savings = inputSize - outputSize;
        
        setStats({
          inputSize,
          outputSize,
          savings,
          savingsPercent: inputSize > 0 ? (savings / inputSize) * 100 : 0,
        });
      } else {
        const parsed = decode(input, {
          indent,
          expandPaths: keyFolding ? "safe" : "off",
        });
        const json = JSON.stringify(parsed, null, 2);
        setOutput(json);
        
        const inputSize = new Blob([input]).size;
        const outputSize = new Blob([json]).size;
        
        setStats({
          inputSize,
          outputSize,
          savings: inputSize - outputSize,
          savingsPercent: 0,
        });
      }
      setError("");
    } catch (err) {
      setError(`Error: ${(err as Error).message}`);
      setOutput("");
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard",
    });
  };

  const downloadOutput = () => {
    const ext = mode === "json-to-toon" ? "toon" : "json";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const swapMode = () => {
    setMode(mode === "json-to-toon" ? "toon-to-json" : "json-to-toon");
    setInput(output);
    setOutput("");
    setError("");
  };

  const loadSample = () => {
    const sample = {
      users: [
        { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
        { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
        { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
      ],
      metadata: {
        total: 3,
        page: 1,
        perPage: 10,
      },
    };
    setInput(JSON.stringify(sample, null, 2));
    setOutput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-mono">JSON ↔ TOON</h1>
              <p className="text-muted-foreground">Convert JSON to TOON format for smaller LLM context</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="border-primary/30 text-primary">AI Tools</Badge>
            <Badge variant="outline">Token Saver</Badge>
            <Badge variant="outline">LLM</Badge>
          </div>
        </div>

        {/* Options Bar */}
        <Card className="mb-6 bg-card border-border">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Mode:</Label>
                <Badge variant={mode === "json-to-toon" ? "default" : "outline"} className="cursor-pointer" onClick={() => setMode("json-to-toon")}>
                  JSON → TOON
                </Badge>
                <Badge variant={mode === "toon-to-json" ? "default" : "outline"} className="cursor-pointer" onClick={() => setMode("toon-to-json")}>
                  TOON → JSON
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Delimiter:</Label>
                <Select value={delimiter} onValueChange={(v) => setDelimiter(v as Delimiter)}>
                  <SelectTrigger className="w-[100px] h-8 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma</SelectItem>
                    <SelectItem value="	">Tab</SelectItem>
                    <SelectItem value="|">Pipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch 
                  id="keyFolding" 
                  checked={keyFolding} 
                  onCheckedChange={setKeyFolding}
                />
                <Label htmlFor="keyFolding" className="text-sm text-muted-foreground cursor-pointer">
                  Key Folding
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">Indent:</Label>
                <Select value={String(indent)} onValueChange={(v) => setIndent(Number(v))}>
                  <SelectTrigger className="w-[70px] h-8 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={loadSample} variant="outline" size="sm">
                Load Sample
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground font-mono">
                  {mode === "json-to-toon" ? "JSON Input" : "TOON Input"}
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  {stats.inputSize > 0 ? `${stats.inputSize} bytes` : "—"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "json-to-toon" 
                  ? '{"key": "value", "array": [1, 2, 3]}'
                  : 'key: value\narray[3]: 1,2,3'
                }
                className="min-h-[400px] font-mono text-sm bg-background border-border resize-none"
              />
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground font-mono">
                  {mode === "json-to-toon" ? "TOON Output" : "JSON Output"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {stats.outputSize > 0 && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {stats.outputSize} bytes
                    </Badge>
                  )}
                  {stats.savings > 0 && mode === "json-to-toon" && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono text-xs">
                      -{stats.savingsPercent.toFixed(1)}%
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="min-h-[400px] p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 font-mono text-sm">{error}</p>
                </div>
              ) : (
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Output will appear here..."
                  className="min-h-[400px] font-mono text-sm bg-background border-border resize-none"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <Button onClick={convert} className="min-w-[140px]">
            <Zap className="w-4 h-4 mr-2" />
            Convert
          </Button>
          <Button onClick={swapMode} variant="outline">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Swap & Convert
          </Button>
          <Button onClick={copyOutput} variant="outline" disabled={!output}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button onClick={downloadOutput} variant="outline" disabled={!output}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-muted/50 border-border">
          <CardHeader>
            <CardTitle className="text-foreground font-mono text-lg">About TOON Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">TOON</strong> (Tabular Object-Oriented Notation) is a compact data format 
              designed to reduce token count when sending structured data to LLMs.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Tabular arrays</strong> — Repeating object keys are declared once in a header</li>
              <li><strong>Key folding</strong> — Nested single-key paths collapse to dotted notation</li>
              <li><strong>Tab delimiters</strong> — Better tokenization than commas for most LLMs</li>
              <li><strong>Lossless</strong> — Full round-trip compatibility with JSON</li>
            </ul>
            <p className="pt-2">
              Typical savings: <strong className="text-primary">20-50%</strong> fewer tokens for structured data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JsonToToon;
