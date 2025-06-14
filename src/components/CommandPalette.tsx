
import { useState, useEffect } from "react";
import { Search, FileText, Code, Zap, Clock, Globe, Palette, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const allTools = [
  // Text & String Utilities
  { name: "JSON Formatter", category: "Text & String", icon: Code, description: "Prettify, minify, and validate JSON", route: "/tools/json-formatter" },
  { name: "Base64 Encoder/Decoder", category: "Text & String", icon: FileText, description: "Encode and decode Base64 strings", route: "/tools/base64" },
  { name: "URL Encoder/Decoder", category: "Text & String", icon: FileText, description: "Encode and decode URLs", route: "/tools/url-encoder" },
  { name: "String Case Converter", category: "Text & String", icon: FileText, description: "Convert between different cases", route: "/tools/string-case" },
  { name: "JWT Decoder", category: "Text & String", icon: Code, description: "Decode JWT tokens", route: "/tools/jwt-decoder" },
  { name: "Hash Generator", category: "Text & String", icon: Code, description: "Generate MD5, SHA1, SHA256 hashes", route: "/tools/hash-generator" },
  { name: "UUID Generator", category: "Text & String", icon: Zap, description: "Generate UUIDs v1, v4, v5", route: "/tools/uuid-generator" },
  { name: "Regex Tester", category: "Text & String", icon: Code, description: "Test regular expressions", route: "/tools/regex-tester" },
  { name: "Lorem Ipsum Generator", category: "Text & String", icon: FileText, description: "Generate placeholder text", route: "/tools/lorem-ipsum" },
  
  // File & Format Utilities
  { name: "File Converter", category: "File & Format", icon: Code, description: "Convert between file formats", route: "/tools/file-converter" },
  { name: "Markdown ↔ HTML", category: "File & Format", icon: FileText, description: "Convert Markdown to HTML", route: "/tools/md-html-converter" },
  { name: "CSV Parser", category: "File & Format", icon: FileText, description: "Parse and convert CSV files", route: "/tools/csv-parser" },
  { name: "Text Diff Checker", category: "File & Format", icon: Code, description: "Compare text differences", route: "/tools/text-diff" },
  { name: "JSON Merge Tool", category: "File & Format", icon: Code, description: "Merge JSON objects", route: "/tools/json-merge" },
  { name: "YAML ↔ JSON", category: "File & Format", icon: Code, description: "Convert YAML to JSON", route: "/tools/yaml-json" },
  
  // Developer Tools
  { name: ".env Formatter", category: "Developer Tools", icon: Zap, description: "Format environment files", route: "/tools/env-formatter" },
  { name: "Gitignore Generator", category: "Developer Tools", icon: Code, description: "Generate .gitignore files", route: "/tools/gitignore-generator" },
  { name: "HTTP Request Tester", category: "Developer Tools", icon: Globe, description: "Test HTTP requests", route: "/tools/http-tester" },
  { name: "Dockerfile Generator", category: "Developer Tools", icon: Code, description: "Generate Dockerfiles", route: "/tools/dockerfile-generator" },
  { name: "Timestamp Converter", category: "Developer Tools", icon: Clock, description: "Convert timestamps", route: "/tools/timestamp" },
  { name: "Code Minifier/Beautifier", category: "Developer Tools", icon: Code, description: "Minify and beautify code", route: "/tools/code-beautifier" },
  
  // Time & Schedule
  { name: "Cron Expression Helper", category: "Time & Schedule", icon: Clock, description: "Create cron expressions", route: "/tools/cron-helper" },
  { name: "Timezone Converter", category: "Time & Schedule", icon: Clock, description: "Convert between timezones", route: "/tools/timezone" },
  { name: "Countdown Timer", category: "Time & Schedule", icon: Clock, description: "Create countdown timers", route: "/tools/countdown" },
  
  // Network & Web Tools
  { name: "IP & DNS Lookup", category: "Network & Web", icon: Globe, description: "Lookup IP and DNS information", route: "/tools/ip-lookup" },
  { name: "Ping / Traceroute Visualizer", category: "Network & Web", icon: Globe, description: "Visualize network paths", route: "/tools/network-tools" },
  { name: "User Agent Parser", category: "Network & Web", icon: Globe, description: "Parse user agent strings", route: "/tools/user-agent" },
  
  // Frontend/UX Helpers
  { name: "Color Converter", category: "Frontend/UX", icon: Palette, description: "Convert between color formats", route: "/tools/color-converter" },
  { name: "Font Previewer", category: "Frontend/UX", icon: Palette, description: "Preview and compare fonts", route: "/tools/font-previewer" },
  { name: "Favicon Generator", category: "Frontend/UX", icon: Palette, description: "Generate favicons", route: "/tools/favicon-generator" }
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredTools = allTools.filter(tool =>
    tool.name.toLowerCase().includes(search.toLowerCase()) ||
    tool.description.toLowerCase().includes(search.toLowerCase()) ||
    tool.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredTools.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          window.location.href = filteredTools[selectedIndex].route;
          onOpenChange(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, filteredTools, onOpenChange]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl">
        <div className="flex flex-col max-h-[80vh]">
          {/* Search Input */}
          <div className="flex items-center border-b border-slate-200 px-4 py-3">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent text-lg focus:ring-0 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {filteredTools.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium mb-2">No tools found</p>
                <p className="text-sm">Try searching with different keywords</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredTools.map((tool, index) => (
                  <button
                    key={tool.route}
                    onClick={() => {
                      window.location.href = tool.route;
                      onOpenChange(false);
                    }}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${
                      index === selectedIndex 
                        ? 'bg-blue-50 border-blue-200 border' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      index === selectedIndex 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900 truncate">
                          {tool.name}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${
                      index === selectedIndex ? 'text-blue-600' : 'text-slate-400'
                    }`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span>Search by</span>
                <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600">⌘K</kbd>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
