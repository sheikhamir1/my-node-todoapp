import { body } from "express-validator";

export const userValidation = [
  body("email").isEmail().withMessage("Email is not valid!").normalizeEmail(),

  body("userName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username must be minimum 3 characters!")
    .isLength({ max: 25 })
    .withMessage("Username must be maximum 25 characters!"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 characters!")
    .isLength({ max: 15 })
    .withMessage("Password must be 15 characters!"),
];

export const updateUserNameValidation = [
  body("userName")
    .isLength({ min: 3 })
    .withMessage("Username must be minimum 3 characters!")
    .isLength({ max: 25 })
    .withMessage("Username must be maximum 25 characters!"),
];

export const forgotPasswordValidation = [
  body("email").isEmail().withMessage("Email is not valid!").normalizeEmail(),
];

export const resetPasswordValidation = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be 8 characters!")
    .isLength({ max: 15 })
    .withMessage("Password must be 15 characters!"),
];

export const taskValidation = [
  // Validate title
  body("title")
    .optional()
    .isString()
    .withMessage("Title is required and should be a string")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),

  // Validate description
  body("description")
    .optional()
    .isString()
    .withMessage("Description should be a string"),

  // Validate tags
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags should be an array of strings"),

  // Validate priority (enum validation)
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be one of: low, medium, high"),

  // Validate status (enum validation)
  body("status")
    .optional()
    .isIn(["pending", "ongoing", "completed"])
    .withMessage("Status must be one of: pending, ongoing, completed"),

  // Validate dueDate
  body("dueDate")
    .optional()
    .custom((value) => {
      const today = new Date();
      const dueDate = new Date(value);

      if (dueDate < today) {
        throw new Error("Due date must be in the future");
      }
      return true;
    }),

  // Validate recurrence (optional)
  body("recurrence.enabled")
    .optional()
    .isBoolean()
    .withMessage("Recurrence enabled must be a boolean")
    .custom((value, { req }) => {
      // If recurrence.enabled is true, validate other recurrence fields
      if (value === true) {
        // If recurrence is enabled, check for frequency and interval
        if (!req.body.recurrence.frequency) {
          throw new Error(
            "Recurrence frequency is required when enabled is true"
          );
        }
        if (!req.body.recurrence.interval) {
          throw new Error(
            "Recurrence interval is required when enabled is true"
          );
        }
      }
      return true;
    }),

  // Validate recurrence.frequency
  body("recurrence.frequency")
    .optional()
    .custom((value, { req }) => {
      // Only validate if recurrence.enabled is true
      if (
        req.body.recurrence.enabled === true &&
        !["daily", "weekly", "monthly", "yearly"].includes(value)
      ) {
        throw new Error(
          "Recurrence frequency must be one of: daily, weekly, monthly, yearly"
        );
      }
      return true;
    }),

  // Validate recurrence.interval
  body("recurrence.interval")
    .optional()
    .custom((value, { req }) => {
      // Only validate if recurrence.enabled is true
      if (req.body.recurrence.enabled === true && value < 1) {
        throw new Error("Recurrence interval must be at least 1");
      }
      return true;
    }),

  body("recurrence.endDate")
    .optional()
    .custom((value, { req }) => {
      // Only validate if recurrence.enabled is true
      if (req.body.recurrence.enabled) {
        // If endDate is missing, it's required
        if (!value) {
          throw new Error("End date is required when recurrence is enabled");
        }

        // Ensure that endDate is greater than dueDate
        const dueDate = new Date(req.body.dueDate);
        const recurrenceEndDate = new Date(value);

        if (recurrenceEndDate > dueDate) {
          throw new Error(
            "Recurrence end date must be before or equal to the due date"
          );
        }
      }

      return true;
    }),

  // Validate notification (optional)
  body("notification.enabled")
    .optional()
    .isBoolean()
    .withMessage("Notification enabled must be a boolean"),
  body("notification.reminderDate")
    .optional()
    .custom((value, { req }) => {
      // Only validate if notification.enabled is true
      if (req.body.notification.enabled) {
        // If reminderDate is missing, it's required
        if (!value) {
          throw new Error(
            "Reminder date is required when notification is enabled"
          );
        }

        // Ensure that reminderDate is greater than dueDate
        const dueDate = new Date(req.body.dueDate);
        const reminderDate = new Date(value);

        if (reminderDate > dueDate) {
          throw new Error("Reminder date must be before or equal to due date");
        }
      }

      return true;
    }),
];
