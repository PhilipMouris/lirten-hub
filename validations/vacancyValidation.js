const Joi = require("joi");

const createValidation = request => {
  const createSchema = {
    partnerId: Joi.required(),
    title: Joi.string(),
    description: Joi.string().required(),
    duration: Joi.string(),
    monthlyWage: Joi.string(),
    location: Joi.string(),
    dailyHours: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    state: Joi.string(),
    availability: Joi.string(),
    skills: Joi.array()
  };
  return Joi.validate(request, createSchema);
};
const updateValidation = request => {
  const updateSchema = {
    partnerId: Joi.required(),
    description: Joi.string().required(),
    title: Joi.string(),
    duration: Joi.string(),
    monthlyWage: Joi.string(),
    location: Joi.string(),
    dailyHours: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    state: Joi.string(),
    availability: Joi.string(),
    skills: Joi.array(),
    acceptedMemberId: Joi.string()
  };
  return Joi.validate(request, updateSchema);
};

module.exports = { createValidation, updateValidation };
