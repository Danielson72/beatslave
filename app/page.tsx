import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Music, ShoppingCart, Download, Shield, Clock, Award } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-premium.svg"
            alt="Premium studio equipment representing professional beat production"
            fill
            priority
            quality={100}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10 text-center">
          <div className="mb-8 inline-block">
            <div className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2 bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
              BeatSlave
            </div>
            <div className="text-xl md:text-2xl text-gold font-light tracking-wider">
              Premium Beats. Professional Power.
            </div>
          </div>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
            Gospel, Hip Hop, and Trap beats crafted with purpose.
            <br className="hidden md:block" />
            Studio-grade quality for artists who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/catalog">
              <Button
                size="lg"
                className="text-lg px-8 bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-black font-semibold shadow-xl hover:shadow-gold/50 transition-all duration-300"
              >
                Browse Premium Beats
              </Button>
            </Link>
            <Link href="/legal/license">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-gold text-gold hover:bg-gold/10 transition-all duration-300"
              >
                View Licensing
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-gold" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              <span>24/7 Access</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gold/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Artists Choose <span className="text-gold">BeatSlave</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional tools for serious creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-lg border border-border hover:border-gold/50 transition-all duration-300 group">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-dark/20 to-gold/20 mb-6 group-hover:from-gold-dark/30 group-hover:to-gold/30 transition-all duration-300">
              <Music className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Professional Quality</h3>
            <p className="text-muted-foreground leading-relaxed">
              Studio-grade beats mixed and mastered by industry professionals.
              Every track is production-ready for commercial use.
            </p>
          </div>

          <div className="text-center p-8 rounded-lg border border-border hover:border-gold/50 transition-all duration-300 group">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-dark/20 to-gold/20 mb-6 group-hover:from-gold-dark/30 group-hover:to-gold/30 transition-all duration-300">
              <ShoppingCart className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Simple Licensing</h3>
            <p className="text-muted-foreground leading-relaxed">
              Clear, straightforward terms with instant downloads.
              No hidden fees, no complicated contracts.
            </p>
          </div>

          <div className="text-center p-8 rounded-lg border border-border hover:border-gold/50 transition-all duration-300 group">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gold-dark/20 to-gold/20 mb-6 group-hover:from-gold-dark/30 group-hover:to-gold/30 transition-all duration-300">
              <Award className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Premium Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stems available separately for advanced production.
              Direct artist contact for custom projects.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-black-rich to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gold-dark/10 to-gold/10 rounded-2xl border border-gold/20 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Elevate Your Sound?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of artists creating with professional beats.
              Browse our catalog and find your next hit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalog">
                <Button
                  size="lg"
                  className="text-lg px-10 bg-gradient-to-r from-gold-dark to-gold hover:from-gold hover:to-gold-light text-black font-semibold shadow-xl hover:shadow-gold/50 transition-all duration-300"
                >
                  Explore Catalog
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Standard License starting at <span className="text-gold font-semibold">$0.99</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
