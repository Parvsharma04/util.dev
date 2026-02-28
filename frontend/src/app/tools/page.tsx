"use client";

import { useState } from "react";
import { Search, FileText, Code, Zap, Clock, Globe, Palette, Terminal, ArrowLeft, Database } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolLayout } from "@/components/ToolLayout";

import { allTools, categories } from "@/lib/tools";


const Tools = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTools = allTools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentCategoryObj = categories.find(c => c.name === selectedCategory) || categories[0];

  return (
    <ToolLayout
      title="All Developer Tools"
      description="Try adjusting your search or category filter"
      category={`${selectedCategory} (${selectedCategory === "All" ? allTools.length : currentCategoryObj.count})`}
      icon={Terminal}
    >
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
    </ToolLayout>
  );
};

export default Tools;
