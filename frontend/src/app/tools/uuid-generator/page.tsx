"use client";

import { useState } from "react";
import { Copy, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { ToolLayout } from "@/components/ToolLayout";

const UuidGenerator = () => {
  const [version, setVersion] = useState("v4");
  const [quantity, setQuantity] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const { toast } = useToast();

  const generateUUID = () => {
    if (version === "v4") {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    } else if (version === "v1") {
      const timestamp = Date.now();
      const random = Math.random().toString(16).substring(2, 15);
      return `${timestamp.toString(16)}-${random.substring(0, 4)}-1${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(11)}`;
    }
    return "";
  };

  const handleGenerate = () => {
    const newUuids = Array.from({ length: quantity }, () => generateUUID());
    setUuids(newUuids);
  };

  const copyToClipboard = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast({
      title: "Copied!",
      description: "UUID copied to clipboard",
    });
  };

  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    toast({
      title: "Copied!",
      description: "All UUIDs copied to clipboard",
    });
  };

  return (
    <ToolLayout title="UUID Generator" description="Generate unique identifiers (UUIDs) v1, v4, and more" category="Text & String" icon={Badge} popular>
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Version</label>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v4">UUID v4</SelectItem>
                <SelectItem value="v1">UUID v1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-24"
            />
          </div>
          <Button onClick={handleGenerate} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Generated UUIDs</CardTitle>
              <CardDescription>
                {version === "v4" ? "Random UUIDs" : "Timestamp-based UUIDs"}
              </CardDescription>
            </div>
            {uuids.length > 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={copyAllToClipboard}
                disabled={uuids.length === 0}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {uuids.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <RefreshCw className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p>Click "Generate" to create UUIDs</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="font-mono text-sm text-foreground flex-1">
                    {uuid}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(uuid)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>About UUIDs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">UUID v4 (Random)</h4>
                <p className="text-muted-foreground">
                  Generated using random or pseudo-random numbers. Most commonly used.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">UUID v1 (Timestamp)</h4>
                <p className="text-muted-foreground">
                  Based on timestamp and MAC address. Provides time ordering.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default UuidGenerator;
