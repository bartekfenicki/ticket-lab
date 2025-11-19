import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupSwagger } from "./config/swagger.js";
import userRoutes from "./routes/staffUserRoutes.js"

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
setupSwagger(app);

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Test route
app.get("/api/health", (req, res) => res.send("API is healthy ✅"));

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}/api/health`);
  console.log(`📄 Swagger docs available at http://localhost:${PORT}/api/docs`);
});
