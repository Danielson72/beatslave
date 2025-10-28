import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  trackId: z.string(),
  email: z.string().email(),
  acceptedTerms: z.boolean(),
  licenseType: z.enum(["STANDARD", "PREMIUM", "EXCLUSIVE"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = checkoutSchema.parse(body);

    if (!validated.acceptedTerms) {
      return NextResponse.json(
        { error: "You must accept the terms and license agreement" },
        { status: 400 }
      );
    }

    if (validated.licenseType !== "STANDARD") {
      return NextResponse.json(
        { error: "Only Standard license is available in v1.0" },
        { status: 400 }
      );
    }

    const track = await prisma.track.findUnique({
      where: { id: validated.trackId },
      include: {
        release: {
          include: {
            artist: true,
          },
        },
      },
    });

    if (!track || !track.isActive) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    const priceCents = track.standardPriceCents;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: validated.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: priceCents,
            product_data: {
              name: `${track.title} - Standard License`,
              description: `by ${track.release.artist.name} | Includes 2-Track WAV + MP3`,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/catalog`,
      metadata: {
        trackId: track.id,
        licenseType: validated.licenseType,
        acceptedTerms: "true",
      },
    });

    const order = await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        customerEmail: validated.email,
        totalCents: priceCents,
        status: "PENDING",
        items: {
          create: {
            trackId: track.id,
            licenseType: validated.licenseType,
            priceCents,
          },
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
