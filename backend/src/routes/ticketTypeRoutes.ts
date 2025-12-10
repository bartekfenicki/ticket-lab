import { Router } from "express";
import {
  getTicketTypes,
  getTicketType,
  createNewTicketType,
  updateExistingTicketType,
  deleteExistingTicketType,
} from "../controllers/ticketTypeController.js";

const router = Router();


router.get("/", getTicketTypes);
router.get("/:id", getTicketType);
router.post("/", createNewTicketType);
router.put("/:id", updateExistingTicketType);
router.delete("/:id", deleteExistingTicketType);

/**
 * @swagger
 * tags:
 *   name: TicketTypes
 *   description: Manage ticket types
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
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-types/{id}:
 *   get:
 *     summary: Get a ticket type by ID
 *     tags: [TicketTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Ticket type ID
 *     responses:
 *       200:
 *         description: Ticket type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketType'
 *       404:
 *         description: Ticket type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-types:
 *   post:
 *     summary: Create a new ticket type
 *     tags: [TicketTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketType'
 *     responses:
 *       201:
 *         description: Ticket type created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-types/{id}:
 *   put:
 *     summary: Update an existing ticket type
 *     tags: [TicketTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Ticket type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketType'
 *     responses:
 *       200:
 *         description: Ticket type updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Ticket type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-types/{id}:
 *   delete:
 *     summary: Delete a ticket type by ID
 *     tags: [TicketTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Ticket type ID
 *     responses:
 *       200:
 *         description: Ticket type deleted successfully
 *       404:
 *         description: Ticket type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "VIP Ticket"
 *         price:
 *           type: number
 *           example: 50
 *         description:
 *           type: string
 *           example: "Front row seating with complimentary drinks"
 *         is_special_event:
 *           type: boolean
 *           example: true
 *         active:
 *           type: boolean
 *           example: true
 */


export default router;
