import { Request, Response } from "express";
import * as ticketTypeModel  from "../models/ticketTypeModel.js";

// GET ALL TICKET TYPES
export const getTicketTypes = async (req: Request, res: Response) => {
  try {
    const ticketTypes = await ticketTypeModel.getAllTicketTypes();
    res.json(ticketTypes);
  } catch (err) {
    console.error("Error fetching ticket types:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ONE BY ID
export const getTicketType = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const ticketType = await ticketTypeModel.getTicketTypeById(id);
    if (!ticketType) {
      return res.status(404).json({ error: "Ticket type not found" });
    }

    res.json(ticketType);
  } catch (err) {
    console.error("Error fetching ticket type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createNewTicketType = async (req: Request, res: Response) => {
  try {
    const created = await ticketTypeModel.createTicketType(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating ticket type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateExistingTicketType = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const updated = await ticketTypeModel.updateTicketType(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Ticket type not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating ticket type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteExistingTicketType = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await ticketTypeModel.deleteTicketType(id);
    res.json({ message: "Ticket type deleted" });
  } catch (err) {
    console.error("Error deleting ticket type:", err);
    res.status(500).json({ error: "Server error" });
  }
};
