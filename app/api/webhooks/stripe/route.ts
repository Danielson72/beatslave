import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { randomUUID } from "crypto";
import { sendPurchaseConfirmation, sendAdminNotification } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const order = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
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
      });

      if (!order) {
        console.error("Order not found for session:", session.id);
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        );
      }

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const downloadToken = randomUUID();

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "COMPLETED",
          downloadTokens: {
            create: {
              token: downloadToken,
              expiresAt,
            },
          },
          termsAcceptance: {
            create: {
              acceptedAt: new Date(),
              legalVersion: "v1.0",
              ipAddress: session.customer_details?.address?.country || null,
              userAgent: "stripe-checkout",
            },
          },
        },
      });

      console.log("Order completed:", order.id);

      // Send emails
      const orderItem = order.items[0];
      if (orderItem) {
        const track = orderItem.track;
        const artist = track.release.artist;

        // Send purchase confirmation to customer
        await sendPurchaseConfirmation({
          customerEmail: order.customerEmail,
          trackTitle: track.title,
          artistName: artist.name,
          licenseType: orderItem.licenseType,
          priceCents: orderItem.priceCents,
          downloadToken,
          orderId: order.id,
        });

        // Send admin notification
        await sendAdminNotification({
          customerEmail: order.customerEmail,
          trackTitle: track.title,
          artistName: artist.name,
          licenseType: orderItem.licenseType,
          priceCents: orderItem.priceCents,
          orderId: order.id,
        });
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Error processing order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

