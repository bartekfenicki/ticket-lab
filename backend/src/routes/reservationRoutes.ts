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


router.get("/", getReservations);
router.get("/:id", getReservation);
router.post("/", createNewReservation);
router.put("/:id", updateExistingReservation);
router.delete("/:id", deleteExistingReservation);
router.post("/:id/by-email", sendReservationByEmail);

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Manage reservations
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 *       500:
 *         description: Server error
 */

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
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update an existing reservation
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reservations/{id}/by-email:
 *   post:
 *     summary: Send reservation details by email
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       404:
 *         description: Reservation not found
 *       500:
 *         description: Failed to send email
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservationVariant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         reservation_option_type_id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: "VIP Seat"
 *         price:
 *           type: number
 *           example: 50
 *         pricing_type:
 *           type: string
 *           enum: ["flat", "per_person"]
 *           example: "flat"
 *         active:
 *           type: boolean
 *           example: true
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Front row seat with extra legroom"
 *     ReservationAddOn:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         reservation_option_type_id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: "Breakfast"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "Buffet breakfast included"
 *         price:
 *           type: number
 *           example: 15
 *         pricing_type:
 *           type: string
 *           enum: ["flat", "per_person"]
 *           example: "per_person"
 *         active:
 *           type: boolean
 *           example: true
 *     Reservation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         email:
 *           type: string
 *           example: "john@example.com"
 *         title:
 *           type: string
 *           example: "Dinner Reservation"
 *         note:
 *           type: string
 *           nullable: true
 *           example: "Birthday celebration"
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-12-25"
 *         start_time:
 *           type: string
 *           example: "19:00"
 *         num_people:
 *           type: integer
 *           example: 4
 *         total_price:
 *           type: number
 *           example: 200
 *         payment_method:
 *           type: string
 *           example: "Credit Card"
 *         payment_status:
 *           type: string
 *           example: "Paid"
 *         status:
 *           type: string
 *           example: "Confirmed"
 *         first_name:
 *           type: string
 *           example: "John"
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         phone:
 *           type: string
 *           example: "+48 123 456 789"
 *         option_type_id:
 *           type: integer
 *           example: 2
 *         selected_variant:
 *           $ref: '#/components/schemas/ReservationVariant'
 *         selected_add_ons:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReservationAddOn'
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-12-10T09:00:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-12-10T09:00:00Z"
 */


export default router;
