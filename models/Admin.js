const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminSchema = new Schema(
  {
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    salary: {
      type: String
    },
    isSuper: {
      type: Boolean
    },
    age: {
      type: Number
    }
  },
  { _id: false }
);
module.exports = Admin = mongoose.model("admins", adminSchema);
