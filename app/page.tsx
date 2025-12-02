import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <main className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
            QuickClaims<span className="text-blue-600">.ai</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            AI-Powered Project Management for Construction Contractors
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <p className="text-lg text-gray-700">
            Transform your construction projects with AI-powered document generation, 
            automated estimates, and intelligent project roadmaps.
          </p>

          <div className="grid md:grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">AI Concierge</h3>
              <p className="text-sm text-gray-600">
                Answer 3 simple questions to create your project
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Smart Upload</h3>
              <p className="text-sm text-gray-600">
                Upload scopes and photos for AI analysis
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Auto-Generate</h3>
              <p className="text-sm text-gray-600">
                Get roadmaps, estimates, and material lists instantly
              </p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-block w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  )
}
