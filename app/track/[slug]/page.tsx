import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDuration } from "@/lib/utils";
import { Music2, Clock, Music } from "lucide-react";
import { PurchaseSection } from "./purchase-section";

export default async function TrackPage({
  params,
}: {
  params: { slug: string };
}) {
  const track = await prisma.track.findUnique({
    where: { slug: params.slug },
    include: {
      release: {
        include: {
          artist: true,
        },
      },
    },
  });

  if (!track || !track.isActive) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mb-4">
            <Music2 className="w-32 h-32 text-slate-400" />
          </div>

          {track.previewUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <audio
                  controls
                  className="w-full"
                  preload="metadata"
                  src={track.previewUrl}
                >
                  Your browser does not support audio playback.
                </audio>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{track.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">
              {track.release.artist.name}
            </p>
            <p className="text-sm text-muted-foreground">
              from {track.release.title}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {track.genre && <Badge variant="secondary">{track.genre}</Badge>}
            {track.mood && <Badge variant="secondary">{track.mood}</Badge>}
            {track.bpm && <Badge variant="outline">{track.bpm} BPM</Badge>}
            {track.key && <Badge variant="outline">{track.key}</Badge>}
            {track.duration && (
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(track.duration)}
              </Badge>
            )}
          </div>

          {track.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {track.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Card className="mb-6 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Standard License - {formatPrice(track.standardPriceCents)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-sm">
                    <strong>Includes:</strong> 2-Track WAV + MP3 high-quality
                    downloads
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-sm">
                    <strong>License:</strong> Commercial use allowed
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-sm">
                    <strong>Support:</strong> 24-hour download access
                  </p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>Need stems?</strong> Separate track stems available
                    upon request.
                    <br />
                    Contact:{" "}
                    <a
                      href="mailto:dalvarez@sotsvc.com"
                      className="text-primary hover:underline"
                    >
                      dalvarez@sotsvc.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <PurchaseSection
            trackId={track.id}
            price={formatPrice(track.standardPriceCents)}
          />
        </div>
      </div>
    </div>
  );
}
