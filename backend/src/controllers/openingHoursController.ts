import { Request, Response } from "express";
import * as openingHoursModel from "../models/openingHoursModel.js";

// GET ALL
export const getOpeningHours = async (req: Request, res: Response) => {
  try {
    const hours = await openingHoursModel.getAllOpeningHours();
    res.json(hours);
  } catch (err) {
    console.error("Error fetching opening hours:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET BY ID
export const getOpeningHour = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const hour = await openingHoursModel.getOpeningHourById(id);

    if (!hour) return res.status(404).json({ error: "Opening hour not found" });

    res.json(hour);
  } catch (err) {
    console.error("Error fetching opening hour:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createOpeningHour = async (req: Request, res: Response) => {
  try {
    const { day_of_week, open_time, close_time, active } = req.body;

    const newHour = await openingHoursModel.createOpeningHour(
      day_of_week, open_time, close_time, active
    );

    res.status(201).json(newHour);
  } catch (err) {
    console.error("Error creating opening hour:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateOpeningHour = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { day_of_week, open_time, close_time, active } = req.body;

    const updated = await openingHoursModel.updateOpeningHour(
      id,
      day_of_week,
      open_time,
      close_time,
      active
    );

    if (!updated) return res.status(404).json({ error: "Opening hour not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating opening hour:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteOpeningHour = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const success = await openingHoursModel.deleteOpeningHour(id);

    if (!success) return res.status(404).json({ error: "Opening hour not found" });

    res.json({ message: "Opening hour deleted" });
  } catch (err) {
    console.error("Error deleting opening hour:", err);
    res.status(500).json({ error: "Server error" });
  }
};
