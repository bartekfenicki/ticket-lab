import { Router } from "express";
import {
  getEmailLogs,
  getEmailLog,
  createEmailLog,
  deleteEmailLog
} from "../controllers/emailLogsController.js";

const router = Router();

router.get("/", getEmailLogs);
router.get("/:id", getEmailLog);
router.post("/", createEmailLog);
router.delete("/:id", deleteEmailLog);

/**
 * @swagger
 * tags:
 *   name: EmailLogs
 *   description: Logging of all outgoing emails
 */

/**
 * @swagger
 * /api/email-logs:
 *   get:
 *     summary: Get all email logs
 *     tags: [EmailLogs]
 *     responses:
 *       200:
 *         description: List of email logs
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
 *                   email:
 *                     type: string
 *                     example: "john@example.com"
 *                   subject:
 *                     type: string
 *                     example: "Reservation Confirmation"
 *                   type:
 *                     type: string
 *                     example: "Reservation"
 *                   sent_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-10T14:30:00Z"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/email-logs/{id}:
 *   get:
 *     summary: Get an email log by ID
 *     tags: [EmailLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Email log ID
 *     responses:
 *       200:
 *         description: Email log details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "john@example.com"
 *                 subject:
 *                   type: string
 *                   example: "Reservation Confirmation"
 *                 type:
 *                   type: string
 *                   example: "Reservation"
 *                 sent_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-10T14:30:00Z"
 *       404:
 *         description: Email log not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/email-logs:
 *   post:
 *     summary: Create a new email log
 *     tags: [EmailLogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - subject
 *               - type
 *               - sent_at
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *               subject:
 *                 type: string
 *                 example: "Reservation Confirmation"
 *               type:
 *                 type: string
 *                 example: "Reservation"
 *               sent_at:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-10T14:30:00Z"
 *     responses:
 *       201:
 *         description: Email log created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/email-logs/{id}:
 *   delete:
 *     summary: Delete an email log by ID
 *     tags: [EmailLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Email log ID
 *     responses:
 *       200:
 *         description: Email log deleted successfully
 *       404:
 *         description: Email log not found
 *       500:
 *         description: Server error
 */


export default router;
