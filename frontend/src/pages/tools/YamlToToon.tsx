import { useState } from "react";
import { ArrowLeft, Copy, Download, ArrowRightLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { encode, decode } from "@toon-format/toon";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

type Delimiter = "," | "\t" | "|";

const YamlToToon = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [mode, setMode] = useState<"yaml-to-toon" | "toon-to-yaml">(
        "yaml-to-toon",
    );
    const [delimiter, setDelimiter] = useState<Delimiter>("\t");
    const [keyFolding, setKeyFolding] = useState(true);
    const [indent, setIndent] = useState(2);
    const { toast } = useToast();

    const [stats, setStats] = useState({
        inputSize: 0,
        outputSize: 0,
        savings: 0,
        savingsPercent: 0,
    });

    const convert = () => {
        if (!input.trim()) {
            setError("Please enter some input");
            return;
        }

        try {
            if (mode === "yaml-to-toon") {
                // Parse YAML first
                const parsed = parseYaml(input);
                const toon = encode(parsed, {
                    indent,
                    delimiter,
                    keyFolding: keyFolding ? "safe" : "off",
                });
                setOutput(toon);

                const inputSize = new Blob([input]).size;
                const outputSize = new Blob([toon]).size;
                const savings = inputSize - outputSize;

                setStats({
                    inputSize,
                    outputSize,
                    savings,
                    savingsPercent: inputSize > 0 ? (savings / inputSize) * 100 : 0,
                });
            } else {
                // TOON to YAML
                const parsed = decode(input, {
                    indent,
                    expandPaths: keyFolding ? "safe" : "off",
                });
                const yaml = stringifyYaml(parsed, { indent: 2 });
                setOutput(yaml);

                const inputSize = new Blob([input]).size;
                const outputSize = new Blob([yaml]).size;

                setStats({
                    inputSize,
                    outputSize,
                    savings: inputSize - outputSize,
                    savingsPercent: 0,
                });
            }
            setError("");
        } catch (err) {
            setError(`Error: ${(err as Error).message}`);
            setOutput("");
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        toast({
            title: "Copied!",
            description: "Output copied to clipboard",
        });
    };

    const downloadOutput = () => {
        const ext = mode === "yaml-to-toon" ? "toon" : "yaml";
        const blob = new Blob([output], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `output.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const swapMode = () => {
        setMode(mode === "yaml-to-toon" ? "toon-to-yaml" : "yaml-to-toon");
        setInput(output);
        setOutput("");
        setError("");
    };

    const loadSample = () => {
        const sample = `# Sample YAML configuration
server:
  host: localhost
  port: 8080
  ssl: true

database:
  type: postgres
  connection:
    host: db.example.com
    port: 5432
    name: myapp

users:
  - id: 1
    name: Alice
    role: admin
  - id: 2
    name: Bob
    role: user
  - id: 3
    name: Charlie
    role: user
`;
        setInput(sample);
        setOutput("");
        setError("");
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Link
                        to="/tools"
                        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tools
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground font-mono">
                                YAML ↔ TOON
                            </h1>
                            <p className="text-muted-foreground">
                                Convert YAML to TOON format for smaller LLM context
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="border-primary/30 text-primary">
                            AI Tools
                        </Badge>
                        <Badge variant="outline">Token Saver</Badge>
                        <Badge variant="outline">Config</Badge>
                    </div>
                </div>

                {/* Options Bar */}
                <Card className="mb-6 bg-card border-border">
                    <CardContent className="py-4">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm text-muted-foreground">Mode:</Label>
                                <Badge
                                    variant={mode === "yaml-to-toon" ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => setMode("yaml-to-toon")}
                                >
                                    YAML → TOON
                                </Badge>
                                <Badge
                                    variant={mode === "toon-to-yaml" ? "default" : "outline"}
                                    className="cursor-pointer"
                                    onClick={() => setMode("toon-to-yaml")}
                                >
                                    TOON → YAML
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <Label className="text-sm text-muted-foreground">
                                    Delimiter:
                                </Label>
                                <Select
                                    value={delimiter}
                                    onValueChange={(v) => setDelimiter(v as Delimiter)}
                                >
                                    <SelectTrigger className="w-[100px] h-8 bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value=",">Comma</SelectItem>
                                        <SelectItem value="	">Tab</SelectItem>
                                        <SelectItem value="|">Pipe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Switch
                                    id="keyFolding"
                                    checked={keyFolding}
                                    onCheckedChange={setKeyFolding}
                                />
                                <Label
                                    htmlFor="keyFolding"
                                    className="text-sm text-muted-foreground cursor-pointer"
                                >
                                    Key Folding
                                </Label>
                            </div>

                            <Button onClick={loadSample} variant="outline" size="sm">
                                Load Sample
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input */}
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-foreground font-mono">
                                    {mode === "yaml-to-toon" ? "YAML Input" : "TOON Input"}
                                </CardTitle>
                                <Badge variant="outline" className="font-mono text-xs">
                                    {stats.inputSize > 0 ? `${stats.inputSize} bytes` : "—"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={
                                    mode === "yaml-to-toon"
                                        ? "key: value\narray:\n  - item1\n  - item2"
                                        : "key: value\narray[2]: item1,item2"
                                }
                                className="min-h-[400px] font-mono text-sm bg-background border-border resize-none"
                            />
                        </CardContent>
                    </Card>

                    {/* Output */}
                    <Card className="bg-card border-border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-foreground font-mono">
                                    {mode === "yaml-to-toon" ? "TOON Output" : "YAML Output"}
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {stats.outputSize > 0 && (
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {stats.outputSize} bytes
                                        </Badge>
                                    )}
                                    {stats.savings > 0 && mode === "yaml-to-toon" && (
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono text-xs">
                                            -{stats.savingsPercent.toFixed(1)}%
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {error ? (
                                <div className="min-h-[400px] p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <p className="text-red-400 font-mono text-sm">{error}</p>
                                </div>
                            ) : (
                                <Textarea
                                    value={output}
                                    readOnly
                                    placeholder="Output will appear here..."
                                    className="min-h-[400px] font-mono text-sm bg-background border-border resize-none"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                    <Button onClick={convert} className="min-w-[140px]">
                        <Zap className="w-4 h-4 mr-2" />
                        Convert
                    </Button>
                    <Button onClick={swapMode} variant="outline">
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Swap & Convert
                    </Button>
                    <Button onClick={copyOutput} variant="outline" disabled={!output}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                    </Button>
                    <Button onClick={downloadOutput} variant="outline" disabled={!output}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                </div>

                {/* Comparison Section */}
                <Card className="mt-8 bg-muted/50 border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground font-mono text-lg">
                            YAML vs TOON Comparison
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-mono text-sm text-foreground mb-2">YAML</h4>
                                <pre className="text-xs text-muted-foreground bg-background p-3 rounded-lg overflow-x-auto">
                                    {`users:
  - id: 1
    name: Alice
  - id: 2
    name: Bob
  - id: 3
    name: Charlie`}
                                </pre>
                            </div>
                            <div>
                                <h4 className="font-mono text-sm text-foreground mb-2">
                                    TOON (with key folding + tab delimiter)
                                </h4>
                                <pre className="text-xs text-muted-foreground bg-background p-3 rounded-lg overflow-x-auto">
                                    {`users[3]{id	name}:
  1	Alice
  2	Bob
  3	Charlie`}
                                </pre>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            TOON's tabular format eliminates repetitive keys and uses
                            efficient delimiters, typically saving{" "}
                            <strong className="text-primary">30-50%</strong> on array-heavy
                            data.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default YamlToToon;
