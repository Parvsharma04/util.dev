"use client";

import { useState } from "react";
import { Copy, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const ColorConverter = () => {
  const [color, setColor] = useState("#3b82f6");
  const { toast } = useToast();

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const getColorFormats = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsla: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`,
      values: { rgb, hsl }
    };
  };

  const formats = getColorFormats(color);

  const copyToClipboard = (value: string, format: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copied!",
      description: `${format} value copied to clipboard`,
    });
  };

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert between HEX, RGB, HSL, and other color formats"
      category="Frontend/UX"
      icon={Palette}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border card-glow h-[400px]">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Color Picker</CardTitle>
            <CardDescription className="font-mono">Select or enter a HEX color</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4">
              <div
                className="w-full h-32 rounded-xl border border-border shadow-inner transition-colors duration-200"
                style={{ backgroundColor: color }}
              />
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Hex Code</label>
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#000000"
                    className="font-mono uppercase bg-input border-border"
                  />
                </div>
                <div className="w-16 space-y-2">
                  <label className="text-xs font-mono text-muted-foreground uppercase">Pick</label>
                  <Input
                    type="color"
                    value={color.startsWith('#') && color.length === 7 ? color : '#000000'}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-10 p-1 cursor-pointer bg-input border-border"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border card-glow min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-mono text-lg">Conversion Results</CardTitle>
            <CardDescription className="font-mono">Output formats and values</CardDescription>
          </CardHeader>
          <CardContent>
            {formats ? (
              <div className="space-y-3">
                {[
                  { label: "HEX", value: formats.hex },
                  { label: "RGB", value: formats.rgb },
                  { label: "RGBA", value: formats.rgba },
                  { label: "HSL", value: formats.hsl },
                  { label: "HSLA", value: formats.hsla },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border group">
                    <div>
                      <div className="text-[10px] font-mono font-bold text-muted-foreground uppercase">{item.label}</div>
                      <div className="font-mono text-sm text-foreground">{item.value}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(item.value, item.label)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground font-mono italic">
                Invalid color format
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {formats && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-muted-foreground uppercase mb-1">RGB Channels</div>
                <div className="font-mono text-sm">
                  R: <span className="text-primary">{formats.values.rgb.r}</span>,
                  G: <span className="text-primary">{formats.values.rgb.g}</span>,
                  B: <span className="text-primary">{formats.values.rgb.b}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-muted-foreground uppercase mb-1">HSL Channels</div>
                <div className="font-mono text-sm">
                  H: <span className="text-primary">{formats.values.hsl.h}°</span>,
                  S: <span className="text-primary">{formats.values.hsl.s}%</span>,
                  L: <span className="text-primary">{formats.values.hsl.l}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolLayout>
  );
};

export default ColorConverter;
