import { Request, Response } from "express";
import * as ticketModel from "../models/ticketModel.js";
import { v4 as uuidv4 } from "uuid";
import { generateTicketPdfBuffer } from "../utils/generateTicketPdf.js";
import { Resend } from "resend";

export const createTicket = async (req: Request, res: Response) => {
  try {

    const {
      date,
      email,
      phone,
      full_name,
      other_names,
      items,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("Tickets array is invalid:", items); // <-- log invalid array
      return res.status(400).json({ error: "Tickets array is required" });
    }

    if (!date || !email || !full_name) {
      console.error("Missing required fields:", { date, email, full_name }); // <-- log missing
      return res.status(400).json({ error: "Missing required fields" });
    }

    for (const t of items) {
      t.quantity = Number(t.quantity);
      t.price = Number(t.price);
      if (isNaN(t.quantity) || isNaN(t.price)) {
        console.error("Invalid ticket item numbers:", t);
        return res.status(400).json({ error: "Invalid ticket item numbers" });
      }
    }

    const total_price = items.reduce(
      (sum: number, t: any) => sum + t.price * t.quantity,
      0
    );

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

export const updateTicketController = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const updated = await ticketModel.updateTicket(id, data);

    if (!updated) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update ticket error:", error);
    res.status(500).json({ error: "Failed to update ticket" });
  }
};


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTicketByEmail = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const ticket = await ticketModel.getTicketWithItems(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    const pdfBuffer = await generateTicketPdfBuffer(ticket);

    const emailResponse = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: ticket.email,
      subject: `Your Ticket #${ticket.id}`,
      text: `Hello ${ticket.full_name},

        Attached is your ticket receipt.

        Thank you for your purchase!
        ${process.env.WEB_LINK}`,
      attachments: [
        {
          filename: `ticket-${ticket.id}.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    console.log("RESEND TICKET EMAIL RESPONSE:", emailResponse);

    return res.json({ message: "Email sent" });

  } catch (err) {
    console.error("Resend Ticket Email Error:", err);
    return res.status(500).json({ message: "Failed to send email" });
  }
};
