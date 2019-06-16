const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const feedbackSchema = require("./Feedback.js").schema;
const partnerSchema = new Schema(
  {
    address: {
      type: String
    },
    fax: {
      type: String
    },
    phone: {
      type: Number
    },
    fieldOfWork: {
      type: String
    },
    partners: {
      type: [String]
    },
    members: {
      type: [String]
    },
    projects: {
      type: [String]
    },
    feedback: {
      type: [feedbackSchema]
    },
    approved: {
      type: Boolean
    }
  },
  { _id: false }
);
module.exports = Partner = mongoose.model("partners", partnerSchema);
