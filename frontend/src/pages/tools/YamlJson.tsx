
import { useState } from "react";
import { Copy, RotateCcw, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const YamlJson = () => {
  const [yamlInput, setYamlInput] = useState("");
  const [jsonInput, setJsonInput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const { toast } = useToast();

  // Simple YAML to JSON converter (basic implementation)
  const yamlToJson = (yaml: string): string => {
    try {
      // This is a very basic YAML parser - in production you'd use a proper library
      const lines = yaml.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
      const obj: any = {};
      
      lines.forEach(line => {
        const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
        if (match) {
          const [, indent, key, value] = match;
          const cleanKey = key.trim();
          const cleanValue = value.trim();
          
          if (cleanValue === '') return;
          
          // Handle different value types
          if (cleanValue === 'true' || cleanValue === 'false') {
            obj[cleanKey] = cleanValue === 'true';
          } else if (/^\d+$/.test(cleanValue)) {
            obj[cleanKey] = parseInt(cleanValue);
          } else if (/^\d+\.\d+$/.test(cleanValue)) {
            obj[cleanKey] = parseFloat(cleanValue);
          } else {
            obj[cleanKey] = cleanValue.replace(/^["']|["']$/g, '');
          }
        }
      });
      
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      throw new Error('Invalid YAML format');
    }
  };

  // Simple JSON to YAML converter (basic implementation)
  const jsonToYaml = (json: string): string => {
    try {
      const obj = JSON.parse(json);
      let yaml = '';
      
      const convertValue = (value: any, indent: string = ''): string => {
        if (typeof value === 'object' && value !== null) {
          let result = '';
          Object.keys(value).forEach(key => {
            result += `${indent}${key}: `;
            if (typeof value[key] === 'object' && value[key] !== null) {
              result += '\n' + convertValue(value[key], indent + '  ');
            } else {
              result += `${value[key]}\n`;
            }
          });
          return result;
        }
        return `${value}\n`;
      };
      
      yaml = convertValue(obj);
      return yaml.trim();
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const convertYamlToJson = () => {
    try {
      const result = yamlToJson(yamlInput);
      setJsonOutput(result);
      toast({ title: "Converted!", description: "YAML converted to JSON" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid YAML format",
        variant: "destructive"
      });
    }
  };

  const convertJsonToYaml = () => {
    try {
      const result = jsonToYaml(jsonInput);
      setYamlOutput(result);
      toast({ title: "Converted!", description: "JSON converted to YAML" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} copied to clipboard` });
  };

  const clearAll = () => {
    setYamlInput("");
    setJsonInput("");
    setYamlOutput("");
    setJsonOutput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">YAML ↔ JSON Converter</h1>
          <p className="text-muted-foreground">Convert between YAML and JSON formats</p>
          <Badge className="bg-green-100 text-green-700 border-green-200 mt-2">File & Format</Badge>
        </div>

        <div className="mb-6">
          <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <Tabs defaultValue="yaml-to-json" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="yaml-to-json">YAML → JSON</TabsTrigger>
            <TabsTrigger value="json-to-yaml">JSON → YAML</TabsTrigger>
          </TabsList>

          <TabsContent value="yaml-to-json" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>YAML Input</CardTitle>
                  <CardDescription>Enter your YAML content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="name: John Doe&#10;age: 30&#10;email: john@example.com&#10;active: true"
                      value={yamlInput}
                      onChange={(e) => setYamlInput(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    <Button onClick={convertYamlToJson} className="w-full">
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Convert to JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>JSON Output</CardTitle>
                      <CardDescription>Generated JSON from YAML</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(jsonOutput, "JSON")}
                      disabled={!jsonOutput}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={jsonOutput}
                    readOnly
                    className="min-h-[400px] font-mono text-sm bg-muted"
                    placeholder="JSON output will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="json-to-yaml" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>JSON Input</CardTitle>
                  <CardDescription>Enter your JSON content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Textarea
                      placeholder='{"name": "John Doe", "age": 30, "email": "john@example.com", "active": true}'
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    <Button onClick={convertJsonToYaml} className="w-full">
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Convert to YAML
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>YAML Output</CardTitle>
                      <CardDescription>Generated YAML from JSON</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(yamlOutput, "YAML")}
                      disabled={!yamlOutput}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={yamlOutput}
                    readOnly
                    className="min-h-[400px] font-mono text-sm bg-muted"
                    placeholder="YAML output will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default YamlJson;
