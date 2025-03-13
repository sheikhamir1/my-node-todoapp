import jwt from "jsonwebtoken";
import chalk from "chalk";
import { Users } from "../models/userModel.js";

export const isUserLogin = async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log("req.cookies.jwt", token);

  try {
    // check if user is logged in
    if (!token) {
      return res.status(401).json({ message: "Please login first!" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("verifyToken", verifyToken);

    const tokenExpiresAt = () => {
      const date = new Date(verifyToken.exp * 1000);
      return date.toLocaleString();
    };
    console.log(
      chalk.red.bold("Token Expires at:"),
      chalk.blue.bold(tokenExpiresAt())
    );

    // check if user is still exists
    const currentUser = await Users.findById(verifyToken.id);
    if (!currentUser) {
      return res.status(401).json({ message: "User no longer exists!" });
    }

    if (currentUser.changePasswordAfter(verifyToken.iat)) {
      return res.status(401).json({
        message: "User recently changed password! Please login again.",
      });
    }

    req.user = currentUser;
    // console.log(chalk.green.bold((req.user = currentUser)));
    const currentUserID = currentUser._id;
    // console.log(currentUserID);

    next();
  } catch (error) {
    next(error);
  }
};
