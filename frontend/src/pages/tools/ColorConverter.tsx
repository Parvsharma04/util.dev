
import { useState } from "react";
import { Copy, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <a href="/" className="hover:text-foreground">Home</a>
            <span>→</span>
            <a href="/tools" className="hover:text-foreground">Tools</a>
            <span>→</span>
            <span className="text-foreground">Color Converter</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Color Converter</h1>
              <p className="text-muted-foreground">Convert between HEX, RGB, HSL, and other color formats</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-pink-100 text-pink-700 border-pink-200">Frontend/UX</Badge>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Input</CardTitle>
              <CardDescription>Enter a color value or use the color picker</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-16 border border-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex-1">
                  <Input
                    placeholder="#3b82f6"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="w-full h-32 rounded-lg border border-slate-200"
                style={{ backgroundColor: color }}
              />
            </CardContent>
          </Card>

          {formats && (
            <Card>
              <CardHeader>
                <CardTitle>Color Formats</CardTitle>
                <CardDescription>All format variations of your color</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">HEX</div>
                      <div className="font-mono text-sm text-foreground">{formats.hex}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(formats.hex, "HEX")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">RGB</div>
                      <div className="font-mono text-sm text-foreground">{formats.rgb}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(formats.rgb, "RGB")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">RGBA</div>
                      <div className="font-mono text-sm text-foreground">{formats.rgba}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(formats.rgba, "RGBA")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">HSL</div>
                      <div className="font-mono text-sm text-foreground">{formats.hsl}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(formats.hsl, "HSL")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">HSLA</div>
                      <div className="font-mono text-sm text-foreground">{formats.hsla}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(formats.hsla, "HSLA")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-muted rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">RGB Values</div>
                      <div className="text-sm">
                        R: {formats.values.rgb.r}<br/>
                        G: {formats.values.rgb.g}<br/>
                        B: {formats.values.rgb.b}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">HSL Values</div>
                      <div className="text-sm">
                        H: {formats.values.hsl.h}°<br/>
                        S: {formats.values.hsl.s}%<br/>
                        L: {formats.values.hsl.l}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorConverter;
