"use client";

import { useState, useEffect } from "react";
import { Palette, RotateCcw, Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolLayout } from "@/components/ToolLayout";

const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);

    return (
        <ToolLayout title="Contrast Checker" description="Check color contrast against WCAG guidelines" category="Frontend/UX" icon={Terminal}>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Card className="bg-card border-border card-glow">
                            <CardHeader>
                                <CardTitle className="font-mono">Color Selection</CardTitle>
                                <CardDescription className="font-mono">
                                    Enter colors in HEX format to calculate their contrast ratio.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block font-mono">Foreground Text Color</label>
                                        <div className="flex gap-4">
                                            <div
                                                className="w-12 h-12 rounded-lg border border-border shrink-0"
                                                style={{ backgroundColor: foreground }}
                                            />
                                            <Input
                                                value={foreground}
                                                onChange={(e) => setForeground(e.target.value)}
                                                placeholder="#FFFFFF"
                                                className="font-mono uppercase bg-input"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-foreground mb-2 block font-mono">Background Color</label>
                                        <div className="flex gap-4">
                                            <div
                                                className="w-12 h-12 rounded-lg border border-border shrink-0"
                                                style={{ backgroundColor: background }}
                                            />
                                            <Input
                                                value={background}
                                                onChange={(e) => setBackground(e.target.value)}
                                                placeholder="#000000"
                                                className="font-mono uppercase bg-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button variant="outline" onClick={resetColors} className="w-full font-mono border-border hover:border-primary/50">
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset Colors
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border card-glow">
                            <CardHeader>
                                <CardTitle className="font-mono">WCAG Compliance</CardTitle>
                                <CardDescription className="font-mono">
                                    Contrast ratio guidelines
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 font-mono">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                                        <div>
                                            <div className="font-medium text-foreground">AA Normal Text</div>
                                            <div className="text-xs text-muted-foreground">Ratio &ge; 4.5:1</div>
                                        </div>
                                        <Badge variant={passesAA ? "default" : "destructive"}>
                                            {passesAA ? "PASS" : "FAIL"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                                        <div>
                                            <div className="font-medium text-foreground">AA Large Text</div>
                                            <div className="text-xs text-muted-foreground">Ratio &ge; 3.0:1</div>
                                        </div>
                                        <Badge variant={passesAALarge ? "default" : "destructive"}>
                                            {passesAALarge ? "PASS" : "FAIL"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                                        <div>
                                            <div className="font-medium text-foreground">AAA Normal Text</div>
                                            <div className="text-xs text-muted-foreground">Ratio &ge; 7.0:1</div>
                                        </div>
                                        <Badge variant={passesAAA ? "default" : "destructive"}>
                                            {passesAAA ? "PASS" : "FAIL"}
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                                        <div>
                                            <div className="font-medium text-foreground">AAA Large Text</div>
                                            <div className="text-xs text-muted-foreground">Ratio &ge; 4.5:1</div>
                                        </div>
                                        <Badge variant={passesAAALarge ? "default" : "destructive"}>
                                            {passesAAALarge ? "PASS" : "FAIL"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-card border-border card-glow h-full">
                            <CardHeader>
                                <CardTitle className="font-mono">Live Preview</CardTitle>
                                <div className="text-sm font-mono flex items-center gap-2">
                                    Ratio: <Badge variant="secondary" className="text-lg bg-primary/10 text-primary border-primary/30">{ratio}:1</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="rounded-xl border border-border p-8 h-full min-h-[400px] flex flex-col justify-center transition-colors duration-300"
                                    style={{ backgroundColor: background }}
                                >
                                    <div style={{ color: foreground }} className="space-y-6">
                                        <h2 className="text-4xl font-bold">Contrast Preview</h2>
                                        <h3 className="text-2xl font-medium">Large Text (18pt / 24px)</h3>
                                        <p className="text-base leading-relaxed">
                                            This is what normal text (12pt / 16px) looks like with these colors.
                                            Good contrast makes your application readable for everyone, including those with visual impairments.
                                            The Web Content Accessibility Guidelines (WCAG) dictate what contrast ratio is considered acceptable.
                                        </p>
                                        <div className="flex gap-4 pt-4">
                                            <Button style={{ backgroundColor: foreground, color: background }} className="hover:opacity-90">
                                                Example Button
                                            </Button>
                                            <Button variant="outline" style={{ borderColor: foreground, color: foreground }}>
                                                Secondary Button
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                    </ToolLayout>
    );
};

export default ContrastChecker;
