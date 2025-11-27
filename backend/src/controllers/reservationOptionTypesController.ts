import { Request, Response } from "express";
import * as optionTypesModel from "../models/reservationOptionTypesModel.js";

// GET ALL
export const getOptionTypes = async (req: Request, res: Response) => {
  try {
    const options = await optionTypesModel.getAllOptionTypes();
    res.json(options);
  } catch (err) {
    console.error("Error fetching option types:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ONE
export const getOptionType = async (req: Request, res: Response) => {
  try {
    const option = await optionTypesModel.getOptionTypeById(Number(req.params.id));
    if (!option) return res.status(404).json({ error: "Option type not found" });

    res.json(option);
  } catch (err) {
    console.error("Error fetching option type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createNewOptionType = async (req: Request, res: Response) => {
  try {
    const created = await optionTypesModel.createOptionType(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating option type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateExistingOptionType = async (req: Request, res: Response) => {
  try {
    const updated = await optionTypesModel.updateOptionType(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: "Option type not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating option type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteExistingOptionType = async (req: Request, res: Response) => {
  try {
    await optionTypesModel.deleteOptionType(Number(req.params.id));
    res.json({ message: "Option type deleted" });
  } catch (err) {
    console.error("Error deleting option type:", err);
    res.status(500).json({ error: "Server error" });
  }
};
