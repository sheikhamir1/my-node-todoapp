import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    changePasswordAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    isUserActive: {
      type: Boolean,
      default: true,
    },
    userDeactivateAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.isValidPassword = async function (
  testPassword,
  actulPassword
) {
  try {
    return await bcrypt.compare(testPassword, actulPassword);
  } catch (error) {
    throw error;
  }
};

userSchema.methods.changePasswordAfter = function (JWT_TIMESTAMP) {
  if (this.changePasswordAt) {
    const changePasswordAt = parseInt(
      this.changePasswordAt.getTime() / 1000,
      10
    );
    // console.log(changePasswordAt, JWT_TIMESTAMP);

    return JWT_TIMESTAMP < changePasswordAt;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const planeToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(planeToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log(
    { planeToken },
    { passwordResetToken: this.passwordResetToken }
    // { passwordResetExpires: this.passwordResetExpires }
  );

  return planeToken;
};

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.changePasswordAt = Date.now() - 1000;
  next();
});

userSchema.index({ email: 1, unique: true });
userSchema.index({ password: 1 });

const Users = mongoose.model("User", userSchema);

export { Users };
