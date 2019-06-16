const Joi = require("joi");

// 2 schemas for password attribute difference when updating
const createValidation = (request) => {
  const createSchema = {
    name: Joi.string().min(3).required(),
    password:Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().min(4).max(6).required(),
    hourlyRate:Joi.string(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    image: Joi.string()
  };
  return Joi.validate(request, createSchema);
};
const updateValidation = (request) => {
  const updateSchema = {
    name: Joi.string().min(3).required(),
    dateOfBirth: Joi.date().required(),
    gender: Joi.string().min(4).max(6).required(),
    hourlyRate:Joi.string(),
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    image: Joi.string(),
    ratings: Joi.array()
  }
  return Joi.validate(request, updateSchema);
};

module.exports = { createValidation,updateValidation };
