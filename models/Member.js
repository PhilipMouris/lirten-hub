const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = require("./Reviews.js").schema;
const memberSchema = new Schema(
  {
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    skills: {
      type: [String]
    },
    interests: {
      type: [String]
    },
    reviews: {
      type: [reviewSchema]
    },
    age: {
      type: Number
    },
    availability: {
      type: String
    },
    location: {
      type: String
    }
  },
  { _id: false }
);
module.exports = Member = mongoose.model("members", memberSchema);
