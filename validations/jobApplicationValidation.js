const Joi = require("joi");

const createValidation = request => {
  const createSchema = {
    vacancyId: Joi.string().required(),
    memberId: Joi.string().required(),
    applicationText: Joi.string()
  };
  return Joi.validate(request, createSchema);
};
const updateValidation = request => {
  const updateSchema = {
    applicationText: Joi.string(),
    state: Joi.string()
  };
  return Joi.validate(request, updateSchema);
};

module.exports = { createValidation, updateValidation };
