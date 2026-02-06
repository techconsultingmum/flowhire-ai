import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const posts = [
  {
    slug: "ai-in-recruiting",
    title: "How AI is Transforming Modern Recruiting",
    excerpt: "Discover how artificial intelligence is changing the way companies find and hire talent, and what it means for recruiters.",
    category: "Industry Trends",
    date: "Feb 5, 2026",
    readTime: "5 min read",
    image: "/placeholder.svg",
  },
  {
    slug: "candidate-experience",
    title: "5 Ways to Improve Your Candidate Experience",
    excerpt: "Learn practical strategies to create a positive hiring experience that attracts top talent and builds your employer brand.",
    category: "Best Practices",
    date: "Feb 1, 2026",
    readTime: "4 min read",
    image: "/placeholder.svg",
  },
  {
    slug: "remote-hiring",
    title: "The Complete Guide to Remote Hiring",
    excerpt: "Everything you need to know about building and managing a remote hiring process that works.",
    category: "Guides",
    date: "Jan 28, 2026",
    readTime: "8 min read",
    image: "/placeholder.svg",
  },
  {
    slug: "diversity-hiring",
    title: "Building Diverse Teams: A Practical Approach",
    excerpt: "Actionable strategies for creating inclusive hiring practices that attract diverse candidates.",
    category: "Diversity & Inclusion",
    date: "Jan 20, 2026",
    readTime: "6 min read",
    image: "/placeholder.svg",
  },
  {
    slug: "ats-comparison",
    title: "Choosing the Right ATS for Your Team",
    excerpt: "A comprehensive comparison of applicant tracking systems to help you make the right choice.",
    category: "Tools & Tech",
    date: "Jan 15, 2026",
    readTime: "7 min read",
    image: "/placeholder.svg",
  },
  {
    slug: "interview-techniques",
    title: "Modern Interview Techniques That Work",
    excerpt: "Move beyond traditional interviews with these evidence-based techniques for better hiring decisions.",
    category: "Best Practices",
    date: "Jan 10, 2026",
    readTime: "5 min read",
    image: "/placeholder.svg",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights, guides, and best practices to help you hire smarter.
            </p>
          </div>

          {/* Featured Post */}
          <Card className="mb-12 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-muted aspect-video md:aspect-auto">
                <img 
                  src={posts[0].image} 
                  alt={posts[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4">{posts[0].category}</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  {posts[0].title}
                </h2>
                <p className="text-muted-foreground mb-4">{posts[0].excerpt}</p>
                <div className="text-sm text-muted-foreground">
                  {posts[0].date} · {posts[0].readTime}
                </div>
              </div>
            </div>
          </Card>

          {/* Post Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">{post.excerpt}</CardDescription>
                  <div className="text-sm text-muted-foreground">
                    {post.date} · {post.readTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
