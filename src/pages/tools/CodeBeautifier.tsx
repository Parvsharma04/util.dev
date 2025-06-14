
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CodeBeautifier = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Code Beautifier</h1>
        <p className="text-slate-600">Minify and beautify code</p>
        <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-2">Developer Tools</Badge>
      </div>
      <Card>
        <CardHeader><CardTitle>Coming Soon</CardTitle></CardHeader>
        <CardContent><p>This tool is under development.</p></CardContent>
      </Card>
    </div>
  </div>
);

export default CodeBeautifier;
