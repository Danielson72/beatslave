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
                track: true,
              },
            },
          },
        },
      },
    });

    if (!downloadToken) {
      return NextResponse.json(
        { error: "Download token not found" },
        { status: 404 }
      );
    }

    if (downloadToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Download token has expired" },
        { status: 410 }
      );
    }

    if (downloadToken.order.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "Order is not completed" },
        { status: 400 }
      );
    }

    const orderItem = downloadToken.order.items[0];
    if (!orderItem) {
      return NextResponse.json(
        { error: "No track found in order" },
        { status: 404 }
      );
    }

    const track = orderItem.track;
    if (!track.audioUrl) {
      return NextResponse.json(
        { error: "Track audio file not available" },
        { status: 404 }
      );
    }

    const filePath = join(process.cwd(), "public", track.audioUrl);

    try {
      const fileBuffer = await readFile(filePath);

      await prisma.downloadToken.update({
        where: { id: downloadToken.id },
        data: { usedAt: new Date() },
      });

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "audio/wav",
          "Content-Disposition": `attachment; filename="${track.slug}.wav"`,
          "Content-Length": fileBuffer.length.toString(),
        },
      });
    } catch (fileError) {
      console.error("Error reading file:", fileError);
      return NextResponse.json(
        { error: "File not found on server" },
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
