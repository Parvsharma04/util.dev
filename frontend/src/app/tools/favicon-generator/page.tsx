"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, Palette, Image as ImageIcon, Check, RefreshCw, ZoomIn, ShieldCheck, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const FaviconGenerator = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [iconSize, setIconSize] = useState("64");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState("12");
  const [padding, setPadding] = useState("0");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ title: "Invalid File", description: "Please upload an image file (PNG, JPG, SVG)", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        toast({ title: "Image Loaded", description: "Configuring workspace..." });
      };
      reader.readAsDataURL(file);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = parseInt(iconSize);
    const radius = parseInt(borderRadius);
    const pad = parseInt(padding);

    canvas.width = size;
    canvas.height = size;

    // Clear and draw background
    ctx.clearRect(0, 0, size, size);

    // Draw rounded background if radius exists
    ctx.fillStyle = backgroundColor;
    if (radius > 0) {
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    // Load and draw image
    const img = new Image();
    img.onload = () => {
      ctx.save();
      if (radius > 0) {
        ctx.clip(); // Clip image to the same rounded path
      }

      const drawSize = size - (pad * 2);
      ctx.drawImage(img, pad, pad, drawSize, drawSize);
      ctx.restore();
    };
    img.src = uploadedImage;
  };

  useEffect(() => {
    drawCanvas();
  }, [uploadedImage, iconSize, backgroundColor, borderRadius, padding]);

  const downloadFavicon = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `favicon-${iconSize}x${iconSize}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "Downloaded", description: "Your favicon asset is ready" });
      }
    }, 'image/png');
  };

  const reset = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout
      title="Favicon Studio"
      description="Professional-grade icon generator for web browsers and mobile home screens"
      category="Design & UI"
      icon={Palette}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <Card className="lg:col-span-1 bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="font-mono text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              Design Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${uploadedImage ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/20 bg-muted/20'
                }`}
            >
              <input type="file" onChange={handleImageUpload} className="hidden" ref={fileInputRef} accept="image/*" />
              <div className="flex flex-col items-center gap-3">
                {uploadedImage ? (
                  <div className="relative group">
                    <img src={uploadedImage} alt="Uploaded" className="w-20 h-20 rounded-lg shadow-xl" />
                    <button onClick={reset} className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground opacity-30" />
                )}
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} className="font-mono text-xs">
                  {uploadedImage ? "Change Image" : "Select Source"}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target Resolution</label>
                <Select value={iconSize} onValueChange={setIconSize}>
                  <SelectTrigger className="bg-muted/10 border-border font-mono text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="font-mono text-xs">
                    <SelectItem value="16">16 x 16 (Browser Tab)</SelectItem>
                    <SelectItem value="32">32 x 32 (Standard)</SelectItem>
                    <SelectItem value="64">64 x 64 (High Res)</SelectItem>
                    <SelectItem value="180">180 x 180 (iOS Icon)</SelectItem>
                    <SelectItem value="512">512 x 512 (PWA Splash)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Bg Color</label>
                  <div className="flex gap-2">
                    <Input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10 p-1 bg-transparent border-border" />
                    <Input type="text" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="font-mono text-[10px] bg-muted/10 border-border" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Radius (px)</label>
                  <Input type="number" value={borderRadius} onChange={(e) => setBorderRadius(e.target.value)} className="font-mono text-xs bg-muted/10 border-border" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Internal Padding ({padding}px)</label>
                <Input type="range" min="0" max="100" value={padding} onChange={(e) => setPadding(e.target.value)} className="accent-primary" />
              </div>

              <Button onClick={downloadFavicon} disabled={!uploadedImage} className="w-full h-11 bg-primary hover:bg-primary/90 font-mono shadow-lg shadow-primary/10">
                <Download className="w-4 h-4 mr-2" />
                Export Assets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border card-glow h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ZoomIn className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="font-mono text-sm">Real-time Preview</CardTitle>
                </div>
                <Badge variant="outline" className="font-mono text-[10px] border-primary/30 text-primary uppercase">Alpha 1.0</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center p-12 bg-grid-slate-900/[0.04] bg-[size:20px_20px]">
              {uploadedImage ? (
                <div className="space-y-8 flex flex-col items-center">
                  <div className="p-4 bg-card rounded-2xl shadow-2xl border border-border">
                    <canvas ref={canvasRef} className="max-w-[128px] max-h-[128px] shadow-sm" />
                  </div>
                  <div className="flex items-end gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded bg-background shadow-md overflow-hidden border border-border">
                        <canvas width="32" height="32" className="w-full h-full scale-[0.25] origin-top-left" ref={(c) => {
                          if (c && uploadedImage) {
                            const ctx = c.getContext('2d');
                            if (ctx) {
                              const img = new Image();
                              img.onload = () => ctx.drawImage(img, 0, 0, 32, 32);
                              img.src = canvasRef.current?.toDataURL() || "";
                            }
                          }
                        }} />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold">Tab View</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-background shadow-lg overflow-hidden border border-border">
                        <canvas width="48" height="48" className="w-full h-full" ref={(c) => {
                          if (c && uploadedImage) {
                            const ctx = c.getContext('2d');
                            if (ctx) {
                              const img = new Image();
                              img.onload = () => ctx.drawImage(img, 0, 0, 48, 48);
                              img.src = canvasRef.current?.toDataURL() || "";
                            }
                          }
                        }} />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground uppercase font-bold">Shortcut</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 opacity-30 italic font-mono text-sm max-w-md">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                  <p>Upload a source image to begin sculpting your application's visual identity.</p>
                </div>
              )}
            </CardContent>
            {uploadedImage && (
              <div className="p-4 bg-muted/50 border-t border-border mt-auto flex justify-between items-center px-8">
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground italic">
                  <Check className="w-3 h-3 text-emerald-500" />
                  Ready for export
                </div>
                <Button size="sm" onClick={downloadFavicon} className="font-mono text-xs">
                  Download .png
                </Button>
              </div>
            )}
          </Card>

          <Card className="bg-muted/10 border-border">
            <CardContent className="p-6">
              <div className="flex gap-4 items-start">
                <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-2 uppercase tracking-widest">Quality Assurance</h4>
                  <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                    Our generator uses browser-native Canvas rendering for pixel-perfect results.
                    Target size is exactly <span className="text-primary">{iconSize}x{iconSize}px</span>.
                    Background transparency is supported if you leave the background color empty or set to rgba(0,0,0,0).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default FaviconGenerator;
