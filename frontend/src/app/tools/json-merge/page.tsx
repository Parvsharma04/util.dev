"use client";


import { useState } from "react";
import { Copy, RotateCcw, Merge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const JsonMerge = () => {
  const [json1, setJson1] = useState("");
  const [json2, setJson2] = useState("");
  const [mergedJson, setMergedJson] = useState("");
  const [mergeStrategy, setMergeStrategy] = useState("overwrite");
  const { toast } = useToast();

  const mergeObjects = (obj1: any, obj2: any, strategy: string): any => {
    if (strategy === "overwrite") {
      return { ...obj1, ...obj2 };
    } else if (strategy === "preserve") {
      const result = { ...obj2 };
      Object.keys(obj1).forEach(key => {
        if (!(key in result)) {
          result[key] = obj1[key];
        }
      });
      return result;
    } else if (strategy === "deep") {
      const result = { ...obj1 };
      Object.keys(obj2).forEach(key => {
        if (key in result && typeof result[key] === 'object' && typeof obj2[key] === 'object') {
          result[key] = mergeObjects(result[key], obj2[key], strategy);
        } else {
          result[key] = obj2[key];
        }
      });
      return result;
    }
    return obj1;
  };

  const performMerge = () => {
    try {
      if (!json1.trim() || !json2.trim()) {
        toast({
          title: "Error",
          description: "Please enter both JSON objects",
          variant: "destructive"
        });
        return;
      }

      const parsed1 = JSON.parse(json1);
      const parsed2 = JSON.parse(json2);
      
      const merged = mergeObjects(parsed1, parsed2, mergeStrategy);
      setMergedJson(JSON.stringify(merged, null, 2));
      
      toast({
        title: "Success!",
        description: "JSON objects merged successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(mergedJson);
    toast({ title: "Copied!", description: "Merged JSON copied to clipboard" });
  };

  const clearAll = () => {
    setJson1("");
    setJson2("");
    setMergedJson("");
  };

  return (
        <ToolLayout title="JSON Merge Tool" description="Merge two JSON objects with different strategies" category="File & Format" icon={Button}>
<div className="mb-6">
          <div className="flex gap-4 items-end">
            <div>
              <label className="text-sm font-medium">Merge Strategy</label>
              <Select value={mergeStrategy} onValueChange={setMergeStrategy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overwrite">Overwrite (JSON2 wins)</SelectItem>
                  <SelectItem value="preserve">Preserve (JSON1 wins)</SelectItem>
                  <SelectItem value="deep">Deep Merge</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={performMerge} className="bg-blue-600 hover:bg-blue-700">
              <Merge className="w-4 h-4 mr-2" />
              Merge JSON
            </Button>
            <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>JSON Object 1</CardTitle>
              <CardDescription>First JSON object to merge</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder='{"name": "John", "age": 30, "city": "New York"}'
                value={json1}
                onChange={(e) => setJson1(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>JSON Object 2</CardTitle>
              <CardDescription>Second JSON object to merge</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder='{"age": 31, "country": "USA", "occupation": "Developer"}'
                value={json2}
                onChange={(e) => setJson2(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {mergedJson && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Merged Result</CardTitle>
                  <CardDescription>Combined JSON object using {mergeStrategy} strategy</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                {mergedJson}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Merge Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Overwrite</h4>
                <p className="text-muted-foreground">Properties from JSON2 override those in JSON1</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Preserve</h4>
                <p className="text-muted-foreground">Properties from JSON1 are preserved when conflicts occur</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Deep Merge</h4>
                <p className="text-muted-foreground">Recursively merge nested objects</p>
              </div>
            </div>
          </CardContent>
        </Card>
              </ToolLayout>
    );
};

export default JsonMerge;
