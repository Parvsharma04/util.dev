"use client";

import { useState } from "react";
import { Copy, RotateCcw, FileText, Code, Braces, Info, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ToolLayout } from "@/components/ToolLayout";

const MarkdownHtml = () => {
  const [markdownInput, setMarkdownInput] = useState("");
  const [htmlInput, setHtmlInput] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const { toast } = useToast();

  const convertMarkdownToHtml = () => {
    if (!markdownInput) {
      toast({ title: "Input Required", description: "Please enter Markdown text", variant: "destructive" });
      return;
    }
    // Very simple regex based conversion for demo
    let html = markdownInput
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br />\n');

    setHtmlOutput(html);
    toast({ title: "Success", description: "Markdown converted to HTML" });
  };

  const convertHtmlToMarkdown = () => {
    if (!htmlInput) {
      toast({ title: "Input Required", description: "Please enter HTML text", variant: "destructive" });
      return;
    }
    let markdown = htmlInput
      .replace(/<h1>(.*?)<\/h1>/gim, '# $1')
      .replace(/<h2>(.*?)<\/h2>/gim, '## $1')
      .replace(/<h3>(.*?)<\/h3>/gim, '### $1')
      .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
      .replace(/<em>(.*?)<\/em>/gim, '*$1*')
      .replace(/<img alt="([^"]*)" src="([^"]*)" \/>/gim, '![$1]($2)')
      .replace(/<a href="([^"]*)">(.*?)<\/a>/gim, '[$2]($1)')
      .replace(/<br \/>/gim, '\n')
      .replace(/<br>/gim, '\n');

    setMarkdownOutput(markdown);
    toast({ title: "Success", description: "HTML converted to Markdown" });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${type} copied to clipboard` });
  };

  const clearAll = () => {
    setMarkdownInput("");
    setHtmlInput("");
    setMarkdownOutput("");
    setHtmlOutput("");
  };

  return (
    <ToolLayout
      title="Markdown ↔ HTML Converter"
      description="Bi-directional conversion between Markdown syntax and HTML tags"
      category="File & Format"
      icon={FileText}
    >
      <div className="space-y-6">
        <Tabs defaultValue="md-to-html" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50 border border-border p-1">
              <TabsTrigger value="md-to-html" className="font-mono text-xs gap-2">
                <FileText className="w-3.5 h-3.5" />
                MD → HTML
              </TabsTrigger>
              <TabsTrigger value="html-to-md" className="font-mono text-xs gap-2">
                <Code className="w-3.5 h-3.5" />
                HTML → MD
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" onClick={clearAll} className="font-mono text-xs text-destructive hover:bg-destructive/10 border-border">
              <RotateCcw className="w-3.5 h-3.5 mr-2" />
              Clear All
            </Button>
          </div>

          <TabsContent value="md-to-html" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border card-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="font-mono text-sm flex items-center gap-2">
                    <Braces className="w-4 h-4 text-primary" />
                    Markdown Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="# Header&#10;**Bold text** and *italics*."
                    value={markdownInput}
                    onChange={(e) => setMarkdownInput(e.target.value)}
                    className="min-h-[400px] font-mono text-xs bg-muted/10 border-border"
                  />
                  <Button onClick={convertMarkdownToHtml} className="w-full font-mono bg-primary">
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Convert to HTML
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border card-glow flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-sm flex items-center gap-2">
                      <Code className="w-4 h-4 text-emerald-500" />
                      HTML Output
                    </CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(htmlOutput, "HTML")}
                      disabled={!htmlOutput}
                      className="h-8 w-8 hover:bg-primary/10"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <Textarea
                    value={htmlOutput}
                    readOnly
                    className="min-h-[440px] h-full font-mono text-xs bg-muted/30 border-border"
                    placeholder="HTML result will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="html-to-md" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border card-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="font-mono text-sm flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary" />
                    HTML Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="<h1>Header</h1>&#10;<p><strong>Bold</strong> and <em>italics</em></p>"
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    className="min-h-[400px] font-mono text-xs bg-muted/10 border-border"
                  />
                  <Button onClick={convertHtmlToMarkdown} className="w-full font-mono bg-primary">
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Convert to Markdown
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border card-glow flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-mono text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-500" />
                      Markdown Output
                    </CardTitle>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyToClipboard(markdownOutput, "Markdown")}
                      disabled={!markdownOutput}
                      className="h-8 w-8 hover:bg-primary/10"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <Textarea
                    value={markdownOutput}
                    readOnly
                    className="min-h-[440px] h-full font-mono text-xs bg-muted/30 border-border"
                    placeholder="Markdown result will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Note Card */}
        <Card className="bg-muted/30 border-border">
          <CardContent className="p-6">
            <div className="flex gap-4 items-start">
              <Info className="w-6 h-6 text-primary shrink-0" />
              <div>
                <h4 className="font-bold font-mono text-xs mb-2 uppercase tracking-widest">Conversion Notice</h4>
                <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
                  This converter uses lightweight regex-based logic for fast, local processing.
                  It supports standard elements like headers, bold, italics, links, and images.
                  For complex nested structures, manually review the output.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default MarkdownHtml;
