import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Zap, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Simple tokenizer approximations for different models
const tokenizers = {
  "gpt-4": {
    name: "GPT-4 / GPT-4 Turbo",
    estimate: (text: string) => Math.ceil(text.length / 4),
    pricePerMillion: { input: 30, output: 60 },
  },
  "gpt-4o": {
    name: "GPT-4o",
    estimate: (text: string) => Math.ceil(text.length / 4),
    pricePerMillion: { input: 5, output: 15 },
  },
  "gpt-3.5": {
    name: "GPT-3.5 Turbo",
    estimate: (text: string) => Math.ceil(text.length / 4),
    pricePerMillion: { input: 0.5, output: 1.5 },
  },
  "claude-3-opus": {
    name: "Claude 3 Opus",
    estimate: (text: string) => Math.ceil(text.length / 3.5),
    pricePerMillion: { input: 15, output: 75 },
  },
  "claude-3-sonnet": {
    name: "Claude 3.5 Sonnet",
    estimate: (text: string) => Math.ceil(text.length / 3.5),
    pricePerMillion: { input: 3, output: 15 },
  },
  "claude-3-haiku": {
    name: "Claude 3.5 Haiku",
    estimate: (text: string) => Math.ceil(text.length / 3.5),
    pricePerMillion: { input: 0.25, output: 1.25 },
  },
  "llama-3": {
    name: "Llama 3 / 3.1",
    estimate: (text: string) => Math.ceil(text.length / 4),
    pricePerMillion: { input: 0, output: 0 },
  },
  "gemini-pro": {
    name: "Gemini 1.5 Pro",
    estimate: (text: string) => Math.ceil(text.length / 4),
    pricePerMillion: { input: 3.5, output: 10.5 },
  },
};

type ModelKey = keyof typeof tokenizers;

const TokenCounter = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<ModelKey>("gpt-4o");
  const [stats, setStats] = useState({
    tokens: 0,
    characters: 0,
    words: 0,
    lines: 0,
    estimatedCost: { input: 0, output: 0 },
  });
  const { toast } = useToast();

  useEffect(() => {
    const tokens = tokenizers[model].estimate(input);
    const characters = input.length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split("\n").length : 0;
    const pricing = tokenizers[model].pricePerMillion;
    
    setStats({
      tokens,
      characters,
      words,
      lines,
      estimatedCost: {
        input: (tokens / 1_000_000) * pricing.input,
        output: (tokens / 1_000_000) * pricing.output,
      },
    });
  }, [input, model]);

  const copyStats = () => {
    const text = `Model: ${tokenizers[model].name}
Tokens: ~${stats.tokens.toLocaleString()}
Characters: ${stats.characters.toLocaleString()}
Words: ${stats.words.toLocaleString()}
Lines: ${stats.lines.toLocaleString()}
Est. Input Cost: $${stats.estimatedCost.input.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Stats copied!", description: "Token statistics copied to clipboard" });
  };

  const clearInput = () => {
    setInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-mono">Token Counter</h1>
              <p className="text-muted-foreground">Estimate token count and costs for LLM APIs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30">AI/LLM</Badge>
            <Badge variant="outline">Cost Estimator</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono">Input Text</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={model} onValueChange={(v) => setModel(v as ModelKey)}>
                      <SelectTrigger className="w-[200px] bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(tokenizers).map(([key, value]) => (
                          <SelectItem key={key} value={key}>{value.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={clearInput}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your prompt, conversation, or any text here..."
                  className="min-h-[400px] font-mono text-sm bg-background resize-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Token Stats
                </CardTitle>
                <CardDescription>Estimated for {tokenizers[model].name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold font-mono text-primary">
                      ~{stats.tokens.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Tokens</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <div className="text-2xl font-bold font-mono text-foreground">
                      {stats.characters.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Characters</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <div className="text-2xl font-bold font-mono text-foreground">
                      {stats.words.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Words</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <div className="text-2xl font-bold font-mono text-foreground">
                      {stats.lines.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Lines</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    💰 Cost Estimate
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">As input:</span>
                      <span className="font-mono text-foreground">
                        ${stats.estimatedCost.input.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">As output:</span>
                      <span className="font-mono text-foreground">
                        ${stats.estimatedCost.output.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button onClick={copyStats} className="w-full" variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Stats
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  About Token Counting
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>
                  Token counts are <strong>estimates</strong> based on average character-to-token ratios.
                  Actual counts may vary by ~10-20%.
                </p>
                <p>
                  For exact counts, use the official tokenizer for your model (e.g., tiktoken for OpenAI).
                </p>
                <p>
                  Pricing is based on published API rates and may change.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCounter;
