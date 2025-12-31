import { Request, Response } from "express";
import * as reservationsModel from "../models/reservationModel.js";
import { generateReservationPdfBuffer } from "../utils/generateResevationPdf.js";
import { Resend } from "resend";
// GET ALL
export const getReservations = async (req: Request, res: Response) => {
  try {
    const reservations = await reservationsModel.getAllReservations();
    res.json(reservations);
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ONE
export const getReservation = async (req: Request, res: Response) => {
  try {
    const reservation = await reservationsModel.getReservationById(Number(req.params.id));
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });
    res.json(reservation);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createNewReservation = async (req: Request, res: Response) => {
  try {
    const created = await reservationsModel.createReservation(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating reservation:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateExistingReservation = async (req: Request, res: Response) => {
  try {
    const updated = await reservationsModel.updateReservation(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Reservation not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteExistingReservation = async (req: Request, res: Response) => {
  try {
    await reservationsModel.deleteReservation(Number(req.params.id));
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendReservationByEmail = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const reservation = await reservationsModel.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Generate PDF buffer
    const pdfBuffer = await generateReservationPdfBuffer(reservation);

    // Send email with Resend
    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: process.env.MAIL_USER!,
      subject: `Reservation request from ${reservation.first_name} ${reservation.last_name}`,
      text: `Attached is the reservation summary for ${reservation.first_name} ${reservation.last_name}.
            Send payment details to ${reservation.email}.
            Manage reservation here: ${process.env.WEB_LINK}`,

      attachments: [
        {
          filename: `reservation-${reservation.last_name}.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ]
    });

    console.log("RESEND EMAIL RESPONSE:", emailResponse);

    return res.json({ message: "Email sent" });

  } catch (err) {
    console.error("Resend email error:", err);
    return res.status(500).json({ message: "Failed to send email" });
  }
};
