"use client";

import { useState } from "react";
import { Upload, Download, FileIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

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
        <ToolLayout title="File Converter" description="Convert between different file formats" category="File & Format" icon={Terminal}>
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
              </ToolLayout>
    );
};

export default FileConverter;
