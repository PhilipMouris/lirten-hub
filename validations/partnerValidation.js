const Joi = require("joi");

// 2 schemas for password attribute difference when updating
const createValidation = request => {
  const createSchema = {
    name: Joi.string()
      .min(3)
      .required(),
    address: Joi.string().min(3),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    fax: Joi.string().min(3),
    phone: Joi.number(),
    partners: Joi.array().allow(null),
    members: Joi.array().allow(null),
    projects: Joi.array().allow(null),
    password: Joi.string().required(),
    image: Joi.string(),
    approved: Joi.boolean().required(),
    fieldOfWork: Joi.string()
  };
  return Joi.validate(request, createSchema);
};
const updateValidation = request => {
  const updateSchema = {
    name: Joi.string()
      .min(3)
      .required(),
    address: Joi.string().min(3),
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    fax: Joi.string().min(3),
    phone: Joi.number(),
    fieldOfWork:Joi.string(),
    partners: Joi.array().allow(null),
    members: Joi.array().allow(null),
    projects: Joi.array().allow(null),
    image: Joi.string(),
    approved: Joi.boolean().required(),
    fieldOfWork: Joi.string()
  };
  return Joi.validate(request, updateSchema);
};

module.exports = { createValidation, updateValidation };
