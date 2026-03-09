import Link from 'next/link'
import { FileText, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Evidence<span className="text-blue-600">Flow</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-all font-medium">Features</a>
            <a href="#samples" className="text-slate-600 hover:text-blue-600 transition-all font-medium">Samples</a>
            <Link href="/dashboard" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-32">
        {/* Hero Section */}
        <section className="px-4 text-center pb-24 border-b border-slate-100">
          <div className="max-w-4xl mx-auto">
            <span>Next-Gen Medical Content Platform</span>
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
              Transform Evidence into <br />
              <span className="text-blue-600">Stunning Content</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
              The only SaaS designed for doctors, researchers, and creators to convert complex medical papers into Card News, Visual Abstracts, and SNS Threads in seconds.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-10 py-4 rounded-2xl text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-2xl shadow-blue-500/30"
              >
                Start Creating Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#samples"
                className="inline-flex items-center px-10 py-4 rounded-2xl text-lg font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all font-sans"
              >
                View Samples
              </a>
            </div>

            {/* Badge Grid */}
            <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="font-bold text-xl text-slate-400 font-sans tracking-widest uppercase">PubMed</span>
              <span className="font-bold text-xl text-slate-400 font-sans tracking-widest uppercase">Crossref</span>
              <span className="font-bold text-xl text-slate-400 font-sans tracking-widest uppercase">OpenAI</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-sm font-bold text-blue-600 tracking-[0.2em] uppercase mb-4">Core Benefits</h2>
            <h3 className="text-4xl font-bold text-slate-900 mb-20 tracking-tight">Built for Medical Precision</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all duration-300 hover:shadow-xl">
                <div className="inline-flex p-4 bg-blue-100 text-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Shield size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 leading-tight">Evidence PICO Structure</h3>
                <p className="text-slate-500 leading-relaxed font-sans">Automatically extract Population, Intervention, Comparison, and Outcome from any abstract or PDF.</p>
              </div>
              <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all duration-300 hover:shadow-xl">
                <div className="inline-flex p-4 bg-orange-100 text-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Zap size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 leading-tight">Instant Generation</h3>
                <p className="text-slate-500 leading-relaxed font-sans">Generate 10+ slides of card news or a full research blog post in under 60 seconds.</p>
              </div>
              <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all duration-300 hover:shadow-xl">
                <div className="inline-flex p-4 bg-green-100 text-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 leading-tight">Multi-format Export</h3>
                <p className="text-slate-500 leading-relaxed font-sans">Perfectly sized outputs for Instagram, LinkedIn, X, and your personal medical blog.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EvidenceFlow</span>
          </div>
          <p className="text-slate-400 text-sm font-sans">&copy; 2026 EvidenceFlow SaaS. Powered by AI for Healthcare Professionals.</p>
        </div>
      </footer>
    </div>
  )
}
