import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Music2 } from "lucide-react";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { search?: string; genre?: string; mood?: string };
}) {
  const { search, genre, mood } = searchParams;

  const tracks = await prisma.track.findMany({
    where: {
      isActive: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { tags: { hasSome: [search] } },
        ],
      }),
      ...(genre && { genre: { contains: genre, mode: "insensitive" } }),
      ...(mood && { mood: { contains: mood, mode: "insensitive" } }),
    },
    include: {
      release: {
        include: {
          artist: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Browse Beats</h1>
        <p className="text-muted-foreground">
          {tracks.length} professional beats available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <Link key={track.id} href={`/track/${track.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Music2 className="w-16 h-16 text-slate-400" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{track.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {track.release.artist.name}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {track.genre && (
                    <Badge variant="secondary">{track.genre}</Badge>
                  )}
                  {track.bpm && (
                    <Badge variant="outline">{track.bpm} BPM</Badge>
                  )}
                  {track.key && <Badge variant="outline">{track.key}</Badge>}
                </div>
                <div className="text-xl font-bold">
                  {formatPrice(track.standardPriceCents)}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {tracks.length === 0 && (
        <div className="text-center py-16">
          <Music2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">No beats found</h2>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
