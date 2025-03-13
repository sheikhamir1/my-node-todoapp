import mongoose from "mongoose";

import { Schema } from "mongoose";

const categoriesSchema = new Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  categoryDescription: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Categories = mongoose.model("Categories", categoriesSchema);

export { Categories };
