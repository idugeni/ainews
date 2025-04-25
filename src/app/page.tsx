import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileText, Newspaper, ArrowRight, History, Download, Globe, Sparkles, Search, Lightbulb } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <div className="text-center space-y-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">News Generator with Google Gemini AI</h1>
        <p className="text-xl text-muted-foreground">
          Create professional news content in seconds with the power of Google Gemini AI
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-lg w-16 h-16 flex items-center justify-center mb-3">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Generate News Titles</CardTitle>
            <CardDescription className="text-center">Create engaging headlines for any topic</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-2">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Our AI analyzes your topic and generates multiple catchy, SEO-optimized headlines tailored to your
              specific news category. Perfect for journalists, content creators, and marketers looking to maximize
              engagement.
            </p>
            <Link href="/title" className="w-full">
              <Button className="w-full group">
                Create Titles
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-lg w-16 h-16 flex items-center justify-center mb-3">
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Generate News Content</CardTitle>
            <CardDescription className="text-center">Create complete, well-structured articles</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-2">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Transform any title into a professionally structured news article with proper headings, paragraphs, and
              quotes. Our AI generates factual-sounding, engaging content ready for WordPress publishing or further
              editing.
            </p>
            <Link href="/news" className="w-full">
              <Button className="w-full group">
                Create News
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
              <History className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Content History</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Access your previously generated titles and articles. Easily reuse, edit, or export your content whenever
              you need it.
            </p>
            <Link href="/history">
              <Button variant="outline" size="sm" className="w-full">
                View History
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Export Options</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Export your content as Markdown or HTML with a single click. Perfect for integrating with your CMS, blog,
              or content platform.
            </p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Generate Content First
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">WordPress Integration</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Publish your generated content directly to WordPress as a draft or live post. Streamline your content
              workflow with one-click publishing.
            </p>
            <Button variant="outline" size="sm" className="w-full" disabled>
              Generate Content First
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">SEO Analysis</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Get instant SEO feedback on your generated content. Our analyzer checks readability, keyword usage, and
              content structure to help your articles rank better in search engines.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-3">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Specialized Categories</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-sm text-muted-foreground mb-4 text-center">
              Generate content for specific news categories including business, technology, science, health,
              entertainment, politics, travel, and environment. Each category uses specialized prompts for relevant
              content.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-12 text-center max-w-2xl bg-primary/5 p-6 rounded-lg">
        <div className="mx-auto bg-primary/10 p-3 rounded-lg w-16 h-16 flex items-center justify-center mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Powered by Google Gemini 2.5</h2>
        <p className="text-muted-foreground">
          Our application leverages the latest Google Gemini 2.5 models to generate high-quality, engaging news content.
          Choose between Gemini 2.5 Pro for complex, nuanced articles or Gemini 2.5 Flash for faster results when time
          is of the essence.
        </p>
      </div>
    </div>
  );
}
