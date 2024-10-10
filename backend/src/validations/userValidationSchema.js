const Joi = require("joi");

// Registration validation schema
const userRegisterValidation = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "any.required": "Password is required",
  }),
});
const validateRegisterData = (req, res, next) => {
  const { error } = userRegisterValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

// Login validation schema
const loginValidationSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().optional(),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
  }),
});

const validateLoginData = (req, res, next) => {
  const { error } = loginValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

// account update validation schema
const accounUpdateValidationSchema = Joi.object({
  username: Joi.string().email().trim().lowercase().optional(),
  fullName: Joi.string().trim().optional(),
});

const validateData = (req, res, next) => {
  const { error } = accounUpdateValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = { validateRegisterData, validateLoginData, validateData };
