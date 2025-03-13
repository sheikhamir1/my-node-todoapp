import express, { Router } from "express";
import bodyParse from "body-parser";
import { taskRouter } from "./routes/tasksRoute.js";
import { userRouter } from "./routes/userRoute.js";
import {
  connectLocalMongoDB,
  connectMongoDB,
} from "./configs/databaseConfig.js";
import cookieParser from "cookie-parser";
import expressRateLimit from "express-rate-limit";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";
import { logger } from "./utils/logger.js";
import { errorHandeler } from "./middlewares/errorHandeler.js";
import { isUserLogin } from "./middlewares/isUserLogin.js";
import { Tasks } from "./models/tasksModel.js";
import { Users } from "./models/userModel.js";

// connectLocalMongoDB();
connectMongoDB();
const app = express();

const rateLimit = expressRateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour!",
  // standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(bodyParse.json({ limit: "1mb" }));
app.use(bodyParse.urlencoded({ extended: true }));
app.use(logger);
// app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(sanitize());
app.use(hpp());
app.use("/api", rateLimit);

app.delete("/all", (req, res) => {
  // Tasks.deleteMany({}).then(() => {
  //   res.status(200).json({ message: "All tasks deleted successfully!" });
  // });
  // Users.deleteMany({}).then(() => {
  //   res.status(200).json({ message: "All users deleted successfully!" });
  // });
});

// All Routes Here...
app.use("/api/v1/tasks", isUserLogin, taskRouter);
app.use("/api/v1/user", userRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: `${req.originalUrl} Route not found! ` });
});
app.use(errorHandeler);

export { app };
