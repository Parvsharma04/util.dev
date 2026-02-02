import { useState } from "react";
import { Upload, Download, FileIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const FileConverter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("");
  const [convertedData, setConvertedData] = useState("");
  const { toast } = useToast();

  const supportedFormats = [
    { value: "json", label: "JSON" },
    { value: "csv", label: "CSV" },
    { value: "xml", label: "XML" },
    { value: "txt", label: "Text" }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("File content:", e.target?.result);
      };
      reader.readAsText(uploadedFile);
    }
  };

  const convertFile = () => {
    if (!file || !outputFormat) {
      toast({
        title: "Missing Requirements",
        description: "Please select a file and output format",
        variant: "destructive"
      });
      return;
    }

    const mockConvertedData = `Converted ${file.name} to ${outputFormat} format\n\nThis is a demo conversion result.`;
    setConvertedData(mockConvertedData);
    
    toast({
      title: "Conversion Complete",
      description: `File converted to ${outputFormat.toUpperCase()}`
    });
  };

  const downloadConverted = () => {
    const blob = new Blob([convertedData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${outputFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-foreground">File Converter</h1>
          <p className="text-muted-foreground">Convert between different file formats</p>
          <Badge className="bg-green-100 text-green-700 border-green-200 mt-2">File & Format</Badge>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload File</CardTitle>
              <CardDescription>Select a file to convert</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".json,.csv,.xml,.txt"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground">JSON, CSV, XML, TXT files</p>
                  </label>
                </div>
                
                {file && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <FileIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <Badge variant="outline">{file.type || 'Unknown'}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="text-sm font-medium">Output Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={convertFile} className="bg-blue-600 hover:bg-blue-700">
                  Convert File
                </Button>
              </div>
            </CardContent>
          </Card>

          {convertedData && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Converted Result</CardTitle>
                  <Button onClick={downloadConverted} size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto">
                  {convertedData}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileConverter;
