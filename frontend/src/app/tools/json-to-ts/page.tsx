"use client";

import { useState } from "react";
import { Code, Copy, RotateCcw, Play, Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import JsonToTS from "json-to-ts";
import { ToolLayout } from "@/components/ToolLayout";



const JsonToTs = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const { toast } = useToast();

    const handleConvert = async () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            const interfaces = JsonToTS(parsed);
            setOutput(interfaces.join("\n\n"));

        } catch (err) {
            toast({
                title: "Invalid JSON",
                description: "Please enter valid JSON to generate TypeScript interfaces.",
                variant: "destructive",
            });
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: "TypeScript interfaces copied to clipboard.",
        });
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
    };

    return (
        <ToolLayout
            title="JSON to TypeScript"
            description="Generate strictly typed interfaces directly from JSON"
            category="Advanced Utilities"
            icon={Code}
        >


            <div className="mb-6 flex gap-3">
                <Button
                    onClick={handleConvert}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-medium"
                >
                    <Play className="w-4 h-4 mr-2" />
                    Generate TypeScript
                </Button>
                <Button onClick={clearAll} variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-border font-mono">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border card-glow h-[600px] flex flex-col">
                    <CardHeader className="py-4 border-b border-border shrink-0">
                        <CardTitle className="font-mono text-lg">JSON Input</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                        <Textarea
                            placeholder='{\n  "name": "util.dev",\n  "version": 1,\n  "features": ["fast", "clean"]\n}'
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full bg-transparent border-0 rounded-none resize-none px-4 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 h-full"
                        />
                    </CardContent>
                </Card>

                <Card className="bg-card border-border card-glow h-[600px] flex flex-col">
                    <CardHeader className="py-4 border-b border-border flex flex-row items-center justify-between shrink-0">
                        <CardTitle className="font-mono text-lg">TypeScript Interfaces</CardTitle>
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
                            className="flex-1 w-full bg-muted/30 border-0 rounded-none resize-none px-4 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/30 h-full text-blue-400"
                            placeholder="// Generated TypeScript will appear here"
                        />
                    </CardContent>
                </Card>
            </div>
        </ToolLayout>
    );
};

export default JsonToTs;
