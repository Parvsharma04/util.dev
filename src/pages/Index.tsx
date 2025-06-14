
import { useState } from "react";
import { Search, Command, Zap, Code, FileText, Clock, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";

const featuredTools = [
  {
    title: "JSON Formatter",
    description: "Prettify, minify, and validate JSON with syntax highlighting",
    icon: Code,
    category: "Text & String",
    route: "/tools/json-formatter",
    popular: true
  },
  {
    title: "Base64 Encoder",
    description: "Encode and decode Base64 strings and files",
    icon: FileText,
    category: "Text & String",
    route: "/tools/base64",
    popular: true
  },
  {
    title: "Color Converter",
    description: "Convert between HEX, RGB, HSL color formats",
    icon: Palette,
    category: "Frontend/UX",
    route: "/tools/color-converter",
    popular: false
  },
  {
    title: "Timestamp Converter",
    description: "Convert UNIX timestamps to human readable dates",
    icon: Clock,
    category: "Developer Tools",
    route: "/tools/timestamp",
    popular: true
  },
  {
    title: "UUID Generator",
    description: "Generate UUIDs v1, v4, v5 with customizable options",
    icon: Zap,
    category: "Text & String",
    route: "/tools/uuid-generator",
    popular: true
  },
  {
    title: "HTTP Request Tester",
    description: "Test API endpoints with custom headers and body",
    icon: Globe,
    category: "Developer Tools",
    route: "/tools/http-tester",
    popular: false
  }
];

const categories = [
  { name: "Text & String", count: 9, icon: FileText, color: "bg-blue-500" },
  { name: "File & Format", count: 6, icon: Code, color: "bg-green-500" },
  { name: "Developer Tools", count: 6, icon: Zap, color: "bg-purple-500" },
  { name: "Time & Schedule", count: 3, icon: Clock, color: "bg-orange-500" },
  { name: "Network & Web", count: 3, icon: Globe, color: "bg-red-500" },
  { name: "Frontend/UX", count: 3, icon: Palette, color: "bg-pink-500" }
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = featuredTools.filter(tool =>
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hover:bg-slate-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                      DevKit Hub
                    </h1>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCommandOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search tools...</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCommandOpen(true)}
                  className="sm:hidden"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 blur-3xl"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-fade-in">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">
                All the tools you need. None of the fluff.
              </Badge>
              <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6">
                Developer Tools
                <br />
                <span className="text-3xl sm:text-5xl">Made Simple</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                A comprehensive collection of developer utilities designed for speed, simplicity, and reliability. 
                Everything you need in one beautiful interface.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <div className="relative max-w-md mx-auto sm:mx-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button 
                  size="lg" 
                  onClick={() => setCommandOpen(true)}
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
                >
                  <Command className="w-5 h-5 mr-2" />
                  Open Command Palette
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card key={category.name} className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-slate-200 hover:border-slate-300" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-500">{category.count} tools</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Tools */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {searchQuery ? `Search Results (${filteredTools.length})` : 'Featured Tools'}
            </h2>
            <Button variant="outline" className="hover:bg-slate-50">
              View All Tools
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => (
              <Card 
                key={tool.title} 
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200 hover:border-slate-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors duration-200">
                      <tool.icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                    </div>
                    {tool.popular && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                        Popular
                      </Badge>
                    )}
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
                        Try Now →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">DevKit Hub</span>
            </div>
            <p className="text-slate-600 mb-4">
              Open source developer tools for the modern web
            </p>
            <div className="flex justify-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">About</a>
              <a href="#" className="hover:text-slate-700 transition-colors">GitHub</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Feedback</a>
              <a href="#" className="hover:text-slate-700 transition-colors">Changelog</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
