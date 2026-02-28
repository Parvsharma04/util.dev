"use client";

import { useState } from "react";
import { Copy, Download, ArrowRightLeft, Zap, Settings2, Database, FileJson, Info, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { encode, decode } from "@toon-format/toon";
import { ToolLayout } from "@/components/ToolLayout";

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
      toast({ title: "Input Required", description: "Please enter data to compress", variant: "destructive" });
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
        toast({ title: "Compression Optimized", description: `Reduced by ${((savings / inputSize) * 100).toFixed(1)}%` });
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
        toast({ title: "Extraction Successful", description: "TOON data expanded to JSON" });
      }
      setError("");
    } catch (err) {
      setError(`Stream Error: ${(err as Error).message}`);
      setOutput("");
      toast({ title: "Processing Error", description: "Failed to parse input stream", variant: "destructive" });
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!", description: "Result copied to clipboard" });
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

  const loadSample = () => {
    const sample = {
      users: [
        { id: 1, name: "Alice", role: "admin", status: "active" },
        { id: 2, name: "Bob", role: "user", status: "offline" },
        { id: 3, name: "Charlie", role: "user", status: "active" },
      ],
      config: {
        timeout: 5000,
        retry: true,
        region: "us-east-1"
      },
    };
    setInput(JSON.stringify(sample, null, 2));
    setMode("json-to-toon");
    setError("");
  };

  return (
    <ToolLayout
      title="TOON Context Optimizer"
      description="Token-efficient data serialization for high-performance LLM context management"
      category="AI Tools"
      icon={Zap}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-card border-border card-glow">
            <CardHeader>
              <CardTitle className="font-mono text-sm flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                Stream Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Operation Mode</label>
                <Select value={mode} onValueChange={(v) => setMode(v as any)}>
                  <SelectTrigger className="bg-muted/10 border-border font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-mono text-xs">
                    <SelectItem value="json-to-toon">JSON → TOON (Compress)</SelectItem>
                    <SelectItem value="toon-to-json">TOON → JSON (Expand)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-muted/5">
                  <div className="space-y-0.5">
                    <label className="text-xs font-bold text-foreground">Key Folding</label>
                    <p className="text-[10px] text-muted-foreground">Collapse nested paths</p>
                  </div>
                  <Switch checked={keyFolding} onCheckedChange={setKeyFolding} className="data-[state=checked]:bg-primary" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Delimiter</label>
                  <Select value={delimiter} onValueChange={(v) => setDelimiter(v as any)}>
                    <SelectTrigger className="bg-muted/10 border-border font-mono text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="font-mono text-xs">
                      <SelectItem value=",">Comma (,)</SelectItem>
                      <SelectItem value="\t">Tab (\t)</SelectItem>
                      <SelectItem value="|">Pipe (|)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={convert} className="flex-1 h-11 bg-primary font-mono text-xs">
                  <RefreshCw className="w-3.5 h-3.5 mr-2" />
                  Execute
                </Button>
                <Button variant="outline" onClick={loadSample} className="h-11 font-mono text-xs">
                  Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex gap-4 items-start">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-bold font-mono text-xs uppercase tracking-widest">Efficiency Stats</h4>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">Input Size</p>
                      <p className="text-sm font-mono font-bold text-foreground">{stats.inputSize} B</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase">Output Size</p>
                      <p className="text-sm font-mono font-bold text-foreground">{stats.outputSize} B</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[9px] text-muted-foreground uppercase">Compression Ratio</p>
                        <p className="text-[9px] font-bold text-primary font-mono">{stats.savingsPercent.toFixed(1)}%</p>
                      </div>
                      <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden border border-border">
                        <div className="h-full bg-primary" style={{ width: `${Math.min(100, stats.savingsPercent)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Data Projection */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-card border-border card-glow flex-1 flex flex-col min-h-[400px]">
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <FileJson className="w-3.5 h-3.5" />
                  Source Buffer
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setInput("")} className="text-[10px] h-7 font-mono opacity-50 hover:opacity-100">Clear</Button>
              </div>
            </CardHeader>
            <CardContent className="lex-1 p-0">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === "json-to-toon" ? '{"key": "value"}' : 'key: value'}
                className="h-full min-h-[250px] border-0 rounded-none font-mono text-xs bg-transparent p-6 leading-relaxed resize-none focus-visible:ring-0"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border card-glow flex-1 flex flex-col min-h-[400px]">
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" />
                  Optimized Result
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={copyOutput} disabled={!output}>
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={downloadOutput} disabled={!output}>
                    <Download className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="lex-1 p-0">
              {error ? (
                <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <AlertCircle className="w-10 h-10 text-destructive opacity-30 mb-2" />
                  <p className="text-xs font-mono text-destructive">{error}</p>
                </div>
              ) : (
                <Textarea
                  value={output}
                  readOnly
                  className="h-full min-h-[250px] border-0 rounded-none font-mono text-xs bg-muted/5 p-6 leading-relaxed resize-none focus-visible:ring-0"
                  placeholder="The projected stream will appear here..."
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Legend */}
        <Card className="lg:col-span-3 bg-muted/30 border-border">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <Check className="w-8 h-8 text-primary shrink-0 opacity-50" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Tabular Logic</h4>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Repeated object keys are extracted into a singular header row, drastically reducing token entropy in arrays.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="w-8 h-8 text-primary shrink-0 opacity-50" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Key Folding</h4>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">Deeply nested objects with singular properties are collapsed into dot-notation strings to save whitespace tokens.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="w-8 h-8 text-primary shrink-0 opacity-50" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Lossless Transfer</h4>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">TOON is fully round-trip compatible. You can expand TOON messages back into standard JSON without data degradation.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default JsonToToon;
