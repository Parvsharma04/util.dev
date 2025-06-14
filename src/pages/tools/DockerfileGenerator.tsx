import { useState } from "react";
import { Copy, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const DockerfileGenerator = () => {
  const [baseImage, setBaseImage] = useState("node:18-alpine");
  const [workDir, setWorkDir] = useState("/app");
  const [copyFiles, setCopyFiles] = useState("package*.json ./");
  const [runCommands, setRunCommands] = useState("npm install");
  const [exposePort, setExposePort] = useState("3000");
  const [startCommand, setStartCommand] = useState("npm start");
  const [addHealthcheck, setAddHealthcheck] = useState(false);
  const [addMultiStage, setAddMultiStage] = useState(false);
  const [dockerfile, setDockerfile] = useState("");
  const { toast } = useToast();

  const generateDockerfile = () => {
    let content = `# Generated Dockerfile\n`;
    
    if (addMultiStage) {
      content += `# Build stage\n`;
      content += `FROM ${baseImage} AS builder\n\n`;
      content += `WORKDIR ${workDir}\n\n`;
      content += `COPY ${copyFiles}\n`;
      content += `RUN ${runCommands}\n\n`;
      content += `# Production stage\n`;
      content += `FROM ${baseImage} AS production\n\n`;
      content += `WORKDIR ${workDir}\n\n`;
      content += `COPY --from=builder ${workDir} .\n\n`;
    } else {
      content += `FROM ${baseImage}\n\n`;
      content += `WORKDIR ${workDir}\n\n`;
      content += `COPY ${copyFiles}\n\n`;
      content += `RUN ${runCommands}\n\n`;
    }
    
    if (exposePort) {
      content += `EXPOSE ${exposePort}\n\n`;
    }
    
    if (addHealthcheck) {
      content += `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\\n`;
      content += `  CMD curl -f http://localhost:${exposePort}/health || exit 1\n\n`;
    }
    
    content += `CMD ["${startCommand.split(' ')[0]}", "${startCommand.split(' ').slice(1).join('", "')}"]`;
    
    setDockerfile(content);
    toast({ title: "Success!", description: "Dockerfile generated successfully" });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dockerfile);
    toast({ title: "Copied!", description: "Dockerfile copied to clipboard" });
  };

  const downloadDockerfile = () => {
    const blob = new Blob([dockerfile], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dockerfile';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Dockerfile Generator</h1>
          <p className="text-slate-600">Generate Docker configuration files</p>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-2">DevOps & Deploy</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Configure your Docker setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Base Image</label>
                <Select value={baseImage} onValueChange={setBaseImage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="node:18-alpine">Node.js 18 Alpine</SelectItem>
                    <SelectItem value="node:16-alpine">Node.js 16 Alpine</SelectItem>
                    <SelectItem value="python:3.9-slim">Python 3.9 Slim</SelectItem>
                    <SelectItem value="nginx:alpine">Nginx Alpine</SelectItem>
                    <SelectItem value="ubuntu:22.04">Ubuntu 22.04</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Working Directory</label>
                <Input value={workDir} onChange={(e) => setWorkDir(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Copy Files</label>
                <Input value={copyFiles} onChange={(e) => setCopyFiles(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Run Commands</label>
                <Input value={runCommands} onChange={(e) => setRunCommands(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Expose Port</label>
                <Input value={exposePort} onChange={(e) => setExposePort(e.target.value)} />
              </div>

              <div>
                <label className="text-sm font-medium">Start Command</label>
                <Input value={startCommand} onChange={(e) => setStartCommand(e.target.value)} />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="healthcheck" 
                  checked={addHealthcheck} 
                  onCheckedChange={(checked) => setAddHealthcheck(checked === true)}
                />
                <label htmlFor="healthcheck" className="text-sm">Add Healthcheck</label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="multistage" 
                  checked={addMultiStage} 
                  onCheckedChange={(checked) => setAddMultiStage(checked === true)}
                />
                <label htmlFor="multistage" className="text-sm">Multi-stage Build</label>
              </div>

              <Button onClick={generateDockerfile} className="w-full">
                Generate Dockerfile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Dockerfile</CardTitle>
                  <CardDescription>Your Docker configuration</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyToClipboard} disabled={!dockerfile}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={downloadDockerfile} disabled={!dockerfile}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={dockerfile}
                readOnly
                className="min-h-[500px] font-mono text-sm bg-slate-50"
                placeholder="Generated Dockerfile will appear here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DockerfileGenerator;
