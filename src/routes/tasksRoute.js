import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/tasksHandeler.js";
import { bodyLogger, paramLogger } from "../utils/logger.js";
import { taskValidation } from "../validations/validation.js";
import { resultValidation } from "../validations/resultValidation.js";

const taskRouter = express.Router();

taskRouter
  .route("/")
  .get(getAllTasks)
  .post(taskValidation, resultValidation, bodyLogger, createTask);
taskRouter
  .route("/:id")
  .get(paramLogger, getTask)
  .put(taskValidation, resultValidation, paramLogger, bodyLogger, updateTask)
  .delete(paramLogger, deleteTask);

export { taskRouter };
