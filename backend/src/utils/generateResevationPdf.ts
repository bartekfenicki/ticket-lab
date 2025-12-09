import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import type { Reservation } from "../models/reservationModel.js";

export const generateReservationPdfBuffer = async (reservation: Reservation): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const chunks: Buffer[] = [];

    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;

    // Logo path
    const logoPath = path.join(process.cwd(), "public/logo/lab-logo.jpeg");

    // -------------------------------------------------------
    // LOGO
    // -------------------------------------------------------
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 40, 20, { width: 100 });
    }

    // -------------------------------------------------------
    // TITLE
    // -------------------------------------------------------
    doc
      .fontSize(24)
      .text("Reservation Summary", 0, 40, {
        align: "center",
        width: pageWidth,
      });

    // -------------------------------------------------------
    // CUSTOMER DETAILS
    // -------------------------------------------------------
    const labelX = 60;
    const valueX = 220;
    let y = 120;
    const line = 22;

    const formattedDate = new Date(reservation.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const fullName = `${reservation.first_name} ${reservation.last_name}`;

    const customerInfo = [
      ["Reservation ID:", reservation.id],
      ["Full Name:", fullName],
      ["Email:", reservation.email],
      ["Phone:", reservation.phone || "-"],
      ["Date:", formattedDate],
      ["Start Time:", reservation.start_time],
      ["Guests:", reservation.num_people],
      ["Payment Method:", reservation.payment_method],
      ["Payment Status:", reservation.payment_status],
      ["Total Price:", `${reservation.total_price} PLN`],
    ];

    doc.font("Helvetica-Bold").fontSize(14).text("Customer Details", labelX, y - 20);
    doc.font("Helvetica");

    customerInfo.forEach(([label, value]) => {
  doc.font("Helvetica-Bold").text(String(label), labelX, y);
  doc.font("Helvetica").text(String(value), valueX, y);
  y += line;
});

    // -------------------------------------------------------
    // SELECTED VARIANT
    // -------------------------------------------------------
    const variant = reservation.selected_variant;

    y += 10;
    doc.font("Helvetica-Bold").fontSize(14).text("Reservation Variant", labelX, y);
    y += 25;

    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("Name", labelX, y);
    doc.text("Pricing", 250, y);
    doc.text("Price", 350, y);
    doc.text("Subtotal", 450, y);
    y += 18;

    const variantSubtotal =
      variant.pricing_type === "per_person"
        ? variant.price * reservation.num_people
        : variant.price;

    doc.font("Helvetica").fontSize(12);
    doc.text(variant.name, labelX, y);
    doc.text(variant.pricing_type, 250, y);
    doc.text(`${variant.price} PLN`, 350, y);
    doc.text(`${variantSubtotal} PLN`, 450, y);
    y += 30;

    // -------------------------------------------------------
    // ADD-ONS
    // -------------------------------------------------------
    doc.font("Helvetica-Bold").fontSize(14).text("Add-Ons", labelX, y);
    y += 25;

    if (reservation.selected_add_ons.length === 0) {
      doc.fontSize(12).text("No add-ons selected.", labelX, y);
      y += 30;
    } else {
      doc.font("Helvetica-Bold").fontSize(12);
      doc.text("Add-On", labelX, y);
      doc.text("Pricing", 250, y);
      doc.text("Price", 330, y);
      doc.text("Subtotal", 430, y);
      y += 18;

      doc.font("Helvetica").fontSize(12);

      reservation.selected_add_ons.forEach(add => {
        const subtotal =
          add.pricing_type === "per_person"
            ? add.price * reservation.num_people
            : add.price;

        doc.text(add.name, labelX, y);
        doc.text(add.pricing_type, 250, y);
        doc.text(`${add.price} PLN`, 330, y);
        doc.text(`${subtotal} PLN`, 430, y);

        y += 18;
      });

      y += 20;
    }

    // -------------------------------------------------------
    // QR CODE
    // -------------------------------------------------------
    try {
      const qrData = await QRCode.toDataURL(String(reservation.id));
      const qrBuffer = Buffer.from(qrData.replace("data:image/png;base64,", ""), "base64");
      doc.image(qrBuffer, pageWidth - 160, 120, { width: 110 });
    } catch {
      console.warn("QR code generation failed");
    }

    // -------------------------------------------------------
    // FOOTER
    // -------------------------------------------------------
    doc
      .fontSize(10)
      .fillColor("#666")
      .text("Thank you for your reservation. Please show this PDF or the QR code on arrival.", 40, doc.page.height - 60, {
        align: "center",
      });

    doc.end();
  });
};
