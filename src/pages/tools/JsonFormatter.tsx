
import { useState } from "react";
import { Copy, Download, Upload, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <a href="/" className="hover:text-slate-700">Home</a>
            <span>→</span>
            <a href="/tools" className="hover:text-slate-700">Tools</a>
            <span>→</span>
            <span className="text-slate-900">JSON Formatter</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">JSON Formatter</h1>
              <p className="text-slate-600">Prettify, minify, and validate JSON with syntax highlighting</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">Text & String</Badge>
            <Badge variant="outline">Popular</Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => formatJson(2)} className="bg-blue-600 hover:bg-blue-700">
              Format (2 spaces)
            </Button>
            <Button onClick={() => formatJson(4)} variant="outline">
              Format (4 spaces)
            </Button>
            <Button onClick={minifyJson} variant="outline">
              Minify
            </Button>
            <Button onClick={validateJson} variant="outline">
              Validate
            </Button>
            <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Input JSON</CardTitle>
                  <CardDescription>Paste your JSON here</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isValid === true && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Valid</span>
                    </div>
                  )}
                  {isValid === false && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">Invalid</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your JSON here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Formatted JSON</CardTitle>
                  <CardDescription>Your formatted result</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    disabled={!output}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadJson}
                    disabled={!output}
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
                className="min-h-[400px] font-mono text-sm bg-slate-50"
                placeholder="Formatted JSON will appear here..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-slate-900 mb-2">Pretty Print</h3>
                <p className="text-sm text-slate-600">Format JSON with proper indentation and spacing</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-slate-900 mb-2">Minify</h3>
                <p className="text-sm text-slate-600">Remove whitespace to reduce file size</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-slate-900 mb-2">Validate</h3>
                <p className="text-sm text-slate-600">Check if your JSON syntax is correct</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-slate-900 mb-2">Error Detection</h3>
                <p className="text-sm text-slate-600">Get detailed error messages for invalid JSON</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-slate-900 mb-2">Copy & Download</h3>
                <p className="text-sm text-slate-600">Easy copy to clipboard or download as file</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-slate-900 mb-2">Keyboard Shortcuts</h3>
                <p className="text-sm text-slate-600">Ctrl+Enter to format, Ctrl+S to download</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
