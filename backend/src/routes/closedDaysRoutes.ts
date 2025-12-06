import { Router } from "express";
import {
  getClosedDays,
  getClosedDay,
  createClosedDay,
  updateClosedDay,
  deleteClosedDay,
} from "../controllers/closedDaysController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ClosedDays
 *   description: Manage closed calendar days
 */

router.get("/", getClosedDays);
router.get("/:id", getClosedDay);
router.post("/", createClosedDay);
router.put("/:id", updateClosedDay);
router.delete("/:id", deleteClosedDay);

export default router;
