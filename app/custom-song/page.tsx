'use client'

import { useState, Suspense, FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Check, ChevronDown, Music, Video, Sparkles, Clock, RefreshCw, CreditCard, Loader2, AlertCircle, XCircle } from 'lucide-react'
import SubscribeModal from '../components/SubscribeModal'

const EDGE_FUNCTION_URL = 'https://vvmlgbwtaavrkvygazgm.supabase.co/functions/v1/custom-song-order'

// ─── Types ───────────────────────────────────────────────────────────

type Package = 'song_only' | 'song_video'

interface FormData {
  name: string
  email: string
  phone: string
  occasion: string
  genre: string
  vocalist: string
  message: string
  referenceSongs: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
  occasion?: string
  genre?: string
}

// ─── Constants ───────────────────────────────────────────────────────

const packages = {
  song_only: {
    label: 'Custom Song',
    price: 50,
    deposit: 25,
    balance: 25,
    icon: Music,
    features: [
      'Original custom song',
      'Professional mix & master',
      'Full commercial rights',
      'MP3 + WAV delivery',
      '1 round of revisions',
    ],
  },
  song_video: {
    label: 'Custom Song + Video',
    price: 99,
    deposit: 50,
    balance: 49,
    icon: Video,
    badge: 'Most Popular',
    features: [
      'Original custom song',
      'Professional mix & master',
      'Full commercial rights',
      'MP3 + WAV delivery',
      'Custom music video (1080p)',
      'Social-ready vertical cut',
      '2 rounds of revisions',
    ],
  },
} as const

const occasions = [
  'Birthday',
  'Wedding',
  'Anniversary',
  'Memorial/Tribute',
  'Graduation',
  'Baby Shower',
  'Proposal',
  'Holiday Gift',
  'Just Because',
  'Other',
]

const genres = [
  'Hip-Hop/Rap',
  'R&B/Soul',
  'Gospel/Worship',
  'Reggaeton',
  'Dancehall',
  'Drum & Bass',
  'Pop',
  'Country',
  'Rock',
  'Lo-Fi/Chill',
  'Other',
]

const vocalistOptions = ['Male', 'Female', 'Instrumental', 'No Preference']

const faqs = [
  {
    q: 'What\'s included in each package?',
    a: 'The Custom Song package ($50) includes an original song with professional mixing and mastering, delivered as MP3 + WAV with full commercial rights and 1 revision round. The Custom Song + Video package ($99) includes everything in the song package plus a custom 1080p music video, a social-ready vertical cut, and 2 revision rounds.',
  },
  {
    q: 'How is AI used in the production process?',
    a: 'We use a hybrid approach — AI assists with initial composition ideas and production elements, but every song is crafted, arranged, mixed, and mastered by human producers. Think of AI as another instrument in our toolkit, not a replacement for human creativity and emotion.',
  },
  {
    q: 'How long does it take?',
    a: 'Custom songs are typically delivered within 5–7 business days. Songs with video take 7–10 business days. Rush delivery may be available for an additional fee — just ask!',
  },
  {
    q: 'What if I want changes?',
    a: 'The Custom Song package includes 1 round of revisions, and the Song + Video package includes 2 rounds. Additional revisions can be requested for a small fee. We want you to love your song!',
  },
  {
    q: 'What do I receive when it\'s done?',
    a: 'You\'ll receive high-quality MP3 and WAV files of your song, plus full commercial rights. If you ordered the video package, you\'ll also get a 1080p landscape video and a vertical (9:16) social media cut.',
  },
  {
    q: 'How does the deposit work?',
    a: 'You pay a deposit upfront to secure your order and get us started. The remaining balance is due upon delivery, once you\'ve heard your song and approved it. No surprises.',
  },
]

const navLinks = [
  { label: 'Beats', href: '/' },
  { label: '88', href: '/88' },
  { label: 'Custom Song', href: '/custom-song' },
  { label: 'Licensing', href: '/licensing' },
]

// ─── Component ───────────────────────────────────────────────────────

export default function CustomSongPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    }>
      <CustomSongContent />
    </Suspense>
  )
}

function CustomSongContent() {
  const searchParams = useSearchParams()
  const [selectedPackage, setSelectedPackage] = useState<Package>('song_video')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    occasion: '',
    genre: '',
    vocalist: '',
    message: '',
    referenceSongs: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // URL param states from Stripe redirect
  const isSuccess = searchParams.get('success') === 'true'
  const isCancelled = searchParams.get('cancelled') === 'true'
  const returnedOrderId = searchParams.get('order_id')

  const pkg = packages[selectedPackage]

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    if (submitError) setSubmitError('')
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.message.trim()) newErrors.message = 'Please describe your song'
    if (!formData.occasion) newErrors.occasion = 'Please select an occasion'
    if (!formData.genre) newErrors.genre = 'Please select a genre'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          occasion: formData.occasion,
          genre: formData.genre,
          vocalist: formData.vocalist || 'No Preference',
          message: formData.message,
          referenceSongs: formData.referenceSongs || undefined,
          selectedPackage,
          depositAmount: pkg.deposit,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to create order. Please try again.')
      }

      const data = await response.json()
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        throw new Error('No checkout URL received. Please try again.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Success Screen (returned from Stripe) ─────────────────────────

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold font-serif text-gold">BeatSlave</Link>
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-zinc-400 hover:text-gold transition-colors">{link.label}</Link>
                ))}
                <button
                  onClick={() => setShowSubscribe(true)}
                  className="text-sm font-semibold text-gold border border-gold px-4 py-1.5 rounded-full hover:bg-gold hover:text-black transition-all"
                >
                  Subscribe
                </button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-4xl font-bold font-serif mb-4">Deposit Paid — You&apos;re All Set!</h1>
          <p className="text-lg text-zinc-400 mb-6">
            Your custom song order has been confirmed and your deposit has been received.
          </p>
          <div className="bg-surface border border-border rounded-xl p-6 text-left mb-8 max-w-md mx-auto">
            {returnedOrderId && (
              <div className="flex justify-between items-center mb-4">
                <span className="text-zinc-400">Order ID</span>
                <span className="font-mono text-sm text-zinc-300">{returnedOrderId.slice(0, 8)}...</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-400">Status</span>
              <span className="font-semibold text-gold">Deposit Paid</span>
            </div>
            <div className="text-sm text-zinc-500 pt-3 border-t border-border">
              Check your email for a confirmation with full order details and next steps.
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-6 text-left mb-8 max-w-md mx-auto">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <ol className="space-y-2 text-sm text-zinc-400">
              <li className="flex gap-3">
                <span className="text-gold font-bold">1.</span>
                Our team reviews your order within 24 hours
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">2.</span>
                We begin production on your custom song
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">3.</span>
                You&apos;ll receive a preview for approval
              </li>
              <li className="flex gap-3">
                <span className="text-gold font-bold">4.</span>
                Pay the remaining balance and receive your final files
              </li>
            </ol>
          </div>
          <Link
            href="/"
            className="inline-block bg-gold hover:bg-gold-dark text-black font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-sm text-zinc-400">
            <p>&copy; 2025 BeatSlave. All rights reserved.</p>
          </div>
        </footer>
        <SubscribeModal isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />
      </div>
    )
  }

  // ─── Cancelled Screen (returned from Stripe) ──────────────────────

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] text-white">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold font-serif text-gold">BeatSlave</Link>
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-zinc-400 hover:text-gold transition-colors">{link.label}</Link>
                ))}
                <button
                  onClick={() => setShowSubscribe(true)}
                  className="text-sm font-semibold text-gold border border-gold px-4 py-1.5 rounded-full hover:bg-gold hover:text-black transition-all"
                >
                  Subscribe
                </button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-24 text-center max-w-2xl">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold font-serif mb-4">Payment Cancelled</h1>
          <p className="text-lg text-zinc-400 mb-8">
            Your order was not placed. No charges were made to your account.
          </p>
          <Link
            href="/custom-song"
            className="inline-block bg-gold hover:bg-gold-dark text-black font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Try Again
          </Link>
        </div>

        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-sm text-zinc-400">
            <p>&copy; 2025 BeatSlave. All rights reserved.</p>
          </div>
        </footer>
        <SubscribeModal isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} />
      </div>
    )
  }

  // ─── Main Page ────────────────────────────────────────────────────

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
                  className={`text-sm transition-colors ${
                    link.href === '/custom-song'
                      ? 'text-gold'
                      : 'text-zinc-400 hover:text-gold'
                  }`}
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
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold font-serif mb-4">
          Your Song. <span className="text-gold">Your Story.</span>
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          A one-of-a-kind song crafted for your moment — birthdays, weddings, memorials, or just because.
        </p>
      </section>

      <form onSubmit={handleSubmit}>
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

            {/* ─── Left Column: Packages + Form ─── */}
            <div className="lg:col-span-2 space-y-10">

              {/* Package Selection */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-6">Choose Your Package</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(Object.entries(packages) as [Package, typeof packages[Package]][]).map(([key, p]) => {
                    const Icon = p.icon
                    const isSelected = selectedPackage === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedPackage(key)}
                        className={`relative text-left rounded-xl border p-6 transition-all ${
                          isSelected
                            ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10'
                            : 'border-border bg-surface hover:border-zinc-600'
                        }`}
                      >
                        {'badge' in p && p.badge && (
                          <span className="absolute -top-3 right-4 bg-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                            {p.badge}
                          </span>
                        )}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-gold/20 text-gold' : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold">{p.label}</h3>
                            <p className="text-sm text-zinc-400">${p.price} total</p>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {p.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-sm">
                              <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-gold' : 'text-zinc-600'}`} />
                              <span className="text-zinc-300">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Deposit now</span>
                            <span className="font-bold text-gold">${p.deposit}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-zinc-400">On delivery</span>
                            <span className="text-zinc-300">${p.balance}</span>
                          </div>
                        </div>
                        {/* Selection indicator */}
                        <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-gold' : 'border-zinc-600'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-gold" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* Contact Info */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-6">Your Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className={`w-full bg-surface border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-colors ${
                        errors.name ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`w-full bg-surface border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-colors ${
                        errors.email ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="you@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1.5">Phone <span className="text-zinc-600">(optional)</span></label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-colors"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </section>

              {/* Occasion */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-2">What&apos;s the Occasion?</h2>
                {errors.occasion && <p className="text-red-400 text-xs mb-3">{errors.occasion}</p>}
                <div className="flex flex-wrap gap-2">
                  {occasions.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => updateField('occasion', o)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        formData.occasion === o
                          ? 'bg-gold text-black border-gold'
                          : 'bg-surface border-border text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </section>

              {/* Genre */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-2">Pick a Genre</h2>
                {errors.genre && <p className="text-red-400 text-xs mb-3">{errors.genre}</p>}
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => updateField('genre', g)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        formData.genre === g
                          ? 'bg-gold text-black border-gold'
                          : 'bg-surface border-border text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </section>

              {/* Vocalist Preference */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">Vocalist Preference</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {vocalistOptions.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => updateField('vocalist', v)}
                      className={`py-3 rounded-lg text-sm font-medium border transition-all ${
                        formData.vocalist === v
                          ? 'bg-gold text-black border-gold'
                          : 'bg-surface border-border text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </section>

              {/* Message / Lyrics */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-2">Tell Us About Your Song</h2>
                <p className="text-sm text-zinc-400 mb-4">
                  Share the story, names, special memories, inside jokes, or specific lyrics you&apos;d like included.
                </p>
                <textarea
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  rows={6}
                  className={`w-full bg-surface border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-colors resize-none ${
                    errors.message ? 'border-red-500' : 'border-border'
                  }`}
                  placeholder="E.g., This song is for my wife's 30th birthday. Her name is Maria. She loves dancing salsa and our first date was at a rooftop in Miami..."
                />
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              </section>

              {/* Reference Songs */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-2">Reference Songs</h2>
                <p className="text-sm text-zinc-400 mb-4">
                  Share any songs that capture the vibe or style you&apos;re going for. <span className="text-zinc-600">(optional)</span>
                </p>
                <input
                  type="text"
                  value={formData.referenceSongs}
                  onChange={(e) => updateField('referenceSongs', e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-colors"
                  placeholder='E.g., "Perfect" by Ed Sheeran, "All of Me" by John Legend'
                />
              </section>
            </div>

            {/* ─── Right Column: Order Summary (sticky) ─── */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <div className="bg-surface border border-border rounded-xl p-6">
                  <h3 className="text-lg font-bold font-serif mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{pkg.label}</span>
                      <span className="font-semibold">${pkg.price}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Deposit due today</span>
                        <span className="font-bold text-gold text-lg">${pkg.deposit}</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-zinc-500 text-sm">Balance on delivery</span>
                        <span className="text-zinc-400 text-sm">${pkg.balance}</span>
                      </div>
                    </div>
                  </div>

                  {formData.occasion && (
                    <div className="text-sm mb-2">
                      <span className="text-zinc-500">Occasion:</span>{' '}
                      <span className="text-zinc-200">{formData.occasion}</span>
                    </div>
                  )}
                  {formData.genre && (
                    <div className="text-sm mb-2">
                      <span className="text-zinc-500">Genre:</span>{' '}
                      <span className="text-zinc-200">{formData.genre}</span>
                    </div>
                  )}
                  {formData.vocalist && (
                    <div className="text-sm mb-4">
                      <span className="text-zinc-500">Vocalist:</span>{' '}
                      <span className="text-zinc-200">{formData.vocalist}</span>
                    </div>
                  )}

                  {submitError && (
                    <div className="flex items-start gap-3 p-4 mb-4 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-300">{submitError}</p>
                        <p className="text-xs text-red-400/60 mt-1">
                          Please try again or contact us at dalvarez@sotsvc.com
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating order...
                      </>
                    ) : (
                      `Pay $${pkg.deposit} Deposit & Submit`
                    )}
                  </button>

                  <p className="text-xs text-zinc-500 text-center mt-3">
                    Secure payment via Stripe. Remaining ${pkg.balance} due on delivery.
                  </p>
                </div>

                {/* Trust signals */}
                <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <p className="text-sm font-medium">5–10 Day Delivery</p>
                      <p className="text-xs text-zinc-500">Rush available upon request</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Revisions Included</p>
                      <p className="text-xs text-zinc-500">We work until you love it</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gold shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Pay-on-Delivery Model</p>
                      <p className="text-xs text-zinc-500">Balance due only after approval</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Human Artistry + AI Disclosure */}
      <section className="border-t border-border py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-bold font-serif">Human Artistry + AI Innovation</h2>
          </div>
          <p className="text-zinc-400 leading-relaxed mb-6">
            Every BeatSlave custom song blends the best of both worlds. Our producers use AI-assisted tools to accelerate composition and explore creative possibilities, while human artistry ensures every note carries real emotion, nuance, and intention. The result? A song that&apos;s uniquely yours — crafted faster without compromising soul.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-surface border border-border rounded-lg p-4">
              <p className="font-semibold text-gold mb-1">AI-Assisted</p>
              <p className="text-zinc-500">Composition ideas, arrangement exploration</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <p className="font-semibold text-gold mb-1">Human-Crafted</p>
              <p className="text-zinc-500">Arrangement, mixing, mastering, emotion</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <p className="font-semibold text-gold mb-1">100% Original</p>
              <p className="text-zinc-500">Every song is unique to your story</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold font-serif mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-light transition-colors"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
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
