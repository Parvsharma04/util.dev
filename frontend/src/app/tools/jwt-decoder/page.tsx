"use client";


import { useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const JwtDecoder = () => {
  const [jwt, setJwt] = useState("");
  const [decoded, setDecoded] = useState<{ header: any; payload: any; signature: string } | null>(null);
  const { toast } = useToast();

  const decodeJwt = () => {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      setDecoded({ header, payload, signature });
    } catch (err) {
      toast({
        title: "Error",
        description: "Invalid JWT token",
        variant: "destructive",
      });
      setDecoded(null);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  return (
        <ToolLayout title="JWT Decoder" description="Decode JSON Web Tokens and view header, payload, and signature" category="Text & String" icon={Badge}>
<Button onClick={decodeJwt} className="bg-blue-600 hover:bg-blue-700">
                  Decode JWT
                </Button>
              </div>
            </CardContent>
          </Card>

          {decoded && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Header</CardTitle>
                      <CardDescription>JWT algorithm and token type</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "Header")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="p-3 bg-muted rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(decoded.header, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Payload</CardTitle>
                      <CardDescription>JWT claims and data</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "Payload")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="p-3 bg-muted rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Signature</CardTitle>
                      <CardDescription>Verification signature (base64 encoded)</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(decoded.signature, "Signature")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {decoded.signature}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
              </ToolLayout>
    );
};

export default JwtDecoder;
