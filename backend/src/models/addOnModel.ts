import { pool } from "../config/db.js";

export interface AddOn {
  id: number;
  reservation_option_type_id: number;
  name: string;
  description: string | null;
  price: number;
  pricing_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Get all add-ons
export const getAllAddOns = async (): Promise<AddOn[]> => {
  const result = await pool.query("SELECT * FROM add_ons ORDER BY name ASC");
  return result.rows;
};

// Get add-ons by reservation option type
export const getAddOnsByOptionType = async (optionTypeId: number): Promise<AddOn[]> => {
  const result = await pool.query(
    "SELECT * FROM add_ons WHERE reservation_option_type_id = $1 ORDER BY name ASC",
    [optionTypeId]
  );
  return result.rows;
};

// Create add-on
export const createAddOn = async (data: Omit<AddOn, "id" | "created_at" | "updated_at">) => {
  const { reservation_option_type_id, name, description, price, pricing_type, active } = data;

  const result = await pool.query(
    `INSERT INTO add_ons (reservation_option_type_id, name, description, price, pricing_type, active)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [reservation_option_type_id, name, description, price, pricing_type, active]
  );

  return result.rows[0];
};

// Update add-on
export const updateAddOn = async (id: number, data: Partial<AddOn>) => {
  const filteredData = { ...data };
  delete filteredData.updated_at;

  const fields = Object.keys(filteredData);
  const values = Object.values(filteredData);

  if (fields.length === 0) {
    const result = await pool.query(
      `UPDATE add_ons
       SET updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  const setString = fields.map((f, i) => `${f}=$${i + 1}`).join(", ");

  const result = await pool.query(
    `UPDATE add_ons
     SET ${setString}, updated_at = NOW()
     WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0];
};

// Delete add-on
export const deleteAddOn = async (id: number) => {
  await pool.query("DELETE FROM add_ons WHERE id = $1", [id]);
  return true;
};
