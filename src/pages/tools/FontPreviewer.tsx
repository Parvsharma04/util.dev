
import { useState } from "react";
import { Type, Download, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const FontPreviewer = () => {
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [fontSize, setFontSize] = useState([16]);
  const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog");
  const [customFont, setCustomFont] = useState("");
  const { toast } = useToast();

  const systemFonts = [
    "Arial", "Arial Black", "Helvetica", "Times", "Times New Roman", "Courier",
    "Courier New", "Verdana", "Georgia", "Palatino", "Garamond", "Bookman",
    "Comic Sans MS", "Trebuchet MS", "Impact", "Lucida Console"
  ];

  const webFonts = [
    "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace",
    "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto",
    "Inter", "Helvetica Neue", "Arial Nova", "Nimbus Sans",
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Noto Color Emoji"
  ];

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890",
    "Typography is the art and technique of arranging type",
    "Beautiful fonts make beautiful designs",
    "Hello World! Welcome to Font Previewer 2024"
  ];

  const fontWeights = [
    { value: "100", label: "Thin (100)" },
    { value: "300", label: "Light (300)" },
    { value: "400", label: "Regular (400)" },
    { value: "500", label: "Medium (500)" },
    { value: "600", label: "SemiBold (600)" },
    { value: "700", label: "Bold (700)" },
    { value: "900", label: "Black (900)" }
  ];

  const [fontWeight, setFontWeight] = useState("400");
  const [fontStyle, setFontStyle] = useState("normal");

  const copyCSS = () => {
    const cssText = `font-family: ${selectedFont || customFont};
font-size: ${fontSize[0]}px;
font-weight: ${fontWeight};
font-style: ${fontStyle};`;
    
    navigator.clipboard.writeText(cssText);
    toast({
      title: "Copied!",
      description: "CSS properties copied to clipboard"
    });
  };

  const loadSampleText = (text: string) => {
    setPreviewText(text);
  };

  const currentFont = customFont || selectedFont;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Font Previewer</h1>
          <p className="text-slate-600">Preview and compare fonts with custom text</p>
          <Badge className="bg-pink-100 text-pink-700 border-pink-200 mt-2">Frontend/UX</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Font Settings</CardTitle>
                <CardDescription>Customize font appearance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">System Fonts</label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {systemFonts.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Web Fonts</label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select web font" />
                      </SelectTrigger>
                      <SelectContent>
                        {webFonts.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Custom Font Family</label>
                    <Input
                      placeholder="Inter, system-ui, sans-serif"
                      value={customFont}
                      onChange={(e) => setCustomFont(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Font Size: {fontSize[0]}px</label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={72}
                      min={8}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Font Weight</label>
                    <Select value={fontWeight} onValueChange={setFontWeight}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeights.map((weight) => (
                          <SelectItem key={weight.value} value={weight.value}>
                            {weight.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Font Style</label>
                    <Select value={fontStyle} onValueChange={setFontStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="italic">Italic</SelectItem>
                        <SelectItem value="oblique">Oblique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={copyCSS} className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy CSS
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Texts</CardTitle>
                <CardDescription>Quick text examples</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sampleTexts.map((text, index) => (
                    <button
                      key={index}
                      onClick={() => loadSampleText(text)}
                      className="w-full text-left p-2 text-sm border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                    >
                      {text.substring(0, 40)}...
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Preview Text</CardTitle>
                    <CardDescription>Enter your custom text to preview</CardDescription>
                  </div>
                  <Type className="w-5 h-5 text-slate-600" />
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Enter text to preview with different fonts..."
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Font Preview</CardTitle>
                <CardDescription>
                  {currentFont} • {fontSize[0]}px • {fontWeight} • {fontStyle}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div
                    className="p-6 bg-white border border-slate-200 rounded-lg min-h-[200px] break-words"
                    style={{
                      fontFamily: currentFont,
                      fontSize: `${fontSize[0]}px`,
                      fontWeight: fontWeight,
                      fontStyle: fontStyle,
                      lineHeight: 1.5
                    }}
                  >
                    {previewText}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium mb-2">Small Text (12px)</h4>
                      <div
                        style={{
                          fontFamily: currentFont,
                          fontSize: "12px",
                          fontWeight: fontWeight,
                          fontStyle: fontStyle
                        }}
                      >
                        {previewText.substring(0, 50)}...
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium mb-2">Large Text (24px)</h4>
                      <div
                        style={{
                          fontFamily: currentFont,
                          fontSize: "24px",
                          fontWeight: fontWeight,
                          fontStyle: fontStyle
                        }}
                      >
                        {previewText.substring(0, 30)}...
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Font Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium mb-2">Web Safe Fonts</h4>
                    <p className="text-slate-600">
                      Fonts that are commonly available across different operating systems and browsers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Font Loading</h4>
                    <p className="text-slate-600">
                      Use font-display: swap for better performance when loading custom web fonts.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Font Stacks</h4>
                    <p className="text-slate-600">
                      Provide fallback fonts in case your primary font fails to load.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Accessibility</h4>
                    <p className="text-slate-600">
                      Ensure sufficient contrast and readable font sizes for better accessibility.
                    </p>
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

export default FontPreviewer;
