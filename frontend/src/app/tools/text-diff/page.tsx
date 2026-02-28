"use client";

import { useState } from "react";
import { Copy, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const TextDiff = () => {
  const [originalText, setOriginalText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [diffResult, setDiffResult] = useState<Array<{type: 'added' | 'removed' | 'unchanged', content: string}>>([]);
  const { toast } = useToast();

  const calculateDiff = () => {
    if (!originalText.trim() || !modifiedText.trim()) {
      toast({
        title: "Error",
        description: "Please enter both original and modified text",
        variant: "destructive"
      });
      return;
    }

    // Simple line-by-line diff
    const originalLines = originalText.split('\n');
    const modifiedLines = modifiedText.split('\n');
    const diff: Array<{type: 'added' | 'removed' | 'unchanged', content: string}> = [];

    const maxLength = Math.max(originalLines.length, modifiedLines.length);
    
    for (let i = 0; i < maxLength; i++) {
      const originalLine = originalLines[i] || '';
      const modifiedLine = modifiedLines[i] || '';
      
      if (originalLine === modifiedLine) {
        if (originalLine) {
          diff.push({ type: 'unchanged', content: originalLine });
        }
      } else {
        if (originalLine && !modifiedLines.includes(originalLine)) {
          diff.push({ type: 'removed', content: originalLine });
        }
        if (modifiedLine && !originalLines.includes(modifiedLine)) {
          diff.push({ type: 'added', content: modifiedLine });
        }
      }
    }

    setDiffResult(diff);
    toast({
      title: "Diff Calculated",
      description: `Found ${diff.filter(d => d.type !== 'unchanged').length} differences`
    });
  };

  const copyDiff = () => {
    const diffText = diffResult.map(item => {
      const prefix = item.type === 'added' ? '+ ' : item.type === 'removed' ? '- ' : '  ';
      return prefix + item.content;
    }).join('\n');
    
    navigator.clipboard.writeText(diffText);
    toast({ title: "Copied!", description: "Diff result copied to clipboard" });
  };

  const clearAll = () => {
    setOriginalText("");
    setModifiedText("");
    setDiffResult([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Text Diff Checker</h1>
          <p className="text-muted-foreground">Compare two texts and highlight differences</p>
          <Badge className="bg-green-100 text-green-700 border-green-200 mt-2">File & Format</Badge>
        </div>

        <div className="mb-6">
          <div className="flex gap-3">
            <Button onClick={calculateDiff} className="bg-blue-600 hover:bg-blue-700">
              Compare Texts
            </Button>
            <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Original Text</CardTitle>
              <CardDescription>Enter the original version</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter original text here..."
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modified Text</CardTitle>
              <CardDescription>Enter the modified version</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter modified text here..."
                value={modifiedText}
                onChange={(e) => setModifiedText(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {diffResult.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Diff Result</CardTitle>
                  <CardDescription>
                    <span className="text-green-600">+ Added lines</span> • 
                    <span className="text-red-600 ml-2">- Removed lines</span> • 
                    <span className="text-muted-foreground ml-2">Unchanged lines</span>
                  </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={copyDiff}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Diff
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-96 overflow-auto">
                {diffResult.map((item, index) => (
                  <div
                    key={index}
                    className={`px-2 py-1 ${
                      item.type === 'added' 
                        ? 'bg-green-100 text-green-800' 
                        : item.type === 'removed'
                        ? 'bg-red-100 text-red-800'
                        : 'text-slate-700'
                    }`}
                  >
                    <span className="select-none mr-2">
                      {item.type === 'added' ? '+' : item.type === 'removed' ? '-' : ' '}
                    </span>
                    {item.content}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TextDiff;
