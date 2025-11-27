import { Request, Response } from "express";
import * as reservationsModel from "../models/reservationModel.js";

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
