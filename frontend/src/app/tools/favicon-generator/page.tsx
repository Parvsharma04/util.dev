"use client";


import { useState, useRef } from "react";
import { Upload, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const FaviconGenerator = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [iconSize, setIconSize] = useState("32");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState("0");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFavicon = () => {
    if (!uploadedImage) {
      toast({
        title: "Error",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = parseInt(iconSize);
    canvas.width = size;
    canvas.height = size;

    // Set background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // Load and draw image
    const img = document.createElement('img');
    img.onload = () => {
      // Apply border radius if specified
      if (parseInt(borderRadius) > 0) {
        ctx.beginPath();
        ctx.roundRect(0, 0, size, size, parseInt(borderRadius));
        ctx.clip();
      }

      ctx.drawImage(img, 0, 0, size, size);
    };
    img.src = uploadedImage;

    toast({ title: "Success!", description: "Favicon generated successfully" });
  };

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
      }
    });
  };

  return (
        <ToolLayout title="Favicon Generator" description="Generate favicons from your images" category="Design & UI" icon={Badge}>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload & Configure</CardTitle>
              <CardDescription>Upload an image and configure favicon settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="hidden"
                  ref={fileInputRef}
                  accept="image/*"
                />
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <p className="text-sm text-muted-foreground mt-2">PNG, JPG, SVG files</p>
              </div>

              {uploadedImage && (
                <div className="text-center">
                  <img src={uploadedImage} alt="Uploaded" className="max-w-32 max-h-32 mx-auto rounded" />
                </div>
              )}

              <div>
                <label className="text-sm font-medium">Icon Size</label>
                <Select value={iconSize} onValueChange={setIconSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16">16x16 px</SelectItem>
                    <SelectItem value="32">32x32 px</SelectItem>
                    <SelectItem value="48">48x48 px</SelectItem>
                    <SelectItem value="64">64x64 px</SelectItem>
                    <SelectItem value="128">128x128 px</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Background Color</label>
                <Input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Border Radius (px)</label>
                <Input
                  type="number"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  min="0"
                  max="50"
                />
              </div>

              <Button onClick={generateFavicon} className="w-full" disabled={!uploadedImage}>
                Generate Favicon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preview & Download</CardTitle>
                  <CardDescription>Preview your favicon</CardDescription>
                </div>
                <Button size="sm" onClick={downloadFavicon}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <canvas
                  ref={canvasRef}
                  className="border border-slate-200 rounded"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Generated favicon will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
              </ToolLayout>
    );
};

export default FaviconGenerator;
