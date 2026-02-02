import { useState } from "react";
import { Copy, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const MarkdownHtml = () => {
  const [markdownInput, setMarkdownInput] = useState("");
  const [htmlInput, setHtmlInput] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const { toast } = useToast();

  const convertMarkdownToHtml = () => {
    let html = markdownInput
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[([^\]]*)\]\(([^\)]*)\)/gim, '<img alt="$1" src="$2" />')
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n$/gim, '<br />');
    
    setHtmlOutput(html);
    toast({ title: "Converted!", description: "Markdown converted to HTML" });
  };

  const convertHtmlToMarkdown = () => {
    let markdown = htmlInput
      .replace(/<h1>(.*?)<\/h1>/gim, '# $1')
      .replace(/<h2>(.*?)<\/h2>/gim, '## $1')
      .replace(/<h3>(.*?)<\/h3>/gim, '### $1')
      .replace(/<strong>(.*?)<\/strong>/gim, '**$1**')
      .replace(/<em>(.*?)<\/em>/gim, '*$1*')
      .replace(/<img alt="([^"]*)" src="([^"]*)" \/>/gim, '![$1]($2)')
      .replace(/<a href="([^"]*)">(.*?)<\/a>/gim, '[$2]($1)')
      .replace(/<br \/>/gim, '\n');
    
    setMarkdownOutput(markdown);
    toast({ title: "Converted!", description: "HTML converted to Markdown" });
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Markdown ↔ HTML Converter</h1>
          <p className="text-muted-foreground">Convert between Markdown and HTML formats</p>
          <Badge className="bg-green-100 text-green-700 border-green-200 mt-2">File & Format</Badge>
        </div>

        <div className="mb-6">
          <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <Tabs defaultValue="md-to-html" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="md-to-html">Markdown → HTML</TabsTrigger>
            <TabsTrigger value="html-to-md">HTML → Markdown</TabsTrigger>
          </TabsList>

          <TabsContent value="md-to-html" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Markdown Input</CardTitle>
                  <CardDescription>Enter your Markdown content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="# Hello World&#10;&#10;This is **bold** text and *italic* text.&#10;&#10;[Link](https://example.com)"
                      value={markdownInput}
                      onChange={(e) => setMarkdownInput(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    <Button onClick={convertMarkdownToHtml} className="w-full">
                      Convert to HTML
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>HTML Output</CardTitle>
                      <CardDescription>Generated HTML code</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(htmlOutput, "HTML")}
                      disabled={!htmlOutput}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={htmlOutput}
                    readOnly
                    className="min-h-[400px] font-mono text-sm bg-muted"
                    placeholder="HTML output will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="html-to-md" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>HTML Input</CardTitle>
                  <CardDescription>Enter your HTML content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="<h1>Hello World</h1>&#10;&#10;<p>This is <strong>bold</strong> text and <em>italic</em> text.</p>&#10;&#10;<a href='https://example.com'>Link</a>"
                      value={htmlInput}
                      onChange={(e) => setHtmlInput(e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                    />
                    <Button onClick={convertHtmlToMarkdown} className="w-full">
                      Convert to Markdown
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Markdown Output</CardTitle>
                      <CardDescription>Generated Markdown code</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(markdownOutput, "Markdown")}
                      disabled={!markdownOutput}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={markdownOutput}
                    readOnly
                    className="min-h-[400px] font-mono text-sm bg-muted"
                    placeholder="Markdown output will appear here..."
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarkdownHtml;
