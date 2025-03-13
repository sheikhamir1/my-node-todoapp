import mongoose from "mongoose";

import { Schema } from "mongoose";

const tasksSchema = new Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },

  priority: {
    type: String,
    required: true,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
  startAt: {
    type: Date,
  },
  isUpdated: {
    type: Boolean,
  },
  updatedAt: {
    type: Date,
  },

  completedAt: {
    type: Date,
  },
  isCompleted: {
    type: Boolean,
  },
  isDeleted: {
    type: Boolean,
  },
  dueDate: {
    type: Date,
  },
  recurrence: {
    enabled: Boolean,
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    interval: {
      type: Number,
      min: 1,
    },
    recurrenceEndDate: Date,
    nextOccurrence: Date,
  },
  notification: {
    enabled: Boolean,
    reminderDate: Date,
  },
});

tasksSchema.methods.markAsCompleted = function () {
  if (this.status === "ongoing") {
    this.status = "completed";
    if (!this.isCompleted) {
      this.isCompleted = true;
      this.completedAt = new Date();
    }
  }

  if (!this.isUpdated) {
    this.isUpdated = true;
    this.updatedAt = new Date();
  }

  return this.save();
};

tasksSchema.methods.taskStart = function () {
  if (this.status === "pending") {
    this.status = "ongoing";
    this.startAt = new Date();
  }

  return this.save();
};

tasksSchema.query.checkStatus = function (status) {
  return this.where({ status });
};

tasksSchema.index({ UserId: 1 });
tasksSchema.index({ createdAt: 1 });
tasksSchema.index({ dueDate: 1 });
tasksSchema.index({ priority: 1, status: 1 });

const Tasks = mongoose.model("Tasks", tasksSchema);

export { Tasks };
