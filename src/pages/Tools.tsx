import { useState } from "react";
import { Search, FileText, Code, Zap, Clock, Globe, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  { name: "All", count: allTools.length, icon: Code, color: "bg-slate-500" },
  { name: "Text & String", count: 9, icon: FileText, color: "bg-blue-500" },
  { name: "File & Format", count: 6, icon: Code, color: "bg-green-500" },
  { name: "Developer Tools", count: 6, icon: Zap, color: "bg-purple-500" },
  { name: "Time & Schedule", count: 3, icon: Clock, color: "bg-orange-500" },
  { name: "Network & Web", count: 3, icon: Globe, color: "bg-red-500" },
  { name: "Frontend/UX", count: 3, icon: Palette, color: "bg-pink-500" }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <a href="/" className="hover:text-slate-700">Home</a>
          <span>→</span>
          <span className="text-slate-900">All Tools</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">All Developer Tools</h1>
          <p className="text-xl text-slate-600 mb-6">
            Browse our complete collection of {allTools.length} developer utilities
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                <Badge variant="secondary" className="text-xs">
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
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 hover:border-slate-300 hover:-translate-y-1"
              onClick={() => window.location.href = tool.route}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-200">
                    <tool.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                  <div className="flex gap-2">
                    {!tool.implemented && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-900 transition-colors">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {tool.category}
                  </Badge>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
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
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No tools found</h3>
            <p className="text-slate-500">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
