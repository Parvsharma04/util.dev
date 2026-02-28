
import { useState, useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { allTools } from "@/lib/tools";



interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredTools = allTools.filter(tool =>
    tool.title.toLowerCase().includes(search.toLowerCase()) ||
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
      <DialogContent className="p-0 max-w-2xl bg-popover border-border">
        <div className="flex flex-col max-h-[80vh]">
          {/* Search Input */}
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <Input
              placeholder="$ search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent text-lg focus:ring-0 focus:outline-none font-mono"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto max-h-96">
            {filteredTools.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-lg font-medium mb-2 font-mono">No tools found</p>
                <p className="text-sm font-mono">Try searching with different keywords</p>
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
                    className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${index === selectedIndex
                      ? 'bg-primary/10 border-primary/30 border'
                      : 'hover:bg-accent'
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${index === selectedIndex
                      ? 'bg-primary/10 text-primary border-primary/30'
                      : 'bg-accent text-muted-foreground border-border'
                      }`}>
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate font-mono">
                          {tool.title}
                        </h3>

                        <Badge variant="outline" className="text-xs font-mono border-border">
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 ${index === selectedIndex ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded border border-border">↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded border border-border">Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted rounded border border-border">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span>Search by</span>
                <kbd className="px-2 py-1 bg-muted rounded border border-border">⌘K</kbd>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
