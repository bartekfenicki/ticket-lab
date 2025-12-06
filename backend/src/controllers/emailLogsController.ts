import { Request, Response } from "express";
import * as emailLogsModel from "../models/emailLogsModel.js";

// GET ALL
export const getEmailLogs = async (req: Request, res: Response) => {
  try {
    const logs = await emailLogsModel.getAllEmailLogs();
    res.json(logs);
  } catch (err) {
    console.error("Error fetching email logs:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET BY ID
export const getEmailLog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const log = await emailLogsModel.getEmailLogById(id);

    if (!log) return res.status(404).json({ error: "Email log not found" });

    res.json(log);
  } catch (err) {
    console.error("Error fetching email log:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE
export const createEmailLog = async (req: Request, res: Response) => {
  try {
    const { email, subject, type } = req.body;

    const newLog = await emailLogsModel.createEmailLog(email, subject, type);

    res.status(201).json(newLog);
  } catch (err) {
    console.error("Error creating email log:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE
export const deleteEmailLog = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const success = await emailLogsModel.deleteEmailLog(id);

    if (!success) return res.status(404).json({ error: "Email log not found" });

    res.json({ message: "Email log deleted" });
  } catch (err) {
    console.error("Error deleting email log:", err);
    res.status(500).json({ error: "Server error" });
  }
};
