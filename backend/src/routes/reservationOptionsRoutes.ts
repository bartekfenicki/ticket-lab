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


router.get("/", getReservationOptions);
router.get("/:id", getReservationOption);
router.get("/reservation/:reservationId", getReservationOptionsForReservation);
router.post("/", createNewReservationOption);
router.put("/:id", updateExistingReservationOption);
router.delete("/:id", deleteExistingReservationOption);

/**
 * @swagger
 * tags:
 *   name: ReservationOptions
 *   description: Manage reservation options
 */

/**
 * @swagger
 * /api/reservation-options:
 *   get:
 *     summary: Get all reservation options
 *     tags: [ReservationOptions]
 *     responses:
 *       200:
 *         description: List of reservation options
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
 *                   reservation_id:
 *                     type: integer
 *                     example: 10
 *                   option_type_id:
 *                     type: integer
 *                     example: 2
 *                   quantity:
 *                     type: integer
 *                     example: 3
 *                   calculated_price:
 *                     type: number
 *                     example: 150
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-options/{id}:
 *   get:
 *     summary: Get a reservation option by ID
 *     tags: [ReservationOptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation option ID
 *     responses:
 *       200:
 *         description: Reservation option details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 reservation_id:
 *                   type: integer
 *                   example: 10
 *                 option_type_id:
 *                   type: integer
 *                   example: 2
 *                 quantity:
 *                   type: integer
 *                   example: 3
 *                 calculated_price:
 *                   type: number
 *                   example: 150
 *       404:
 *         description: Reservation option not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-options/reservation/{reservationId}:
 *   get:
 *     summary: Get all options for a specific reservation
 *     tags: [ReservationOptions]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: List of reservation options for the reservation
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
 *                   reservation_id:
 *                     type: integer
 *                     example: 10
 *                   option_type_id:
 *                     type: integer
 *                     example: 2
 *                   quantity:
 *                     type: integer
 *                     example: 3
 *                   calculated_price:
 *                     type: number
 *                     example: 150
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-options:
 *   post:
 *     summary: Create a new reservation option
 *     tags: [ReservationOptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservation_id
 *               - option_type_id
 *               - quantity
 *               - calculated_price
 *             properties:
 *               reservation_id:
 *                 type: integer
 *                 example: 10
 *               option_type_id:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 example: 3
 *               calculated_price:
 *                 type: number
 *                 example: 150
 *     responses:
 *       201:
 *         description: Reservation option created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-options/{id}:
 *   put:
 *     summary: Update an existing reservation option
 *     tags: [ReservationOptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation option ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservation_id:
 *                 type: integer
 *                 example: 10
 *               option_type_id:
 *                 type: integer
 *                 example: 2
 *               quantity:
 *                 type: integer
 *                 example: 4
 *               calculated_price:
 *                 type: number
 *                 example: 200
 *     responses:
 *       200:
 *         description: Reservation option updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Reservation option not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservation-options/{id}:
 *   delete:
 *     summary: Delete a reservation option by ID
 *     tags: [ReservationOptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation option ID
 *     responses:
 *       200:
 *         description: Reservation option deleted successfully
 *       404:
 *         description: Reservation option not found
 *       500:
 *         description: Server error
 */


export default router;
