"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [testText, setTestText] = useState("");
  const [flags, setFlags] = useState("g");

  return (
        <ToolLayout title="Regex Tester" description="Test regular expressions with real-time highlighting" category="Text & String" icon={Badge}>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pattern & Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Regex Pattern</label>
                <Input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="[a-z]+" />
              </div>
              <div>
                <label className="text-sm font-medium">Flags</label>
                <Input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="g" />
              </div>
              <div>
                <label className="text-sm font-medium">Test Text</label>
                <Textarea value={testText} onChange={(e) => setTestText(e.target.value)} className="min-h-[200px]" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">Enter a pattern to see matches</div>
            </CardContent>
          </Card>
        </div>
              </ToolLayout>
    );
};

export default RegexTester;
