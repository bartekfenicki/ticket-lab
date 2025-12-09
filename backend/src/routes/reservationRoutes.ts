import { Router } from "express";
import {
  getReservations,
  getReservation,
  createNewReservation,
  updateExistingReservation,
  deleteExistingReservation,
  sendReservationByEmail,
  // sendReservationByEmail,
} from "../controllers/reservationController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reservations management
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: List of reservations
 */
router.get("/", getReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Reservation data
 *       404:
 *         description: Not found
 */
router.get("/:id", getReservation);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     responses:
 *       201:
 *         description: Created reservation
 */
router.post("/", createNewReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Updated reservation
 *       404:
 *         description: Not found
 */
router.put("/:id", updateExistingReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Deleted
 */
router.delete("/:id", deleteExistingReservation);

router.get("/:id/by-email", sendReservationByEmail);

export default router;
