# util.dev 🔧✨

> **All the tools you need. None of the fluff.**

util.dev is a **developer-first utility hub** — fast, minimal, offline-capable, and opinionated. It brings together the tools developers reach for every day, without ads, auth walls, or unnecessary abstraction.

Think: *lovable.dev–level polish* for practical dev utilities.

---

## 🧠 Product Vision

Developers constantly context-switch between:

* random one-off websites
* terminal scripts
* browser extensions
* outdated tools with bad UX

**util.dev exists to centralize essential developer utilities into a single, clean workspace that feels instant, trustworthy, and calm.**

### North Star

> Finish the task before your coffee cools.

---

## 🎯 Target Audience

### Primary

* Frontend & backend developers
* Indie hackers & startup engineers
* Students & interview preppers

### Secondary

* Designers working with code
* Technical PMs

### Explicitly Not For

* Enterprise workflow orchestration
* Paid SaaS dashboards
* Heavy analytics or tracking platforms

---

## 🧩 Product Principles

### 1. Speed Is the Feature

* Instant load times
* Tools usable without sign-in
* Zero unnecessary clicks

### 2. Minimal UI, Maximum Utility

* One tool, one job
* No nested complexity
* Keyboard-first interactions

### 3. Local-First & Private

* Inputs never leave the browser by default
* Offline support where possible
* No data retention

### 4. Developer Taste

* Clean typography
* Neutral, low-contrast color palette
* Calm, deliberate motion

---

## 🗺️ Information Architecture

### Core Routes

* `/` — Home (search, featured tools, quick access)
* `/tools` — All tools (grid + category filters)
* `/tools/[slug]` — Individual tool pages
* `/favorites` — Bookmarked tools (local-first)
* `/settings` — Theme, shortcuts, preferences
* `/about` — Philosophy, changelog, GitHub
* `/feedback` — GitHub issues / contact

---

## 🧰 Tool Categories & Scope

### 1. Text & String Utilities

* JSON Formatter / Validator
* Base64 Encoder / Decoder (text & files)
* URL Encoder / Decoder
* String Case Converter
* JWT Decoder
* Hash Generator (MD5, SHA1, SHA256)
* UUID Generator (v1 / v4 / v5)
* Regex Tester
* Lorem Ipsum Generator

### 2. File & Format Utilities

* CSV ↔ JSON / XML
* Markdown ↔ HTML (live preview)
* YAML ↔ JSON
* Text Diff Checker
* JSON Merge Tool
* File Preview & Export

### 3. Developer Utilities

* `.env` Formatter & Validator
* Gitignore Generator
* HTTP Request Tester (Postman-lite)
* Dockerfile Generator
* Timestamp Converter
* Code Beautifier / Minifier (JS, CSS, HTML)

### 4. Time & Scheduling

* Cron Expression Helper
* Timezone Converter
* Countdown / Shareable Timers

### 5. Network & Web

* IP & DNS Lookup
* Header Inspector
* User Agent Parser
* Ping / Traceroute Visualizer (frontend-only)

### 6. Frontend & UX Helpers

* Color Converter (HEX / RGB / HSL)
* Contrast Checker (WCAG)
* Font Previewer
* Favicon Generator

---

## 🔥 Advanced & Modern Utilities (Planned)

* **JSON → Type / DTO Generator** (TypeScript, Zod, Go, Java)
* **JSON → Form / UI Generator**
* **Token Counter** (LLM-aware: GPT, Claude, etc.)
* **Prompt Cleaner & Formatter**
* **cURL → Fetch / Axios Converter**
* **SQL Formatter**
* **Mock API Generator**
* **Bulk UUID Generator**

---

## 🎨 UI & Design System

### Visual Style

* Neutral grayscale foundation
* Single restrained accent color
* Soft shadows, no harsh borders
* Rounded corners (subtle, not playful)

### Layout

* Collapsible sidebar grouped by category
* Centered tool workspace
* Breadcrumb navigation (Tools → Category → Tool)

### Interaction Patterns

* Command Palette (`Ctrl + K`)
* Keyboard shortcuts surfaced inline
* Toasts for copy / save success
* Tabbed views for dual tools (encode/decode)

### Theme System

* Light / Dark / System modes
* Token-based theming
* Smooth, non-distracting transitions

---

## ⚙️ Shared Capabilities Across Tools

* Copy & download outputs
* Drag-and-drop file upload
* URL state persistence (`?input=`)
* Offline caching via Service Workers
* Local favorites (no auth required)
* Zero ads, zero popups

---

## 🛠️ Technical Scope

### Frontend Stack

* React + TypeScript
* Vite
* Tailwind CSS (tokenized)
* shadcn/ui + Radix
* Lucide / Tabler icons

### Architecture

* Tool modules isolated & lazy-loaded
* Shared UI primitives
* Local storage abstraction
* Client-side caching

### Optional Backend (Future)

* Account sync for favorites
* Privacy-first analytics
* Tool usage insights (aggregated only)

---

## 📈 Success Metrics

### Product Health

* Time to first tool use (<2s)
* Tools used per session
* Return visits

### Community

* GitHub stars & forks
* Issues & PRs opened
* External references

---

## 🔒 Boundaries & Ethics

util.dev will **never**:

* Force login to use tools
* Collect or store private input data
* Inject ads or affiliate links
* Obscure simple tasks with abstractions

---

## 🌱 Long-Term Vision

util.dev becomes:

* A trusted daily dev companion
* A replacement for bookmarks
* A visual Swiss Army knife for developers

Not a growth-hacked SaaS —
but a product developers quietly depend on.

---

## ✨ Product Mantra

> **Fast tools. Clean UI. Zero nonsense.**

If a developer thinks:

> *“Yep. This is staying bookmarked.”*

Then util.dev has succeeded. 🧠✨
