"use client";

import { useState } from "react";
import { Terminal, Copy, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolLayout } from "@/components/ToolLayout";
import { convertCurl } from "@/app/actions/curl";

const CurlConverter = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"fetch" | "axios">("fetch");
    const [isConverting, setIsConverting] = useState(false);
    const { toast } = useToast();

    const handleConvert = async () => {
        if (!input.trim()) return;

        setIsConverting(true);
        try {
            const result = await convertCurl(input, mode);
            setOutput(result);
        } catch (err: any) {
            toast({
                title: "Conversion Error",
                description: err.message || "Failed to parse cURL command. Check if it's strictly valid.",
                variant: "destructive",
            });
        } finally {
            setIsConverting(false);
        }
    };


    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: `Converted ${mode} code copied to clipboard`,
        });
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
    };

    return (
        <ToolLayout title="cURL Converter" description="Convert cURL commands to JavaScript Fetch or Axios" category="Developer Tools" icon={Terminal}>
            <Tabs value={mode} onValueChange={(value) => setMode(value as "fetch" | "axios")} className="mb-6">
                <TabsList className="bg-muted/50 border border-border">
                    <TabsTrigger value="fetch" className="font-mono data-[state=active]:bg-card">Fetch API</TabsTrigger>
                    <TabsTrigger value="axios" className="font-mono data-[state=active]:bg-card">Axios</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mb-6 flex gap-3">
                <Button
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-medium"
                >
                    {isConverting ? "Converting..." : `Convert to ${mode === 'fetch' ? 'Fetch' : 'Axios'}`}
                </Button>

                <Button onClick={clearAll} variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-border font-mono">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border card-glow h-[600px] flex flex-col">
                    <CardHeader className="py-4 border-b border-border shrink-0">
                        <CardTitle className="font-mono text-lg">Input cURL</CardTitle>
                        <CardDescription className="font-mono">
                            Paste your cURL command here
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                        <Textarea
                            placeholder={"curl 'https://api.example.com/data' \\\n  -H 'Authorization: Bearer my-token'"}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full bg-transparent border-0 rounded-none resize-none px-4 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 h-full"
                        />
                    </CardContent>
                </Card>

                <Card className="bg-card border-border card-glow h-[600px] flex flex-col">
                    <CardHeader className="py-4 border-b border-border flex flex-row items-center justify-between shrink-0">
                        <div>
                            <CardTitle className="font-mono text-lg">Output ({mode})</CardTitle>
                            <CardDescription className="font-mono">
                                Generated JavaScript snippet
                            </CardDescription>
                        </div>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyToClipboard}
                            disabled={!output}
                            className="h-8 hover:bg-primary/10 hover:text-primary transition-colors -my-2"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            <span className="font-mono text-xs">Copy</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col min-h-0 relative">
                        <Textarea
                            value={output}
                            readOnly
                            className="flex-1 w-full bg-muted/30 border-0 rounded-none resize-none px-4 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/30 h-full text-primary"
                            placeholder={`// Generated ${mode} code will appear here`}
                        />
                    </CardContent>
                </Card>
            </div>
        </ToolLayout>
    );
};

export default CurlConverter;
