import { pool } from "../config/db.js";

export interface ClosedDay {
  id: number;
  date: string;
  reason: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
}

// Get all closed days
export const getAllClosedDays = async (): Promise<ClosedDay[]> => {
  const result = await pool.query(
    "SELECT * FROM closed_days ORDER BY date ASC"
  );
  return result.rows;
};

// Get single closed day
export const getClosedDayById = async (id: number): Promise<ClosedDay | null> => {
  const result = await pool.query(
    "SELECT * FROM closed_days WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// Create new closed day
export const createClosedDay = async (
  date: string,
  reason: string | null,
  created_by: number
): Promise<ClosedDay> => {
  const result = await pool.query(
    `INSERT INTO closed_days (date, reason, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [date, reason, created_by]
  );
  return result.rows[0];
};

// Update closed day
export const updateClosedDay = async (
  id: number,
  date: string,
  reason: string | null
): Promise<ClosedDay | null> => {
  const result = await pool.query(
    `UPDATE closed_days
     SET date = $1,
         reason = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING *`,
    [date, reason, id]
  );
  return result.rows[0] || null;
};

// Delete closed day
export const deleteClosedDay = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM closed_days WHERE id = $1",
    [id]
  );
  return result.rowCount! > 0;
};
