"use client";


import { useState } from "react";
import { Copy, RotateCcw, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
    { value: "xml", label: "XML" },
    { value: "sql", label: "SQL" }
  ];

  const beautifyCode = () => {
    if (!codeInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter code to beautify",
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
          // Simple JS beautification (basic implementation)
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
          // Simple CSS beautification
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
        case "xml":
          // Simple HTML/XML beautification
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
          // Simple SQL beautification
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
        title: "Success!",
        description: "Code has been beautified and minified"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to beautify ${language} code`,
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} code copied to clipboard` });
  };

  const clearAll = () => {
    setCodeInput("");
    setBeautifiedCode("");
    setMinifiedCode("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Code Beautifier</h1>
          <p className="text-muted-foreground">Beautify and minify your code</p>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-2">Developer Tools</Badge>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm font-medium">Language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={beautifyCode} className="bg-blue-600 hover:bg-blue-700">
              <Code className="w-4 h-4 mr-2" />
              Beautify Code
            </Button>
            <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Code</CardTitle>
              <CardDescription>Paste your {language} code here</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={language === "json" ? '{"name":"John","age":30,"city":"New York"}' : 
                           language === "javascript" ? 'function hello(){console.log("Hello World!");}' :
                           language === "css" ? '.button{background:red;color:white;padding:10px;}' :
                           language === "html" ? '<div><p>Hello World!</p></div>' :
                           'Enter your code here...'}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Beautified</CardTitle>
                  <CardDescription>Formatted and readable code</CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(beautifiedCode, "Beautified")}
                  disabled={!beautifiedCode}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={beautifiedCode}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-muted"
                placeholder="Beautified code will appear here..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Minified</CardTitle>
                  <CardDescription>Compressed code</CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(minifiedCode, "Minified")}
                  disabled={!minifiedCode}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={minifiedCode}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-muted"
                placeholder="Minified code will appear here..."
              />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Code Formatting Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Beautified Code</h4>
                <p className="text-muted-foreground">
                  Properly formatted code with consistent indentation and spacing for better readability and maintenance.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Minified Code</h4>
                <p className="text-muted-foreground">
                  Compressed code with removed whitespace and comments to reduce file size for production deployment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeBeautifier;
