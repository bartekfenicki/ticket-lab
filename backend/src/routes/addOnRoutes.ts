import { Router } from "express";
import {
  getAddOns,
  getAddOnsByOptionType,
  createAddOn,
  updateAddOn,
  deleteAddOn,
} from "../controllers/addOnController.js";

const router = Router();

router.get("/", getAddOns);
router.get("/option-type/:optionTypeId", getAddOnsByOptionType);
router.post("/", createAddOn);
router.put("/:id", updateAddOn);
router.delete("/:id", deleteAddOn);



/**
 * @swagger
 * tags:
 *   name: AddOns
 *   description: Reservation add-ons management
 */

/**
 * @swagger
 * /api/addons:
 *   get:
 *     summary: Get all add-ons
 *     tags: [AddOns]
 *     responses:
 *       200:
 *         description: List of add-ons
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
 *                     example: "Extra Bed"
 *                   price:
 *                     type: number
 *                     example: 20
 *                   option_type_id:
 *                     type: integer
 *                     example: 2
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/addons/option-type/{optionTypeId}:
 *   get:
 *     summary: Get add-ons for a reservation option type
 *     tags: [AddOns]
 *     parameters:
 *       - in: path
 *         name: optionTypeId
 *         schema:
 *           type: integer
 *           example: 2
 *         required: true
 *         description: Reservation option type ID
 *     responses:
 *       200:
 *         description: List of add-ons for the option type
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
 *                   name:
 *                     type: string
 *                     example: "Breakfast"
 *                   price:
 *                     type: number
 *                     example: 15
 *                   option_type_id:
 *                     type: integer
 *                     example: 2
 *       404:
 *         description: Option type not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/addons:
 *   post:
 *     summary: Create a new add-on
 *     tags: [AddOns]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - option_type_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Extra Bed"
 *               price:
 *                 type: number
 *                 example: 20
 *               option_type_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Add-on created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/addons/{id}:
 *   put:
 *     summary: Update an add-on
 *     tags: [AddOns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Add-on ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Extra Bed Updated"
 *               price:
 *                 type: number
 *                 example: 25
 *               option_type_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Add-on updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Add-on not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/addons/{id}:
 *   delete:
 *     summary: Delete an add-on
 *     tags: [AddOns]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: Add-on ID
 *     responses:
 *       200:
 *         description: Add-on deleted successfully
 *       404:
 *         description: Add-on not found
 *       500:
 *         description: Server error
 */


export default router;
