import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const downloadToken = await prisma.downloadToken.findUnique({
      where: { token: params.token },
      include: {
        order: {
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
          },
        },
      },
    });

    if (!downloadToken) {
      console.error("Download token not found:", params.token);
      return NextResponse.json(
        { error: "Download token not found" },
        { status: 404 }
      );
    }

    if (downloadToken.expiresAt < new Date()) {
      console.error("Download token expired:", params.token);
      return NextResponse.json(
        { error: "Download token has expired. Please contact support if you need assistance." },
        { status: 410 }
      );
    }

    if (downloadToken.order.status !== "COMPLETED") {
      console.error("Order not completed:", downloadToken.order.id);
      return NextResponse.json(
        { error: "Order is not completed" },
        { status: 400 }
      );
    }

    const orderItem = downloadToken.order.items[0];
    if (!orderItem) {
      console.error("No track found in order:", downloadToken.order.id);
      return NextResponse.json(
        { error: "No track found in order" },
        { status: 404 }
      );
    }

    const track = orderItem.track;
    if (!track.audioUrl) {
      console.error("Track audio file not available:", track.id);
      return NextResponse.json(
        { error: "Track audio file not available" },
        { status: 404 }
      );
    }

    // Construct file path - assuming audioUrl is relative to public directory
    const filePath = join(process.cwd(), "public", track.audioUrl);

    try {
      const fileBuffer = await readFile(filePath);

      // Mark token as used
      await prisma.downloadToken.update({
        where: { id: downloadToken.id },
        data: { usedAt: new Date() },
      });

      console.log("Download successful:", {
        orderId: downloadToken.order.id,
        trackId: track.id,
        trackTitle: track.title,
        customerEmail: downloadToken.order.customerEmail,
      });

      // Determine file extension and content type
      const fileExtension = track.audioUrl.split('.').pop()?.toLowerCase() || 'wav';
      const contentType = fileExtension === 'mp3' ? 'audio/mpeg' : 'audio/wav';
      const filename = `${track.slug}-${orderItem.licenseType.toLowerCase()}.${fileExtension}`;

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": fileBuffer.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    } catch (fileError) {
      console.error("Error reading file:", fileError);
      return NextResponse.json(
        { error: "File not found on server. Please contact support." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

