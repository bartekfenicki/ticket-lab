import { Router } from "express";
import {
  getEmailLogs,
  getEmailLog,
  createEmailLog,
  deleteEmailLog
} from "../controllers/emailLogsController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: EmailLogs
 *   description: Logging of all outgoing emails
 */

router.get("/", getEmailLogs);
router.get("/:id", getEmailLog);
router.post("/", createEmailLog);
router.delete("/:id", deleteEmailLog);

export default router;
