import { Request, Response } from "express";
import * as closedDaysModel from "../models/closedDaysModel.js";

// GET ALL
export const getClosedDays = async (req: Request, res: Response) => {
  try {
    const days = await closedDaysModel.getAllClosedDays();
    res.json(days);
  } catch (err) {
    console.error("Error fetching closed days:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET BY ID
export const getClosedDay = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const day = await closedDaysModel.getClosedDayById(id);

    if (!day) return res.status(404).json({ error: "Closed day not found" });

    res.json(day);
  } catch (err) {
    console.error("Error fetching closed day:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createClosedDay = async (req: Request, res: Response) => {
  try {
    const { date, reason, created_by } = req.body;

    const newDay = await closedDaysModel.createClosedDay(date, reason, created_by);

    res.status(201).json(newDay);
  } catch (err) {
    console.error("Error creating closed day:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateClosedDay = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { date, reason } = req.body;

    const updated = await closedDaysModel.updateClosedDay(id, date, reason);

    if (!updated) return res.status(404).json({ error: "Closed day not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating closed day:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteClosedDay = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const success = await closedDaysModel.deleteClosedDay(id);

    if (!success) return res.status(404).json({ error: "Closed day not found" });

    res.json({ message: "Closed day deleted" });
  } catch (err) {
    console.error("Error deleting closed day:", err);
    res.status(500).json({ error: "Server error" });
  }
};
