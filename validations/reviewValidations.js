const Joi = require("joi");
const Review = require("../models/Reviews");

module.exports = {
  createValidation: request => {
    const createSchema = {
      partnerID:Joi.string().required(),
      memberID:Joi.string().required(),
      reviewText:Joi.string().required(),
      rating:Joi.string(),
    };

    return Joi.validate(request, createSchema);
  },

  updateValidation: request => {
    const updateSchema = {
      reviewText:Joi.string().required(),
      rating:Joi.string(),
      
    };

    return Joi.validate(request, updateSchema);
  }
};
