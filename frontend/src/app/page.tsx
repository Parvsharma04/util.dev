"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Command, Terminal, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/AppShell";
import { allTools } from "@/lib/tools";

const featuredTools = allTools.slice(0, 6);

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [typedText, setTypedText] = useState("");
    const fullText = "util.dev";

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setTypedText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 100);
        return () => clearInterval(timer);
    }, []);

    const filteredTools = featuredTools.filter(tool =>
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppShell>
            <div className="flex flex-col">
                {/* Hero Section */}
                <section className="relative py-16 sm:py-24 overflow-hidden">
                    <div className="absolute inset-0 grid-pattern opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="animate-fade-in">
                            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/30 font-mono">
                                &gt; All the tools you need. None of the fluff._
                            </Badge>
                            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6 font-mono">
                                <span className="glow-strong">{typedText}</span>
                                <span className="cursor text-primary">_</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-mono">
                                Developer utilities designed for speed, simplicity, and reliability.
                                Everything you need in one clean interface.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <div className="relative max-w-md mx-auto sm:mx-0">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input
                                        placeholder="$ search tools..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-12 text-lg border-border bg-input focus:border-primary focus:ring-primary font-mono"
                                    />
                                </div>
                                <Button
                                    size="lg"
                                    className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-mono animate-pulse-glow"
                                >
                                    <Command className="w-5 h-5 mr-2" />
                                    Search Command Palette
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Tools */}
                <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-foreground font-mono glow flex items-center gap-2">
                            <span className="text-muted-foreground">&gt;</span>
                            {searchQuery ? `Search Results (${filteredTools.length})` : 'Featured Tools'}
                        </h2>
                        <Link href="/tools">
                            <Button variant="outline" className="hover:bg-accent border-border hover:border-primary/50 font-mono cursor-pointer">
                                View All Tools
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTools.map((tool, index) => (
                            <Link key={tool.title} href={tool.route}>
                                <Card
                                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border hover:border-primary/50 hover:-translate-y-1 bg-card card-glow h-full"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200 border border-border group-hover:border-primary/30">
                                                <tool.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            {tool.popular && (
                                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30 font-mono text-xs">
                                                    Popular
                                                </Badge>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg group-hover:text-primary transition-colors font-mono">
                                            {tool.title}
                                        </CardTitle>
                                        <CardDescription className="text-muted-foreground text-sm">
                                            {tool.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between">
                                            <Badge variant="outline" className="text-xs font-mono border-border">
                                                {tool.category}
                                            </Badge>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 font-mono">
                                                    Try Now →
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Quick Stats */}
                <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-card border-border card-glow">
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-primary glow font-mono">{allTools.length}+</div>
                                <div className="text-sm text-muted-foreground font-mono">Tools Available</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border card-glow">
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-primary glow font-mono">&lt;2s</div>
                                <div className="text-sm text-muted-foreground font-mono">Load Time</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border card-glow">
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-primary glow font-mono">100%</div>
                                <div className="text-sm text-muted-foreground font-mono">Private</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card border-border card-glow">
                            <CardContent className="p-6 text-center">
                                <div className="text-3xl font-bold text-primary glow font-mono">0</div>
                                <div className="text-sm text-muted-foreground font-mono">Ads & Trackers</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-border py-12 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
                                <Terminal className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-xl font-bold text-foreground font-mono glow">util.dev</span>
                        </div>
                        <p className="text-muted-foreground mb-4 font-mono text-sm">
                            Fast tools. Clean UI. Zero nonsense.
                        </p>
                        <div className="flex justify-center gap-6 text-sm text-muted-foreground font-mono">
                            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
                            <Link href="https://github.com/Parvsharma04/util.dev" className="hover:text-primary transition-colors cursor-pointer" target="_blank" rel="noreferrer">GitHub</Link>
                            <Link href="/settings" className="hover:text-primary transition-colors cursor-pointer">Settings</Link>
                        </div>
                        <div className="mt-6 text-xs text-muted-foreground/60 font-mono">
                            © 2026 util.dev
                        </div>
                    </div>
                </footer>
            </div>
        </AppShell>
    );
};

export default Index;
