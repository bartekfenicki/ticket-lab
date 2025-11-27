import { Request, Response } from "express";
import * as addOnsModel from "../models/addOnModel.js";

// GET ALL
export const getAddOns = async (req: Request, res: Response) => {
  try {
    const addOns = await addOnsModel.getAllAddOns();
    res.json(addOns);
  } catch (err) {
    console.error("Error fetching add-ons:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET BY OPTION TYPE
export const getAddOnsByOptionType = async (req: Request, res: Response) => {
  const optionTypeId = Number(req.params.optionTypeId);
  try {
    const addOns = await addOnsModel.getAddOnsByOptionType(optionTypeId);
    res.json(addOns);
  } catch (err) {
    console.error("Error fetching add-ons for option type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createAddOn = async (req: Request, res: Response) => {
  try {
    const addOn = await addOnsModel.createAddOn(req.body);
    res.status(201).json(addOn);
  } catch (err) {
    console.error("Error creating add-on:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateAddOn = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updated = await addOnsModel.updateAddOn(id, req.body);
    if (!updated) return res.status(404).json({ error: "Add-on not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating add-on:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteAddOn = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await addOnsModel.deleteAddOn(id);
    res.json({ message: "Add-on deleted" });
  } catch (err) {
    console.error("Error deleting add-on:", err);
    res.status(500).json({ error: "Server error" });
  }
};
