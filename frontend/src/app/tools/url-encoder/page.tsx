"use client";

import { useState } from "react";
import { Copy, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { ToolLayout } from "@/components/ToolLayout";

const UrlEncoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(input);
      setOutput(encoded);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to encode URL.",
        variant: "destructive",
      });
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid URL encoding.",
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
    <ToolLayout title="URL Encoder/Decoder" description="Encode and decode URLs for safe transmission" category="Text & String" icon={Badge}>
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
              {mode === "encode" ? "Enter URL to encode" : "Enter encoded URL to decode"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={mode === "encode" ? "https://example.com/search?q=hello world" : "https%3A//example.com/search%3Fq%3Dhello%20world"}
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
                  {mode === "encode" ? "URL encoded result" : "Decoded URL result"}
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
              className="min-h-[400px] font-mono text-sm bg-muted"
              placeholder="Output will appear here..."
            />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default UrlEncoder;
