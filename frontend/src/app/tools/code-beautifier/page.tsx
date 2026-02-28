"use client";

import { useState } from "react";
import { Copy, RotateCcw, Code, FileCode, Check, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const CodeBeautifier = () => {
  const [codeInput, setCodeInput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [beautifiedCode, setBeautifiedCode] = useState("");
  const [minifiedCode, setMinifiedCode] = useState("");
  const { toast } = useToast();

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "json", label: "JSON" },
    { value: "css", label: "CSS" },
    { value: "html", label: "HTML" },
    { value: "sql", label: "SQL" }
  ];

  const beautifyCode = () => {
    if (!codeInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some code to process",
        variant: "destructive"
      });
      return;
    }

    try {
      let beautified = "";
      let minified = "";

      switch (language) {
        case "json":
          const parsed = JSON.parse(codeInput);
          beautified = JSON.stringify(parsed, null, 2);
          minified = JSON.stringify(parsed);
          break;

        case "javascript":
          beautified = codeInput
            .replace(/\{/g, ' {\n  ')
            .replace(/\}/g, '\n}')
            .replace(/;/g, ';\n')
            .replace(/,/g, ',\n  ')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
          minified = codeInput.replace(/\s+/g, ' ').trim();
          break;

        case "css":
          beautified = codeInput
            .replace(/\{/g, ' {\n  ')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n  ')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
          minified = codeInput.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
          break;

        case "html":
          let indentLevel = 0;
          beautified = codeInput
            .replace(/></g, '>\n<')
            .split('\n')
            .map(line => {
              const trimmed = line.trim();
              if (trimmed.startsWith('</')) indentLevel--;
              const indented = '  '.repeat(Math.max(0, indentLevel)) + trimmed;
              if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
                indentLevel++;
              }
              return indented;
            })
            .join('\n');
          minified = codeInput.replace(/>\s+</g, '><').trim();
          break;

        case "sql":
          beautified = codeInput
            .replace(/\bSELECT\b/gi, '\nSELECT\n  ')
            .replace(/\bFROM\b/gi, '\nFROM\n  ')
            .replace(/\bWHERE\b/gi, '\nWHERE\n  ')
            .replace(/\bJOIN\b/gi, '\nJOIN\n  ')
            .replace(/\bORDER BY\b/gi, '\nORDER BY\n  ')
            .replace(/\bGROUP BY\b/gi, '\nGROUP BY\n  ')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .join('\n');
          minified = codeInput.replace(/\s+/g, ' ').trim();
          break;

        default:
          beautified = codeInput;
          minified = codeInput.replace(/\s+/g, ' ').trim();
      }

      setBeautifiedCode(beautified);
      setMinifiedCode(minified);

      toast({
        title: "Success",
        description: `Code ${language.toUpperCase()} processed successfully`,
      });
    } catch (error) {
      toast({
        title: "Parsing Error",
        description: `Invalid ${language.toUpperCase()} syntax detected`,
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${type} code copied to clipboard` });
  };

  const clearAll = () => {
    setCodeInput("");
    setBeautifiedCode("");
    setMinifiedCode("");
  };

  return (
    <ToolLayout
      title="Code Beautifier"
      description="Format and minify code for various languages instantly"
      category="Developer Tools"
      icon={FileCode}
    >
      <div className="space-y-6">
        {/* Controls Card */}
        <Card className="bg-card border-border card-glow">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="shrink-0 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Language</div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full sm:w-48 bg-muted/20 border-border font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value} className="font-mono">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={beautifyCode} className="flex-1 sm:flex-none font-mono bg-primary hover:bg-primary/90">
                  <Code className="w-4 h-4 mr-2" />
                  Format Code
                </Button>
                <Button onClick={clearAll} variant="outline" className="font-mono border-border hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="bg-card border-border card-glow flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="font-mono text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                Input Source
              </CardTitle>
              <CardDescription className="text-xs">Paste your messy or minified code here</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <Textarea
                placeholder={`Paste your ${language} here...`}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="min-h-[500px] font-mono text-xs bg-muted/10 border-border focus:ring-primary leading-relaxed"
              />
            </CardContent>
          </Card>

          {/* Results column */}
          <div className="space-y-6 flex flex-col">
            {/* Beautified Output */}
            <Card className="bg-card border-border card-glow flex flex-col flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Beautified
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(beautifiedCode, "Beautified")}
                    disabled={!beautifiedCode}
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <Textarea
                  value={beautifiedCode}
                  readOnly
                  className="h-full min-h-[250px] font-mono text-xs bg-primary/[0.02] border-border italic text-muted-foreground"
                  placeholder="Formatted code will appear here..."
                />
              </CardContent>
            </Card>

            {/* Minified Output */}
            <Card className="bg-card border-border card-glow flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Minified
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(minifiedCode, "Minified")}
                    disabled={!minifiedCode}
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={minifiedCode}
                  readOnly
                  className="min-h-[150px] font-mono text-xs bg-muted/30 border-border break-all"
                  placeholder="Minified code will appear here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-muted/30 border-border">
          <CardContent className="p-6">
            <div className="flex gap-4 items-start">
              <Info className="w-6 h-6 text-primary shrink-0" />
              <div className="space-y-2">
                <h4 className="font-bold font-mono text-sm uppercase tracking-widest text-foreground">Why code formatting?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-primary tracking-tighter mr-1">[BEAUTIFY]</strong>
                    Improves readability for humans. Essential for debugging, code reviews, and maintaining scalable projects with clear hierarchy.
                  </p>
                  <p>
                    <strong className="text-primary tracking-tighter mr-1">[MINIFY]</strong>
                    Removes all unnecessary whitespace, comments, and newlines. Reduces payload size for faster network transfers in production.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CodeBeautifier;
