import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const trackUploadSchema = z.object({
  artistName: z.string().min(1),
  artistSlug: z.string().min(1),
  releaseName: z.string().min(1),
  releaseSlug: z.string().min(1),
  trackTitle: z.string().min(1),
  trackSlug: z.string().min(1),
  bpm: z.number().optional(),
  key: z.string().optional(),
  genre: z.string().optional(),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
  standardPrice: z.number().min(0).default(99),
  isActive: z.boolean().default(true),
  audioUrl: z.string().optional(),
  previewUrl: z.string().optional(),
  coverUrl: z.string().optional(),
});

function verifyAdminAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error("ADMIN_PASSWORD not configured");
    return false;
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === adminPassword;
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(req)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = trackUploadSchema.parse(body);

    // Create or find artist
    let artist = await prisma.artist.findUnique({
      where: { slug: validated.artistSlug },
    });

    if (!artist) {
      artist = await prisma.artist.create({
        data: {
          name: validated.artistName,
          slug: validated.artistSlug,
        },
      });
    }

    // Create or find release
    let release = await prisma.release.findUnique({
      where: { slug: validated.releaseSlug },
    });

    if (!release) {
      release = await prisma.release.create({
        data: {
          title: validated.releaseName,
          slug: validated.releaseSlug,
          artistId: artist.id,
          coverUrl: validated.coverUrl,
        },
      });
    }

    // Check if track already exists
    const existingTrack = await prisma.track.findUnique({
      where: { slug: validated.trackSlug },
    });

    if (existingTrack) {
      return NextResponse.json(
        { error: "Track with this slug already exists" },
        { status: 400 }
      );
    }

    // Create track
    const track = await prisma.track.create({
      data: {
        title: validated.trackTitle,
        slug: validated.trackSlug,
        releaseId: release.id,
        audioUrl: validated.audioUrl,
        previewUrl: validated.previewUrl,
        bpm: validated.bpm,
        key: validated.key,
        genre: validated.genre,
        mood: validated.mood,
        tags: validated.tags || [],
        standardPriceCents: validated.standardPrice,
        priceCents: validated.standardPrice,
        isActive: validated.isActive,
      },
      include: {
        release: {
          include: {
            artist: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      track: {
        id: track.id,
        title: track.title,
        slug: track.slug,
        artist: track.release.artist.name,
        release: track.release.title,
      },
    });
  } catch (error) {
    console.error("Track upload error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create track" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(req)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tracks = await prisma.track.findMany({
      include: {
        release: {
          include: {
            artist: true,
          },
        },
        orderItems: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      tracks: tracks.map((track) => ({
        id: track.id,
        title: track.title,
        slug: track.slug,
        artist: track.release.artist.name,
        release: track.release.title,
        bpm: track.bpm,
        key: track.key,
        genre: track.genre,
        mood: track.mood,
        tags: track.tags,
        priceCents: track.standardPriceCents,
        isActive: track.isActive,
        salesCount: track.orderItems.length,
        createdAt: track.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracks" },
      { status: 500 }
    );
  }
}

