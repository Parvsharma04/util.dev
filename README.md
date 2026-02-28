# util.dev 🔧

> **All the tools you need. None of the fluff.**

util.dev is a **developer-first utility hub** — fast, minimal, offline-capable, and opinionated. It brings together 38 essential developer tools into a single, clean workspace with a terminal-inspired aesthetic. No ads, no auth walls, no unnecessary abstraction.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend (Optional)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API will be available at `http://localhost:3001`

---

## 🎨 Theme System

util.dev features a terminal-inspired, multi-mode theme system:

| Mode | Description |
|------|-------------|
| **Terminal** | Green on black, hacker aesthetic (default) |
| **Dark** | Low-contrast for night sessions |
| **Light** | Clean and bright for daytime use |
| **System** | Follows your OS preference |

Toggle themes using the theme switcher in the header. Powered by `next-themes`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + K` | Open Command Palette |
| `⌘/Ctrl + B` | Toggle Sidebar |

---

## 🧰 Tools Directory — 38 Implemented Tools

All tools are fully client-side (except where noted), meaning your data never leaves your browser. Every tool shares a common layout system (`ToolLayout`) with breadcrumb navigation, consistent header design, and a unified theming system via `shadcn/ui` + Radix primitives.

---

### 📝 Text & String Utilities *(9 tools)*

#### JSON Formatter
> `/tools/json-formatter`

Prettify, minify, and validate JSON with syntax highlighting. Supports 2-space and 4-space indentation, validation with detailed error messages, copy-to-clipboard, and file download.

- **Features**: Format, minify, validate, error detection, copy & download
- **Key Libraries**: Native `JSON.parse` / `JSON.stringify`

#### Base64 Encoder/Decoder
> `/tools/base64-encoder`

Encode and decode Base64 strings and files. Supports both text and file-based encoding with automatic detection of input type.

- **Features**: Text encode/decode, file support, auto-detection
- **Key Libraries**: Native `btoa` / `atob`

#### URL Encoder/Decoder
> `/tools/url-encoder`

Encode and decode URLs for safe transmission. Handles component-level encoding and full URL encoding with real-time conversion.

- **Features**: Component encoding, full URL encoding, real-time conversion
- **Key Libraries**: Native `encodeURIComponent` / `decodeURIComponent`

#### String Case Converter
> `/tools/string-case`

Convert text between different cases: camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE, Title Case, and more.

- **Features**: 8+ case conversions, bulk processing, one-click copy

#### JWT Decoder
> `/tools/jwt-decoder`

Decode and inspect JWT tokens without verification. Displays header, payload, and signature components with pretty-printed JSON output and expiration detection.

- **Features**: Header/payload inspection, expiration check, base64url decoding
- **Key Libraries**: Native Base64 decoding

#### Hash Generator
> `/tools/hash-generator`

Generate cryptographic hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms. Supports text input with instant hash computation.

- **Features**: Multiple algorithms (MD5, SHA-1, SHA-256, SHA-512), copy output
- **Key Libraries**: Web Crypto API

#### UUID Generator
> `/tools/uuid-generator`

Generate UUIDs in v1 (timestamp-based), v4 (random), and v5 (namespace) formats with customizable options including bulk generation.

- **Features**: v1/v4/v5 generation, bulk generation, uppercasing
- **Key Libraries**: `uuid`

#### Regex Tester
> `/tools/regex-tester`

Test regular expressions with real-time matching and highlighting. Supports global, case-insensitive, multiline, and other flags with match group display.

- **Features**: Real-time matching, flag toggles, match highlighting, capture group display
- **Key Libraries**: Native `RegExp`

#### Lorem Ipsum Generator
> `/tools/lorem-ipsum`

Generate placeholder text for your projects. Customize output by paragraphs, sentences, or words with multiple style options.

- **Features**: Paragraph/sentence/word count, multiple styles, copy output

---

### 📂 File & Format Utilities *(6 tools)*

#### File Converter
> `/tools/file-converter`

Convert between different file formats. General-purpose file format conversion utility.

- **Features**: Multi-format support, drag-and-drop upload

#### Markdown ↔ HTML
> `/tools/markdown-html`

Bi-directional conversion between Markdown and HTML. Real-time preview with split-pane editor showing both source and rendered output.

- **Features**: Live preview, bidirectional conversion, copy & download

#### CSV Parser & Viewer
> `/tools/csv-parser`

Parse CSV data into an interactive table view and convert to JSON. Supports file upload and clipboard paste with automatic header detection.

- **Features**: Table preview, JSON conversion, file upload, auto header detection
- **Key Libraries**: Custom CSV parser

#### YAML ↔ JSON
> `/tools/yaml-json`

Convert between YAML and JSON formats with proper indentation and error reporting. Supports bi-directional conversion.

- **Features**: Bidirectional conversion, error messages, formatting options
- **Key Libraries**: `yaml`

#### Text Diff Checker
> `/tools/text-diff`

Compare two blocks of text and visualize the differences with inline highlighting. Shows additions, deletions, and unchanged lines.

- **Features**: Side-by-side diff, inline highlighting, line numbers

#### JSON Merge Tool
> `/tools/json-merge`

Compare and merge two JSON objects with conflict resolution. Shows structural differences and allows selective merging.

- **Features**: Deep merge, conflict detection, selective merge, diff view

---

### 🛠️ Developer Tools *(8 tools)*

#### .env Formatter
> `/tools/env-formatter`

Format and organize environment variable files. Sort, group, validate, and clean `.env` files with duplicate detection.

- **Features**: Sort, group by prefix, duplicate detection, comment preservation

#### Gitignore Generator
> `/tools/gitignore-generator`

Generate `.gitignore` files from a curated library of templates covering popular languages, frameworks, and IDEs.

- **Features**: Template library (Node, Python, Java, etc.), custom rules, preview

#### HTTP Request Tester
> `/tools/http-tester`

Test API endpoints with custom HTTP methods, headers, body, and query parameters. Displays response status, headers, body, and timing.

- **Features**: GET/POST/PUT/DELETE/PATCH, custom headers, body editor, response inspector

#### Dockerfile Generator
> `/tools/dockerfile-generator`

Generate Dockerfiles for your applications based on language, framework, and deployment target selections.

- **Features**: Multi-language support, multi-stage builds, optimized templates

#### Timestamp Converter
> `/tools/timestamp-converter`

Convert UNIX timestamps to human-readable dates and vice versa. Supports seconds and milliseconds with live "now" display.

- **Features**: Unix ↔ human-readable, seconds/milliseconds, timezone display, live clock

#### Code Beautifier / Minifier
> `/tools/code-beautifier`

Beautify and minify code across multiple languages including JavaScript, HTML, CSS, and JSON.

- **Features**: Multi-language support, beautify & minify modes, indent options

#### SQL Formatter
> `/tools/sql-formatter`

Format and beautify raw SQL queries with proper indentation, keyword uppercasing, and syntax standardization.

- **Features**: Keyword uppercasing, indentation, multi-dialect support
- **Key Libraries**: `sql-formatter`

#### cURL Converter
> `/tools/curl-converter`

Convert cURL commands to JavaScript Fetch API or Axios code. Uses server-side processing via Next.js Server Actions for native shell parsing.

- **Features**: Fetch API and Axios output, server-side parsing
- **Key Libraries**: `curlconverter` (externalized via `serverExternalPackages` for native `tree-sitter-bash` compatibility)
- **Architecture**: Uses Next.js Server Actions (`"use server"`) with dynamic imports

---

### ⏰ Time & Schedule *(3 tools)*

#### Cron Expression Helper
> `/tools/cron-helper`

Create and understand cron expressions with a visual builder. Shows human-readable descriptions and next scheduled run times.

- **Features**: Visual builder, human-readable output, next-run predictions, common presets

#### Timezone Converter
> `/tools/timezone-converter`

Convert times between different timezones. Displays a world clock view with multiple timezone comparisons.

- **Features**: Multi-timezone comparison, world clock, daylight saving awareness
- **Key Libraries**: `date-fns`

#### Countdown Timer
> `/tools/countdown-timer`

Create configurable countdown timers with visual progress display and notification support.

- **Features**: Custom duration, visual progress, audio notifications

---

### 🌐 Network & Web *(3 tools)*

#### IP & DNS Lookup (Network Intelligence)
> `/tools/ip-lookup`

Deep geolocation tracking and multi-tier DNS resolution probe. Displays IP geolocation data (city, region, country, ISP, ASN) and DNS records (A, AAAA, MX, TXT, NS) with a polished command-center UI.

- **Features**: IP geolocation, DNS record resolution, VPN/proxy/TOR detection, registrar info
- **Architecture**: Client-side simulation (mock data for demo)

#### Network Tools
> `/tools/network-tools`

Ping and traceroute visualization tools. Simulates network diagnostics with animated progress, latency statistics, packet loss calculation, and hop-by-hop route display.

- **Features**: Ping simulation (10 packets), traceroute visualization, average latency, packet loss %
- **Architecture**: Client-side simulation with animated results

#### User Agent Parser
> `/tools/user-agent-parser`

Parse and analyze user agent strings. Breaks down browser, engine, OS, device type, and bot detection from any user agent string.

- **Features**: Browser/OS/engine detection, device type identification, bot detection

---

### 🎨 Frontend / UX Helpers *(4 tools)*

#### Color Converter
> `/tools/color-converter`

Convert between HEX, RGB, and HSL color formats with a live color preview. Supports color picker input.

- **Features**: HEX/RGB/HSL conversion, live preview, color picker, copy output

#### Font Previewer
> `/tools/font-previewer`

Preview and compare Google Fonts with customizable text, size, weight, and line-height controls.

- **Features**: Google Fonts library, live preview, size/weight/line-height controls

#### Favicon Generator
> `/tools/favicon-generator`

Generate favicons for your website from text or emoji input. Creates multiple sizes for different platforms.

- **Features**: Text/emoji input, multi-size generation, download package

#### Contrast Checker
> `/tools/contrast-checker`

Check color contrast ratios against WCAG 2.1 accessibility guidelines. Shows AA/AAA compliance for normal and large text with a live preview panel.

- **Features**: WCAG AA/AAA compliance check, live preview with example buttons, real-time ratio calculation
- **Implementation**: Custom luminance and contrast ratio calculation per WCAG spec

---

### ⚡ Advanced Utilities *(1 tool)*

#### JSON to TypeScript
> `/tools/json-to-ts`

Generate strictly typed TypeScript interfaces directly from JSON input. Automatically infers types for nested objects, arrays, and primitives.

- **Features**: Interface generation, nested object support, array type inference, optional properties
- **Key Libraries**: `json-to-ts`

---

### 🤖 AI & LLM Tools *(4 tools)*

#### Token Counter
> `/tools/token-counter`

Count tokens for GPT-4, GPT-4o, GPT-3.5, Claude 3 (Opus/Sonnet/Haiku), Llama 3, and Gemini 1.5 Pro. Shows estimated API costs per model with real-time counting.

- **Features**: 8 model presets, token estimation, cost calculation ($/million tokens), character/word/line stats
- **Implementation**: Model-specific tokenizer approximations with configurable pricing

#### JSON → TOON
> `/tools/json-to-toon`

Convert JSON to TOON (Tabular Object-Oriented Notation) format for smaller LLM context windows. Shows compression statistics and byte savings.

- **Features**: JSON to TOON encoding, configurable delimiter (tab/comma/pipe), key folding, compression stats
- **Key Libraries**: `@toon-format/toon`

#### YAML → TOON
> `/tools/yaml-to-toon`

Convert YAML to TOON format for token savings in LLM pipelines. Bi-directional conversion with configurable encoding options.

- **Features**: YAML ↔ TOON conversion, delimiter selection, key folding toggle, byte size comparison
- **Key Libraries**: `@toon-format/toon`, `yaml`

#### Prompt Optimizer
> `/tools/prompt-optimizer`

Minify and optimize prompts to reduce token count while preserving meaning. Offers multiple optimization strategies that can be toggled independently.

- **Features**: Whitespace compression, filler word removal, abbreviation, instruction compaction, token savings display
- **Implementation**: Rule-based text transformations with configurable optimization passes

---

## 🏗️ Architecture

### Project Structure

```
util.dev/
├── frontend/                    # Next.js 16 application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── about/           # About page
│   │   │   ├── settings/        # Settings page
│   │   │   ├── actions/         # Server Actions (curl converter)
│   │   │   └── tools/           # 38 tool pages
│   │   │       ├── page.tsx     # Tools index (grid + search + filters)
│   │   │       ├── json-formatter/
│   │   │       ├── base64-encoder/
│   │   │       └── ...
│   │   ├── components/
│   │   │   ├── AppShell.tsx     # Main layout (header + sidebar)
│   │   │   ├── CommandPalette.tsx # ⌘K command palette
│   │   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   │   ├── ThemeToggle.tsx  # Theme switcher
│   │   │   ├── ToolLayout.tsx   # Shared tool page layout
│   │   │   └── ui/             # 49 shadcn/ui components
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/
│   │       └── tools.ts        # Tool registry (metadata, routes, categories)
│   ├── next.config.mjs         # Next.js config
│   └── package.json
│
└── backend/                     # Express.js API (optional)
    ├── src/
    └── package.json
```

### Design System

All tool pages use a consistent layout system:

1. **`AppShell`** — Global wrapper providing the navigation header, collapsible sidebar, and command palette
2. **`ToolLayout`** — Shared tool page template with breadcrumb navigation, icon, title, description, and category badge
3. **`shadcn/ui`** — 49 Radix-based UI primitives (Button, Card, Input, Textarea, Select, Switch, Tabs, Badge, Progress, Toast, etc.)
4. **`tools.ts`** — Central registry defining all tool metadata (title, description, icon, category, route, implementation status)

### Shared Capabilities

Every tool benefits from:
- ✅ Copy to clipboard
- ✅ Download output as file
- ✅ Toast notifications for actions
- ✅ Responsive layout (mobile → desktop)
- ✅ Dark/light/terminal theme support
- ✅ Accessible keyboard navigation
- ✅ Zero tracking / zero ads

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16.1.6** | React framework with Turbopack |
| **React 18.3** | UI library |
| **TypeScript 5.5** | Type safety |
| **Tailwind CSS 3.4** | Utility-first styling |
| **shadcn/ui + Radix** | Accessible component primitives |
| **next-themes** | Theme management |
| **cmdk** | Command palette |
| **lucide-react** | Icon library |
| **date-fns** | Date/time utilities |
| **recharts** | Charting library |
| **yaml** | YAML parsing/serialization |
| **sql-formatter** | SQL beautification |
| **curlconverter** | cURL → JS conversion |
| **@toon-format/toon** | TOON format encoding |
| **json-to-ts** | TypeScript type generation |

### Backend (Optional)
| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | API server |
| **TypeScript** | Type safety |
| **Helmet** | Security headers |
| **CORS** | Cross-origin support |
| **UUID** | ID generation |

---

## 📄 License

MIT

---

**Fast tools. Clean UI. Zero nonsense.** ⚡
