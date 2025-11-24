/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket purchasing and management
 */

import { Router } from "express";
import { createTicket, getAllTickets, getTicket, getTicketsByEmail } from "../controllers/ticketController.js";

const router = Router();

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket purchase (supports multiple ticket types)
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - email
 *               - full_name
 *               - total_price
 *               - tickets
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-18"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "+48 123 456 789"
 *               full_name:
 *                 type: string
 *                 example: "John Doe"
 *               other_names:
 *                 type: string
 *                 example: "Jane Doe, Mark Doe"
 *               total_price:
 *                 type: number
 *                 example: 120
 *               tickets:
 *                 type: array
 *                 description: Array of ticket types inside this order
 *                 items:
 *                   type: object
 *                   properties:
 *                     ticket_type_id:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Ticket purchase created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
router.post("/", createTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket order by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket order found
 *       404:
 *         description: Ticket not found
 */
router.get("/:id", getTicket);

/**
 * @swagger
 * /api/tickets/by-email:
 *   get:
 *     summary: Get all tickets associated with an email address
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tickets
 *       400:
 *         description: Email required
 *       500:
 *         description: Server error
 */
router.get("/by-email", getTicketsByEmail);

router.get("/", getAllTickets);

export default router;
