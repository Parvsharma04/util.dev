"use client";

import { useState } from "react";
import { Database, Copy, RotateCcw, Play, Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolLayout } from "@/components/ToolLayout";
import { format } from "sql-formatter";

const SQLFormatter = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [dialect, setDialect] = useState("sql");
    const { toast } = useToast();

    const handleFormat = () => {
        if (!input.trim()) return;
        try {
            const formatted = format(input, {
                language: dialect as any,
                keywordCase: 'upper',
            });
            setOutput(formatted);
        } catch (err) {
            toast({
                title: "Formatting Error",
                description: "Failed to format SQL. Please check your syntax.",
                variant: "destructive",
            });
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: "Formatted SQL copied to clipboard.",
        });
    };

    const clearAll = () => {
        setInput("");
        setOutput("");
    };

    return (
        <ToolLayout title="SQL Formatter" description="Format and beautify raw SQL queries" category="Developer Tools" icon={Database}>
            <div className="mb-6 flex flex-wrap items-center gap-4 bg-card border border-border p-4 rounded-xl card-glow">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground font-mono">Dialect:</span>
                    <Select value={dialect} onValueChange={setDialect}>
                        <SelectTrigger className="w-[180px] bg-input border-border font-mono">
                            <SelectValue placeholder="Select dialect" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="sql">Standard SQL</SelectItem>
                            <SelectItem value="postgresql">PostgreSQL</SelectItem>
                            <SelectItem value="mysql">MySQL</SelectItem>
                            <SelectItem value="mariadb">MariaDB</SelectItem>
                            <SelectItem value="sqlite">SQLite</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="h-8 w-px bg-border hidden sm:block"></div>

                <Button
                    onClick={handleFormat}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-medium ml-auto sm:ml-0"
                >
                    <Play className="w-4 h-4 mr-2" />
                    Format SQL
                </Button>
                <Button onClick={clearAll} variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10 border-border font-mono">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card border-border card-glow h-[600px] flex flex-col">
                    <CardHeader className="py-4 border-b border-border shrink-0">
                        <CardTitle className="font-mono text-lg">Raw SQL</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                        <Textarea
                            placeholder="SELECT * FROM users WHERE status = 'active';"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 w-full bg-transparent border-0 rounded-none resize-none px-4 py-4 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 h-full"
                        />
                    </CardContent>
                </Card>

                <Card className="bg-card border-border card-glow h-[600px] flex flex-col">
                    <CardHeader className="py-4 border-b border-border flex flex-row items-center justify-between shrink-0">
                        <CardTitle className="font-mono text-lg">Formatted Output</CardTitle>
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
                            placeholder="-- Formatted SQL will appear here"
                        />
                    </CardContent>
                </Card>
            </div>
        </ToolLayout>
    );
};

export default SQLFormatter;
