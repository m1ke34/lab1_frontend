import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { ApiError, errorHandler } from "./middlewares/errorHandler";
import { logger } from "./middlewares/logger";
import reportsRoutes from "./routes/reports.routes";

const app = express();

app.use(express.json());
app.use(logger);

const allowedOrigins = [
  "http://localhost:5500", 
  "http://127.0.0.1:5500", 
  "http://localhost:5173", 
  "http://127.0.0.1:5173"
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS: origin is not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options(/(.*)/, cors());

app.use("/api/v1/reports", reportsRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, "ROUTE_NOT_FOUND", "Такого маршруту не існує"));
});

app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер працює: http://localhost:${PORT}`);
  console.log(`Репорти: http://localhost:${PORT}/api/v1/reports`);
});
