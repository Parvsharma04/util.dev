# Technical Implementation Guide

> Deep dive into the architecture, algorithms, APIs, and design decisions behind every util.dev tool.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Component System](#component-system)
- [State Management Patterns](#state-management-patterns)
- [Tool Implementations](#tool-implementations)
  - [Text & String Utilities](#text--string-utilities)
  - [File & Format Utilities](#file--format-utilities)
  - [Developer Tools](#developer-tools)
  - [Time & Schedule](#time--schedule)
  - [Network & Web](#network--web)
  - [Frontend/UX Helpers](#frontendux-helpers)
  - [Advanced Utilities](#advanced-utilities)
  - [AI & LLM Tools](#ai--llm-tools)
- [Build Configuration](#build-configuration)
- [Third-Party Dependencies](#third-party-dependencies)

---

## Architecture Overview

### Framework

util.dev is built on **Next.js 16.1.6** using the App Router with Turbopack. All tool pages are client components (`"use client"`) since they require browser APIs (clipboard, Web Crypto, `Blob`, `FileReader`, etc.).

### Rendering Strategy

- **Static Generation (SSG)**: All 38 tool pages are statically generated at build time (`○` routes)
- **Server Actions**: Only `curl.ts` uses `"use server"` for native module access (`curlconverter`)
- **No SSR data fetching**: Tools are pure client-side — zero server round-trips during use

### File Convention

```
frontend/src/app/tools/[tool-name]/page.tsx   ← One page per tool
frontend/src/lib/tools.ts                      ← Central registry
frontend/src/components/ToolLayout.tsx          ← Shared layout wrapper
frontend/src/components/AppShell.tsx            ← Global shell (header + sidebar)
```

Every tool page follows this structure:

```tsx
"use client";

// 1. Imports (React hooks, UI components, libraries)
// 2. Helper functions (pure, declared outside component)
// 3. Component function
//    a. State declarations (useState, useEffect)
//    b. Handler functions (convert, copy, download, clear)
//    c. JSX return wrapped in <ToolLayout>
// 4. Default export
```

---

## Component System

### AppShell

**File**: `components/AppShell.tsx`

The global layout wrapper providing:

- **Sticky header** with backdrop blur (`bg-background/80 backdrop-blur-lg`)
- **Sidebar** toggle via hamburger button or `Ctrl+B`
- **Command Palette** trigger via search button or `Ctrl+K`
- **Theme Toggle** component
- **Keyboard shortcuts** registered via `useEffect` + `window.addEventListener("keydown")`

```
AppShell
├── Sidebar (sheet overlay, collapsible, 256px width)
├── CommandPalette (cmdk-based, searches all tools)
├── Header (sticky, z-40, blur backdrop)
│   ├── Menu button → toggles Sidebar
│   ├── Logo → links to /
│   ├── Search button → opens CommandPalette
│   └── ThemeToggle
└── <main> → {children}
```

### ToolLayout

**File**: `components/ToolLayout.tsx`

Wraps every tool page inside `AppShell`, providing:

- **Breadcrumb**: `Home → Tools → {title}`
- **Icon + Title + Description** header block
- **Category badge** + optional "Popular" badge
- **Children slot** for tool-specific content

**Props Interface**:
```typescript
interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  icon: LucideIcon | React.FC<any>;
  children: ReactNode;
  popular?: boolean;
}
```

### Tool Registry

**File**: `lib/tools.ts`

Central source of truth for all tool metadata. Defines:

```typescript
interface Tool {
  title: string;
  name?: string;        // Alias for CommandPalette/Sidebar compatibility
  description: string;
  icon: any;            // Lucide icon component
  category: string;
  route: string;
  implemented: boolean;
  popular?: boolean;
}
```

Exports:
- `allTools: Tool[]` — flat array of all 38 tools (+ `.map()` to add `name` field)
- `categories` — category definitions with icons, colors, and computed counts
- `toolCategories` — grouped tools by category for sidebar rendering

---

## State Management Patterns

All tools use **React local state** (`useState`) — no global state management library. Common patterns:

### Input/Output Pattern
```typescript
const [input, setInput] = useState("");
const [output, setOutput] = useState("");
const [error, setError] = useState("");
```

### Processing Pattern
```typescript
const [isProcessing, setIsProcessing] = useState(false);

const process = async () => {
  setIsProcessing(true);
  try {
    // ... computation
    setOutput(result);
    setError("");
  } catch (err) {
    setError((err as Error).message);
    setOutput("");
  } finally {
    setIsProcessing(false);
  }
};
```

### Clipboard Pattern (shared across all tools)
```typescript
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast({ title: "Copied!", description: "Output copied to clipboard" });
};
```

### File Download Pattern (shared across all tools)
```typescript
const download = (content: string, filename: string, mime: string) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## Tool Implementations

---

### Text & String Utilities

---

#### 1. JSON Formatter

**File**: `tools/json-formatter/page.tsx` (249 lines)

**Core Logic**:
- `formatJson(indent)` — `JSON.parse()` → `JSON.stringify(parsed, null, indent)`
- `minifyJson()` — `JSON.parse()` → `JSON.stringify(parsed)` (no spacing)
- `validateJson()` — Wraps `JSON.parse()` in try/catch, sets `isValid` state

**State**: `input`, `output`, `error`, `isValid: boolean | null`

**API**: Native `JSON` object — no external parser library.

**Layout**: 2-column grid (input + output), action bar above with Format/Minify/Validate/Clear buttons, 6-card feature section below.

---

#### 2. Base64 Encoder/Decoder

**File**: `tools/base64-encoder/page.tsx` (178 lines)

**Core Logic**:
- `processBase64()` — Branches on `mode` state:
  - Encode: `btoa(input)` (native browser)
  - Decode: `atob(input)` (native browser)
- Handles errors for invalid Base64 sequences

**State**: `input`, `output`, `mode: "encode" | "decode"`

**API**: Native `btoa()` / `atob()` — no external library. Limited to ASCII; UTF-8 would need `TextEncoder`.

---

#### 3. URL Encoder/Decoder

**File**: `tools/url-encoder/page.tsx` (135 lines)

**Core Logic**:
- `handleEncode()` — `encodeURIComponent(input)`
- `handleDecode()` — `decodeURIComponent(input)`

**State**: `input`, `output`, `mode: "encode" | "decode"`

**API**: Native `encodeURIComponent()` / `decodeURIComponent()`.

**UI Pattern**: Tab-based mode switching (`encode`/`decode`), 2-column input/output grid.

---

#### 4. String Case Converter

**File**: `tools/string-case/page.tsx` (128 lines)

**Core Logic** — `convertToCase(text, caseType)` uses regex transformations:

| Case | Method |
|------|--------|
| `camelCase` | `text.replace(/(?:^\w\|[A-Z]\|\b\w)/g, ...)` — first char lowercase, rest uppercase at word boundaries |
| `PascalCase` | Same regex but all uppercase at boundaries |
| `snake_case` | `text.toLowerCase().replace(/\s+/g, '_')` |
| `kebab-case` | `text.toLowerCase().replace(/\s+/g, '-')` |
| `UPPER_SNAKE_CASE` | `text.toUpperCase().replace(/\s+/g, '_')` |
| `Title Case` | `text.replace(/\w\S*/g, ...)` — capitalize first char of each word |

**UI Pattern**: 1:2 grid — input on left, all 8 case outputs rendered simultaneously on right with individual copy buttons.

---

#### 5. JWT Decoder

**File**: `tools/jwt-decoder/page.tsx` (182 lines)

**Core Logic** — `decodeJwt()`:
1. `jwt.split('.')` → validates exactly 3 parts
2. Inner `decodeBase64(str)`:
   - Pads base64url string to 4-byte boundary: `str.padEnd(str.length + (4 - str.length % 4) % 4, '=')`
   - Converts base64url → base64: `.replace(/-/g, '+').replace(/_/g, '/')`
   - Decodes: `JSON.parse(atob(padded))`
3. Outputs `{ header, payload, signature }`

**State**: `jwt: string`, `decoded: { header: any; payload: any; signature: string } | null`

**Security Note**: Decode-only — does **not** verify signatures (explicitly stated in UI).

---

#### 6. Hash Generator

**File**: `tools/hash-generator/page.tsx` (189 lines)

**Core Logic** — `generateHashes()`:
```typescript
const msgUint8 = new TextEncoder().encode(input);
const sha256Buffer = await crypto.subtle.digest("SHA-256", msgUint8);
const hash = Array.from(new Uint8Array(sha256Buffer))
  .map(b => b.toString(16).padStart(2, '0'))
  .join("");
```

**Algorithms**: SHA-1, SHA-256, SHA-512 (via `crypto.subtle.digest`)

**API**: **Web Crypto API** — hardware-accelerated, runs entirely in-browser. No MD5 (not supported by Web Crypto).

**State**: `input`, `hashes: Record<string, string>`, `isGenerating`

---

#### 7. UUID Generator

**File**: `tools/uuid-generator/page.tsx`

**Core Logic**: Uses the `uuid` npm package for standards-compliant UUID generation.

**Variants**: v1 (timestamp), v4 (random), v5 (namespace + name)

---

#### 8. Regex Tester

**File**: `tools/regex-tester/page.tsx` (54 lines)

**Core Logic**: Uses native `RegExp` constructor:
```typescript
const regex = new RegExp(pattern, flags);
```

**State**: `pattern`, `testText`, `flags` (default: `"g"`)

**Current Status**: Minimal implementation — pattern input and flag configuration are functional, but match highlighting/output display is a stub.

---

#### 9. Lorem Ipsum Generator

**File**: `tools/lorem-ipsum/page.tsx`

**Core Logic**: Custom word bank with configurable output: paragraphs, sentences, or words.

---

### File & Format Utilities

---

#### 10. CSV Parser & Viewer

**File**: `tools/csv-parser/page.tsx` (238 lines)

**Core Logic** — `parseCsv()`:
```typescript
const lines = csvInput.trim().split('\n');
const data = lines.map(line =>
  line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
);
```

- First row treated as headers for JSON conversion
- Quoted values partially handled (trims surrounding quotes)
- File upload via `FileReader.readAsText()`

**Output**: Dual view — interactive `<Table>` component (shadcn/ui) + JSON textarea

**State**: `csvInput`, `parsedData: string[][]`, `jsonOutput`

---

#### 11. YAML ↔ JSON

**File**: `tools/yaml-json/page.tsx`

**Core Logic**:
- YAML → JSON: `yaml.parse()` → `JSON.stringify(parsed, null, 2)`
- JSON → YAML: `JSON.parse()` → `yaml.stringify(parsed)`

**Library**: `yaml` (npm) — full YAML 1.2 spec support

---

#### 12. Text Diff Checker

**File**: `tools/text-diff/page.tsx` (168 lines)

**Algorithm** — `calculateDiff()`: Simple line-by-line comparison (not LCS/Myers):

```typescript
for (let i = 0; i < maxLength; i++) {
  if (originalLines[i] === modifiedLines[i]) {
    diff.push({ type: 'unchanged', content: originalLines[i] });
  } else {
    if (originalLine && !modifiedLines.includes(originalLine))
      diff.push({ type: 'removed', content: originalLine });
    if (modifiedLine && !originalLines.includes(modifiedLine))
      diff.push({ type: 'added', content: modifiedLine });
  }
}
```

**Output format**: Array of `{ type: 'added' | 'removed' | 'unchanged', content: string }`, rendered with color-coded lines (`+ green`, `- red`).

**Limitation**: This is a positional diff, not a longest-common-subsequence diff. Reordered lines may show as both added and removed.

---

#### 13. JSON Merge Tool

**File**: `tools/json-merge/page.tsx`

**Core Logic**: Deep object merge with conflict detection. Compares two JSON objects, identifies structural differences, and allows selective merging.

---

#### 14. Markdown ↔ HTML

**File**: `tools/markdown-html/page.tsx`

**Core Logic**: Bidirectional Markdown ↔ HTML conversion with live preview.

---

#### 15. File Converter

**File**: `tools/file-converter/page.tsx`

**Core Logic**: General-purpose file format conversion with drag-and-drop file upload support.

---

### Developer Tools

---

#### 16. .env Formatter

**File**: `tools/env-formatter/page.tsx`

**Core Logic**: Parses `.env` file syntax (key=value pairs), sorts alphabetically, groups by common prefixes, detects duplicates, and preserves comments.

---

#### 17. Gitignore Generator

**File**: `tools/gitignore-generator/page.tsx`

**Core Logic**: Template-based generation. Stores predefined `.gitignore` patterns for common languages/frameworks (Node.js, Python, Java, Go, etc.) and allows combining templates with custom rules.

---

#### 18. HTTP Request Tester

**File**: `tools/http-tester/page.tsx`

**Core Logic**: Uses `fetch()` API to send HTTP requests from the browser. Supports custom methods (GET/POST/PUT/DELETE/PATCH), headers, and JSON body. Displays response status, headers, body, and request duration.

**Limitation**: Subject to CORS restrictions since requests originate from the browser.

---

#### 19. Dockerfile Generator

**File**: `tools/dockerfile-generator/page.tsx` (270 lines)

**Core Logic** — `generateDockerfile()`: Template-based string builder:

```typescript
if (addMultiStage) {
  content += `FROM ${baseImage} AS builder\n`;
  content += `WORKDIR ${workDir}\n`;
  content += `COPY ${copyFiles}\n`;
  content += `RUN ${runCommands}\n`;
  content += `FROM ${baseImage} AS production\n`;
  content += `COPY --from=builder ${workDir} .\n`;
} else {
  content += `FROM ${baseImage}\n`;
  // ... single-stage template
}
```

**Options**: Base image, work directory, copy files, run commands, expose port, start command, healthcheck toggle, multi-stage toggle.

**State**: Individual `useState` for each form field (`baseImage`, `workDir`, `copyFiles`, `runCommands`, `exposePort`, `startCommand`, `addHealthcheck`, `addMultiStage`)

---

#### 20. Timestamp Converter

**File**: `tools/timestamp-converter/page.tsx` (261 lines)

**Core Logic**:
- `convertFromTimestamp(ts)` — Auto-detects seconds vs milliseconds:
  ```typescript
  const num = parseInt(ts);
  const date = num > 1e12 ? new Date(num) : new Date(num * 1000);
  ```
- `convertFromHuman(dateStr)` — `new Date(dateStr)` → extracts Unix timestamp
- `setNow()` — Sets current timestamp with `Date.now()`
- Live clock via `useEffect` + `setInterval(1000)`

**Output**: Multiple date formats (ISO 8601, UTC, locale string, Unix seconds, Unix milliseconds)

---

#### 21. Code Beautifier / Minifier

**File**: `tools/code-beautifier/page.tsx`

**Core Logic**: Multi-language beautification and minification. Supports JavaScript, HTML, CSS, and JSON.

---

#### 22. SQL Formatter

**File**: `tools/sql-formatter/page.tsx` (130 lines)

**Core Logic**:
```typescript
import { format } from "sql-formatter";

const formatted = format(input, {
  language: dialect as any,  // "sql" | "postgresql" | "mysql" | "mariadb" | "sqlite"
  keywordCase: 'upper',
});
```

**Library**: `sql-formatter` (npm) — AST-based SQL formatting.

**Dialects**: Standard SQL, PostgreSQL, MySQL, MariaDB, SQLite (via `<Select>` dropdown)

---

#### 23. cURL Converter

**File**: `tools/curl-converter/page.tsx` + `app/actions/curl.ts`

**Architecture**: This is the **only tool that uses server processing**.

```
Client (page.tsx) → Server Action (curl.ts) → curlconverter → tree-sitter-bash
```

**Server Action** (`"use server"`):
```typescript
export async function convertCurl(curl: string, mode: "fetch" | "axios") {
  const curlconverter = await import("curlconverter");  // Dynamic import
  if (mode === "fetch") return curlconverter.toBrowser(curl);
  else return curlconverter.toNodeAxios(curl);
}
```

**Build workaround**: `curlconverter` depends on `tree-sitter-bash` (native C++ Node.js addon). Turbopack cannot bundle native addons, so:
1. `next.config.mjs` declares `serverExternalPackages: ["curlconverter", "tree-sitter-bash"]`
2. The import is dynamic (`await import()`) inside the function body

---

### Time & Schedule

---

#### 24. Cron Expression Helper

**File**: `tools/cron-helper/page.tsx` (277 lines)

**Core Logic** — `generateDescription(expression)`:
1. Splits expression on whitespace, validates exactly 5 parts (`min hr dom mon dow`)
2. Builds human-readable description by interpreting each field:
   - Day of week: Maps `0-6` to day names, handles ranges (`1-5`) and lists (`1,3,5`)
   - Time: Handles wildcards (`*`), specific times, and intervals
   - Day of month, month: Numeric to human-readable
3. Concatenates and capitalizes first letter

**State**: `expression`, individual field states (`minute`, `hour`, `dayOfMonth`, `month`, `dayOfWeek`), `description`, bi-directional sync between fields and expression string.

**Common presets**: Stored as array of `{ label, expression }` objects (e.g., "Every minute" → `* * * * *`).

---

#### 25. Timezone Converter

**File**: `tools/timezone-converter/page.tsx`

**Core Logic**: Uses `date-fns` for timezone-aware date manipulation and formatting.

---

#### 26. Countdown Timer

**File**: `tools/countdown-timer/page.tsx`

**Core Logic**: `useEffect` + `setInterval(1000)` for tick-based countdown with configurable target duration.

---

### Network & Web

---

#### 27. IP & DNS Lookup (Network Intelligence)

**File**: `tools/ip-lookup/page.tsx` (313 lines)

**Architecture**: Client-side **simulation** with mock data (no real API calls). Simulates:
- IP geolocation lookup (city, region, country, lat/lng, ISP, ASN, VPN/proxy/TOR detection)
- DNS record resolution (A, AAAA, MX, TXT, NS records)

**Simulated delay**: `await new Promise(resolve => setTimeout(resolve, 1200))` for realistic loading UX.

**Layout**: 3-column grid — command entry (left), signal output (right 2 cols). Card-based display with badges, icons, and hover effects.

---

#### 28. Network Tools

**File**: `tools/network-tools/page.tsx`

**Architecture**: Client-side **simulation** with `setTimeout` chains:

**Ping simulation**:
```typescript
for (let i = 1; i <= 10; i++) {
  setTimeout(() => {
    const time = Math.random() * 100 + 10;  // 10-110ms
    const status = Math.random() > 0.1 ? "success" : "timeout";  // 90% success
    // ... push result, update progress
  }, i * 500);  // 500ms between pings
}
```

**Traceroute simulation**: 6 mocked hops with `800ms` intervals, each with 3 RTT measurements.

**Statistics**: `getAverageTime()` and `getPacketLoss()` compute from accumulated results.

---

#### 29. User Agent Parser

**File**: `tools/user-agent-parser/page.tsx`

**Core Logic**: Regex-based user agent string parsing. Extracts browser name/version, rendering engine, OS, device type, and bot detection.

---

### Frontend/UX Helpers

---

#### 30. Color Converter

**File**: `tools/color-converter/page.tsx`

**Core Logic**: Mathematical color space conversions:
- HEX → RGB: Regex extraction + `parseInt(hex, 16)`
- RGB → HSL: Standard algorithm using min/max channel values
- HSL → RGB: Sector-based hue mapping

---

#### 31. Contrast Checker

**File**: `tools/contrast-checker/page.tsx`

**Core Logic** — WCAG 2.1 contrast ratio calculation:

```typescript
// Relative luminance per WCAG 2.1
const getLuminance = (r, g, b) => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Contrast ratio
const ratio = (brightest + 0.05) / (darkest + 0.05);
```

**WCAG Thresholds**:
| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA | ≥ 4.5:1 | ≥ 3.0:1 |
| AAA | ≥ 7.0:1 | ≥ 4.5:1 |

**Live Preview**: Renders sample text (headings, paragraphs, buttons) with user-selected foreground/background colors in real-time via `useEffect`.

---

#### 32. Font Previewer

**File**: `tools/font-previewer/page.tsx`

**Core Logic**: Dynamically loads Google Fonts and renders preview text with user-configurable size, weight, letter-spacing, and line-height.

---

#### 33. Favicon Generator

**File**: `tools/favicon-generator/page.tsx`

**Core Logic**: Uses `<canvas>` API to render text/emoji onto multiple icon sizes and packages them for download.

---

### Advanced Utilities

---

#### 34. JSON to TypeScript

**File**: `tools/json-to-ts/page.tsx` (118 lines)

**Core Logic**:
```typescript
import JsonToTS from "json-to-ts";

const handleConvert = () => {
  const parsed = JSON.parse(input);
  const interfaces = JsonToTS(parsed);
  setOutput(interfaces.join("\n\n"));
};
```

**Library**: `json-to-ts` — Analyzes JSON structure and generates TypeScript `interface` declarations. Handles nested objects, arrays (infers element types), optional properties, and union types.

---

### AI & LLM Tools

---

#### 35. Token Counter

**File**: `tools/token-counter/page.tsx` (233 lines)

**Core Logic**: Model-specific token estimation with pricing:

```typescript
const tokenizers = {
  "gpt-4":          { estimate: (text) => ..., pricePerMillion: { input: 30, output: 60 } },
  "gpt-4o":         { estimate: (text) => ..., pricePerMillion: { input: 5, output: 15 } },
  "claude-3-opus":  { estimate: (text) => ..., pricePerMillion: { input: 15, output: 75 } },
  "claude-3-sonnet":{ estimate: (text) => ..., pricePerMillion: { input: 3, output: 15 } },
  "llama-3":        { estimate: (text) => ..., pricePerMillion: { input: 0, output: 0 } },
  "gemini-pro":     { estimate: (text) => ..., pricePerMillion: { input: 3.5, output: 10.5 } },
  // ...
};
```

**Models**: GPT-4, GPT-4o, GPT-3.5 Turbo, Claude 3 Opus, Claude 3.5 Sonnet, Claude 3.5 Haiku, Llama 3, Gemini 1.5 Pro

**Note**: Token counts are **approximations** (character/word-based heuristics), not exact BPE tokenization.

---

#### 36. JSON → TOON

**File**: `tools/json-to-toon/page.tsx` (311 lines)

**Core Logic**:
```typescript
import { encode, decode } from "@toon-format/toon";

// JSON → TOON
const parsed = JSON.parse(input);
const toon = encode(parsed, { indent, delimiter, keyFolding: "safe" });

// TOON → JSON
const parsed = decode(input, { indent, expandPaths: "safe" });
const json = JSON.stringify(parsed, null, 2);
```

**Options**: Delimiter (tab, comma, pipe), key folding (safe/off), indent level

**Stats**: Computes input/output byte sizes via `new Blob([text]).size` and calculates savings percentage.

---

#### 37. YAML → TOON

**File**: `tools/yaml-to-toon/page.tsx`

**Core Logic**: Same as JSON → TOON but with YAML parsing as the input step:
```typescript
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { encode, decode } from "@toon-format/toon";

// YAML → TOON
const parsed = parseYaml(input);
const toon = encode(parsed, { indent, delimiter, keyFolding });

// TOON → YAML
const parsed = decode(input, { indent, expandPaths });
const yaml = stringifyYaml(parsed, { indent: 2 });
```

---

#### 38. Prompt Optimizer

**File**: `tools/prompt-optimizer/page.tsx` (456 lines)

**Core Logic** — `optimize()`: Multi-pass text transformation pipeline:

**Pass 1 — Whitespace normalization**:
```typescript
result.replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\s+|\s+$/gm, "")
```

**Pass 2 — Redundant phrase removal** (18 patterns):
- Filler words: `please`, `kindly`, `basically`, `actually`, `just`, `really`, `very`, `quite`, `literally`
- Verbose phrases: `"in order to"` → `"to"`, `"due to the fact that"` → `"because"`, `"at this point in time"` → `"now"`, `"in the event that"` → `"if"`, etc.

**Pass 3 — Contractions** (40+ patterns):
- `"do not"` → `"don't"`, `"I would"` → `"I'd"`, `"they have"` → `"they've"`, etc.

**Pass 4 — Abbreviations** (16 patterns):
- `"for example"` → `"e.g."`, `"approximately"` → `"~"`, `"configuration"` → `"config"`, `"repository"` → `"repo"`, etc.

**Pass 5 — Bullet conversion**: `\d+[.)]\s*` → `"• "`

**Pass 6 — Markdown stripping**: Removes `**bold**`, `*italic*`, `` `code` ``, `# headers`

**Token estimation**: `estimateTokens(text)` — rough heuristic based on character/word count.

**Configuration**: Each pass is independently toggleable via `OptimizationOption[]` with checkboxes.

---

## Build Configuration

### next.config.mjs

```javascript
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["curlconverter", "tree-sitter-bash"],
};
```

The `serverExternalPackages` directive is critical — it tells Turbopack to leave `curlconverter` and `tree-sitter-bash` as Node.js `require()` calls instead of trying to bundle them. Without this, the build fails because `tree-sitter-bash` is a native C++ addon that cannot be processed as an ESM chunk.

### Build Output

All 44 routes (38 tools + 6 pages) are statically generated:

```
Route (app)            Type
/                      ○ Static
/tools                 ○ Static
/tools/json-formatter  ○ Static
/tools/curl-converter  ○ Static  ← Server Action bundled separately
...
```

---

## Third-Party Dependencies

### Core Libraries

| Package | Version | Used In | Purpose |
|---------|---------|---------|---------|
| `yaml` | ^2.8.2 | yaml-json, yaml-to-toon | YAML 1.2 parsing/serialization |
| `sql-formatter` | ^15.7.2 | sql-formatter | AST-based SQL formatting |
| `json-to-ts` | ^2.1.0 | json-to-ts | JSON → TypeScript interface generation |
| `curlconverter` | ^4.12.0 | curl-converter | cURL → Fetch/Axios code generation |
| `@toon-format/toon` | ^2.1.0 | json-to-toon, yaml-to-toon | TOON format encoding/decoding |
| `date-fns` | ^3.6.0 | timezone-converter, timestamps | Date/time manipulation |
| `uuid` | (backend) | uuid-generator | RFC-compliant UUID generation |

### UI Libraries

| Package | Purpose |
|---------|---------|
| `@radix-ui/*` (20+ packages) | Accessible, unstyled UI primitives |
| `cmdk` ^1.0.0 | Command palette (`Ctrl+K`) |
| `lucide-react` ^0.462.0 | Icon library (100+ icons used) |
| `next-themes` ^0.3.0 | Theme management (dark/light/system) |
| `tailwindcss-animate` ^1.0.7 | CSS animation utilities |
| `recharts` ^2.12.7 | Chart/graph rendering |
| `sonner` ^1.5.0 | Toast notification system |
| `class-variance-authority` ^0.7.1 | Component variant management |
| `tailwind-merge` ^2.5.2 | Tailwind class deduplication |

### Browser APIs Used

| API | Used In |
|-----|---------|
| `crypto.subtle.digest()` | Hash Generator (SHA-1, SHA-256, SHA-512) |
| `navigator.clipboard.writeText()` | All tools (copy to clipboard) |
| `Blob` + `URL.createObjectURL()` | All tools (file download) |
| `FileReader.readAsText()` | CSV Parser (file upload) |
| `TextEncoder` | Hash Generator (string → Uint8Array) |
| `atob()` / `btoa()` | Base64 Encoder, JWT Decoder |
| `setInterval()` | Timestamp Converter (live clock), Countdown Timer |
| `<canvas>` | Favicon Generator |

---

*Last updated: February 2026*
