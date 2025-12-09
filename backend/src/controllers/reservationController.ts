import { Request, Response } from "express";
import * as reservationsModel from "../models/reservationModel.js";
import { generateReservationPdfBuffer } from "../utils/generateResevationPdf.js";
import nodemailer from "nodemailer";
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

export const sendReservationByEmail = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const reservation = await reservationsModel.getReservationById(id);

    if (!reservation) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Generate PDF buffer
    const pdfBuffer = await generateReservationPdfBuffer(reservation);

    // Email transporter
   const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,               // ALWAYS false for port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

    await transporter.sendMail({
      from: '"New Reservation" <no-reply@yourdomain.com>',
      to: process.env.MAIL_USER,
      subject: `Reservation request from ${reservation.first_name + " " + reservation.last_name}`,
      text: `Attached is the requested reservation summary from ${reservation.first_name + " " + reservation.last_name}. Send Payment details to ${reservation.email}. Return to the website to change the reservation status ${process.env.WEB_LINK}`,
      attachments: [
        {
          filename: `reservation-${reservation.last_name}.pdf`,
          content: pdfBuffer,
        }
      ]
    });

    return res.json({ message: "Email sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send email" });
  }
};
