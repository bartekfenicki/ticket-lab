import { Router } from "express";
import {
  getEvents,
  getEvent,
  createNewEvent,
  updateExistingEvent,
  deleteExistingEvent,
} from "../controllers/specialEventsController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SpecialEvents
 *   description: Special events management
 */

/**
 * @swagger
 * /api/special-events:
 *   get:
 *     summary: Get all special events
 *     tags: [SpecialEvents]
 *     responses:
 *       200:
 *         description: List of events
 */
router.get("/", getEvents);

/**
 * @swagger
 * /api/special-events/{id}:
 *   get:
 *     summary: Get special event by ID
 *     tags: [SpecialEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Special event found
 *       404:
 *         description: Not found
 */
router.get("/:id", getEvent);

/**
 * @swagger
 * /api/special-events:
 *   post:
 *     summary: Create a new special event
 *     tags: [SpecialEvents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpecialEvent'
 *     responses:
 *       201:
 *         description: Special event created
 */
router.post("/", createNewEvent);

/**
 * @swagger
 * /api/special-events/{id}:
 *   put:
 *     summary: Update a special event
 *     tags: [SpecialEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Updated event
 *       404:
 *         description: Not found
 */
router.put("/:id", updateExistingEvent);

/**
 * @swagger
 * /api/special-events/{id}:
 *   delete:
 *     summary: Delete a special event
 *     tags: [SpecialEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", deleteExistingEvent);

export default router;
