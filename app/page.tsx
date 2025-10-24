import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, ShoppingCart, Download } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Premium Beats for
            <br />
            <span className="text-slate-600">Artists & Creators</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gospel, Hip Hop, and Trap beats crafted with purpose. High-quality
            WAV + MP3 downloads ready for your next project.
          </p>
          <Link href="/catalog">
            <Button size="lg" className="text-lg px-8">
              Browse Beats
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Music className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Quality</h3>
            <p className="text-muted-foreground">
              Studio-grade beats mixed and mastered for commercial use
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Simple Licensing</h3>
            <p className="text-muted-foreground">
              Clear terms, instant downloads, and hassle-free purchases
            </p>
          </div>
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Download className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
            <p className="text-muted-foreground">
              Download your tracks immediately in WAV and MP3 formats
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create?</h2>
          <p className="text-muted-foreground mb-8">
            Explore our catalog and find the perfect beat for your next project
          </p>
          <Link href="/catalog">
            <Button size="lg" variant="outline">
              View Catalog
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
