import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    if (!verifyAdminAuth(req)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Total revenue
    const revenueStats = await prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: {
        totalCents: true,
      },
      _count: true,
    });

    // Revenue by license type
    const revenueByLicense = await prisma.orderItem.groupBy({
      by: ["licenseType"],
      _sum: {
        priceCents: true,
      },
      _count: true,
    });

    // Top selling tracks
    const topTracks = await prisma.orderItem.groupBy({
      by: ["trackId"],
      _count: true,
      _sum: {
        priceCents: true,
      },
      orderBy: {
        _count: {
          trackId: "desc",
        },
      },
      take: 10,
    });

    const trackDetails = await prisma.track.findMany({
      where: {
        id: {
          in: topTracks.map((t) => t.trackId),
        },
      },
      include: {
        release: {
          include: {
            artist: true,
          },
        },
      },
    });

    const topTracksWithDetails = topTracks.map((stat) => {
      const track = trackDetails.find((t) => t.id === stat.trackId);
      return {
        trackId: stat.trackId,
        trackTitle: track?.title || "Unknown",
        artistName: track?.release.artist.name || "Unknown",
        salesCount: stat._count,
        totalRevenue: stat._sum.priceCents || 0,
      };
    });

    // Recent sales (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSales = await prisma.order.count({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const recentRevenue = await prisma.order.aggregate({
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        totalCents: true,
      },
    });

    // Total tracks and artists
    const totalTracks = await prisma.track.count();
    const activeTracks = await prisma.track.count({
      where: { isActive: true },
    });
    const totalArtists = await prisma.artist.count();

    // Download token usage
    const totalTokens = await prisma.downloadToken.count();
    const usedTokens = await prisma.downloadToken.count({
      where: {
        usedAt: {
          not: null,
        },
      },
    });
    const expiredTokens = await prisma.downloadToken.count({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        usedAt: null,
      },
    });

    return NextResponse.json({
      revenue: {
        total: revenueStats._sum.totalCents || 0,
        totalOrders: revenueStats._count,
        last30Days: recentRevenue._sum.totalCents || 0,
        last30DaysOrders: recentSales,
        byLicenseType: revenueByLicense.map((stat) => ({
          licenseType: stat.licenseType,
          revenue: stat._sum.priceCents || 0,
          count: stat._count,
        })),
      },
      catalog: {
        totalTracks,
        activeTracks,
        totalArtists,
      },
      topTracks: topTracksWithDetails,
      downloads: {
        totalTokens,
        usedTokens,
        expiredTokens,
        unusedTokens: totalTokens - usedTokens - expiredTokens,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

