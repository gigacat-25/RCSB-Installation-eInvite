import nodemailer from "nodemailer";
import QRCode from "qrcode";
import { EVENT, PRIMARY_CLUB, EVENT_FLOW } from "@/lib/constants";

// ─── Transporter (lazy singleton) ────────────────────────────────────────────

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (_transporter) return _transporter;

  const host = process.env.NODEMAILER_HOST;
  const port = parseInt(process.env.NODEMAILER_PORT ?? "587", 10);
  const user = process.env.NODEMAILER_USER;
  const pass = process.env.NODEMAILER_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Nodemailer env vars missing. Add NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_USER, NODEMAILER_PASS to .env.local"
    );
  }

  _transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465 (SSL), false for 587 (TLS/STARTTLS)
    auth: { user, pass },
  });

  return _transporter;
}

// ─── Email Template Styles (Shared) ──────────────────────────────────────────

const emailStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
  body { margin: 0; padding: 0; background-color: #1a1210; color: #F5EFC8; font-family: 'Inter', sans-serif; }
  .wrapper { max-width: 600px; margin: 0 auto; background-color: #231815; }
  .header { padding: 48px 40px 32px; text-align: center; border-bottom: 1px solid rgba(245,239,200,0.08); }
  .header-micro { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(165,188,214,0.6); margin: 0 0 16px; font-weight: 300; }
  .header-title { font-family: 'Playfair Display', Georgia, serif; font-size: 38px; font-style: italic; color: #F5EFC8; margin: 0; font-weight: 400; }
  .body { padding: 36px 40px; }
  .greeting { font-size: 14px; color: rgba(165,188,214,0.9); font-weight: 300; line-height: 1.7; margin: 0 0 28px; }
  .pass { border: 1px solid rgba(245,239,200,0.15); border-radius: 16px; overflow: hidden; background: rgba(35,24,21,0.6); }
  .pass-top { padding: 24px 28px; }
  .pass-label { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(165,188,214,0.5); margin: 0 0 6px; }
  .pass-name { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-style: italic; color: #F5EFC8; margin: 0; }
  .pass-sub { font-size: 12px; color: rgba(165,188,214,0.7); margin: 4px 0 0; font-weight: 300; }
  .pass-divider { border: none; border-top: 1px dashed rgba(245,239,200,0.12); margin: 0; }
  .pass-grid { padding: 20px 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pass-cell-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(165,188,214,0.45); margin: 0 0 3px; }
  .pass-cell-value { font-size: 12px; color: rgba(255,255,255,0.82); margin: 0; font-weight: 300; }
  .pass-cell-value.status { color: #F5EFC8; }
  .pass-ref { padding: 16px 28px 24px; border-top: 1px dashed rgba(245,239,200,0.12); display: flex; justify-content: space-between; align-items: flex-end; }
  .ref-number { font-family: 'Courier New', monospace; font-size: 22px; letter-spacing: 0.18em; color: #F5EFC8; }
  .ref-host { font-size: 10px; color: rgba(255,255,255,0.4); text-align: right; line-height: 1.5; font-weight: 300; max-width: 120px; }
  .footer { padding: 28px 40px 40px; text-align: center; }
  .footer-text { font-size: 11px; color: rgba(165,188,214,0.4); font-weight: 300; letter-spacing: 0.12em; line-height: 1.8; margin: 0; }
  .divider-line { width: 48px; height: 1px; background: rgba(245,239,200,0.15); margin: 20px auto; }
  @media (max-width: 480px) {
    .header { padding: 36px 24px 24px; }
    .body { padding: 28px 24px; }
    .pass-grid { grid-template-columns: 1fr; }
    .pass-top, .pass-ref { padding-left: 20px; padding-right: 20px; }
  }
`;

// ─── RSVP Confirmation HTML Template ──────────────────────────────────────────

function buildConfirmationHtml(params: {
  fullName: string;
  clubName: string;
  designation?: string;
  reference: string;
}): string {
  const { fullName, clubName, designation, reference } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>RSVP Confirmed — UGAMA AARAMBHA</title>
  <style>
    ${emailStyles}
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="header">
      <p class="header-micro">${PRIMARY_CLUB} · ${EVENT.district}</p>
      <h1 class="header-title">${EVENT.title}</h1>
    </div>

    <div class="body">
      <p class="greeting">
        Dear <strong style="color:#F5EFC8; font-weight:400;">${fullName}</strong>,<br /><br />
        Your RSVP for <em>${EVENT.fullTitle}</em> has been confirmed. We are delighted to have you with us for this special evening.
      </p>

      <div class="pass">
        <div class="pass-top">
          <p class="pass-label">Invitation Reserved</p>
          <p class="pass-name">${fullName}</p>
          ${designation ? `<p class="pass-sub">${designation}</p>` : ""}
          <p class="pass-sub" style="margin-top:${designation ? "2px" : "4px"}">${clubName}</p>
        </div>

        <hr class="pass-divider" />

        <div class="pass-grid">
          <div>
            <p class="pass-cell-label">Event</p>
            <p class="pass-cell-value">${EVENT.title}</p>
          </div>
          <div>
            <p class="pass-cell-label">Date</p>
            <p class="pass-cell-value">${EVENT.date}</p>
          </div>
          <div>
            <p class="pass-cell-label">Venue</p>
            <p class="pass-cell-value">${EVENT.venue}</p>
          </div>
          <div>
            <p class="pass-cell-label">Status</p>
            <p class="pass-cell-value status">CONFIRMED ✓</p>
          </div>
        </div>

        <!-- Check-in QR Code Section -->
        <div style="text-align: center; padding: 28px; background: rgba(255,255,255,0.015); border-top: 1px dashed rgba(245,239,200,0.12);">
          <p class="pass-cell-label" style="margin-bottom: 12px; letter-spacing: 0.25em;">Check-in QR Code</p>
          <img src="cid:rsvp-qrcode" width="170" height="170" style="border: 3px solid #F5EFC8; border-radius: 12px; background: #FFFFFF; padding: 8px;" alt="Check-in QR Code" />
          <p style="font-size: 10px; color: rgba(165,188,214,0.5); margin: 12px 0 0; font-weight: 300; letter-spacing: 0.05em; line-height: 1.4;">
            Please present this QR code at the registration desk<br />upon arrival for automated check-in.
          </p>
        </div>

        <div class="pass-ref">
          <div>
            <p class="pass-cell-label">Reference</p>
            <p class="ref-number">${reference}</p>
          </div>
          <p class="ref-host">${PRIMARY_CLUB}</p>
        </div>
      </div>

      <div class="divider-line"></div>

      <p class="greeting" style="text-align:center; margin:0;">
        We look forward to welcoming you.<br />
        <em style="color:#F5EFC8;">See you on the 12th.</em>
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">
        ${EVENT.fullTitle} · ${EVENT.edition}<br />
        ${EVENT.date} · ${EVENT.time}<br />
        ${EVENT.venue}
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

// ─── Welcome Event Flow HTML Template ──────────────────────────────────────────

function buildWelcomeEventHtml(params: { fullName: string }): string {
  const { fullName } = params;

  // Build the list of schedule items
  const scheduleRows = EVENT_FLOW.map(
    (item) => `
    <tr style="border-b: 1px solid rgba(245,239,200,0.06);">
      <td style="padding: 12px 16px; font-size: 12px; color: #F5EFC8; font-weight: 400; font-family: monospace; white-space: nowrap; width: 80px;">
        ${item.time}
      </td>
      <td style="padding: 12px 16px; font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 300; line-height: 1.4;">
        ${item.activity}
      </td>
    </tr>
  `
  ).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to UGAMA AARAMBHA</title>
  <style>
    ${emailStyles}
    .flow-card { border: 1px solid rgba(165,188,214,0.15); border-radius: 16px; overflow: hidden; background: rgba(35,24,21,0.4); margin-top: 24px; }
    .flow-header { padding: 18px 24px; background: rgba(245,239,200,0.03); border-bottom: 1px solid rgba(245,239,200,0.08); text-align: center; }
    .flow-title { font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: #F5EFC8; font-weight: 400; margin: 0; }
    .flow-table { width: 100%; border-collapse: collapse; text-align: left; }
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="header">
      <p class="header-micro">Welcome to</p>
      <h1 class="header-title">${EVENT.title}</h1>
    </div>

    <div class="body">
      <p class="greeting" style="font-size: 15px;">
        Welcome, <strong style="color:#F5EFC8; font-weight:500;">${fullName}</strong>!
      </p>

      <p class="greeting">
        We are thrilled to welcome you to the <strong>${EVENT.fullTitle}</strong>. Your check-in has been completed successfully. 
        <br /><br />
        For your convenience, here is the official event schedule for this evening. We hope you have an inspiring and wonderful evening with us.
      </p>

      <div class="flow-card">
        <div class="flow-header">
          <p class="flow-title">Event Flow Schedule</p>
        </div>
        <table class="flow-table">
          <tbody>
            ${scheduleRows}
          </tbody>
        </table>
      </div>

      <div class="divider-line"></div>

      <p class="greeting" style="text-align:center; margin:0;">
        Thank you for joining us in celebrating this new beginning.<br />
        <em style="color:#F5EFC8;">Enjoy the installation ceremony.</em>
      </p>
    </div>

    <div class="footer">
      <p class="footer-text">
        ${PRIMARY_CLUB} · ${EVENT.district}<br />
        ${EVENT.venue}
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
}

// ─── Send Confirmation Email (With QR Code) ──────────────────────────────────

export async function sendConfirmationEmail(params: {
  toEmail: string;
  fullName: string;
  clubName: string;
  designation?: string;
  reference: string;
}): Promise<void> {
  const { toEmail, fullName, clubName, designation, reference } = params;

  const from = `${process.env.NODEMAILER_FROM_NAME ?? "UGAMA AARAMBHA"} <${
    process.env.NODEMAILER_FROM ?? process.env.NODEMAILER_USER
  }>`;

  // 1. Generate QR Code Buffer
  const qrBuffer = await QRCode.toBuffer(reference, {
    margin: 1,
    width: 320,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });

  const html = buildConfirmationHtml({ fullName, clubName, designation, reference });

  // 2. Send email with inline image attachment
  await getTransporter().sendMail({
    from,
    to: toEmail,
    replyTo: process.env.NODEMAILER_REPLY_TO ?? from,
    subject: `Your RSVP is Confirmed — ${EVENT.title} · ${EVENT.date}`,
    html,
    text: [
      `Dear ${fullName},`,
      "",
      `Your RSVP for the ${EVENT.fullTitle} (${EVENT.title}) is confirmed.`,
      "",
      `Event: ${EVENT.title}`,
      `Date: ${EVENT.date}`,
      `Time: ${EVENT.time}`,
      `Venue: ${EVENT.venue}`,
      `Reference: ${reference}`,
      "",
      `Please present this reference number or the QR code in your email upon arrival for check-in.`,
      "",
      `We look forward to welcoming you. See you on the 12th.`,
      "",
      `— ${PRIMARY_CLUB} · ${EVENT.district}`,
    ].join("\n"),
    attachments: [
      {
        filename: "qrcode.png",
        content: qrBuffer,
        cid: "rsvp-qrcode", // Matches <img src="cid:rsvp-qrcode" />
      },
    ],
  });
}

// ─── Send Welcome & Event Flow Email (Check-in trigger) ──────────────────────

export async function sendWelcomeEventEmail(params: {
  toEmail: string;
  fullName: string;
}): Promise<void> {
  const { toEmail, fullName } = params;

  const from = `${process.env.NODEMAILER_FROM_NAME ?? "UGAMA AARAMBHA"} <${
    process.env.NODEMAILER_FROM ?? process.env.NODEMAILER_USER
  }>`;

  const html = buildWelcomeEventHtml({ fullName });

  await getTransporter().sendMail({
    from,
    to: toEmail,
    replyTo: process.env.NODEMAILER_REPLY_TO ?? from,
    subject: `Welcome to ${EVENT.title} — Event Flow Schedule`,
    html,
    text: [
      `Welcome, ${fullName}!`,
      "",
      `We are thrilled to welcome you to the ${EVENT.fullTitle}. Your check-in has been completed.`,
      "",
      `Event Schedule for this evening:`,
      ...EVENT_FLOW.map((item) => `  - ${item.time}: ${item.activity}`),
      "",
      `Thank you for joining us. Enjoy the installation ceremony.`,
      "",
      `— ${PRIMARY_CLUB} · ${EVENT.district}`,
    ].join("\n"),
  });
}
