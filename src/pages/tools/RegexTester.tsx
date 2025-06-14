
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RegexTester = () => {
  const [pattern, setPattern] = useState("");
  const [testText, setTestText] = useState("");
  const [flags, setFlags] = useState("g");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <a href="/" className="hover:text-slate-700">Home</a>
            <span>→</span>
            <span className="text-slate-900">Regex Tester</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Regex Tester</h1>
          <p className="text-slate-600">Test regular expressions with real-time highlighting</p>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-2">Text & String</Badge>
        </div>

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
              <div className="text-slate-500">Enter a pattern to see matches</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
