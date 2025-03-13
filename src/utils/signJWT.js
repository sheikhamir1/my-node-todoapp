import jwt from "jsonwebtoken";

export const signToken = (userID) => {
  const signingToken = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return signingToken;
};

export const jwtCookie = (res, signToken) => {
  res.cookie("jwt", signToken, {
    httpOnly: true,
    secure: process.env.PRODUCTION,
    sameSite: "Strict", // Prevent cross-site request forgery (CSRF)
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (e.g., 1 day)
  });

  //   return signToken;
};
