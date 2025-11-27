import { pool } from "../config/db.js";

export interface ReservationOption {
  id: number;
  reservation_id: number;
  option_type_id: number;
  quantity: number;
  calculated_price: number;
}

// GET ALL
export const getAllReservationOptions = async (): Promise<ReservationOption[]> => {
  const result = await pool.query(`
    SELECT * FROM reservation_options
    ORDER BY id ASC
  `);
  return result.rows;
};

// GET BY ID
export const getReservationOptionById = async (
  id: number
): Promise<ReservationOption | null> => {
  const result = await pool.query(
    "SELECT * FROM reservation_options WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

// GET ALL OPTIONS FOR ONE RESERVATION
export const getOptionsByReservationId = async (
  reservationId: number
): Promise<ReservationOption[]> => {
  const result = await pool.query(
    "SELECT * FROM reservation_options WHERE reservation_id = $1 ORDER BY id ASC",
    [reservationId]
  );
  return result.rows;
};

// CREATE
export const createReservationOption = async (
  data: Omit<ReservationOption, "id">
): Promise<ReservationOption> => {
  const { reservation_id, option_type_id, quantity, calculated_price } = data;

  const result = await pool.query(
    `INSERT INTO reservation_options
      (reservation_id, option_type_id, quantity, calculated_price)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [reservation_id, option_type_id, quantity, calculated_price]
  );

  return result.rows[0];
};

// UPDATE
export const updateReservationOption = async (
  id: number,
  data: Partial<ReservationOption>
): Promise<ReservationOption | null> => {
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (fields.length === 0) return null;

  const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE reservation_options
        SET ${setString}
      WHERE id = $${fields.length + 1}
      RETURNING *`,
    [...values, id]
  );

  return result.rows[0] || null;
};

// DELETE
export const deleteReservationOption = async (id: number): Promise<boolean> => {
  await pool.query("DELETE FROM reservation_options WHERE id = $1", [id]);
  return true;
};
