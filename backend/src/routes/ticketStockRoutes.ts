import { Router } from "express";
import {
  getStocks,
  getStock,
  createNewStock,
  updateExistingStock,
  deleteExistingStock,
  fetchStockByDate,
  upsertStockController,
  updateSoldQuantityController,
} from "../controllers/ticketStockController.js";

const router = Router();

router.get("/", getStocks);
router.get("/by-date", fetchStockByDate)
router.get("/:id", getStock);
router.post("/", createNewStock);
router.put("/upsert", upsertStockController);
router.put("/update-sold", updateSoldQuantityController);
router.put("/:id", updateExistingStock);
router.delete("/:id", deleteExistingStock);

/**
 * @swagger
 * tags:
 *   name: TicketStock
 *   description: Manage ticket stock
 */

/**
 * @swagger
 * /api/ticket-stock:
 *   get:
 *     summary: Get all ticket stock entries
 *     tags: [TicketStock]
 *     responses:
 *       200:
 *         description: List of ticket stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketStock'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-stock/by-date:
 *   get:
 *     summary: Get ticket stock filtered by date
 *     tags: [TicketStock]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-05-18"
 *         description: Date to filter stock
 *     responses:
 *       200:
 *         description: Ticket stock entries for the date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TicketStock'
 *       404:
 *         description: No stock found for the date
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-stock/{id}:
 *   get:
 *     summary: Get a ticket stock entry by ID
 *     tags: [TicketStock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Ticket stock ID
 *     responses:
 *       200:
 *         description: Ticket stock details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TicketStock'
 *       404:
 *         description: Stock entry not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-stock:
 *   post:
 *     summary: Create a new ticket stock entry
 *     tags: [TicketStock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketStock'
 *     responses:
 *       201:
 *         description: Stock entry created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-stock/upsert:
 *   put:
 *     summary: Upsert ticket stock (insert or update)
 *     tags: [TicketStock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketStock'
 *     responses:
 *       200:
 *         description: Stock entry upserted successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-stock/update-sold:
 *   put:
 *     summary: Update sold quantity for ticket stock
 *     tags: [TicketStock]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - sold_quantity
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               sold_quantity:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Sold quantity updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Stock entry not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-stock/{id}:
 *   put:
 *     summary: Update an existing ticket stock entry
 *     tags: [TicketStock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Stock entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketStock'
 *     responses:
 *       200:
 *         description: Stock entry updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Stock entry not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/ticket-stock/{id}:
 *   delete:
 *     summary: Delete a ticket stock entry by ID
 *     tags: [TicketStock]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Stock entry ID
 *     responses:
 *       200:
 *         description: Stock entry deleted successfully
 *       404:
 *         description: Stock entry not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TicketStock:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ticket_type_id:
 *           type: integer
 *           example: 2
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-05-18"
 *         total_quantity:
 *           type: number
 *           example: 100
 *         sold_quantity:
 *           type: number
 *           example: 50
 *         modified_by:
 *           type: integer
 *           nullable: true
 *           example: 1
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-12-10T10:00:00Z"
 */



export default router;
