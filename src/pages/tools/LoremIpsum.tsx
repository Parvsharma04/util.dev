
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Lorem Ipsum Generator</h1>
          <p className="text-slate-600">Generate placeholder text for your designs</p>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-2">Text & String</Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div>
                  <label className="text-sm font-medium">Count</label>
                  <Input type="number" min="1" max="50" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} className="w-24" />
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paragraphs">Paragraphs</SelectItem>
                      <SelectItem value="sentences">Sentences</SelectItem>
                      <SelectItem value="words">Words</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={generateLorem} className="bg-blue-600 hover:bg-blue-700">Generate</Button>
              </div>
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
      </div>
    </div>
  );
};

export default LoremIpsum;
