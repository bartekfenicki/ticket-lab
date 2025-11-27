import { Router } from "express";
import {
  getAddOns,
  getAddOnsByOptionType,
  createAddOn,
  updateAddOn,
  deleteAddOn,
} from "../controllers/addOnController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: AddOns
 *   description: Reservation add-ons management
 */

/**
 * @swagger
 * /api/add-ons:
 *   get:
 *     summary: Get all add-ons
 *     tags: [AddOns]
 *     responses:
 *       200:
 *         description: List of add-ons
 */
router.get("/", getAddOns);

/**
 * @swagger
 * /api/add-ons/option-type/{optionTypeId}:
 *   get:
 *     summary: Get add-ons for a reservation option type
 *     tags: [AddOns]
 *     parameters:
 *       - in: path
 *         name: optionTypeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Reservation option type ID
 *     responses:
 *       200:
 *         description: List of add-ons
 */
router.get("/option-type/:optionTypeId", getAddOnsByOptionType);

/**
 * @swagger
 * /api/add-ons:
 *   post:
 *     summary: Create a new add-on
 *     tags: [AddOns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddOn'
 *     responses:
 *       201:
 *         description: Add-on created
 */
router.post("/", createAddOn);

/**
 * @swagger
 * /api/add-ons/{id}:
 *   put:
 *     summary: Update an add-on
 *     tags: [AddOns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddOn'
 *     responses:
 *       200:
 *         description: Add-on updated
 */
router.put("/:id", updateAddOn);

/**
 * @swagger
 * /api/add-ons/{id}:
 *   delete:
 *     summary: Delete an add-on
 *     tags: [AddOns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Add-on deleted
 */
router.delete("/:id", deleteAddOn);

export default router;
