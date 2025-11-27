import { pool } from "../config/db.js";

export interface ReservationOptionType {
  id: number;
  name: string;
  description: string | null;
  default_price: number;
  active: boolean;
}

// GET ALL
export const getAllOptionTypes = async (): Promise<ReservationOptionType[]> => {
  const result = await pool.query(`
    SELECT * FROM reservation_option_types
    ORDER BY id ASC
  `);
  return result.rows;
};

// GET ONE
export const getOptionTypeById = async (id: number): Promise<ReservationOptionType | null> => {
  const result = await pool.query(
    "SELECT * FROM reservation_option_types WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// CREATE
export const createOptionType = async (
  data: Omit<ReservationOptionType, "id">
): Promise<ReservationOptionType> => {
  const {
    name,
    description,
    default_price,
    active,
  } = data;

  const result = await pool.query(
    `INSERT INTO reservation_option_types
      (name, description, default_price, active)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, description, default_price, active]
  );

  return result.rows[0];
};

// UPDATE
export const updateOptionType = async (
  id: number,
  data: Partial<ReservationOptionType>
): Promise<ReservationOptionType | null> => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (fields.length === 0) return null;

  const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE reservation_option_types
        SET ${setString}
      WHERE id = $${fields.length + 1}
      RETURNING *`,
    [...values, id]
  );

  return result.rows[0] || null;
};

// DELETE
export const deleteOptionType = async (id: number): Promise<boolean> => {
  await pool.query("DELETE FROM reservation_option_types WHERE id = $1", [id]);
  return true;
};
