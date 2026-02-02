import { useState } from "react";
import { Search, FileText, Code, Zap, Clock, Globe, Palette, Terminal, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const allTools = [
  // Text & String Utilities
  {
    title: "JSON Formatter",
    description: "Prettify, minify, and validate JSON with syntax highlighting",
    icon: Code,
    category: "Text & String",
    route: "/tools/json-formatter",
    implemented: true
  },
  {
    title: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64 strings and files",
    icon: FileText,
    category: "Text & String",
    route: "/tools/base64",
    implemented: true
  },
  {
    title: "URL Encoder/Decoder",
    description: "Encode and decode URLs for safe transmission",
    icon: FileText,
    category: "Text & String",
    route: "/tools/url-encoder",
    implemented: true
  },
  {
    title: "String Case Converter",
    description: "Convert between different text cases",
    icon: FileText,
    category: "Text & String",
    route: "/tools/string-case",
    implemented: true
  },
  {
    title: "JWT Decoder",
    description: "Decode and inspect JWT tokens",
    icon: Code,
    category: "Text & String",
    route: "/tools/jwt-decoder",
    implemented: true
  },
  {
    title: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes",
    icon: Code,
    category: "Text & String",
    route: "/tools/hash-generator",
    implemented: true
  },
  {
    title: "UUID Generator",
    description: "Generate UUIDs v1, v4, v5 with customizable options",
    icon: Zap,
    category: "Text & String",
    route: "/tools/uuid-generator",
    implemented: true
  },
  {
    title: "Regex Tester",
    description: "Test regular expressions with real-time matching",
    icon: Code,
    category: "Text & String",
    route: "/tools/regex-tester",
    implemented: true
  },
  {
    title: "Lorem Ipsum Generator",
    description: "Generate placeholder text for your projects",
    icon: FileText,
    category: "Text & String",
    route: "/tools/lorem-ipsum",
    implemented: true
  },
  
  // File & Format Utilities
  {
    title: "File Converter",
    description: "Convert between different file formats",
    icon: Code,
    category: "File & Format",
    route: "/tools/file-converter",
    implemented: true
  },
  {
    title: "Markdown ↔ HTML",
    description: "Convert Markdown to HTML and vice versa",
    icon: FileText,
    category: "File & Format",
    route: "/tools/md-html-converter",
    implemented: true
  },
  {
    title: "CSV Parser",
    description: "Parse and convert CSV files",
    icon: FileText,
    category: "File & Format",
    route: "/tools/csv-parser",
    implemented: true
  },
  {
    title: "Text Diff Checker",
    description: "Compare text differences",
    icon: Code,
    category: "File & Format",
    route: "/tools/text-diff",
    implemented: true
  },
  {
    title: "JSON Merge Tool",
    description: "Compare and merge JSON objects",
    icon: Code,
    category: "File & Format",
    route: "/tools/json-merge",
    implemented: true
  },
  {
    title: "YAML ↔ JSON",
    description: "Convert between YAML and JSON formats",
    icon: Code,
    category: "File & Format",
    route: "/tools/yaml-json",
    implemented: true
  },
  
  // Developer Tools
  {
    title: ".env Formatter",
    description: "Format and organize environment files",
    icon: Zap,
    category: "Developer Tools",
    route: "/tools/env-formatter",
    implemented: true
  },
  {
    title: "Gitignore Generator",
    description: "Generate .gitignore files for your projects",
    icon: Code,
    category: "Developer Tools",
    route: "/tools/gitignore-generator",
    implemented: true
  },
  {
    title: "HTTP Request Tester",
    description: "Test API endpoints with custom headers and body",
    icon: Globe,
    category: "Developer Tools",
    route: "/tools/http-tester",
    implemented: true
  },
  {
    title: "Dockerfile Generator",
    description: "Generate Dockerfiles for your applications",
    icon: Code,
    category: "Developer Tools",
    route: "/tools/dockerfile-generator",
    implemented: true
  },
  {
    title: "Timestamp Converter",
    description: "Convert UNIX timestamps to human readable dates",
    icon: Clock,
    category: "Developer Tools",
    route: "/tools/timestamp",
    implemented: true
  },
  {
    title: "Code Beautifier",
    description: "Beautify and minify your code",
    icon: Code,
    category: "Developer Tools",
    route: "/tools/code-beautifier",
    implemented: true
  },
  
  // Time & Schedule
  {
    title: "Cron Expression Helper",
    description: "Create and understand cron expressions",
    icon: Clock,
    category: "Time & Schedule",
    route: "/tools/cron-helper",
    implemented: true
  },
  {
    title: "Timezone Converter",
    description: "Convert between different timezones",
    icon: Clock,
    category: "Time & Schedule",
    route: "/tools/timezone",
    implemented: true
  },
  {
    title: "Countdown Timer",
    description: "Create countdown timers",
    icon: Clock,
    category: "Time & Schedule",
    route: "/tools/countdown",
    implemented: true
  },
  
  // Network & Web Tools
  {
    title: "IP & DNS Lookup",
    description: "Lookup IP and DNS information",
    icon: Globe,
    category: "Network & Web",
    route: "/tools/ip-lookup",
    implemented: true
  },
  {
    title: "Network Tools",
    description: "Ping and traceroute visualization",
    icon: Globe,
    category: "Network & Web",
    route: "/tools/network-tools",
    implemented: true
  },
  {
    title: "User Agent Parser",
    description: "Parse and analyze user agent strings",
    icon: Globe,
    category: "Network & Web",
    route: "/tools/user-agent",
    implemented: true
  },
  
  // Frontend/UX Helpers
  {
    title: "Color Converter",
    description: "Convert between HEX, RGB, HSL color formats",
    icon: Palette,
    category: "Frontend/UX",
    route: "/tools/color-converter",
    implemented: true
  },
  {
    title: "Font Previewer",
    description: "Preview and compare fonts",
    icon: Palette,
    category: "Frontend/UX",
    route: "/tools/font-previewer",
    implemented: true
  },
  {
    title: "Favicon Generator",
    description: "Generate favicons for your website",
    icon: Palette,
    category: "Frontend/UX",
    route: "/tools/favicon-generator",
    implemented: true
  }
];

const categories = [
  { name: "All", count: allTools.length, icon: Code, color: "bg-primary/20 text-primary border-primary/30" },
  { name: "Text & String", count: 9, icon: FileText, color: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30" },
  { name: "File & Format", count: 6, icon: Code, color: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30" },
  { name: "Developer Tools", count: 6, icon: Zap, color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" },
  { name: "Time & Schedule", count: 3, icon: Clock, color: "bg-orange-500/20 text-orange-500 border-orange-500/30" },
  { name: "Network & Web", count: 3, icon: Globe, color: "bg-red-500/20 text-red-500 border-red-500/30" },
  { name: "Frontend/UX", count: 3, icon: Palette, color: "bg-purple-500/20 text-purple-500 border-purple-500/30" }
];

const Tools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background matrix-bg">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <a href="/">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </a>
              <a href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-primary" />
                </div>
                <span className="font-bold text-foreground font-mono glow text-sm">util.dev</span>
              </a>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 font-mono">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span className="text-primary">→</span>
          <span className="text-foreground">All Tools</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 font-mono glow">All Developer Tools</h1>
          <p className="text-xl text-muted-foreground mb-6 font-mono">
            Browse our complete collection of {allTools.length} developer utilities
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="$ search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-border bg-input focus:border-primary font-mono"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 font-mono glow flex items-center gap-2">
            <span className="text-muted-foreground">&gt;</span> Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 font-mono ${
                  selectedCategory === category.name 
                    ? "bg-primary text-primary-foreground" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground font-mono">
                  {category.name === "All" ? allTools.length : category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <Card 
              key={tool.route}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border hover:border-primary/50 hover:-translate-y-1 bg-card card-glow"
              onClick={() => window.location.href = tool.route}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-200 border border-border group-hover:border-primary/30">
                    <tool.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex gap-2">
                    {!tool.implemented && (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30 text-xs font-mono">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors font-mono">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-mono border-border">
                    {tool.category}
                  </Badge>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 font-mono">
                      {tool.implemented ? "Try Now →" : "Coming Soon"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2 font-mono">No tools found</h3>
            <p className="text-muted-foreground font-mono">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
