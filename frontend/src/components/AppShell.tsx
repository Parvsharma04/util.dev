"use client";

import { useState, useEffect, ReactNode } from "react";
import { Search, Terminal, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setCommandOpen(true);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === "b") {
                e.preventDefault();
                setSidebarOpen(!sidebarOpen);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [sidebarOpen]);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
            <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} flex flex-col`}>
                {/* Global Sticky Header */}
                <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-14">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="hover:bg-accent h-9 w-9"
                                >
                                    <Menu className="w-5 h-5 text-foreground" />
                                </Button>
                                <a href="/" className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
                                        <Terminal className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-bold text-foreground font-mono glow text-sm">util.dev</span>
                                </a>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCommandOpen(true)}
                                    className="hidden sm:flex items-center gap-2 px-3 py-1.5 border-border hover:border-primary/50 hover:bg-accent h-8"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span className="text-xs text-muted-foreground">Search tools...</span>
                                    <div className="flex items-center gap-1 ml-auto">
                                        <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border border-border bg-muted px-1 font-mono text-[9px] font-medium text-muted-foreground italic">
                                            Ctrl K
                                        </kbd>
                                    </div>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCommandOpen(true)}
                                    className="sm:hidden h-9 w-9"
                                >
                                    <Search className="w-5 h-5" />
                                </Button>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
