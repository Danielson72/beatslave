import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download } from "lucide-react";
import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid Session</h1>
        <p className="text-muted-foreground mb-4">
          No session ID provided. Please check your email for the download link.
        </p>
        <Link href="/catalog">
          <Button>Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
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
    },
  });

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-4">
          We couldn't find your order. Please contact support if you completed
          payment.
        </p>
        <Link href="/catalog">
          <Button>Back to Catalog</Button>
        </Link>
      </div>
    );
  }

  const track = order.items[0]?.track;
  const downloadToken = order.downloadTokens[0];

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Purchase Complete!</h1>
        <p className="text-muted-foreground">
          Thank you for your purchase. Your download is ready.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-sm">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-sm">{order.customerEmail}</p>
          </div>
          {track && (
            <div>
              <p className="text-sm text-muted-foreground">Track</p>
              <p className="font-semibold">{track.title}</p>
              <p className="text-sm text-muted-foreground">
                by {track.release.artist.name}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">License Type</p>
            <p className="text-sm">{order.items[0]?.licenseType}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount Paid</p>
            <p className="font-semibold">
              ${(order.totalCents / 100).toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {downloadToken && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Your Track
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your download link is valid for 24 hours. You can download the
              track multiple times within this period.
            </p>
            <a
              href={`/api/download/${downloadToken.token}`}
              download
              className="block"
            >
              <Button className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Now (WAV)
              </Button>
            </a>
            <p className="text-xs text-center text-muted-foreground">
              Expires: {downloadToken.expiresAt.toLocaleString()}
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm font-semibold mb-2">What's Included:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ High-quality WAV file (uncompressed)</li>
                <li>✓ MP3 file (320kbps)</li>
                <li>✓ Standard License for commercial use</li>
              </ul>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Need stems?</strong> Contact us at{" "}
                <a
                  href="mailto:dalvarez@sotsvc.com"
                  className="text-primary hover:underline"
                >
                  dalvarez@sotsvc.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center mt-8">
        <Link href="/catalog">
          <Button variant="outline">Browse More Beats</Button>
        </Link>
      </div>
    </div>
  );
}
