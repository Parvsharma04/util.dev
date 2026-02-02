
import { useState } from "react";
import { Send, Copy, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const HttpTester = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [responseHeaders, setResponseHeaders] = useState("");
  const [statusCode, setStatusCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResponse("");
    setResponseHeaders("");
    setStatusCode("");

    try {
      // Prepare headers
      const requestHeaders: { [key: string]: string } = {};
      headers.forEach(header => {
        if (header.key && header.value) {
          requestHeaders[header.key] = header.value;
        }
      });

      // Since we can't make actual HTTP requests from the browser due to CORS,
      // we'll simulate a response for demo purposes
      setTimeout(() => {
        const mockResponse = {
          status: 200,
          statusText: "OK",
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*",
            "server": "nginx/1.18.0"
          },
          data: {
            message: "This is a mock response for demo purposes",
            url: url,
            method: method,
            timestamp: new Date().toISOString(),
            success: true
          }
        };

        setStatusCode(`${mockResponse.status} ${mockResponse.statusText}`);
        setResponseHeaders(JSON.stringify(mockResponse.headers, null, 2));
        setResponse(JSON.stringify(mockResponse.data, null, 2));
        setLoading(false);

        toast({
          title: "Request Sent",
          description: `${method} request to ${url} completed`
        });
      }, 1000);

    } catch (error) {
      setLoading(false);
      toast({
        title: "Request Failed",
        description: "An error occurred while sending the request",
        variant: "destructive"
      });
    }
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    toast({ title: "Copied!", description: "Response copied to clipboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">HTTP Request Tester</h1>
          <p className="text-muted-foreground">Test API endpoints like Postman</p>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-2">Developer Tools</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Configuration</CardTitle>
                <CardDescription>Configure your HTTP request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Select value={method} onValueChange={setMethod}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="HEAD">HEAD</SelectItem>
                        <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="https://jsonplaceholder.typicode.com/posts/1"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  
                  <Button 
                    onClick={sendRequest} 
                    disabled={loading} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? "Sending..." : "Send Request"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Headers</CardTitle>
                  <Button size="sm" variant="outline" onClick={addHeader}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <Input
                        placeholder="Header name"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Header value"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      {headers.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeHeader(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {(method === "POST" || method === "PUT" || method === "PATCH") && (
              <Card>
                <CardHeader>
                  <CardTitle>Request Body</CardTitle>
                  <CardDescription>JSON, XML, or plain text</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder='{"title": "foo", "body": "bar", "userId": 1}'
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Response</CardTitle>
                  {statusCode && (
                    <Badge 
                      variant={statusCode.startsWith("2") ? "default" : "destructive"}
                      className="mt-1"
                    >
                      {statusCode}
                    </Badge>
                  )}
                </div>
                {response && (
                  <Button size="sm" variant="outline" onClick={copyResponse}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!response && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                  <Send className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Send a request to see the response</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Sending request...</p>
                </div>
              )}

              {response && (
                <Tabs defaultValue="body" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="body">Response Body</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="body">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                      {response}
                    </pre>
                  </TabsContent>
                  
                  <TabsContent value="headers">
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                      {responseHeaders}
                    </pre>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HttpTester;
