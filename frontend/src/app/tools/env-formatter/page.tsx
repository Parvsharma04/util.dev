"use client";

import { useState } from "react";
import { Copy, RotateCcw, FileText, Settings, Download, Trash2, Info, ArrowDownAz, Terminal, Braces } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const EnvFormatter = () => {
  const [envInput, setEnvInput] = useState("");
  const [formattedOutput, setFormattedOutput] = useState("");
  const [sortAlphabetically, setSortAlphabetically] = useState(true);
  const [removeComments, setRemoveComments] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const { toast } = useToast();

  const formatEnv = () => {
    if (!envInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter environment variables to format",
        variant: "destructive"
      });
      return;
    }

    let lines = envInput.split('\n');

    if (removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }

    if (removeComments) {
      lines = lines.filter(line => !line.trim().startsWith('#'));
    }

    if (sortAlphabetically) {
      const envLines = lines.filter(line => line.includes('=') && !line.trim().startsWith('#'));
      const otherLines = lines.filter(line => !line.includes('=') || line.trim().startsWith('#'));

      envLines.sort((a, b) => {
        const keyA = a.split('=')[0].trim();
        const keyB = b.split('=')[0].trim();
        return keyA.localeCompare(keyB);
      });

      lines = [...otherLines, ...envLines];
    }

    const formatted = lines.map(line => {
      if (line.includes('=') && !line.trim().startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        return `${key.trim()}=${value.trim()}`;
      }
      return line;
    }).join('\n');

    setFormattedOutput(formatted);
    toast({ title: "Optimized", description: "Environment file has been cleaned and formatted" });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedOutput);
    toast({ title: "Copied", description: "Clean .env copied to clipboard" });
  };

  const clearAll = () => {
    setEnvInput("");
    setFormattedOutput("");
  };

  const downloadEnv = () => {
    const blob = new Blob([formattedOutput], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title=".env Architect"
      description="Validate, clean, and organize your environment variables for production readiness"
      category="Developer Tools"
      icon={Terminal}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input & Control Column */}
        <div className="space-y-6">
          <Card className="bg-card border-border card-glow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono text-sm flex items-center gap-2">
                  <Braces className="w-4 h-4 text-primary" />
                  Source Input
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={clearAll} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="DATABASE_URL=postgres://...&#10;API_KEY=your_key&#10;# App Config&#10;PORT=3000"
                value={envInput}
                onChange={(e) => setEnvInput(e.target.value)}
                className="min-h-[350px] font-mono text-xs bg-muted/10 border-border"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/5">
                  <div className="flex items-center gap-2">
                    <ArrowDownAz className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sort Az</span>
                  </div>
                  <Switch checked={sortAlphabetically} onCheckedChange={setSortAlphabetically} className="data-[state=checked]:bg-primary" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/5">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Clean Empty</span>
                  </div>
                  <Switch checked={removeEmpty} onCheckedChange={setRemoveEmpty} className="data-[state=checked]:bg-primary" />
                </div>
              </div>

              <Button onClick={formatEnv} className="w-full h-11 font-mono bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10">
                <Settings className="w-4 h-4 mr-2" />
                Execute Formatting
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 flex gap-4 items-start">
              <Info className="w-6 h-6 text-primary shrink-0" />
              <div className="space-y-1">
                <h4 className="font-bold font-mono text-xs uppercase tracking-widest">Security Notice</h4>
                <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                  We never store or log your environment variables. All operations are performed locally in your browser's memory. Always use <span className="text-primary italic">.env.example</span> for template files.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Column */}
        <Card className="bg-card border-border card-glow flex flex-col h-full min-h-[500px]">
          <CardHeader className="pb-3 border-b border-border bg-muted/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-mono text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Cleaned Output
                </CardTitle>
                <CardDescription className="text-xs font-mono">.env</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={copyToClipboard} disabled={!formattedOutput} className="h-8 w-8 hover:text-primary">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={downloadEnv} disabled={!formattedOutput} className="h-8 w-8 hover:text-primary">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Textarea
              value={formattedOutput}
              readOnly
              className="h-full border-0 rounded-none font-mono text-xs bg-muted/5 p-6 leading-relaxed resize-none focus-visible:ring-0 min-h-[450px]"
              placeholder="# Formatted output will be displayed here..."
            />
          </CardContent>
          {formattedOutput && (
            <div className="p-4 border-t border-border bg-card flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="font-mono text-xs">
                <Copy className="w-3.5 h-3.5 mr-2" />
                Copy Output
              </Button>
              <Button size="sm" onClick={downloadEnv} className="font-mono text-xs">
                <Download className="w-3.5 h-3.5 mr-2" />
                Save .env
              </Button>
            </div>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
};

export default EnvFormatter;
