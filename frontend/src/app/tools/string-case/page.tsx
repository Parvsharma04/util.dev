"use client";

import { useState } from "react";
import { Copy, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const StringCase = () => {
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const convertToCase = (text: string, caseType: string): string => {
    if (!text) return "";
    
    switch (caseType) {
      case "camelCase":
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
      case "PascalCase":
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, word => word.toUpperCase()).replace(/\s+/g, '');
      case "snake_case":
        return text.toLowerCase().replace(/\s+/g, '_');
      case "kebab-case":
        return text.toLowerCase().replace(/\s+/g, '-');
      case "UPPER_SNAKE_CASE":
        return text.toUpperCase().replace(/\s+/g, '_');
      case "lowercase":
        return text.toLowerCase();
      case "UPPERCASE":
        return text.toUpperCase();
      case "Title Case":
        return text.replace(/\w\S*/g, txt => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
      default:
        return text;
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const clearAll = () => {
    setInput("");
  };

  const cases = [
    { name: "camelCase", example: "myVariableName" },
    { name: "PascalCase", example: "MyVariableName" },
    { name: "snake_case", example: "my_variable_name" },
    { name: "kebab-case", example: "my-variable-name" },
    { name: "UPPER_SNAKE_CASE", example: "MY_VARIABLE_NAME" },
    { name: "lowercase", example: "my variable name" },
    { name: "UPPERCASE", example: "MY VARIABLE NAME" },
    { name: "Title Case", example: "My Variable Name" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tools
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">String Case Converter</h1>
              <p className="text-muted-foreground">Convert strings between different naming conventions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">Text & String</Badge>
          </div>
        </div>

        <div className="mb-6">
          <Button onClick={clearAll} variant="outline" className="text-red-600 hover:text-red-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Enter your text to convert</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="my variable name"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Converted Cases</CardTitle>
              <CardDescription>All case variations of your input</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cases.map((caseType) => (
                  <div key={caseType.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700 mb-1">
                        {caseType.name}
                      </div>
                      <div className="font-mono text-sm text-foreground break-all">
                        {input ? convertToCase(input, caseType.name) : caseType.example}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(convertToCase(input, caseType.name), caseType.name)}
                      disabled={!input}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StringCase;
