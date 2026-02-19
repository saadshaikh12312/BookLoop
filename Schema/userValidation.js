const Joi = require("joi");

module.exports.validateUserSchema = Joi.object({
  user: Joi.object({
    name: Joi.object({
      firstName: Joi.string()
        .min(3)
        .required(),

      lastName: Joi.string()
        .min(3)
        .required()
    }).required(),

    mobileNo: Joi.string()
      .pattern(/^[6-9]\d{9}$/)
      .required()
      .messages({
        "string.pattern.base": "Enter a valid 10-digit mobile number"
      })
  }).required()
});
