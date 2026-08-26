'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-white">LeadRecover AI</div>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-white hover:bg-slate-700">
              Login
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Recover Lost Leads with <span className="text-blue-400">AI Power</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Stop losing deals. Automatically follow up with lost leads using AI-powered conversations across email, SMS, Instagram, and Facebook.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-slate-700">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Features That Win Back Leads
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-3">AI Lead Follow-up</h3>
              <p className="text-slate-300">
                Intelligent AI writes personalized follow-ups automatically. No more manual emails.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Channel</h3>
              <p className="text-slate-300">
                Reach leads via Email, SMS, Instagram, and Facebook from one platform.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Analytics</h3>
              <p className="text-slate-300">
                Track open rates, responses, and conversion metrics in real-time.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-3">Booking Links</h3>
              <p className="text-slate-300">
                Generate instant booking links to convert leads to meetings.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Lead Qualification</h3>
              <p className="text-slate-300">
                AI qualifies leads automatically. Focus only on hot prospects.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-700 rounded-lg p-8">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-white mb-3">Automations</h3>
              <p className="text-slate-300">
                Create custom follow-up sequences without coding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Simple, Transparent Pricing
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {/* Free Plan */}
            <div className="bg-slate-700 rounded-lg p-8 border border-slate-600">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-slate-300 mb-6">Start recovering leads</p>
              <p className="text-3xl font-bold text-white mb-6">$0<span className="text-lg">/mo</span></p>
              <ul className="text-slate-300 space-y-2 mb-8">
                <li>✓ 5 leads/month</li>
                <li>✓ Email only</li>
                <li>✓ Basic AI responses</li>
              </ul>
              <Button variant="outline" className="w-full text-white border-white">
                Get Started
              </Button>
            </div>

            {/* Starter Plan */}
            <div className="bg-slate-700 rounded-lg p-8 border border-slate-600">
              <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
              <p className="text-slate-300 mb-6">For growing teams</p>
              <p className="text-3xl font-bold text-white mb-6">$49<span className="text-lg">/mo</span></p>
              <ul className="text-slate-300 space-y-2 mb-8">
                <li>✓ 100 leads/month</li>
                <li>✓ Email & SMS</li>
                <li>✓ Lead Qualification</li>
                <li>✓ Basic Analytics</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
            </div>

            {/* Growth Plan */}
            <div className="bg-blue-600 rounded-lg p-8 border border-blue-500 ring-2 ring-blue-400">
              <div className="bg-blue-400 text-blue-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                RECOMMENDED
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
              <p className="text-blue-100 mb-6">Best for most businesses</p>
              <p className="text-3xl font-bold text-white mb-6">$97<span className="text-lg">/mo</span></p>
              <ul className="text-blue-100 space-y-2 mb-8">
                <li>✓ 500 leads/month</li>
                <li>✓ All channels</li>
                <li>✓ Smart sequences</li>
                <li>✓ Booking links</li>
                <li>✓ Team collaboration</li>
              </ul>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                Start Free Trial
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-slate-700 rounded-lg p-8 border border-slate-600">
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-slate-300 mb-6">Enterprise features</p>
              <p className="text-3xl font-bold text-white mb-6">$197<span className="text-lg">/mo</span></p>
              <ul className="text-slate-300 space-y-2 mb-8">
                <li>✓ 2000 leads/month</li>
                <li>✓ Custom integrations</li>
                <li>✓ Priority support</li>
                <li>✓ API access</li>
                <li>✓ Advanced AI</li>
              </ul>
              <Button variant="outline" className="w-full text-white border-white">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Recover Your Lost Leads?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500+ teams recovering leads with AI. Start your free 14-day trial today.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Free Trial - No Credit Card
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400">
          <p>&copy; 2024 LeadRecover AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
