
import { useState } from "react";
import { Copy, Download, Container } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const DockerfileGenerator = () => {
  const [language, setLanguage] = useState("");
  const [version, setVersion] = useState("");
  const [port, setPort] = useState("3000");
  const [workdir, setWorkdir] = useState("/app");
  const [includeHealthcheck, setIncludeHealthcheck] = useState(false);
  const [includeMultistage, setIncludeMultistage] = useState(false);
  const [generatedDockerfile, setGeneratedDockerfile] = useState("");
  const { toast } = useToast();

  const languages = [
    { value: "node", label: "Node.js", versions: ["18", "20", "latest"] },
    { value: "python", label: "Python", versions: ["3.9", "3.10", "3.11", "3.12"] },
    { value: "java", label: "Java", versions: ["8", "11", "17", "21"] },
    { value: "golang", label: "Go", versions: ["1.19", "1.20", "1.21", "latest"] },
    { value: "nginx", label: "Nginx", versions: ["1.20", "1.21", "latest"] },
    { value: "php", label: "PHP", versions: ["8.0", "8.1", "8.2", "8.3"] }
  ];

  const getDockerfileTemplate = () => {
    const selectedLang = languages.find(l => l.value === language);
    if (!selectedLang) return "";

    const templates: { [key: string]: string } = {
      node: `FROM node:${version}

${workdir ? `WORKDIR ${workdir}` : 'WORKDIR /app'}

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE ${port}

${includeHealthcheck ? `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:${port}/health || exit 1

` : ''}USER node

CMD ["npm", "start"]`,

      python: `FROM python:${version}-slim

${workdir ? `WORKDIR ${workdir}` : 'WORKDIR /app'}

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE ${port}

${includeHealthcheck ? `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:${port}/health || exit 1

` : ''}CMD ["python", "app.py"]`,

      java: `FROM openjdk:${version}

${workdir ? `WORKDIR ${workdir}` : 'WORKDIR /app'}

COPY target/*.jar app.jar

EXPOSE ${port}

${includeHealthcheck ? `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:${port}/health || exit 1

` : ''}ENTRYPOINT ["java", "-jar", "app.jar"]`,

      golang: `${includeMultistage ? `# Build stage
FROM golang:${version} AS builder

${workdir ? `WORKDIR ${workdir}` : 'WORKDIR /app'}

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest
RUN apk --no-cache add ca-certificates
${workdir ? `WORKDIR ${workdir}` : 'WORKDIR /app'}
COPY --from=builder /app/main .` : `FROM golang:${version}

${workdir ? `WORKDIR ${workdir}` : 'WORKDIR /app'}

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .`}

EXPOSE ${port}

${includeHealthcheck ? `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:${port}/health || exit 1

` : ''}CMD ["./main"]`,

      nginx: `FROM nginx:${version}

COPY nginx.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html

EXPOSE 80

${includeHealthcheck ? `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost/ || exit 1

` : ''}CMD ["nginx", "-g", "daemon off;"]`,

      php: `FROM php:${version}-apache

${workdir ? `WORKDIR ${workdir}` : 'WORKDIR /var/www/html'}

RUN docker-php-ext-install mysqli pdo pdo_mysql

COPY . .

EXPOSE 80

${includeHealthcheck ? `HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost/ || exit 1

` : ''}CMD ["apache2-foreground"]`
    };

    return templates[language] || "";
  };

  const generateDockerfile = () => {
    if (!language) {
      toast({
        title: "Error",
        description: "Please select a language",
        variant: "destructive"
      });
      return;
    }

    const dockerfile = getDockerfileTemplate();
    setGeneratedDockerfile(dockerfile);
    
    toast({
      title: "Generated!",
      description: "Dockerfile has been generated"
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDockerfile);
    toast({ title: "Copied!", description: "Dockerfile copied to clipboard" });
  };

  const downloadDockerfile = () => {
    const blob = new Blob([generatedDockerfile], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dockerfile';
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedLanguage = languages.find(l => l.value === language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dockerfile Generator</h1>
          <p className="text-slate-600">Generate Dockerfiles for different languages and frameworks</p>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-2">Developer Tools</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Configure your Docker image settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Language/Runtime</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
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

                {selectedLanguage && (
                  <div>
                    <label className="text-sm font-medium">Version</label>
                    <Select value={version} onValueChange={setVersion}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedLanguage.versions.map((ver) => (
                          <SelectItem key={ver} value={ver}>
                            {ver}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium">Port</label>
                  <Input
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    placeholder="3000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Working Directory</label>
                  <Input
                    value={workdir}
                    onChange={(e) => setWorkdir(e.target.value)}
                    placeholder="/app"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="healthcheck"
                      checked={includeHealthcheck}
                      onCheckedChange={setIncludeHealthcheck}
                    />
                    <label htmlFor="healthcheck" className="text-sm font-medium">
                      Include health check
                    </label>
                  </div>

                  {(language === "golang" || language === "node") && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="multistage"
                        checked={includeMultistage}
                        onCheckedChange={setIncludeMultistage}
                      />
                      <label htmlFor="multistage" className="text-sm font-medium">
                        Multi-stage build
                      </label>
                    </div>
                  )}
                </div>

                <Button onClick={generateDockerfile} className="w-full bg-blue-600 hover:bg-blue-700">
                  <Container className="w-4 h-4 mr-2" />
                  Generate Dockerfile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Generated Dockerfile</CardTitle>
                  <CardDescription>Ready to use Docker configuration</CardDescription>
                </div>
                {generatedDockerfile && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={downloadDockerfile}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!generatedDockerfile ? (
                <div className="text-center py-12 text-slate-500">
                  <Container className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Configure settings and generate your Dockerfile</p>
                </div>
              ) : (
                <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-auto max-h-96 font-mono">
                  {generatedDockerfile}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Docker Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Multi-stage Builds</h4>
                <p className="text-slate-600">Use multi-stage builds to reduce final image size by separating build and runtime environments.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Health Checks</h4>
                <p className="text-slate-600">Include health checks to monitor container health and enable automatic restarts.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Layer Caching</h4>
                <p className="text-slate-600">Order instructions to maximize Docker layer caching and reduce build times.</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Security</h4>
                <p className="text-slate-600">Run containers as non-root users and use official base images for better security.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DockerfileGenerator;
