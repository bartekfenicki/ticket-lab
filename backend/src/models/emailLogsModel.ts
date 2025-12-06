import { pool } from "../config/db.js";

export interface EmailLog {
  id: number;
  email: string;
  subject: string;
  type: string;        // e.g. "reservation", "ticket", "system", etc.
  sent_at: string;     // timestamp
}

// Get all logs
export const getAllEmailLogs = async (): Promise<EmailLog[]> => {
  const result = await pool.query(
    "SELECT * FROM emails_log ORDER BY sent_at DESC"
  );
  return result.rows;
};

// Get log by ID
export const getEmailLogById = async (id: number): Promise<EmailLog | null> => {
  const result = await pool.query(
    "SELECT * FROM emails_log WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// Create new email log
export const createEmailLog = async (
  email: string,
  subject: string,
  type: string
): Promise<EmailLog> => {
  const result = await pool.query(
    `INSERT INTO emails_log (email, subject, type, sent_at)
     VALUES ($1, $2, $3, NOW())
     RETURNING *`,
    [email, subject, type]
  );
  return result.rows[0];
};

// Delete log
export const deleteEmailLog = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM emails_log WHERE id = $1",
    [id]
  );
  return result.rowCount! > 0;
};
