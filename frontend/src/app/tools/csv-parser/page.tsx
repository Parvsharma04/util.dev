"use client";

import { useState } from "react";
import { Upload, Download, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const CsvParser = () => {
  const [csvInput, setCsvInput] = useState("");
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [jsonOutput, setJsonOutput] = useState("");
  const { toast } = useToast();

  const parseCsv = () => {
    if (!csvInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSV data",
        variant: "destructive"
      });
      return;
    }

    try {
      const lines = csvInput.trim().split('\n');
      const data = lines.map(line => {
        // Simple CSV parsing (handles basic cases)
        return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
      });
      
      setParsedData(data);
      
      // Convert to JSON
      if (data.length > 1) {
        const headers = data[0];
        const rows = data.slice(1);
        const jsonData = rows.map(row => {
          const obj: { [key: string]: string } = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        setJsonOutput(JSON.stringify(jsonData, null, 2));
      }
      
      toast({
        title: "Success!",
        description: "CSV data parsed successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to parse CSV data",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvInput(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} copied to clipboard` });
  };

  const downloadJson = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
        <ToolLayout title="CSV Parser" description="Parse CSV data and convert to JSON or view as table" category="File & Format" icon={Terminal}>
<Button asChild variant="outline">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload CSV
                    </label>
                  </Button>
                  <Button onClick={parseCsv} className="bg-blue-600 hover:bg-blue-700">
                    Parse CSV
                  </Button>
                </div>
                
                <Textarea
                  placeholder="name,email,age&#10;John Doe,john@example.com,30&#10;Jane Smith,jane@example.com,25"
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {parsedData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Parsed Table</CardTitle>
                <CardDescription>CSV data displayed as a table</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {parsedData[0]?.map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(1).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {jsonOutput && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>JSON Output</CardTitle>
                    <CardDescription>CSV data converted to JSON format</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(jsonOutput, "JSON")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={downloadJson}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                  {jsonOutput}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
              </ToolLayout>
    );
};

export default CsvParser;
