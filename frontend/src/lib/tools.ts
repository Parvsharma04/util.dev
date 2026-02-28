import {
    FileText,
    Code,
    Zap,
    Clock,
    Globe,
    Palette,
    Terminal,
    Database,
    Search,
    Layout,
    Type,
    Hash,
    Fingerprint,
    Regex,
    FileJson,
    FileCode,
    FileSpreadsheet,
    Diff,
    Combine,
    Braces,
    Settings2,
    Container,
    History,
    Workflow,
    MousePointer2,
    Calendar,
    Timer,
    Navigation,
    Activity,
    UserCircle,
    Pipette,
    Type as FontIcon,
    Image,
    Contrast,
    Binary
} from "lucide-react";

export interface Tool {
    title: string;
    name?: string; // For compatibility with CommandPalette/Sidebar
    description: string;
    icon: any;
    category: string;
    route: string;
    implemented: boolean;
    popular?: boolean;
}

export const allTools: Tool[] = [
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
        route: "/tools/base64-encoder",
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
        route: "/tools/markdown-html",
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
        route: "/tools/timestamp-converter",
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
    {
        title: "SQL Formatter",
        description: "Format and beautify raw SQL queries",
        icon: Database,
        category: "Developer Tools",
        route: "/tools/sql-formatter",
        implemented: true
    },
    {
        title: "cURL Converter",
        description: "Convert cURL commands to JavaScript Fetch or Axios",
        icon: Terminal,
        category: "Developer Tools",
        route: "/tools/curl-converter",
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
        route: "/tools/timezone-converter",
        implemented: true
    },
    {
        title: "Countdown Timer",
        description: "Create countdown timers",
        icon: Clock,
        category: "Time & Schedule",
        route: "/tools/countdown-timer",
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
        route: "/tools/user-agent-parser",
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
    },
    {
        title: "Contrast Checker",
        description: "Check color contrast against WCAG guidelines",
        icon: Palette,
        category: "Frontend/UX",
        route: "/tools/contrast-checker",
        implemented: true
    },

    // Advanced Utilities
    {
        title: "JSON to TypeScript",
        description: "Generate strictly typed interfaces directly from JSON",
        icon: Code,
        category: "Advanced Utilities",
        route: "/tools/json-to-ts",
        implemented: true
    },

    // AI & LLM Tools
    {
        title: "Token Counter",
        description: "Count tokens for GPT, Claude, Llama and other LLMs",
        icon: Zap,
        category: "AI & LLM",
        route: "/tools/token-counter",
        implemented: true
    },
    {
        title: "JSON → TOON",
        description: "Convert JSON to TOON format for smaller LLM context",
        icon: Zap,
        category: "AI & LLM",
        route: "/tools/json-to-toon",
        implemented: true
    },
    {
        title: "YAML → TOON",
        description: "Convert YAML to TOON format for token savings",
        icon: Zap,
        category: "AI & LLM",
        route: "/tools/yaml-to-toon",
        implemented: true
    },
    {
        title: "Prompt Optimizer",
        description: "Minify prompts to reduce token count",
        icon: Zap,
        category: "AI & LLM",
        route: "/tools/prompt-optimizer",
        implemented: true
    }
].map(tool => ({
    ...tool,
    name: tool.title // Add name field for components that expect it
}));

export const categories = [
    { name: "All", icon: Code, color: "bg-primary/20 text-primary border-primary/30", count: allTools.length },
    { name: "Text & String", icon: FileText, color: "bg-emerald-500/20 text-emerald-500 border-emerald-500/30", count: allTools.filter(t => t.category === "Text & String").length },
    { name: "File & Format", icon: Code, color: "bg-cyan-500/20 text-cyan-500 border-cyan-500/30", count: allTools.filter(t => t.category === "File & Format").length },
    { name: "Developer Tools", icon: Zap, color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30", count: allTools.filter(t => t.category === "Developer Tools").length },
    { name: "Time & Schedule", icon: Clock, color: "bg-orange-500/20 text-orange-500 border-orange-500/30", count: allTools.filter(t => t.category === "Time & Schedule").length },
    { name: "Network & Web", icon: Globe, color: "bg-red-500/20 text-red-500 border-red-500/30", count: allTools.filter(t => t.category === "Network & Web").length },
    { name: "Frontend/UX", icon: Palette, color: "bg-purple-500/20 text-purple-500 border-purple-500/30", count: allTools.filter(t => t.category === "Frontend/UX").length },
    { name: "Advanced Utilities", icon: Terminal, color: "bg-indigo-500/20 text-indigo-500 border-indigo-500/30", count: allTools.filter(t => t.category === "Advanced Utilities").length },
    { name: "AI & LLM", icon: Zap, color: "bg-pink-500/20 text-pink-500 border-pink-500/30", count: allTools.filter(t => t.category === "AI & LLM").length }
];


export const toolCategories = categories.filter(c => c.name !== "All").map(category => ({
    name: category.name,
    icon: category.icon,
    count: allTools.filter(t => t.category === category.name).length,
    tools: allTools.filter(t => t.category === category.name).map(t => ({
        name: t.title,
        route: t.route
    }))
}));
