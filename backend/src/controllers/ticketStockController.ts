import { Request, Response } from "express";
import * as ticketStockModel from "../models/ticketStockModel.js";

// GET ALL
export const getStocks = async (req: Request, res: Response) => {
  try {
    const stock = await ticketStockModel.getAllStock();
    res.json(stock);
  } catch (err) {
    console.error("Error fetching ticket stock:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET BY ID
export const getStock = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const stock = await ticketStockModel.getStockById(id);
    if (!stock) {
      return res.status(404).json({ error: "Stock record not found" });
    }

    res.json(stock);
  } catch (err) {
    console.error("Error fetching stock:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const fetchStockByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query
    if (!date) return res.status(400).json({ message: "Date required" })

    const stock = await ticketStockModel.getStockByDate(date as string)
    res.json(stock || null)
  } catch (err) {
    res.status(500).json({ message: "Failed to get stock by date" + err })
  }
}

// CREATE
export const createNewStock = async (req: Request, res: Response) => {
  try {
    const created = await ticketStockModel.createStock(req.body);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating stock record:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE
export const updateExistingStock = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const updated = await ticketStockModel.updateStock(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Stock record not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteExistingStock = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await ticketStockModel.deleteStock(id);
    res.json({ message: "Stock entry deleted" });
  } catch (err) {
    console.error("Error deleting stock:", err);
    res.status(500).json({ error: "Server error" });
  }
};
