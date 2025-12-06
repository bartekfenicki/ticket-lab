import { pool } from "../config/db.js";

export interface OpeningHour {
  id: number;
  day_of_week: string;   // e.g. "monday"
  open_time: string;     // "09:00"
  close_time: string;    // "17:00"
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Get all opening hours
export const getAllOpeningHours = async (): Promise<OpeningHour[]> => {
  const result = await pool.query(
    "SELECT * FROM opening_hours ORDER BY id ASC"
  );
  return result.rows;
};

// Get one by ID
export const getOpeningHourById = async (id: number): Promise<OpeningHour | null> => {
  const result = await pool.query(
    "SELECT * FROM opening_hours WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// Create opening hour
export const createOpeningHour = async (
  day_of_week: string,
  open_time: string,
  close_time: string,
  active: boolean
): Promise<OpeningHour> => {
  const result = await pool.query(
    `INSERT INTO opening_hours (day_of_week, open_time, close_time, active)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [day_of_week, open_time, close_time, active]
  );
  return result.rows[0];
};

// Update opening hour
export const updateOpeningHour = async (
  id: number,
  day_of_week: string,
  open_time: string,
  close_time: string,
  active: boolean
): Promise<OpeningHour | null> => {
  const result = await pool.query(
    `UPDATE opening_hours
     SET day_of_week = $1,
         open_time = $2,
         close_time = $3,
         active = $4
     WHERE id = $5
     RETURNING *`,
    [day_of_week, open_time, close_time, active, id]
  );
  return result.rows[0] || null;
};

// Delete opening hour
export const deleteOpeningHour = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM opening_hours WHERE id = $1",
    [id]
  );
  return result.rowCount! > 0;
};
