import { pool } from "../config/db.js";

export interface ReservationOptionTypeVariant {
  id: number;
  reservation_option_type_id: number;
  name: string;
  price: number;
  pricing_type: string;
  active: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

// Get all variants
export const getAllVariants = async (): Promise<ReservationOptionTypeVariant[]> => {
  const result = await pool.query("SELECT * FROM reservation_option_type_variants ORDER BY name ASC");
  return result.rows;
};

// Get variants by option type
export const getVariantsByOptionType = async (optionTypeId: number): Promise<ReservationOptionTypeVariant[]> => {
  const result = await pool.query(
    "SELECT * FROM reservation_option_type_variants WHERE reservation_option_type_id = $1 ORDER BY name ASC",
    [optionTypeId]
  );
  return result.rows;
};

// Create a variant
export const createVariant = async (data: Omit<ReservationOptionTypeVariant, "id" | "created_at" | "updated_at">) => {
  const { reservation_option_type_id, name, price, pricing_type, active, description } = data;

  const result = await pool.query(
    `INSERT INTO reservation_option_type_variants
      (reservation_option_type_id, name, price, pricing_type, active, description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [reservation_option_type_id, name, price, pricing_type, active, description]
  );

  return result.rows[0];
};

export const updateVariant = async (id: number, data: Partial<ReservationOptionTypeVariant>) => {
  // Remove updated_at from incoming data
  const filteredData = { ...data };
  delete filteredData.updated_at;

  const fields = Object.keys(filteredData);
  const values = Object.values(filteredData);

  if (fields.length === 0) {
    // Nothing to update, just update updated_at
    const result = await pool.query(
      `UPDATE reservation_option_type_variants
       SET updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE reservation_option_type_variants
     SET ${setString}, updated_at = NOW()
     WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};

// Delete a variant
export const deleteVariant = async (id: number) => {
  await pool.query("DELETE FROM reservation_option_type_variants WHERE id = $1", [id]);
  return true;
};
