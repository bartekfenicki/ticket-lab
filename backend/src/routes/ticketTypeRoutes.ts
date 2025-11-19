import { Router } from "express";
import {
  getTicketTypes,
  getTicketType,
  createNewTicketType,
  updateExistingTicketType,
  deleteExistingTicketType,
} from "../controllers/ticketTypeController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TicketTypes
 *   description: Ticket type management
 */

/**
 * @swagger
 * /api/ticket-types:
 *   get:
 *     summary: Get all ticket types
 *     tags: [TicketTypes]
 *     responses:
 *       200:
 *         description: List of ticket types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketType'
 */
router.get("/", getTicketTypes);

/**
 * @swagger
 * /api/ticket-types/{id}:
 *   get:
 *     summary: Get ticket type by ID
 *     tags: [TicketTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket type data
 *       404:
 *         description: Not found
 */
router.get("/:id", getTicketType);

/**
 * @swagger
 * /api/ticket-types:
 *   post:
 *     summary: Create a ticket type
 *     tags: [TicketTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketType'
 *     responses:
 *       201:
 *         description: Ticket type created
 */
router.post("/", createNewTicketType);

/**
 * @swagger
 * /api/ticket-types/{id}:
 *   put:
 *     summary: Update a ticket type
 *     tags: [TicketTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated ticket type fields
 *       required: true
 *     responses:
 *       200:
 *         description: Updated ticket type
 *       404:
 *         description: Not found
 */
router.put("/:id", updateExistingTicketType);

/**
 * @swagger
 * /api/ticket-types/{id}:
 *   delete:
 *     summary: Delete a ticket type
 *     tags: [TicketTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Ticket type deleted
 */
router.delete("/:id", deleteExistingTicketType);

export default router;
