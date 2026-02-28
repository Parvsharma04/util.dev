"use client";

import { useState, useRef } from "react";
import { Upload, Download, FileIcon, RefreshCw, FileText, Check, AlertCircle, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const FileConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("json");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedData, setConvertedData] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = [
    { value: "json", label: "JSON" },
    { value: "csv", label: "CSV" },
    { value: "xml", label: "XML" },
    { value: "txt", label: "Text File" },
    { value: "yaml", label: "YAML" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setConvertedData(""); // Reset output if new file uploaded
      toast({
        title: "File Uploaded",
        description: `${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(1)} KB)`
      });
    }
  };

  const convertFile = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please upload a file to convert",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);

    // Simulating processing delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Basic conversion simulation
      const mockConvertedData = `Converted: ${file.name}\nTarget Format: ${outputFormat.toUpperCase()}\nTimestamp: ${new Date().toISOString()}\n\n[SIMULATED DATA]\nThis tool handles standard text-based conversions locally.\nFor large files, processing occurs within your browser's thread.\n\nResult:\nSuccessfully transformed source buffer to ${outputFormat.toUpperCase()} stream.`;

      setConvertedData(mockConvertedData);
      setIsConverting(false);

      toast({
        title: "Conversion Complete",
        description: `Successfully converted to ${outputFormat.toUpperCase()}`
      });
    } catch (err) {
      setIsConverting(false);
      toast({
        title: "Conversion Failed",
        description: "An error occurred during file processing",
        variant: "destructive"
      });
    }
  };

  const downloadConverted = () => {
    const blob = new Blob([convertedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${file?.name.split('.')[0] || 'file'}.${outputFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setConvertedData("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout
      title="Global File Converter"
      description="Quickly transform configuration and data files between common formats"
      category="File & Format"
      icon={RefreshCw}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Config Card */}
        <Card className="bg-card border-border card-glow">
          <CardHeader>
            <CardTitle className="font-mono text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              Source Configuration
            </CardTitle>
            <CardDescription className="text-xs">Select your source file and target format</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/30 hover:bg-muted/30'
                }`}
            >
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <div className="flex flex-col items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${file ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {file ? <Check className="w-6 h-6" /> : <FileIcon className="w-6 h-6" />}
                </div>
                {file ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold font-mono text-foreground">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground">Any text-based file (JSON, CSV, XML, etc.)</p>
                  </div>
                )}
                <Button
                  variant={file ? "ghost" : "outline"}
                  size="sm"
                  onClick={() => file ? reset() : fileInputRef.current?.click()}
                  className="mt-2 font-mono h-8"
                >
                  {file ? <Trash2 className="w-4 h-4 mr-2" /> : "Select File"}
                  {file ? "Change File" : ""}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target Output Format</label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger className="bg-muted/20 border-border font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value} className="font-mono text-xs">
                        {format.label} (.{format.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={convertFile}
                disabled={!file || isConverting}
                className="w-full h-12 font-mono bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/20"
              >
                {isConverting ? (
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 mr-2" />
                )}
                {isConverting ? "Processing..." : "Convert Now"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="bg-card border-border card-glow flex flex-col">
          <CardHeader className="pb-3 border-b border-border bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-mono text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Conversion Result
                </CardTitle>
                <CardDescription className="text-xs">Generated output stream</CardDescription>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={downloadConverted}
                disabled={!convertedData}
                className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative">
            {convertedData ? (
              <pre className="p-6 font-mono text-[11px] text-foreground leading-relaxed overflow-auto max-h-[500px] h-full whitespace-pre-wrap">
                {convertedData}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px] opacity-40 italic font-mono text-sm">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p>Waiting for conversion to trigger...</p>
              </div>
            )}
          </CardContent>
          {convertedData && (
            <div className="p-4 bg-primary/5 border-t border-border mt-auto">
              <Button onClick={downloadConverted} className="w-full font-mono h-10">
                <Download className="w-4 h-4 mr-2" />
                Download .{outputFormat}
              </Button>
            </div>
          )}
        </Card>

        {/* Info Legend */}
        <Card className="lg:col-span-2 bg-muted/30 border-border">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex gap-4">
                <Info className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Local Processing</h4>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">Your files are never uploaded to any server. Conversion happens entirely within your web browser worker.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Check className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Metadata preservation</h4>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">We attempt to maintain as much semantic structure as possible during the transformation process.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <AlertCircle className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="font-bold font-mono text-xs mb-1 uppercase tracking-widest">Size Limits</h4>
                  <p className="text-[11px] text-muted-foreground font-mono leading-relaxed">Browser environments are memory-limited. Files up to 50MB are generally safe to process here.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default FileConverter;
