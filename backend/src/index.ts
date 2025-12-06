import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { setupSwagger } from "./config/swagger.js";
import userRoutes from "./routes/staffUserRoutes.js"
import ticketTypeRoutes from "./routes/ticketTypeRoutes.js";
import specialEventsRoutes from "./routes/specialEventsRoutes.js";
import ticketStockRoutes from "./routes/ticketStockRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import reservationOptionTypesRoutes from "./routes/reservationOptionTypesRoutes.js";
import reservationOptionsRoutes from "./routes/reservationOptionsRoutes.js";
import addOnRoutes from "./routes/addOnRoutes.js";
import optionTypeVariantsRoutes from "./routes/optionTypeVariantsRoutes.js";
import closedDaysRoutes from "./routes/closedDaysRoutes.js";
import openingHoursRoutes from "./routes/openingHoursRoutes.js";
import emailLogsRoutes from "./routes/emailLogsRoutes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
setupSwagger(app);

app.use("/api/users", userRoutes);
app.use("/api/ticket-types", ticketTypeRoutes);
app.use("/api/special-events", specialEventsRoutes);
app.use("/api/ticket-stock", ticketStockRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reservation-option-types", reservationOptionTypesRoutes);
app.use("/api/reservation-options", reservationOptionsRoutes);
app.use("/api/addons", addOnRoutes);
app.use("/api/option-type-variants", optionTypeVariantsRoutes);
app.use("/api/closed-days", closedDaysRoutes);
app.use("/api/opening-hours", openingHoursRoutes);
app.use("/api/email-logs", emailLogsRoutes);

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
