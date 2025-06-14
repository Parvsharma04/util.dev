
import { useState } from "react";
import { Copy, Download, Upload, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <a href="/" className="hover:text-slate-700">Home</a>
            <span>→</span>
            <a href="/tools" className="hover:text-slate-700">Tools</a>
            <span>→</span>
            <span className="text-slate-900">Base64 Encoder/Decoder</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Base64 Encoder/Decoder</h1>
              <p className="text-slate-600">Encode and decode Base64 strings with ease</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">Text & String</Badge>
            <Badge variant="outline">Popular</Badge>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(value) => setMode(value as "encode" | "decode")} className="mb-6">
          <TabsList>
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={mode === "encode" ? handleEncode : handleDecode}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {mode === "encode" ? "Encode" : "Decode"}
            </Button>
            <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>
                {mode === "encode" ? "Enter text to encode" : "Enter Base64 string to decode"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={mode === "encode" ? "Enter your text here..." : "Enter Base64 string here..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Output</CardTitle>
                  <CardDescription>
                    {mode === "encode" ? "Base64 encoded result" : "Decoded text result"}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  disabled={!output}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={output}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-slate-50"
                placeholder="Output will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Base64Encoder;
