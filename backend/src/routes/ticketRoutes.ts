/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket purchasing and management
 */

import { Router } from "express";
import { createTicket, getAllTickets, getTicket, getTicketsByEmail, sendTicketByEmail, updateTicketController } from "../controllers/ticketController.js";

const router = Router();

router.post("/", createTicket);
router.get("/:id", getTicket);
router.get("/by-email", getTicketsByEmail);
router.get("/", getAllTickets);
router.post("/:id/email", sendTicketByEmail);
router.patch("/:id", updateTicketController);

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Manage ticket purchases
 */

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket purchase
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketWithItems'
 *     responses:
 *       201:
 *         description: Ticket purchase created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketWithItems'
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tickets/by-email:
 *   get:
 *     summary: Get tickets by email
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: "john@example.com"
 *         description: Email used to purchase tickets
 *     responses:
 *       200:
 *         description: List of tickets for the email
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketWithItems'
 *       404:
 *         description: No tickets found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: List of all tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketWithItems'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tickets/{id}/email:
 *   post:
 *     summary: Send ticket details by email
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket email sent successfully
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Failed to send email
 */

/**
 * @swagger
 * /api/tickets/{id}:
 *   patch:
 *     summary: Update a ticket partially
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
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
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 example: ["Jane Doe", "Mark Doe"]
 *               total_price:
 *                 type: number
 *                 example: 120
 *               payment_status:
 *                 type: string
 *                 example: "Paid"
 *               qr_token:
 *                 type: string
 *                 example: "abc123xyz"
 *               special_event_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 2
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketItem:
 *       type: object
 *       properties:
 *         ticket_id:
 *           type: integer
 *           example: 1
 *         ticket_type_id:
 *           type: integer
 *           example: 2
 *         quantity:
 *           type: integer
 *           example: 2
 *         price:
 *           type: number
 *           example: 50
 *         subtotal:
 *           type: number
 *           example: 100
 *     Ticket:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-05-18"
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         phone:
 *           type: string
 *           example: "+48 123 456 789"
 *         full_name:
 *           type: string
 *           example: "John Doe"
 *         other_names:
 *           type: array
 *           items:
 *             type: string
 *           nullable: true
 *           example: ["Jane Doe", "Mark Doe"]
 *         total_price:
 *           type: number
 *           example: 120
 *         payment_status:
 *           type: string
 *           example: "Paid"
 *         qr_token:
 *           type: string
 *           example: "abc123xyz"
 *         special_event_id:
 *           type: integer
 *           nullable: true
 *           example: 2
 *     TicketWithItems:
 *       allOf:
 *         - $ref: '#/components/schemas/Ticket'
 *         - type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketItem'
 */

export default router;
