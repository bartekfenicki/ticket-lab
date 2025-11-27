import { Request, Response } from "express";
import * as optionsModel from "../models/reservationOptionsModel.js";

// GET ALL
export const getReservationOptions = async (req: Request, res: Response) => {
  try {
    const options = await optionsModel.getAllReservationOptions();
    res.json(options);
  } catch (err) {
    console.error("Error fetching reservation options:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ONE
export const getReservationOption = async (req: Request, res: Response) => {
  try {
    const option = await optionsModel.getReservationOptionById(Number(req.params.id));
    if (!option) return res.status(404).json({ error: "Reservation option not found" });

    res.json(option);
  } catch (err) {
    console.error("Error fetching reservation option:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET OPTIONS FOR A RESERVATION
export const getReservationOptionsForReservation = async (
  req: Request,
  res: Response
) => {
  try {
    const reservationId = Number(req.params.reservationId);
    const options = await optionsModel.getOptionsByReservationId(reservationId);
    res.json(options);
  } catch (err) {
    console.error("Error fetching reservation’s options:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createNewReservationOption = async (req: Request, res: Response) => {
  try {
    const created = await optionsModel.createReservationOption(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating reservation option:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateExistingReservationOption = async (
  req: Request,
  res: Response
) => {
  try {
    const updated = await optionsModel.updateReservationOption(
      Number(req.params.id),
      req.body
    );
    if (!updated) return res.status(404).json({ error: "Reservation option not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating reservation option:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteExistingReservationOption = async (
  req: Request,
  res: Response
) => {
  try {
    await optionsModel.deleteReservationOption(Number(req.params.id));
    res.json({ message: "Reservation option deleted" });
  } catch (err) {
    console.error("Error deleting reservation option:", err);
    res.status(500).json({ error: "Server error" });
  }
};
