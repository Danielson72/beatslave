import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeatSlave Market - Premium Gospel & Hip Hop Beats",
  description: "Professional beats and instrumentals for artists and creators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              BeatSlave Market
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/catalog" className="hover:underline">
                Browse Beats
              </Link>
              <Link href="/admin" className="hover:underline">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-200px)]">{children}</main>
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold mb-2">BeatSlave Market</h3>
                <p className="text-sm text-muted-foreground">
                  Premium beats for artists and creators
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Legal</h3>
                <div className="flex flex-col gap-2 text-sm">
                  <Link href="/legal/terms" className="hover:underline">
                    Terms of Service
                  </Link>
                  <Link href="/legal/license" className="hover:underline">
                    License Agreement
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2">Contact</h3>
                <p className="text-sm text-muted-foreground">
                  For stems and custom inquiries:
                  <br />
                  <a
                    href="mailto:dalvarez@sotsvc.com"
                    className="hover:underline"
                  >
                    dalvarez@sotsvc.com
                  </a>
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} BeatSlave Market. All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
