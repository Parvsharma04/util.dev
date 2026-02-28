"use client";

import { useState } from "react";
import { Upload, Download, Copy, Table as TableIcon, FileJson, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const CsvParser = () => {
  const [csvInput, setCsvInput] = useState("");
  const [parsedData, setParsedData] = useState<string[][]>([]);
  const [jsonOutput, setJsonOutput] = useState("");
  const { toast } = useToast();

  const parseCsv = () => {
    if (!csvInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter CSV data to parse",
        variant: "destructive"
      });
      return;
    }

    try {
      const lines = csvInput.trim().split('\n');
      const data = lines.map(line => {
        // Simple CSV parsing: split by comma, remove quotes
        return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
      });

      setParsedData(data);

      // Convert to JSON array of objects
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
        title: "Parsed Successfully",
        description: `${data.length - 1} rows detected`,
      });
    } catch (error) {
      toast({
        title: "Parsing Error",
        description: "Invalid CSV format",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvInput(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: `${type} copied to clipboard` });
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
    <ToolLayout
      title="CSV Parser & Viewer"
      description="Convert CSV data to JSON or view it in an interactive table format"
      category="File & Format"
      icon={FileText}
    >
      <div className="space-y-6">
        {/* Input Card */}
        <Card className="bg-card border-border card-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-mono flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  CSV Source
                </CardTitle>
                <CardDescription className="font-mono">Paste your CSV or upload a file</CardDescription>
              </div>
              <div className="flex gap-2">
                <Input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button variant="outline" size="sm" asChild className="font-mono cursor-pointer">
                  <label htmlFor="csv-upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </label>
                </Button>
                <Button size="sm" onClick={parseCsv} className="font-mono bg-primary hover:bg-primary/90">
                  <FileText className="w-4 h-4 mr-2" />
                  Parse
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="name,email,role&#10;John,john@example.com,Admin&#10;Jane,jane@example.com,User"
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="min-h-[200px] font-mono text-xs bg-muted/10 border-border"
            />
          </CardContent>
        </Card>

        {parsedData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table View */}
            <Card className="bg-card border-border card-glow overflow-hidden">
              <CardHeader className="pb-3 border-b border-border bg-muted/20">
                <CardTitle className="font-mono text-sm flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-primary" />
                  Table Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow className="border-border hover:bg-transparent">
                        {parsedData[0]?.map((header, index) => (
                          <TableHead key={index} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                            {header}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(1).map((row, rowIndex) => (
                        <TableRow key={rowIndex} className="border-border hover:bg-primary/5 transition-colors">
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex} className="text-xs font-mono py-2">
                              {cell}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* JSON Output */}
            <Card className="bg-card border-border card-glow flex flex-col">
              <CardHeader className="pb-3 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-mono text-sm flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-primary" />
                    JSON Output
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(jsonOutput, "JSON")}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={downloadJson}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <Textarea
                  value={jsonOutput}
                  readOnly
                  className="h-full min-h-[400px] border-0 rounded-none font-mono text-[10px] bg-muted/5 leading-tight"
                  placeholder="JSON results..."
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Legend */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex gap-4 items-start">
              <Info className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold font-mono text-xs mb-2 uppercase tracking-widest text-foreground">Usage Notes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[11px] font-mono text-muted-foreground">
                  <p>• The first row of your CSV is automatically treated as headers for JSON conversion.</p>
                  <p>• Quoted values (e.g. "Value, with comma") are partially handled by trimming quotes.</p>
                  <p>• For large files, use the upload button to avoid browser lag with large text pastes.</p>
                  <p>• All processing happens client-side; your data is never sent to any server.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default CsvParser;
