import { Router } from "express";
import {
  getOpeningHours,
  getOpeningHour,
  createOpeningHour,
  updateOpeningHour,
  deleteOpeningHour,
} from "../controllers/openingHoursController.js";

const router = Router();



router.get("/", getOpeningHours);
router.get("/:id", getOpeningHour);
router.post("/", createOpeningHour);
router.put("/:id", updateOpeningHour);
router.delete("/:id", deleteOpeningHour);

/**
 * @swagger
 * tags:
 *   name: OpeningHours
 *   description: Opening hours management
 */

/**
 * @swagger
 * /api/opening-hours:
 *   get:
 *     summary: Get all opening hours
 *     tags: [OpeningHours]
 *     responses:
 *       200:
 *         description: List of opening hours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   day_of_week:
 *                     type: string
 *                     example: "Monday"
 *                   open_time:
 *                     type: string
 *                     example: "09:00"
 *                   close_time:
 *                     type: string
 *                     example: "17:00"
 *                   active:
 *                     type: boolean
 *                     example: true
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-10T09:00:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-10T09:00:00Z"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/opening-hours/{id}:
 *   get:
 *     summary: Get an opening hour by ID
 *     tags: [OpeningHours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Opening hour ID
 *     responses:
 *       200:
 *         description: Opening hour details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 day_of_week:
 *                   type: string
 *                   example: "Monday"
 *                 open_time:
 *                   type: string
 *                   example: "09:00"
 *                 close_time:
 *                   type: string
 *                   example: "17:00"
 *                 active:
 *                   type: boolean
 *                   example: true
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-10T09:00:00Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-10T09:00:00Z"
 *       404:
 *         description: Opening hour not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/opening-hours:
 *   post:
 *     summary: Create a new opening hour
 *     tags: [OpeningHours]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day_of_week
 *               - open_time
 *               - close_time
 *               - active
 *             properties:
 *               day_of_week:
 *                 type: string
 *                 example: "Monday"
 *               open_time:
 *                 type: string
 *                 example: "09:00"
 *               close_time:
 *                 type: string
 *                 example: "17:00"
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Opening hour created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/opening-hours/{id}:
 *   put:
 *     summary: Update an opening hour by ID
 *     tags: [OpeningHours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Opening hour ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day_of_week:
 *                 type: string
 *                 example: "Tuesday"
 *               open_time:
 *                 type: string
 *                 example: "10:00"
 *               close_time:
 *                 type: string
 *                 example: "18:00"
 *               active:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Opening hour updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Opening hour not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/opening-hours/{id}:
 *   delete:
 *     summary: Delete an opening hour by ID
 *     tags: [OpeningHours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Opening hour ID
 *     responses:
 *       200:
 *         description: Opening hour deleted successfully
 *       404:
 *         description: Opening hour not found
 *       500:
 *         description: Server error
 */


export default router;
