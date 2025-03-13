import mongoose from "mongoose";

import { Schema } from "mongoose";

const historySchema = new Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  TaskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tasks",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  recurrence: {
    enabled: Boolean,
    frequency: String,
    interval: Number,
    endDate: Date,
    nextOccurrence: Date,
  },
  notification: {
    enabled: Boolean,
    reminderDate: Date,
  },
  historyCreatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedHistory: {
    type: Boolean,
    default: false,
    delatedAt: Date,
  },
});

const History = mongoose.model("History", historySchema);

export { History };
