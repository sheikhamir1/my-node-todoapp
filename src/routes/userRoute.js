import express from "express";
import {
  update,
  user,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  deleteAccount,
} from "../controllers/userHandeler.js";
import { bodyLogger, paramLogger } from "../utils/logger.js";
import {
  userValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateUserNameValidation,
} from "../validations/validation.js";
import { resultValidation } from "../validations/resultValidation.js";
import { removeSpace } from "../validations/customValidation.js";
import { isUserLogin } from "../middlewares/isUserLogin.js";

const userRouter = express.Router();

userRouter.route("/").get(isUserLogin, user);
userRouter
  .route("/signup")
  .post(removeSpace, userValidation, resultValidation, bodyLogger, signup);
userRouter
  .route("/login")
  .post(removeSpace, userValidation, resultValidation, bodyLogger, login);
userRouter
  .route("/")
  .patch(
    isUserLogin,
    removeSpace,
    updateUserNameValidation,
    resultValidation,
    bodyLogger,
    update
  );

userRouter
  .route("/forgotpassword")
  .post(
    removeSpace,
    forgotPasswordValidation,
    resultValidation,
    bodyLogger,
    forgotPassword
  );
userRouter
  .route("/resetpassword/:token")
  .patch(
    removeSpace,
    resetPasswordValidation,
    resultValidation,
    paramLogger,
    bodyLogger,
    resetPassword
  );

userRouter
  .route("/updatepassword")
  .patch(
    isUserLogin,
    removeSpace,
    resetPasswordValidation,
    resultValidation,
    bodyLogger,
    updatePassword
  );

userRouter.route("/deleteaccount").delete(isUserLogin, deleteAccount);

export { userRouter };
