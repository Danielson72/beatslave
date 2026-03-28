'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { X } from 'lucide-react'

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'already' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus email input when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle')
      setEmail('')
      setName('')
      setErrorMsg('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('submitting')
    setErrorMsg('')

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const res = await fetch(`${supabaseUrl}/functions/v1/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          source: 'website',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      if (data.status === 'already_subscribed') {
        setStatus('already')
      } else {
        setStatus('success')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="relative w-full max-w-md bg-[#141414] border border-border rounded-2xl p-8 shadow-2xl shadow-gold/5">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' || status === 'already' ? (
          /* Success state */
          <div className="text-center py-4">
            <div className="text-4xl mb-4">&#127926;</div>
            <h3 className="text-2xl font-bold font-serif text-gold mb-2">
              {status === 'already' ? "You're Already In!" : "You're In!"}
            </h3>
            <p className="text-zinc-400 mb-6">
              {status === 'already'
                ? "Looks like you're already subscribed. We appreciate you!"
                : "Welcome to the BeatSlave family. Check your inbox for a welcome message."}
            </p>
            <button
              onClick={onClose}
              className="bg-gold hover:bg-gold-dark text-black font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Got It
            </button>
          </div>
        ) : (
          /* Form state */
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold font-serif text-gold mb-2">Stay in the Loop</h3>
              <p className="text-zinc-400 text-sm">
                Get notified about new beats, exclusive drops, and special offers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  ref={inputRef}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-gold transition-colors"
                  placeholder="Your name (optional)"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-gold hover:bg-gold-dark text-black font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
              </button>

              <p className="text-xs text-zinc-600 text-center">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
