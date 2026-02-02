
import { useState } from "react";
import { Copy, RotateCcw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

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
        title: "Error",
        description: "Please enter environment variables",
        variant: "destructive"
      });
      return;
    }

    let lines = envInput.split('\n');
    
    // Remove empty lines if option is selected
    if (removeEmpty) {
      lines = lines.filter(line => line.trim() !== '');
    }
    
    // Remove comments if option is selected
    if (removeComments) {
      lines = lines.filter(line => !line.trim().startsWith('#'));
    }
    
    // Sort alphabetically if option is selected
    if (sortAlphabetically) {
      const envLines = lines.filter(line => line.includes('=') && !line.trim().startsWith('#'));
      const commentLines = lines.filter(line => line.trim().startsWith('#'));
      
      envLines.sort((a, b) => {
        const keyA = a.split('=')[0].trim();
        const keyB = b.split('=')[0].trim();
        return keyA.localeCompare(keyB);
      });
      
      lines = [...commentLines, ...envLines];
    }
    
    // Format the lines
    const formatted = lines.map(line => {
      if (line.includes('=') && !line.trim().startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        const value = valueParts.join('=');
        return `${key.trim()}=${value.trim()}`;
      }
      return line;
    }).join('\n');
    
    setFormattedOutput(formatted);
    toast({
      title: "Formatted!",
      description: "Environment file has been formatted"
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedOutput);
    toast({ title: "Copied!", description: "Formatted .env copied to clipboard" });
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">.env Formatter</h1>
          <p className="text-muted-foreground">Format and organize environment variables</p>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-2">Developer Tools</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables Input</CardTitle>
              <CardDescription>Paste your .env file content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="DATABASE_URL=postgres://localhost:5432/mydb&#10;API_KEY=your-api-key&#10;# Database configuration&#10;DB_HOST=localhost&#10;&#10;DEBUG=true"
                  value={envInput}
                  onChange={(e) => setEnvInput(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Sort alphabetically</label>
                    <Switch
                      checked={sortAlphabetically}
                      onCheckedChange={setSortAlphabetically}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Remove empty lines</label>
                    <Switch
                      checked={removeEmpty}
                      onCheckedChange={setRemoveEmpty}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Remove comments</label>
                    <Switch
                      checked={removeComments}
                      onCheckedChange={setRemoveComments}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={formatEnv} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Format .env
                  </Button>
                  <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Formatted Output</CardTitle>
                  <CardDescription>Clean and organized .env file</CardDescription>
                </div>
                {formattedOutput && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={downloadEnv}>
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formattedOutput}
                readOnly
                className="min-h-[400px] font-mono text-sm bg-muted"
                placeholder="Formatted .env content will appear here..."
              />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Formatting Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Sort Alphabetically</h4>
                <p className="text-muted-foreground">Organize variables in alphabetical order for better readability</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Remove Empty Lines</h4>
                <p className="text-muted-foreground">Clean up the file by removing unnecessary empty lines</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Remove Comments</h4>
                <p className="text-muted-foreground">Strip out all comments to create a production-ready file</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnvFormatter;
