//collection imports
const User = require("../models/User");
const mongoose = require("mongoose");
const Vacancy = require("../models/Vacancy");
const JobApplication = require("../models/JobApplication");
//defining options for the update to avoid updating the same collection several
//times
const updateOptions = {
  update_user: true,
  update_vacancy: true,
  update_vacancy_jobApplication: true,
  update_review_member: true
};
//updateGlobal expecting a partner object and options.
const updateGlobal = async (partner, options) => {
  const { _id } = partner;
  const promises = [];
  const optionKeys = Object.keys(options);
  optionKeys.forEach((option, index) => {
    if (options[option]) promises.push(updates[index](_id, partner));
  });
  await Promise.all(promises);
  return;
};
//format: update_collection1_collection2 -> update member in collection1
//in collection2
//ex: update partner in vacancy in jobApplication.
//updates partner in user collection
const update_partner = async (_id, partner) => {
  await User.updateOne({ _id }, partner);
};
//updates partner in reviews in members
const update_review_member = async (_id, partner) => {
  const query = { type: "member", "userData.reviews.partner._id": _id };
  delete partner.userData.feedback;
  const membersToBeUpdated = await User.find(query);
  const memberServices = require("./updateMember");
  const memberUpdateOptions = memberServices.updateOptions;
  const memberUpdateGlobal = memberServices.updateGlobal;
  memberUpdateOptions.update_user = false;
  memberUpdateOptions.update_feedback = false;
  const promises = [];
  membersToBeUpdated.forEach(member => {
    promises.push(
      promiseHelper(
        member,
        _id,
        memberUpdateGlobal,
        memberUpdateOptions,
        partner
      )
    );
  });
  await Promise.all(promises);

  /*await User.updateMany(query, {
    $set: { "userData.reviews.$.partner": partner }
  });
  // global update members goes here
  /*const updateMember = require("./updateMember");
  console.log(updateMember);*/
};
const promiseHelper = async (
  member,
  _id,
  memberUpdate,
  memberOptions,
  partner
) => {
  const newMember = await User.findOneAndUpdate(
    { _id: member._id, "userData.reviews.partner._id": _id },
    {
      $set: { "userData.reviews.$.partner": partner }
    },
    { new: true }
  );
  await memberUpdate(newMember, memberOptions);
};
//updates partner in vacancy
const update_vacancy = async (_id, partner) => {
  const query = { "partner._id": _id };
  await Vacancy.updateMany(query, {
    $set: { partner }
  });
};
//updates partner in vacancy in job Application
const update_vacancy_jobApplication = async (_id, partner) => {
  const query = { "vacancy.partner._id": _id };
  await JobApplication.updateMany(query, {
    $set: { "vacancy.partner": partner }
  });
};
const updates = [
  update_partner,
  update_vacancy,
  update_vacancy_jobApplication,
  update_review_member
];
module.exports = { updateOptions, updateGlobal };
