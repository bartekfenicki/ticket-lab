import { Router } from "express";
import {
  getOptionTypes,
  getOptionType,
  createNewOptionType,
  updateExistingOptionType,
  deleteExistingOptionType,
} from "../controllers/reservationOptionTypesController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ReservationOptionTypes
 *   description: Reservation option types management
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
 */
router.get("/", getOptionTypes);

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
 *     responses:
 *       200:
 *         description: Reservation option type data
 *       404:
 *         description: Not found
 */
router.get("/:id", getOptionType);

/**
 * @swagger
 * /api/reservation-option-types:
 *   post:
 *     summary: Create a new reservation option type
 *     tags: [ReservationOptionTypes]
 *     responses:
 *       201:
 *         description: Created option type
 */
router.post("/", createNewOptionType);

/**
 * @swagger
 * /api/reservation-option-types/{id}:
 *   put:
 *     summary: Update a reservation option type
 *     tags: [ReservationOptionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Updated option type
 *       404:
 *         description: Not found
 */
router.put("/:id", updateExistingOptionType);

/**
 * @swagger
 * /api/reservation-option-types/{id}:
 *   delete:
 *     summary: Delete a reservation option type
 *     tags: [ReservationOptionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", deleteExistingOptionType);

export default router;
