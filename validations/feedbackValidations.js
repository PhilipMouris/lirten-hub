const Joi = require("joi");
const Review = require("../models/Reviews");
module.exports = {
  createValidation: request => {
    const createSchema = {
      memberId: Joi.string().required(),
      partnerId: Joi.string().required(),
      feedbackText: Joi.string().required()
    };

    return Joi.validate(request, createSchema);
  },

  updateValidation: request => {
    const updateSchema = {
      feedbackText: Joi.string().required()
    };

    return Joi.validate(request, updateSchema);
  }
};
