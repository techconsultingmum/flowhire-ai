import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const endpoints = [
  {
    category: "Jobs",
    items: [
      { method: "GET", path: "/api/v1/jobs", description: "List all jobs" },
      { method: "POST", path: "/api/v1/jobs", description: "Create a new job" },
      { method: "GET", path: "/api/v1/jobs/:id", description: "Get a specific job" },
      { method: "PUT", path: "/api/v1/jobs/:id", description: "Update a job" },
      { method: "DELETE", path: "/api/v1/jobs/:id", description: "Delete a job" },
    ],
  },
  {
    category: "Candidates",
    items: [
      { method: "GET", path: "/api/v1/candidates", description: "List all candidates" },
      { method: "POST", path: "/api/v1/candidates", description: "Create a candidate" },
      { method: "GET", path: "/api/v1/candidates/:id", description: "Get a specific candidate" },
      { method: "PUT", path: "/api/v1/candidates/:id", description: "Update a candidate" },
      { method: "DELETE", path: "/api/v1/candidates/:id", description: "Delete a candidate" },
    ],
  },
  {
    category: "Applications",
    items: [
      { method: "GET", path: "/api/v1/applications", description: "List all applications" },
      { method: "POST", path: "/api/v1/applications", description: "Create an application" },
      { method: "PUT", path: "/api/v1/applications/:id/stage", description: "Update application stage" },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "bg-green-500/10 text-green-600 dark:text-green-400",
  POST: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  PUT: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  DELETE: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function ApiReference() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              API Reference
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Build powerful integrations with the Hireflow API. RESTful, well-documented, and developer-friendly.
            </p>
            <div className="flex justify-center gap-4">
              <Button>Get API Key</Button>
              <Button variant="outline">View on GitHub</Button>
            </div>
          </div>

          {/* Quick Start */}
          <Card className="max-w-4xl mx-auto mb-12">
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Get up and running in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="curl">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>
                <TabsContent value="curl" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X GET "https://api.hireflow.com/v1/jobs" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                  </pre>
                </TabsContent>
                <TabsContent value="javascript" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`const response = await fetch('https://api.hireflow.com/v1/jobs', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const jobs = await response.json();`}
                  </pre>
                </TabsContent>
                <TabsContent value="python" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import requests

response = requests.get(
    'https://api.hireflow.com/v1/jobs',
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)
jobs = response.json()`}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Endpoints</h2>
            <div className="space-y-8">
              {endpoints.map((category) => (
                <div key={category.category}>
                  <h3 className="text-lg font-semibold text-foreground mb-4">{category.category}</h3>
                  <div className="space-y-2">
                    {category.items.map((endpoint, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Badge className={methodColors[endpoint.method]}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                        <span className="text-sm text-muted-foreground ml-auto hidden md:block">
                          {endpoint.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              Need help with the API?{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact our developer support team
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
