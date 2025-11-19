import { Router } from "express";
import {
  getStocks,
  getStock,
  createNewStock,
  updateExistingStock,
  deleteExistingStock,
} from "../controllers/ticketStockController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: TicketStock
 *   description: Ticket stock management
 */

/**
 * @swagger
 * /api/ticket-stock:
 *   get:
 *     summary: Get all ticket stock records
 *     tags: [TicketStock]
 *     responses:
 *       200:
 *         description: List of ticket stock entries
 */
router.get("/", getStocks);

/**
 * @swagger
 * /api/ticket-stock/{id}:
 *   get:
 *     summary: Get ticket stock entry by ID
 *     tags: [TicketStock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stock entry
 *       404:
 *         description: Not found
 */
router.get("/:id", getStock);

/**
 * @swagger
 * /api/ticket-stock:
 *   post:
 *     summary: Create a ticket stock record
 *     tags: [TicketStock]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Stock entry created
 */
router.post("/", createNewStock);

/**
 * @swagger
 * /api/ticket-stock/{id}:
 *   put:
 *     summary: Update a ticket stock record
 *     tags: [TicketStock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Updated record
 */
router.put("/:id", updateExistingStock);

/**
 * @swagger
 * /api/ticket-stock/{id}:
 *   delete:
 *     summary: Delete a ticket stock record
 *     tags: [TicketStock]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", deleteExistingStock);

export default router;
