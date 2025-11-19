import { pool } from "../config/db.js";

export interface SpecialEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  ticket_type_id: number;
  max_tickets: number;
  active: boolean;
}

export const getAllEvents = async (): Promise<SpecialEvent[]> => {
  const result = await pool.query("SELECT * FROM special_events ORDER BY date ASC");
  return result.rows;
};

export const getEventById = async (id: number): Promise<SpecialEvent | null> => {
  const result = await pool.query("SELECT * FROM special_events WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const createEvent = async (data: Omit<SpecialEvent, "id">) => {
  const { title, description, date, ticket_type_id, max_tickets, active } = data;

  const result = await pool.query(
    `INSERT INTO special_events (title, description, date, ticket_type_id, max_tickets, active)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description, date, ticket_type_id, max_tickets, active]
  );

  return result.rows[0];
};

export const updateEvent = async (id: number, data: Partial<SpecialEvent>) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE special_events SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};

export const deleteEvent = async (id: number) => {
  await pool.query("DELETE FROM special_events WHERE id = $1", [id]);
  return true;
};
