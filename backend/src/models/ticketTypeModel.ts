import { pool } from "../config/db.js";

export interface TicketType {
  id: number;
  name: string;
  price: number;
  description: string;
  is_special_event: boolean;
  active: boolean;
}

export const getAllTicketTypes = async (): Promise<TicketType[]> => {
  const result = await pool.query("SELECT * FROM ticket_types ORDER BY id ASC");
  return result.rows;
};

export const getTicketTypeById = async (id: number): Promise<TicketType | null> => {
  const result = await pool.query("SELECT * FROM ticket_types WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const createTicketType = async (data: Omit<TicketType, "id">) => {
  const { name, price, description, is_special_event, active } = data;

  const result = await pool.query(
    `INSERT INTO ticket_types (name, price, description, is_special_event, active)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, price, description, is_special_event, active]
  );

  return result.rows[0];
};

export const updateTicketType = async (id: number, data: Partial<TicketType>) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE ticket_types SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};

export const deleteTicketType = async (id: number) => {
  await pool.query("DELETE FROM ticket_types WHERE id = $1", [id]);
  return true;
};
