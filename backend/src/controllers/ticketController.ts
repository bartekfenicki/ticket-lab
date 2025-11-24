import { Request, Response } from "express";
import * as ticketModel from "../models/ticketModel.js";
import { v4 as uuidv4 } from "uuid";
import { generateTicketPdfBuffer } from "../utils/generateTicketPdf.js";
import nodemailer from "nodemailer";

export const createTicket = async (req: Request, res: Response) => {
  try {
    console.log("Incoming ticket creation request:", req.body); // <-- log request

    const {
      date,
      email,
      phone,
      full_name,
      other_names,
      items, // array of {id, price, quantity}
    } = req.body;

    // Validate tickets array
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Tickets array is invalid:", items); // <-- log invalid array
      return res.status(400).json({ error: "Tickets array is required" });
    }

    // Validate required fields
    if (!date || !email || !full_name) {
      console.error("Missing required fields:", { date, email, full_name }); // <-- log missing
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert numeric fields in ticket items
    for (const t of items) {
      t.quantity = Number(t.quantity);
      t.price = Number(t.price);
      if (isNaN(t.quantity) || isNaN(t.price)) {
        console.error("Invalid ticket item numbers:", t); // <-- log invalid numbers
        return res.status(400).json({ error: "Invalid ticket item numbers" });
      }
    }

    // Calculate total
    const total_price = items.reduce(
      (sum: number, t: any) => sum + t.price * t.quantity,
      0
    );

    console.log("Calculated total price:", total_price);

    // Create parent ticket
    const ticket = await ticketModel.createTicket({
      date,
      email,
      phone,
      full_name,
      other_names,
      total_price,
      payment_status: "pending",
      qr_token: uuidv4(),
    });

    console.log("Ticket created:", ticket.id);

    // Create ticket items
    for (const t of items) {
      await ticketModel.createTicketItem({
        ticket_id: ticket.id,
        ticket_type_id: Number(t.ticket_type_id),
        quantity: t.quantity,
        price: t.price,
        subtotal: t.price * t.quantity
      });
    }

   res.json(ticket);

  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const getTicket = async (req: Request, res: Response) => {
  try {
    const ticketId = Number(req.params.id);

    const ticket = await ticketModel.getTicketWithItems(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(ticket);
  } catch (err) {
    console.error("Error getting ticket:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketModel.getAllTickets();
    res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTicketsByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const tickets = await ticketModel.getTicketsByEmail(email as string);
    return res.json(tickets);
  } catch (err) {
    console.error("Error fetching tickets by email:", err);
    return res.status(500).json({ error: "Server error" });
  }
};


export const sendTicketByEmail = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const ticket = await ticketModel.getTicketWithItems(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Generate PDF buffer
    const pdfBuffer = await generateTicketPdfBuffer(ticket);

    // Email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"Your Event" <no-reply@yourdomain.com>',
      to: ticket.email,
      subject: "Your Ticket Receipt",
      text: "Attached is your ticket PDF.",
      attachments: [
        {
          filename: `ticket-${ticket.id}.pdf`,
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
