
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CronHelper = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Cron Expression Helper</h1>
        <p className="text-slate-600">Create and understand cron expressions</p>
        <Badge className="bg-orange-100 text-orange-700 border-orange-200 mt-2">Time & Schedule</Badge>
      </div>
      <Card>
        <CardHeader><CardTitle>Coming Soon</CardTitle></CardHeader>
        <CardContent><p>This tool is under development.</p></CardContent>
      </Card>
    </div>
  </div>
);

export default CronHelper;
