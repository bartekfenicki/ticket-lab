import { Request, Response } from "express";
import * as userModel from "../models/staffUserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Create a user
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("❌ Error creating user:", err, userModel, req.body);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await userModel.validatePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET!,
      { expiresIn: "8h" }
    );

    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 8 * 60 * 60 * 1000,
  });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};



// Get single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userModel.getUserById(Number(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updates: userModel.StaffUser = { ...req.body };

  try {
    if (updates.password_hash) {
      updates.password_hash = await bcrypt.hash(updates.password_hash, 10);
    }



    const updatedUser = await userModel.updateUser(id, updates);
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("❌ Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const success = await userModel.deleteUser(Number(req.params.id));
    if (!success) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
