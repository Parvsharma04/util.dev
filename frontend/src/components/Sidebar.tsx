
import { useState } from "react";
import { X, FileText, Code, Zap, Clock, Globe, Palette, Home, Settings, Info, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const toolCategories = [
  {
    name: "Text & String Utilities",
    icon: FileText,
    count: 9,
    tools: [
      { name: "JSON Formatter", route: "/tools/json-formatter" },
      { name: "Base64 Encoder/Decoder", route: "/tools/base64" }, 
      { name: "URL Encoder/Decoder", route: "/tools/url-encoder" },
      { name: "String Case Converter", route: "/tools/string-case" },
      { name: "JWT Decoder", route: "/tools/jwt-decoder" },
      { name: "Hash Generator", route: "/tools/hash-generator" },
      { name: "UUID Generator", route: "/tools/uuid-generator" },
      { name: "Regex Tester", route: "/tools/regex-tester" },
      { name: "Lorem Ipsum Generator", route: "/tools/lorem-ipsum" }
    ]
  },
  {
    name: "File & Format Utilities",
    icon: Code,
    count: 6,
    tools: [
      { name: "File Converter", route: "/tools/file-converter" },
      { name: "Markdown ↔ HTML", route: "/tools/md-html-converter" },
      { name: "CSV Parser", route: "/tools/csv-parser" },
      { name: "Text Diff Checker", route: "/tools/text-diff" },
      { name: "JSON Merge Tool", route: "/tools/json-merge" },
      { name: "YAML ↔ JSON", route: "/tools/yaml-json" }
    ]
  },
  {
    name: "Developer-Specific Tools",
    icon: Zap,
    count: 6,
    tools: [
      { name: ".env Formatter", route: "/tools/env-formatter" },
      { name: "Gitignore Generator", route: "/tools/gitignore-generator" },
      { name: "HTTP Request Tester", route: "/tools/http-tester" },
      { name: "Dockerfile Generator", route: "/tools/dockerfile-generator" },
      { name: "Timestamp Converter", route: "/tools/timestamp" },
      { name: "Code Minifier/Beautifier", route: "/tools/code-beautifier" }
    ]
  },
  {
    name: "Time & Schedule",
    icon: Clock,
    count: 3,
    tools: [
      { name: "Cron Expression Helper", route: "/tools/cron-helper" },
      { name: "Timezone Converter", route: "/tools/timezone" },
      { name: "Countdown Timer", route: "/tools/countdown" }
    ]
  },
  {
    name: "Network & Web Tools",
    icon: Globe,
    count: 3,
    tools: [
      { name: "IP & DNS Lookup", route: "/tools/ip-lookup" },
      { name: "Ping / Traceroute Visualizer", route: "/tools/network-tools" },
      { name: "User Agent Parser", route: "/tools/user-agent" }
    ]
  },
  {
    name: "Frontend/UX Helpers",
    icon: Palette,
    count: 3,
    tools: [
      { name: "Color Converter", route: "/tools/color-converter" },
      { name: "Font Previewer", route: "/tools/font-previewer" },
      { name: "Favicon Generator", route: "/tools/favicon-generator" }
    ]
  },
  {
    name: "AI & LLM Tools",
    icon: Zap,
    count: 4,
    tools: [
      { name: "Token Counter", route: "/tools/token-counter" },
      { name: "JSON → TOON", route: "/tools/json-to-toon" },
      { name: "YAML → TOON", route: "/tools/yaml-to-toon" },
      { name: "Prompt Optimizer", route: "/tools/prompt-optimizer" }
    ]
  }
];

const mainNavItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "All Tools", icon: Code, href: "/tools" },
  { name: "Settings", icon: Settings, href: "/settings" },
  { name: "About", icon: Info, href: "/about" }
];

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-sidebar-foreground font-mono glow">util.dev</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Main Navigation */}
              <div className="mb-6">
                <nav className="space-y-1">
                  {mainNavItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors font-mono"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </a>
                  ))}
                </nav>
              </div>

              <Separator className="mb-6 bg-sidebar-border" />

              {/* Tool Categories */}
              <div className="space-y-2">
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
                  Tool Categories
                </h3>
                {toolCategories.map((category) => (
                  <div key={category.name}>
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className="w-4 h-4" />
                        <span className="truncate font-mono text-xs">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-sidebar-accent text-sidebar-foreground border-sidebar-border font-mono">
                          {category.count}
                        </Badge>
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            expandedCategories.includes(category.name) ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                    
                    {expandedCategories.includes(category.name) && (
                      <div className="ml-7 mt-1 space-y-1">
                        {category.tools.map((tool) => (
                          <a
                            key={tool.name}
                            href={tool.route}
                            className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded transition-colors font-mono text-xs"
                          >
                            {tool.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-muted-foreground text-center font-mono">
              <p className="glow">util.dev v1.0</p>
              <p className="mt-1">Fast tools. Clean UI. Zero nonsense.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
