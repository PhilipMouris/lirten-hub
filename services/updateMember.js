//collection imports
const User = require("../models/User");
const JobApplication = require("../models/JobApplication");
const Vacancy = require("../models/Vacancy");
const partnerServices = require("./updatePartner");
const partnerUpdateOptions = partnerServices.updateOptions;
const partnerUpdateGlobal = partnerServices.updateGlobal;

//defining options for the update to avoid updating the same collection several
//times
const updateOptions = {
  update_user: true,
  update_jobApplication: true,
  update_slots: true,
  update_vacancy: true,
  update_vacancy_jobApplication: true,
  update_feedback: true
};

//updateGlobal expecting a member Object and options
const updateGlobal = async (member, options) => {
  const { _id } = member;
  const promises = [];
  const optionKeys = Object.keys(options);
  optionKeys.forEach((option, index) => {
    if (options[option]) promises.push(updates[index](_id, member));
  });
  await Promise.all(promises);
  return;
};
//format: update_collection1_collection2 -> update member in collection1
//in collection2
//ex: update member in vacancy in jobApplication.
//updates member in user collection
const update_user = async (_id, member) => {
  await User.updateOne({ _id }, member);
  return;
};
//updates member in feedback in partner
const update_feedback_partner = async (_id, member) => {
  const query = { type: "partner", "userData.feedback.member._id": _id };
  delete member.userData.reviews;
  const partnersUpdated = await User.find(query);
  console.log("HI", member, partnersUpdated);
  partnerUpdateOptions.update_user = false;
  partnerUpdateOptions.update_review_member = false;
  const promises = [];
  partnersUpdated.forEach(async partner => {
    promises.push(promiseHelper(partner, _id, member));
  });
  await Promise.all(promises);
};
//Promise Helper
const promiseHelper = async (partner, _id, member) => {
  const newPartner = await User.findOneAndUpdate(
    { _id: partner._id, "userData.feedback.member._id": _id },
    {
      $set: { "userData.feedback.$.member": member }
    },
    { new: true }
  );
  await partnerUpdateGlobal(newPartner, partnerUpdateOptions);
};

//updates member in jobApplication
const update_jobApplication = async (_id, member) => {
  const query = { "member._id": _id };
  await JobApplication.updateMany(query, {
    $set: {
      member
    }
  });
};
//updates member in slot in lifeCoach
const update_slots_lifeCoach = async (_id, member) => {
  const query = { type: "lifeCoach", "userData.monthlySlots.member._id": _id };
  await User.updateMany(query, {
    $set: { "userData.monthlySlots.$.member": member }
  });
};
//update member in vacancy
const update_vacancy = async (_id, member) => {
  const query = { "acceptedMember._id": _id };
  await Vacancy.updateMany(query, {
    $set: { acceptedMember: member }
  });
};
//update member in vacancy in jobApplication [Is this really required?]
const update_vacancy_jobApplication = async (_id, member) => {
  const query = { "vacancy.acceptedMember._id": _id };
  await JobApplication.updateMany(query, {
    $set: { "vacancy.acceptedMember": member }
  });
};

//grouping update functions
const updates = [
  update_user,
  update_jobApplication,
  update_slots_lifeCoach,
  update_vacancy,
  update_vacancy_jobApplication,
  update_feedback_partner
];

module.exports = { updateGlobal, updateOptions };
