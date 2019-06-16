//collection imports
const User = require("../models/User");
const mongoose = require("mongoose");
const JobApplication = require("../models/JobApplication");
const Vacancy = require("../models/Vacancy");
const memberServices = require("./updateMember");
const memberUpdateOptions = memberServices.updateOptions;
const memberUpdateGlobal = memberServices.updateGlobal;

const deletePartnerGlobal = async _id => {
  const mongoId = mongoose.Types.ObjectId(_id);
  const promises = [];
  deletions.forEach(deleteOperation => {
    promises.push(deleteOperation(mongoId));
  });
  await Promise.all(promises);
};
//format: delete_collection1_collection2 -> delete member in collection1
//in collection2
//deleting vacancy which has this partner
const delete_vacancy = async _id => {
  const query = { "partner._id": _id };
  await Vacancy.deleteMany(query);
};
//deleting all job applications which have this partner
const delete_vacancy_jobApplication = async _id => {
  const query = { "vacancy.partner._id": _id };
  await JobApplication.deleteMany(query);
};
// delete reviews which have this partner
const delete_reviews_member = async _id => {
  const query = { type: "member", "userData.reviews.partner._id": _id };
  /*await User.updateMany(query, {
    $pull: { "userData.reviews": { "partner._id": _id } }
  });*/
  const membersUpdated = await User.find(query);
  memberUpdateOptions.update_user = false;
  memberUpdateOptions.update_feedback = false;
  const promises = [];
  membersUpdated.forEach(member => {
    promises.push(promiseHelper(member, _id));
  });
  await Promise.all(promises);
};
const promiseHelper = async (member, _id) => {
  const newMember = await User.findOneAndUpdate(
    { _id: member._id, "userData.reviews.partner._id": _id },
    {
      $pull: { "userData.reviews": { "partner._id": _id } }
    },
    { new: true }
  );
  memberUpdateGlobal(newMember, memberUpdateOptions);
};

//grouping up delete operations
const deletions = [
  delete_vacancy,
  delete_vacancy_jobApplication,
  delete_reviews_member
];

module.exports = deletePartnerGlobal;
