interface PurchaseConfirmationData {
  customerEmail: string;
  trackTitle: string;
  artistName: string;
  licenseType: string;
  priceCents: number;
  downloadToken: string;
  orderId: string;
}

export function generatePurchaseConfirmationEmail(data: PurchaseConfirmationData) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://beatslave.vercel.app";
  const downloadUrl = `${baseUrl}/api/download/${data.downloadToken}`;
  const priceFormatted = `$${(data.priceCents / 100).toFixed(2)}`;

  const subject = `Your BeatSlave Purchase: ${data.trackTitle}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #000;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      margin-bottom: 30px;
    }
    .track-info {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .track-info h2 {
      margin: 0 0 10px 0;
      font-size: 20px;
    }
    .track-info p {
      margin: 5px 0;
      color: #666;
    }
    .download-button {
      display: inline-block;
      background-color: #000;
      color: #fff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .download-button:hover {
      background-color: #333;
    }
    .license-info {
      background-color: #fffbea;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .order-details {
      font-size: 14px;
      color: #666;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎵 BeatSlave Market</h1>
    </div>

    <div class="content">
      <h2>Thank you for your purchase!</h2>
      <p>Your payment has been processed successfully. You can now download your track.</p>

      <div class="track-info">
        <h2>${data.trackTitle}</h2>
        <p><strong>Artist:</strong> ${data.artistName}</p>
        <p><strong>License:</strong> ${data.licenseType}</p>
        <p><strong>Price:</strong> ${priceFormatted}</p>
      </div>

      <div style="text-align: center;">
        <a href="${downloadUrl}" class="download-button">
          Download Your Track
        </a>
      </div>

      <div class="license-info">
        <p><strong>⚠️ Important:</strong> Your download link is valid for <strong>24 hours</strong>. Please download your files before the link expires.</p>
      </div>

      <div class="order-details">
        <p><strong>Order ID:</strong> ${data.orderId}</p>
        <p><strong>Download Link:</strong><br>
        <a href="${downloadUrl}" style="color: #0066cc; word-break: break-all;">${downloadUrl}</a></p>
      </div>

      <p style="margin-top: 30px;">
        <strong>What's included:</strong>
      </p>
      <ul>
        <li>High-quality WAV file (uncompressed)</li>
        <li>MP3 file (320kbps)</li>
        <li>${data.licenseType} License Agreement</li>
      </ul>

      <p style="margin-top: 20px;">
        If you have any questions or issues with your download, please contact us at <a href="mailto:${process.env.RESEND_TO}">${process.env.RESEND_TO}</a>.
      </p>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} BeatSlave Market. All rights reserved.</p>
      <p>This email was sent to ${data.customerEmail}</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
BeatSlave Market - Purchase Confirmation

Thank you for your purchase!

Track: ${data.trackTitle}
Artist: ${data.artistName}
License: ${data.licenseType}
Price: ${priceFormatted}

Download your track here (valid for 24 hours):
${downloadUrl}

Order ID: ${data.orderId}

What's included:
- High-quality WAV file (uncompressed)
- MP3 file (320kbps)
- ${data.licenseType} License Agreement

If you have any questions, contact us at ${process.env.RESEND_TO}

© ${new Date().getFullYear()} BeatSlave Market
  `.trim();

  return { subject, html, text };
}

interface AdminNotificationData {
  customerEmail: string;
  trackTitle: string;
  artistName: string;
  licenseType: string;
  priceCents: number;
  orderId: string;
}

export function generateAdminNotificationEmail(data: AdminNotificationData) {
  const priceFormatted = `$${(data.priceCents / 100).toFixed(2)}`;
  const subject = `🔔 New Sale: ${data.trackTitle} - ${priceFormatted}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
    }
    .header {
      background-color: #10b981;
      color: white;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .info-row {
      padding: 10px 0;
      border-bottom: 1px solid #e5e5e5;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .label {
      font-weight: 600;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">💰 New Purchase Received</h2>
    </div>

    <div class="info-row">
      <span class="label">Track:</span> ${data.trackTitle}
    </div>
    <div class="info-row">
      <span class="label">Artist:</span> ${data.artistName}
    </div>
    <div class="info-row">
      <span class="label">License:</span> ${data.licenseType}
    </div>
    <div class="info-row">
      <span class="label">Price:</span> ${priceFormatted}
    </div>
    <div class="info-row">
      <span class="label">Customer:</span> ${data.customerEmail}
    </div>
    <div class="info-row">
      <span class="label">Order ID:</span> ${data.orderId}
    </div>
    <div class="info-row">
      <span class="label">Time:</span> ${new Date().toLocaleString()}
    </div>
  </div>
</body>
</html>
  `;

  const text = `
New BeatSlave Purchase

Track: ${data.trackTitle}
Artist: ${data.artistName}
License: ${data.licenseType}
Price: ${priceFormatted}
Customer: ${data.customerEmail}
Order ID: ${data.orderId}
Time: ${new Date().toLocaleString()}
  `.trim();

  return { subject, html, text };
}

