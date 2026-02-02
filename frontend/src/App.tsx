
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Tools from "./pages/Tools";
import Settings from "./pages/Settings";
import About from "./pages/About";
import JsonFormatter from "./pages/tools/JsonFormatter";
import Base64Encoder from "./pages/tools/Base64Encoder";
import UrlEncoder from "./pages/tools/UrlEncoder";
import StringCase from "./pages/tools/StringCase";
import JwtDecoder from "./pages/tools/JwtDecoder";
import HashGenerator from "./pages/tools/HashGenerator";
import UuidGenerator from "./pages/tools/UuidGenerator";
import RegexTester from "./pages/tools/RegexTester";
import LoremIpsum from "./pages/tools/LoremIpsum";
import FileConverter from "./pages/tools/FileConverter";
import MarkdownHtml from "./pages/tools/MarkdownHtml";
import CsvParser from "./pages/tools/CsvParser";
import TextDiff from "./pages/tools/TextDiff";
import JsonMerge from "./pages/tools/JsonMerge";
import YamlJson from "./pages/tools/YamlJson";
import EnvFormatter from "./pages/tools/EnvFormatter";
import GitignoreGenerator from "./pages/tools/GitignoreGenerator";
import HttpTester from "./pages/tools/HttpTester";
import DockerfileGenerator from "./pages/tools/DockerfileGenerator";
import TimestampConverter from "./pages/tools/TimestampConverter";
import CodeBeautifier from "./pages/tools/CodeBeautifier";
import CronHelper from "./pages/tools/CronHelper";
import TimezoneConverter from "./pages/tools/TimezoneConverter";
import CountdownTimer from "./pages/tools/CountdownTimer";
import IpLookup from "./pages/tools/IpLookup";
import NetworkTools from "./pages/tools/NetworkTools";
import UserAgentParser from "./pages/tools/UserAgentParser";
import ColorConverter from "./pages/tools/ColorConverter";
import FontPreviewer from "./pages/tools/FontPreviewer";
import FaviconGenerator from "./pages/tools/FaviconGenerator";
import TokenCounter from "./pages/tools/TokenCounter";
import JsonToToon from "./pages/tools/JsonToToon";
import YamlToToon from "./pages/tools/YamlToToon";
import PromptOptimizer from "./pages/tools/PromptOptimizer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          
            {/* Text & String Utilities */}
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/base64" element={<Base64Encoder />} />
          <Route path="/tools/url-encoder" element={<UrlEncoder />} />
          <Route path="/tools/string-case" element={<StringCase />} />
          <Route path="/tools/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/tools/hash-generator" element={<HashGenerator />} />
          <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
          <Route path="/tools/regex-tester" element={<RegexTester />} />
          <Route path="/tools/lorem-ipsum" element={<LoremIpsum />} />
          
          {/* File & Format Utilities */}
          <Route path="/tools/file-converter" element={<FileConverter />} />
          <Route path="/tools/md-html-converter" element={<MarkdownHtml />} />
          <Route path="/tools/csv-parser" element={<CsvParser />} />
          <Route path="/tools/text-diff" element={<TextDiff />} />
          <Route path="/tools/json-merge" element={<JsonMerge />} />
          <Route path="/tools/yaml-json" element={<YamlJson />} />
          
          {/* Developer Tools */}
          <Route path="/tools/env-formatter" element={<EnvFormatter />} />
          <Route path="/tools/gitignore-generator" element={<GitignoreGenerator />} />
          <Route path="/tools/http-tester" element={<HttpTester />} />
          <Route path="/tools/dockerfile-generator" element={<DockerfileGenerator />} />
          <Route path="/tools/timestamp" element={<TimestampConverter />} />
          <Route path="/tools/code-beautifier" element={<CodeBeautifier />} />
          
          {/* Time & Schedule */}
          <Route path="/tools/cron-helper" element={<CronHelper />} />
          <Route path="/tools/timezone" element={<TimezoneConverter />} />
          <Route path="/tools/countdown" element={<CountdownTimer />} />
          
          {/* Network & Web Tools */}
          <Route path="/tools/ip-lookup" element={<IpLookup />} />
          <Route path="/tools/network-tools" element={<NetworkTools />} />
          <Route path="/tools/user-agent" element={<UserAgentParser />} />
          
          {/* Frontend/UX Helpers */}
          <Route path="/tools/color-converter" element={<ColorConverter />} />
          <Route path="/tools/font-previewer" element={<FontPreviewer />} />
          <Route path="/tools/favicon-generator" element={<FaviconGenerator />} />
          
          {/* AI & LLM Tools */}
          <Route path="/tools/token-counter" element={<TokenCounter />} />
          <Route path="/tools/json-to-toon" element={<JsonToToon />} />
          <Route path="/tools/yaml-to-toon" element={<YamlToToon />} />
          <Route path="/tools/prompt-optimizer" element={<PromptOptimizer />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
</QueryClientProvider>
);

export default App;
