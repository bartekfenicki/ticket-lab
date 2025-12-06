import { Router } from "express";
import {
  getOpeningHours,
  getOpeningHour,
  createOpeningHour,
  updateOpeningHour,
  deleteOpeningHour,
} from "../controllers/openingHoursController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: OpeningHours
 *   description: Opening hours management
 */

router.get("/", getOpeningHours);
router.get("/:id", getOpeningHour);
router.post("/", createOpeningHour);
router.put("/:id", updateOpeningHour);
router.delete("/:id", deleteOpeningHour);

export default router;
