"use client";


import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";
import { FileText } from "lucide-react";


const LoremIpsum = () => {
  const [count, setCount] = useState(5);
  const [type, setType] = useState("paragraphs");
  const [generated, setGenerated] = useState("");
  const { toast } = useToast();

  const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  const generateLorem = () => {
    let result = "";
    if (type === "paragraphs") {
      result = Array.from({ length: count }, () => loremText).join("\n\n");
    } else if (type === "sentences") {
      const sentences = loremText.split(". ");
      result = Array.from({ length: count }, (_, i) => sentences[i % sentences.length]).join(". ");
    } else {
      const words = loremText.split(" ");
      result = Array.from({ length: count }, (_, i) => words[i % words.length]).join(" ");
    }
    setGenerated(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    toast({ title: "Copied!", description: "Lorem ipsum text copied to clipboard" });
  };

  return (
    <ToolLayout title="Lorem Ipsum Generator" description="Generate placeholder text for your designs" category="Text & String" icon={FileText}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground font-mono">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-mono text-muted-foreground">Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full bg-input border-border font-mono">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="words">Words</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium font-mono text-muted-foreground">Count</label>
              <Input
                type="number"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="bg-input border-border font-mono"
                min={1}
                max={50}
              />
            </div>
            <Button onClick={generateLorem} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-mono">
              Generate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Text</CardTitle>
              <Button size="sm" variant="outline" onClick={copyToClipboard} disabled={!generated}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea value={generated} readOnly className="min-h-[300px]" placeholder="Generated text will appear here..." />
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default LoremIpsum;
