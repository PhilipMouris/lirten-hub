const Joi = require("joi");
const createValidation = request => {
  const createSchema = {
    name: Joi.string().min(3).required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().min(4).max(6).required(),
    hourlyRate: Joi.string(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    skills: Joi.array().allow(null),
    interests: Joi.array().allow(null),
    password: Joi.string().required(),
    image: Joi.string(),
    availability: Joi.string(),
    location: Joi.string()
  };
  return Joi.validate(request, createSchema);
};
const updateValidation = request => {
  const updateSchema = {
    name: Joi.string().min(3).required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().min(4).max(6).required(),
    hourlyRate: Joi.string(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    skills: Joi.array().allow(null),
    interests: Joi.array().allow(null),
    image: Joi.string(),
    availability: Joi.string(),
    location: Joi.string()
  }
  return Joi.validate(request, updateSchema);
};
module.exports = { createValidation, updateValidation };
