import { Request, Response } from "express";
import * as variantsModel from "../models/optionTypeVariantsModel.js";

// GET ALL
export const getVariants = async (req: Request, res: Response) => {
  try {
    const variants = await variantsModel.getAllVariants();
    res.json(variants);
  } catch (err) {
    console.error("Error fetching variants:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET BY OPTION TYPE
export const getVariantsByOptionType = async (req: Request, res: Response) => {
  const optionTypeId = Number(req.params.optionTypeId);
  try {
    const variants = await variantsModel.getVariantsByOptionType(optionTypeId);
    res.json(variants);
  } catch (err) {
    console.error("Error fetching variants for option type:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createVariant = async (req: Request, res: Response) => {
  try {
    const variant = await variantsModel.createVariant(req.body);
    res.status(201).json(variant);
  } catch (err) {
    console.error("Error creating variant:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateVariant = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updated = await variantsModel.updateVariant(id, req.body);
    if (!updated) return res.status(404).json({ error: "Variant not found" });
    res.json(updated);
  } catch (err) {
    console.error("Error updating variant:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteVariant = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await variantsModel.deleteVariant(id);
    res.json({ message: "Variant deleted" });
  } catch (err) {
    console.error("Error deleting variant:", err);
    res.status(500).json({ error: "Server error" });
  }
};
