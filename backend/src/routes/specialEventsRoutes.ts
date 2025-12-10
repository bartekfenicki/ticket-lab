import { Router } from "express";
import {
  getEvents,
  getEvent,
  createNewEvent,
  updateExistingEvent,
  deleteExistingEvent,
} from "../controllers/specialEventsController.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/", createNewEvent);
router.put("/:id", updateExistingEvent);
router.delete("/:id", deleteExistingEvent);

/**
 * @swagger
 * tags:
 *   name: SpecialEvents
 *   description: Manage special events
 */

/**
 * @swagger
 * /api/special-events:
 *   get:
 *     summary: Get all special events
 *     tags: [SpecialEvents]
 *     responses:
 *       200:
 *         description: List of special events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SpecialEvent'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/special-events/{id}:
 *   get:
 *     summary: Get a special event by ID
 *     tags: [SpecialEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Special event ID
 *     responses:
 *       200:
 *         description: Special event details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SpecialEvent'
 *       404:
 *         description: Special event not found
 *       500:
 *         description: Server error
 */

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
 *         description: Special event created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/special-events/{id}:
 *   put:
 *     summary: Update an existing special event
 *     tags: [SpecialEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Special event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SpecialEvent'
 *     responses:
 *       200:
 *         description: Special event updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Special event not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/special-events/{id}:
 *   delete:
 *     summary: Delete a special event by ID
 *     tags: [SpecialEvents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Special event ID
 *     responses:
 *       200:
 *         description: Special event deleted successfully
 *       404:
 *         description: Special event not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SpecialEvent:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Christmas Gala"
 *         description:
 *           type: string
 *           example: "An evening of music, food, and celebration."
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-12-25"
 *         ticket_type_id:
 *           type: integer
 *           example: 2
 *         max_tickets:
 *           type: integer
 *           example: 100
 *         active:
 *           type: boolean
 *           example: true
 */


export default router;
