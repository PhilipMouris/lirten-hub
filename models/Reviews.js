const uuid = require("uuid");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const partnerSchema = require("./User.js").schema;
const reviewSchema = new Schema({
  partner: {
    type: partnerSchema,
    required: true,
  },
  reviewText: {
    type: String,
    required: true
  },
  rating: {
    type: Number
  },
  datePosted: {
    type: Date
  }
});
module.exports = Reviews = mongoose.model("Reviews", reviewSchema);
