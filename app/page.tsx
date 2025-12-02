import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <main className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            QuickClaims<span className="text-primary">.ai</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            AI-Powered Project Management for Construction Contractors
          </p>
        </div>

        <div className="card-soft space-y-6">
          <p className="text-lg text-foreground/80">
            Transform your construction projects with AI-powered document generation, 
            automated estimates, and intelligent project roadmaps.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="p-5 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="font-semibold text-foreground mb-2">AI Concierge</h3>
              <p className="text-sm text-muted-foreground">
                Answer 3 simple questions to create your project
              </p>
            </div>
            <div className="p-5 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="font-semibold text-foreground mb-2">Smart Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload scopes and photos for AI analysis
              </p>
            </div>
            <div className="p-5 bg-primary/5 rounded-xl border border-primary/10">
              <h3 className="font-semibold text-foreground mb-2">Auto-Generate</h3>
              <p className="text-sm text-muted-foreground">
                Get roadmaps, estimates, and material lists instantly
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-block w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all shadow-soft hover:shadow-soft-hover"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  )
}
