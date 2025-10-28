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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = status ? { status: status.toUpperCase() as any } : {};

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            track: {
              include: {
                release: {
                  include: {
                    artist: true,
                  },
                },
              },
            },
          },
        },
        downloadTokens: true,
        termsAcceptance: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    const stats = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
      _sum: {
        totalCents: true,
      },
    });

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        customerEmail: order.customerEmail,
        status: order.status,
        totalCents: order.totalCents,
        items: order.items.map((item) => ({
          trackTitle: item.track.title,
          artistName: item.track.release.artist.name,
          licenseType: item.licenseType,
          priceCents: item.priceCents,
        })),
        downloadTokens: order.downloadTokens.map((token) => ({
          token: token.token,
          expiresAt: token.expiresAt,
          usedAt: token.usedAt,
        })),
        termsAccepted: !!order.termsAcceptance,
        createdAt: order.createdAt,
      })),
      stats: stats.map((stat) => ({
        status: stat.status,
        count: stat._count,
        totalRevenue: stat._sum.totalCents || 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

