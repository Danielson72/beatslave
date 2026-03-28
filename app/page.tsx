'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'
import SubscribeModal from './components/SubscribeModal'

const pricingTiers = [
  {
    name: 'Standard License',
    price: '$0.99',
    description: 'Personal use only (non-monetized)',
    features: [
      '2-Track Stems WAV + Tagged MP3',
      'Non-exclusive, non-commercial',
      'Personal use only',
      'No backend royalties',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID,
    royalties: 'No royalties required',
    highlight: false,
  },
  {
    name: 'Premium License',
    price: '$4.99',
    description: 'Commercial rights for your releases',
    features: [
      '2-Track Stems WAV + Tagged MP3',
      'Commercial use (YouTube, Spotify, Apple Music)',
      'Non-exclusive (others can buy same beat)',
      '30-40% backend royalties required',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    royalties: '30-40% backend royalties on all commercial revenue',
    highlight: true,
  },
  {
    name: 'Exclusive License',
    price: '$49.99',
    description: 'Full exclusive ownership',
    features: [
      'Beat removed from catalog after purchase',
      'Complete commercial rights',
      'Can register copyright in your name',
      '10-20% backend royalties required',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_EXCLUSIVE_PRICE_ID,
    royalties: '10-20% backend royalties on all commercial revenue',
    highlight: false,
  },
]

const navLinks = [
  { label: 'Beats', href: '/' },
  { label: '88', href: '/88' },
  { label: 'Custom Song', href: '/custom-song' },
  { label: 'Licensing', href: '/licensing' },
]

export default function Home() {
  const [showSubscribe, setShowSubscribe] = useState(false)

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold font-serif text-gold">BeatSlave</Link>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-gold transition-colors font-sans"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setShowSubscribe(true)}
                className="text-sm font-semibold text-gold border border-gold px-4 py-1.5 rounded-full hover:bg-gold hover:text-black transition-all"
              >
                Subscribe
              </button>
              <Link
                href="/admin"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold mb-4 font-serif">Premium Beats for Your Vision</h2>
        <p className="text-xl text-zinc-400 mb-8 font-sans">
          Choose the perfect license for your music
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border p-8 ${
                tier.highlight
                  ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10'
                  : 'border-border bg-surface/50'
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-black text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 font-serif">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gold">{tier.price}</span>
                </div>
                <p className="text-zinc-400 mt-2">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-6 p-4 rounded-lg bg-surface border border-border">
                <p className="text-xs text-zinc-400 font-medium">Royalty Agreement:</p>
                <p className="text-sm text-zinc-200 mt-1">{tier.royalties}</p>
              </div>

              <button
                onClick={() => {
                  alert('Checkout coming soon! We need to set up Stripe products first.')
                }}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  tier.highlight
                    ? 'bg-gold hover:bg-gold-dark text-black'
                    : 'bg-white hover:bg-zinc-200 text-black'
                }`}
              >
                Purchase License
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="border-t border-border py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h3 className="text-3xl font-bold mb-8 text-center font-serif">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gold/10 border border-gold/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-gold font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Choose Your License</h4>
              <p className="text-sm text-zinc-400">
                Select the license that fits your project needs
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gold/10 border border-gold/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-gold font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Secure Checkout</h4>
              <p className="text-sm text-zinc-400">
                Complete your purchase with Stripe secure payment
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gold/10 border border-gold/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-gold font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Download & Create</h4>
              <p className="text-sm text-zinc-400">
                Instantly download your files and start making music
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="border-t border-border py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h3 className="text-3xl font-bold mb-3 font-serif">Never Miss a Drop</h3>
          <p className="text-zinc-400 mb-8">
            New beats, exclusive offers, and custom song promos — straight to your inbox.
          </p>
          <button
            onClick={() => setShowSubscribe(true)}
            className="bg-gold hover:bg-gold-dark text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Subscribe Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-zinc-400">
          <p>&copy; 2025 BeatSlave. All rights reserved.</p>
        </div>
      </footer>

      {/* Subscribe Modal */}
      <SubscribeModal isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />
    </div>
  )
}
