import chalk from "chalk";

export const logger = (req, res, next) => {
  const date = new Date();
  const url = req.originalUrl;
  const method = req.method;
  const status = res.statusCode;

  console.log(`\n\n${chalk.cyan.bold("Request Log:")}`);

  console.log(
    `Method:${chalk.blue(method)}, URL:${chalk.blue(
      url
    )},Status:${chalk.greenBright.bold(status)}`
  );
  console.log(chalk.yellowBright.bold(`TimeStamp: ${date.toLocaleString()}`));

  next();
};

export const bodyLogger = (req, res, next) => {
  console.log(`${chalk.cyan.bold("Request Body:")}`);
  console.log(req.body);
  next();
};

export const paramLogger = (req, res, next) => {
  console.log(`${chalk.cyan.bold("Request Params:")}`);
  let params = req.params;
  console.log(req.params);
  next();
};

// export const queryLogger = (req, res, next) => {
//   console.log(`${chalk.cyan.bold("Request Query:")}`);
//   console.log(req.query);
//   next();
// };
