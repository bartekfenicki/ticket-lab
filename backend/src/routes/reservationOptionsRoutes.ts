import { Router } from "express";
import {
  getReservationOptions,
  getReservationOption,
  getReservationOptionsForReservation,
  createNewReservationOption,
  updateExistingReservationOption,
  deleteExistingReservationOption,
} from "../controllers/reservationOptionsController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ReservationOptions
 *   description: Links reservation with option types
 */

/**
 * @swagger
 * /api/reservation-options:
 *   get:
 *     summary: Get all reservation options
 *     tags: [ReservationOptions]
 *     responses:
 *       200:
 *         description: List of reservation_options
 */
router.get("/", getReservationOptions);

/**
 * @swagger
 * /api/reservation-options/{id}:
 *   get:
 *     summary: Get a reservation option by ID
 *     tags: [ReservationOptions]
 */
router.get("/:id", getReservationOption);

/**
 * @swagger
 * /api/reservation-options/reservation/{reservationId}:
 *   get:
 *     summary: Get all option entries for a specific reservation
 *     tags: [ReservationOptions]
 */
router.get("/reservation/:reservationId", getReservationOptionsForReservation);

/**
 * @swagger
 * /api/reservation-options:
 *   post:
 *     summary: Create a reservation option entry
 *     tags: [ReservationOptions]
 *     responses:
 *       201:
 *         description: Created reservation option
 */
router.post("/", createNewReservationOption);

/**
 * @swagger
 * /api/reservation-options/{id}:
 *   put:
 *     summary: Update a reservation option entry
 *     tags: [ReservationOptions]
 */
router.put("/:id", updateExistingReservationOption);

/**
 * @swagger
 * /api/reservation-options/{id}:
 *   delete:
 *     summary: Delete a reservation option entry
 *     tags: [ReservationOptions]
 */
router.delete("/:id", deleteExistingReservationOption);

export default router;
