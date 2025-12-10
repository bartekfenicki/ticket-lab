import { Router } from "express";
import {
  getClosedDays,
  getClosedDay,
  createClosedDay,
  updateClosedDay,
  deleteClosedDay,
} from "../controllers/closedDaysController.js";

const router = Router();


router.get("/", getClosedDays);
router.get("/:id", getClosedDay);
router.post("/", createClosedDay);
router.put("/:id", updateClosedDay);
router.delete("/:id", deleteClosedDay);


/**
 * @swagger
 * tags:
 *   name: ClosedDays
 *   description: Manage closed calendar days
 */

/**
 * @swagger
 * /api/closed-days:
 *   get:
 *     summary: Get all closed days
 *     tags: [ClosedDays]
 *     responses:
 *       200:
 *         description: List of closed days
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
 *                   date:
 *                     type: string
 *                     format: date
 *                     example: "2025-12-25"
 *                   reason:
 *                     type: string
 *                     example: "Christmas holiday"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/closed-days/{id}:
 *   get:
 *     summary: Get a closed day by ID
 *     tags: [ClosedDays]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Closed day ID
 *     responses:
 *       200:
 *         description: Closed day details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 date:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-25"
 *                 reason:
 *                   type: string
 *                   example: "Christmas holiday"
 *       404:
 *         description: Closed day not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/closed-days:
 *   post:
 *     summary: Create a new closed day
 *     tags: [ClosedDays]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - reason
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-25"
 *               reason:
 *                 type: string
 *                 example: "Christmas holiday"
 *     responses:
 *       201:
 *         description: Closed day created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/closed-days/{id}:
 *   put:
 *     summary: Update a closed day by ID
 *     tags: [ClosedDays]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Closed day ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-25"
 *               reason:
 *                 type: string
 *                 example: "Updated reason for closure"
 *     responses:
 *       200:
 *         description: Closed day updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Closed day not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/closed-days/{id}:
 *   delete:
 *     summary: Delete a closed day by ID
 *     tags: [ClosedDays]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Closed day ID
 *     responses:
 *       200:
 *         description: Closed day deleted successfully
 *       404:
 *         description: Closed day not found
 *       500:
 *         description: Server error
 */


export default router;
