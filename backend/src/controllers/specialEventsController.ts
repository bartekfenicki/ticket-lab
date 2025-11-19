import { Request, Response } from "express";
import * as specialEventsModel from "../models/specialEventsModel.js";

// GET ALL
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await specialEventsModel.getAllEvents();
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET BY ID
export const getEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const event = await specialEventsModel.getEventById(id);
    if (!event) {
      return res.status(404).json({ error: "Special event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createNewEvent = async (req: Request, res: Response) => {
  try {
    const created = await specialEventsModel.createEvent(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateExistingEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const updated = await specialEventsModel.updateEvent(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteExistingEvent = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await specialEventsModel.deleteEvent(id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Server error" });
  }
};
