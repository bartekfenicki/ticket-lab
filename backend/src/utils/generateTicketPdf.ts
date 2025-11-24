import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import type { TicketWithItems } from "../models/ticketModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const generateTicketPdfBuffer = async (ticket: TicketWithItems): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;

    // -----------------------------------------------------------------
    // LOGO
    // -----------------------------------------------------------------
   const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const logoPath = path.join(__dirname, "../assets/logo/lab-logo.jpeg");

    try {
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 20, { width: 100 }); // keep proportions
      } else {
        console.warn("Logo NOT FOUND at:", logoPath);
      }
    } catch (e) {
      console.warn("Logo load failed:", e);
    }

    // -----------------------------------------------------------------
    // HEADER
    // -----------------------------------------------------------------
      doc
      .fontSize(22)
      .text("Official Ticket", 0, 40, {
        align: "center",
        width: pageWidth
      });
    // -----------------------------------------------------------------
    // INFO BOX BACKGROUND
    // -----------------------------------------------------------------
    doc
      .rect(40, 110, pageWidth - 80, 210)
      .fill("#ffffff");

    const labelX = 60;
    const contentX = 180;
    let y = 130;
    const line = 22;

    const formattedDate = new Date(ticket.date).toLocaleDateString("pl-PL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // -----------------------------------------------------------------
    // TICKET INFO
    // -----------------------------------------------------------------
    const infoRows = [
      ["Full Name:", ticket.full_name],
      ["Email:", ticket.email],
      ["Phone:", ticket.phone || "-"],
      ["Date:", formattedDate],
      ["Total Price:", `${ticket.total_price} PLN`],
      ["Payment Status:", ticket.payment_status]
    ];

    infoRows.forEach(([label, value]) => {
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#000").text(label, labelX, y);
      doc.font("Helvetica").fontSize(12).text(value, contentX, y);
      y += line;
    });

    // -----------------------------------------------------------------
    // TABLE HEADER
    // -----------------------------------------------------------------
    y += 15;
    doc.font("Helvetica-Bold").fontSize(14).text("Tickets:", labelX, y);
    y += 25;

    doc.fontSize(12);

    doc
      .font("Helvetica-Bold")
      .text("Name", 60, y)
      .text("Qty", 200, y)
      .text("Price", 280, y)
      .text("Subtotal", 380, y);

    y += 18;
    doc.font("Helvetica");

    // -----------------------------------------------------------------
    // TABLE ROWS
    // -----------------------------------------------------------------
    ticket.items.forEach((item: any) => {
      doc.text(item.name, 60, y);
      doc.text(String(item.quantity), 200, y);
      doc.text(item.price.toFixed(2), 280, y);
      doc.text((item.quantity * item.price).toFixed(2), 380, y);
      y += 18;
    });

    // -----------------------------------------------------------------
    // QR CODE
    // -----------------------------------------------------------------
    try {
      const qrDataUrl = await QRCode.toDataURL(ticket.qr_token);
      const qrImg = qrDataUrl.replace("data:image/png;base64,", "");

      const qrBuffer = Buffer.from(qrImg, "base64");

      doc.image(qrBuffer, pageWidth - 150, 120, { width: 100 });
    } catch (err) {
      console.warn("QR generation error:", err);
    }

    // -----------------------------------------------------------------
    // FOOTER
    // -----------------------------------------------------------------
    doc
      .fontSize(10)
      .fillColor("#666")
      .text(
        "Show this ticket at the event entrance or scan the QR code for verification.",
        40,
        y + 40
      );

    doc.end();
  });
};

