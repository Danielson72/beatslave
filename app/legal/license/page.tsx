export default function LicensePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Standard License Agreement</h1>

      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">License Grant</h2>
          <p className="text-muted-foreground">
            This Standard License grants you the non-exclusive right to use the
            purchased instrumental beat in accordance with the terms below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What You Can Do</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>
              Create one (1) commercial recording using the licensed beat
            </li>
            <li>Distribute up to 2,000 copies (physical and digital combined)</li>
            <li>
              Perform the recording publicly (live performances, radio, etc.)
            </li>
            <li>Upload to streaming platforms (Spotify, Apple Music, etc.)</li>
            <li>
              Monetize recordings on YouTube, SoundCloud, and social media
            </li>
            <li>Use in non-profit performances and promotional materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What You Cannot Do</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
            <li>Claim exclusive ownership of the beat</li>
            <li>Resell, lease, or license the beat to third parties</li>
            <li>Use the beat in more than one (1) recording</li>
            <li>Register the beat composition with a performance rights organization as your own work</li>
            <li>Sample or replay the beat in other productions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Producer Credit</h2>
          <p className="text-muted-foreground">
            You must provide appropriate credit to the producer in the following
            format:
          </p>
          <div className="bg-muted p-4 rounded-md mt-2 font-mono text-sm">
            Produced by [Producer Name]
          </div>
          <p className="text-muted-foreground mt-2">
            Credit must appear in the song title, description, or liner notes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">File Delivery</h2>
          <p className="text-muted-foreground mb-2">
            Your purchase includes:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
            <li>2-Track WAV file (uncompressed, highest quality)</li>
            <li>MP3 file (320kbps)</li>
          </ul>
          <p className="text-muted-foreground mt-2">
            Stems (individual track elements) are available separately. Contact{" "}
            <a
              href="mailto:dalvarez@sotsvc.com"
              className="text-primary hover:underline"
            >
              dalvarez@sotsvc.com
            </a>{" "}
            for pricing and availability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Copyright</h2>
          <p className="text-muted-foreground">
            The producer retains 100% ownership of the underlying musical
            composition. You own the master recording of your vocal performance
            over the beat, subject to the terms of this license.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Upgrades</h2>
          <p className="text-muted-foreground">
            If you exceed the distribution limits or need additional rights,
            please contact us to upgrade your license. Unauthorized use beyond
            the scope of this license may result in legal action.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Termination</h2>
          <p className="text-muted-foreground">
            This license is perpetual unless terminated for breach. Upon
            termination, you must cease all use of the beat and destroy all
            copies in your possession.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Questions</h2>
          <p className="text-muted-foreground">
            For licensing questions or to request custom terms, contact{" "}
            <a
              href="mailto:dalvarez@sotsvc.com"
              className="text-primary hover:underline"
            >
              dalvarez@sotsvc.com
            </a>
          </p>
        </section>

        <div className="pt-8 border-t text-sm text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <p>Version: 1.0 - Standard License</p>
        </div>
      </div>
    </div>
  );
}
