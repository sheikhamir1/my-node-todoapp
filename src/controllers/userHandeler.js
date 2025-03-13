import { Users } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { signToken, jwtCookie } from "../utils/signJWT.js";

const user = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id).select("-password");
    res.status(200).json({ message: "successfully get user detail!", user });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  const { email, userName, password, changePasswordAt } = req.body;

  const signup = {
    email,
    userName,
    password,
    changePasswordAt,
  };

  try {
    const checkEmail = await Users.findOne({ email: email });
    // console.log("checkEmail", checkEmail.email);

    if (checkEmail) {
      return res.status(400).json({ message: "Email already exist!" });
    }

    const addUser = new Users(signup);
    await addUser.save();

    const token = signToken(addUser._id);
    jwtCookie(res, token);

    res.status(201).json({ message: "user Signup successfully!", addUser });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userLogin = await Users.findOne({ email }).select("+password");
    if (!userLogin) {
      return res.status(400).json({ message: "Email does not exist!" });
    }

    const checkPassword = await userLogin.isValidPassword(
      password,
      userLogin.password
    );
    if (!checkPassword) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect!" });
    }

    const token = signToken(userLogin._id);
    jwtCookie(res, token);

    res.status(200).json({ message: "user login successfully!" });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { userName } = req.body;

  try {
    const updateUser = { userName };

    const user = await Users.findByIdAndUpdate(req.user.id, updateUser, {
      new: true,
    });

    res.status(200).json({
      message: "user updated successfully!",
      user: { email: user.email, userName: user.userName },
    });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;

  // console.log("checking userID", req.user);
  try {
    const user = await Users.findById(req.user.id).select("+password");
    const checkPassword = await user.isValidPassword(password, user.password);
    if (!checkPassword) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect!" });
    }

    user.password = newPassword;
    await user.save();

    const token = signToken(user._id);
    jwtCookie(res, token);

    res.status(200).json({ message: "password updated successfully!" });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email: email });
    // console.log("user", user);

    if (!user) {
      return res
        .status(404)
        .json({ message: "user does not exist with this email!" });
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/user/forgotpassword/${resetToken}`;

    const message = `Your password reset token is :- ${resetURL}.\nIf you have not requested this, please ignore this email.`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)!",
      message,
    });

    res.status(200).json({ message: "Reset password token sent to email!" });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  console.log("token form params", token);
  console.log("token form hashed", hashedToken);

  try {
    const user = await Users.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // console.log("user", user);

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or expired!" });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const token = signToken(user._id);

    jwtCookie(res, token);

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    await Users.findByIdAndUpdate(req.user.id, {
      $set: { isUserActive: false },
      userDeactivateAt: Date.now(),
    });
    res.status(200).json({ message: "Account deleted successfully!" });
  } catch (error) {
    next(error);
  }
};

export {
  update,
  user,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  deleteAccount,
};
