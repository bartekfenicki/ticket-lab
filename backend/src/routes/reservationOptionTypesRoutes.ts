import { Router } from "express";
import {
  getOptionTypes,
  getOptionType,
  createNewOptionType,
  updateExistingOptionType,
  deleteExistingOptionType,
} from "../controllers/reservationOptionTypesController.js";

const router = Router();


router.get("/", getOptionTypes);
router.get("/:id", getOptionType);
router.post("/", createNewOptionType);
router.put("/:id", updateExistingOptionType);
router.delete("/:id", deleteExistingOptionType);

/**
 * @swagger
 * tags:
 *   name: ReservationOptionTypes
 *   description: Manage reservation option types
 */

/**
 * @swagger
 * /api/reservation-option-types:
 *   get:
 *     summary: Get all reservation option types
 *     tags: [ReservationOptionTypes]
 *     responses:
 *       200:
 *         description: List of reservation option types
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
 *                   name:
 *                     type: string
 *                     example: "VIP Package"
 *                   description:
 *                     type: string
 *                     nullable: true
 *                     example: "Includes VIP seating and drinks"
 *                   default_price:
 *                     type: number
 *                     example: 50
 *                   active:
 *                     type: boolean
 *                     example: true
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-option-types/{id}:
 *   get:
 *     summary: Get a reservation option type by ID
 *     tags: [ReservationOptionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation option type ID
 *     responses:
 *       200:
 *         description: Reservation option type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "VIP Package"
 *                 description:
 *                   type: string
 *                   nullable: true
 *                   example: "Includes VIP seating and drinks"
 *                 default_price:
 *                   type: number
 *                   example: 50
 *                 active:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Reservation option type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-option-types:
 *   post:
 *     summary: Create a new reservation option type
 *     tags: [ReservationOptionTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - default_price
 *               - active
 *             properties:
 *               name:
 *                 type: string
 *                 example: "VIP Package"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Includes VIP seating and drinks"
 *               default_price:
 *                 type: number
 *                 example: 50
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Reservation option type created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-option-types/{id}:
 *   put:
 *     summary: Update an existing reservation option type
 *     tags: [ReservationOptionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation option type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "VIP Package Updated"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Updated description"
 *               default_price:
 *                 type: number
 *                 example: 60
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Reservation option type updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Reservation option type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-option-types/{id}:
 *   delete:
 *     summary: Delete a reservation option type by ID
 *     tags: [ReservationOptionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation option type ID
 *     responses:
 *       200:
 *         description: Reservation option type deleted successfully
 *       404:
 *         description: Reservation option type not found
 *       500:
 *         description: Server error
 */


export default router;
