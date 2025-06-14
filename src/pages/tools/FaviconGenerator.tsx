
import { useState } from "react";
import { Upload, Download, Copy, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const FaviconGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [text, setText] = useState("");
  const [generationType, setGenerationType] = useState("upload");
  const { toast } = useToast();

  const faviconSizes = [
    { size: "16x16", name: "Standard Favicon" },
    { size: "32x32", name: "Standard Favicon" },
    { size: "48x48", name: "Windows Site Icon" },
    { size: "64x64", name: "Windows Site Icon" },
    { size: "128x128", name: "Chrome Web Store" },
    { size: "180x180", name: "Apple Touch Icon" },
    { size: "192x192", name: "Android Chrome" },
    { size: "512x512", name: "Android Chrome" }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        toast({
          title: "Image Uploaded",
          description: "Image loaded successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Please upload a valid image file",
          variant: "destructive"
        });
      }
    }
  };

  const generateTextFavicon = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text for the favicon",
        variant: "destructive"
      });
      return;
    }

    // Create a canvas to generate favicon
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, 64, 64);
      
      // Text
      ctx.fillStyle = foregroundColor;
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.charAt(0).toUpperCase(), 32, 32);
      
      setSelectedImage(canvas.toDataURL());
      
      toast({
        title: "Generated!",
        description: "Text favicon created successfully"
      });
    }
  };

  const downloadFavicon = (size: string) => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "No image to download",
        variant: "destructive"
      });
      return;
    }

    const canvas = document.createElement('canvas');
    const [width, height] = size.split('x').map(Number);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `favicon-${size}.png`;
            a.click();
            URL.revokeObjectURL(url);
            
            toast({
              title: "Downloaded!",
              description: `Favicon ${size} downloaded successfully`
            });
          }
        }, 'image/png');
      };
      img.src = selectedImage;
    }
  };

  const downloadAll = () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "No image to download",
        variant: "destructive"
      });
      return;
    }

    faviconSizes.forEach((favicon, index) => {
      setTimeout(() => {
        downloadFavicon(favicon.size);
      }, index * 200);
    });
  };

  const copyHTMLCode = () => {
    const htmlCode = `<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png">
<meta name="theme-color" content="${backgroundColor}">`;

    navigator.clipboard.writeText(htmlCode);
    toast({
      title: "Copied!",
      description: "HTML code copied to clipboard"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Favicon Generator</h1>
          <p className="text-slate-600">Generate favicon packages from images or text</p>
          <Badge className="bg-pink-100 text-pink-700 border-pink-200 mt-2">Frontend/UX</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Favicon Source</CardTitle>
                <CardDescription>Choose how to create your favicon</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={generationType} onValueChange={setGenerationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upload">Upload Image</SelectItem>
                      <SelectItem value="text">Generate from Text</SelectItem>
                    </SelectContent>
                  </Select>

                  {generationType === "upload" && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                          <p className="text-slate-600">Click to upload an image</p>
                          <p className="text-sm text-slate-500">PNG, JPG, SVG supported</p>
                        </label>
                      </div>
                    </div>
                  )}

                  {generationType === "text" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Text (1-2 characters)</label>
                        <Input
                          value={text}
                          onChange={(e) => setText(e.target.value.slice(0, 2))}
                          placeholder="A"
                          maxLength={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Background Color</label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              placeholder="#ffffff"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium">Text Color</label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={foregroundColor}
                              onChange={(e) => setForegroundColor(e.target.value)}
                              className="w-12 h-10 p-1"
                            />
                            <Input
                              value={foregroundColor}
                              onChange={(e) => setForegroundColor(e.target.value)}
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      </div>

                      <Button onClick={generateTextFavicon} className="w-full">
                        <Image className="w-4 h-4 mr-2" />
                        Generate Favicon
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How your favicon will look</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                      <img 
                        src={selectedImage} 
                        alt="Favicon preview" 
                        className="w-8 h-8 rounded"
                      />
                      <span className="text-sm">Your Website</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {[16, 32, 48, 64].map((size) => (
                        <div key={size} className="text-center">
                          <img 
                            src={selectedImage} 
                            alt={`${size}x${size}`}
                            width={size}
                            height={size}
                            className="mx-auto mb-1 border border-slate-200 rounded"
                          />
                          <span className="text-xs text-slate-600">{size}px</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Image className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Upload an image or generate from text to see preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Download Favicons</CardTitle>
                    <CardDescription>Get all sizes for different platforms</CardDescription>
                  </div>
                  {selectedImage && (
                    <Button onClick={downloadAll} size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedImage ? (
                  <div className="space-y-3">
                    {faviconSizes.map((favicon) => (
                      <div key={favicon.size} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div>
                          <div className="font-medium">{favicon.size}</div>
                          <div className="text-sm text-slate-600">{favicon.name}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadFavicon(favicon.size)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>Generate a favicon to download different sizes</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>HTML Code</CardTitle>
                    <CardDescription>Add to your website's &lt;head&gt; section</CardDescription>
                  </div>
                  {selectedImage && (
                    <Button size="sm" variant="outline" onClick={copyHTMLCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedImage ? (
                  <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-x-auto">
{`<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
<meta name="theme-color" content="${backgroundColor}">`}
                  </pre>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <p>HTML code will appear here after generating favicon</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Favicon Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">Size Requirements</h4>
                    <p className="text-slate-600">Provide multiple sizes for different platforms and devices.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">File Format</h4>
                    <p className="text-slate-600">PNG is recommended for favicons with transparency support.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Simple Design</h4>
                    <p className="text-slate-600">Keep designs simple and recognizable at small sizes.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaviconGenerator;
