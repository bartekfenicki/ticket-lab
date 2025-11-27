import { pool } from "../config/db.js";

export interface TicketStock {
  id: number;
  ticket_type_id: number;
  date: string;
  total_quantity: number;
  sold_quantity: number;
  modified_by?: number | null;
  updated_at: string;
}

export const getAllStock = async (): Promise<TicketStock[]> => {
  const result = await pool.query("SELECT * FROM ticket_stock ORDER BY date ASC");
  return result.rows;
};

export const getStockById = async (id: number): Promise<TicketStock | null> => {
  const result = await pool.query("SELECT * FROM ticket_stock WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const getStockByDate = async (date: string): Promise<TicketStock | null> => {
  const result = await pool.query(
    "SELECT * FROM ticket_stock WHERE date = $1",
    [date]
  )
  return result.rows[0] || null
}

export const createStock = async (data: Omit<TicketStock, "id" | "updated_at">) => {
  const { ticket_type_id, date, total_quantity, sold_quantity, modified_by } = data;

  const result = await pool.query(
    `INSERT INTO ticket_stock (ticket_type_id, date, total_quantity, sold_quantity, modified_by)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [ticket_type_id, date, total_quantity, sold_quantity, modified_by]
  );

  return result.rows[0];
};

export const updateStock = async (id: number, data: Partial<TicketStock>) => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE ticket_stock SET ${setString}, updated_at = NOW()
     WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};

export const upsertStock = async (data: Omit<TicketStock, "id" | "updated_at">) => {
  const { ticket_type_id, date, total_quantity, sold_quantity, modified_by } = data;

  const result = await pool.query(
    `INSERT INTO ticket_stock (ticket_type_id, date, total_quantity, sold_quantity, modified_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (ticket_type_id, date)
     DO UPDATE SET
        total_quantity = EXCLUDED.total_quantity,
        sold_quantity = EXCLUDED.sold_quantity,
        modified_by = NULL,
        updated_at = NOW()
     RETURNING *`,
    [ticket_type_id, date, total_quantity, sold_quantity, modified_by]
  );

  return result.rows[0];
};

export const deleteStock = async (id: number) => {
  await pool.query("DELETE FROM ticket_stock WHERE id = $1", [id]);
  return true;
};
