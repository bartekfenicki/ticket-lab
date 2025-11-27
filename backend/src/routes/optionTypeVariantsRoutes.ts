import { Router } from "express";
import {
  getVariants,
  getVariantsByOptionType,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/optionTypeVariantsController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ReservationOptionTypeVariants
 *   description: Variants for reservation option types
 */

/**
 * @swagger
 * /api/option-type-variants:
 *   get:
 *     summary: Get all variants
 *     tags: [ReservationOptionTypeVariants]
 *     responses:
 *       200:
 *         description: List of variants
 */
router.get("/", getVariants);

/**
 * @swagger
 * /api/option-type-variants/option-type/{optionTypeId}:
 *   get:
 *     summary: Get variants for a reservation option type
 *     tags: [ReservationOptionTypeVariants]
 *     parameters:
 *       - in: path
 *         name: optionTypeId
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of variants
 */
router.get("/option-type/:optionTypeId", getVariantsByOptionType);

/**
 * @swagger
 * /api/option-type-variants:
 *   post:
 *     summary: Create a variant
 *     tags: [ReservationOptionTypeVariants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReservationOptionTypeVariant'
 *     responses:
 *       201:
 *         description: Variant created
 */
router.post("/", createVariant);

/**
 * @swagger
 * /api/option-type-variants/{id}:
 *   put:
 *     summary: Update a variant
 *     tags: [ReservationOptionTypeVariants]
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
 *             $ref: '#/components/schemas/ReservationOptionTypeVariant'
 *     responses:
 *       200:
 *         description: Variant updated
 */
router.put("/:id", updateVariant);

/**
 * @swagger
 * /api/option-type-variants/{id}:
 *   delete:
 *     summary: Delete a variant
 *     tags: [ReservationOptionTypeVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Variant deleted
 */
router.delete("/:id", deleteVariant);

export default router;
