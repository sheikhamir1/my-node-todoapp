export const removeSpace = (req, res, next) => {
  let { email, userName, password } = req.body;

  // Modify the fields if they exist
  if (email) {
    email = email.toLowerCase().trim().replace(/\s+/g, "");
    req.body.email = email;
    // console.log("clean email", email);
  }

  if (userName) {
    userName = userName.toLowerCase().trim().replace(/\s+/g, "");
    req.body.userName = userName;
    // console.log("clean userName", userName);
  }

  if (password) {
    password = password.trim().replace(/\s+/g, "");
    req.body.password = password;
    // console.log("clean password", password);
  }

  next();
};
