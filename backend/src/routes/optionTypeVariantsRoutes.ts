import { Router } from "express";
import {
  getVariants,
  getVariantsByOptionType,
  createVariant,
  updateVariant,
  deleteVariant,
} from "../controllers/optionTypeVariantsController.js";

const router = Router();

router.get("/", getVariants);
router.get("/option-type/:optionTypeId", getVariantsByOptionType);
router.post("/", createVariant);
router.put("/:id", updateVariant);
router.delete("/:id", deleteVariant);

/**
 * @swagger
 * tags:
 *   name: OptionTypeVariants
 *   description: Manage reservation option type variants
 */

/**
 * @swagger
 * /api/option-type-variants:
 *   get:
 *     summary: Get all option type variants
 *     tags: [OptionTypeVariants]
 *     responses:
 *       200:
 *         description: List of option type variants
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
 *                   reservation_option_type_id:
 *                     type: integer
 *                     example: 2
 *                   name:
 *                     type: string
 *                     example: "VIP Seat"
 *                   price:
 *                     type: number
 *                     example: 50
 *                   pricing_type:
 *                     type: string
 *                     example: "fixed"
 *                   active:
 *                     type: boolean
 *                     example: true
 *                   description:
 *                     type: string
 *                     example: "Front row seat with extra legroom"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-10T09:00:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-10T09:00:00Z"
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/option-type-variants/option-type/{optionTypeId}:
 *   get:
 *     summary: Get variants by reservation option type
 *     tags: [OptionTypeVariants]
 *     parameters:
 *       - in: path
 *         name: optionTypeId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *         description: Reservation option type ID
 *     responses:
 *       200:
 *         description: List of variants for the option type
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 3
 *                   reservation_option_type_id:
 *                     type: integer
 *                     example: 2
 *                   name:
 *                     type: string
 *                     example: "VIP Seat"
 *                   price:
 *                     type: number
 *                     example: 50
 *                   pricing_type:
 *                     type: string
 *                     example: "fixed"
 *                   active:
 *                     type: boolean
 *                     example: true
 *                   description:
 *                     type: string
 *                     example: "Front row seat with extra legroom"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-10T09:00:00Z"
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-12-10T09:00:00Z"
 *       404:
 *         description: Option type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/option-type-variants:
 *   post:
 *     summary: Create a new option type variant
 *     tags: [OptionTypeVariants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservation_option_type_id
 *               - name
 *               - price
 *               - pricing_type
 *               - active
 *             properties:
 *               reservation_option_type_id:
 *                 type: integer
 *                 example: 2
 *               name:
 *                 type: string
 *                 example: "VIP Seat"
 *               price:
 *                 type: number
 *                 example: 50
 *               pricing_type:
 *                 type: string
 *                 example: "fixed"
 *               active:
 *                 type: boolean
 *                 example: true
 *               description:
 *                 type: string
 *                 example: "Front row seat with extra legroom"
 *     responses:
 *       201:
 *         description: Variant created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/option-type-variants/{id}:
 *   put:
 *     summary: Update an option type variant
 *     tags: [OptionTypeVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Variant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservation_option_type_id:
 *                 type: integer
 *                 example: 2
 *               name:
 *                 type: string
 *                 example: "VIP Seat Updated"
 *               price:
 *                 type: number
 *                 example: 55
 *               pricing_type:
 *                 type: string
 *                 example: "fixed"
 *               active:
 *                 type: boolean
 *                 example: true
 *               description:
 *                 type: string
 *                 example: "Updated description for VIP Seat"
 *     responses:
 *       200:
 *         description: Variant updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Variant not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/option-type-variants/{id}:
 *   delete:
 *     summary: Delete an option type variant by ID
 *     tags: [OptionTypeVariants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Variant ID
 *     responses:
 *       200:
 *         description: Variant deleted successfully
 *       404:
 *         description: Variant not found
 *       500:
 *         description: Server error
 */


export default router;
