//collection imports
const User = require("../models/User");
const mongoose = require("mongoose");
const JobApplication = require("../models/JobApplication");
const Vacancy = require("../models/Vacancy");
const partnerServices = require("./updatePartner");
const partnerUpdateOptions = partnerServices.updateOptions;
const partnerUpdateGlobal = partnerServices.updateGlobal;

//deleteMember Global expecting a member ID
const deleteMemberGlobal = async _id => {
  const mongoId = mongoose.Types.ObjectId(_id);
  const promises = [];
  deletions.forEach(deleteOperation => {
    promises.push(deleteOperation(mongoId));
  });
  await Promise.all(promises);
};
//format: delete_collection1_collection2 -> delete member in collection1
//in collection2
//delete feedback in partner
const delete_feedback_partner = async _id => {
  const query = {
    type: "partner",
    "userData.feedback.member._id": _id
  };
  const partnersUpdated = await User.find(query);
  /*await User.updateMany(query, {
    $pull: { "userData.feedback": { "member._id": _id } }
  });*/
  partnerUpdateOptions.update_user = false;
  partnerUpdateOptions.update_review_member = false;
  const promises = [];
  partnersUpdated.forEach(async partner => {
    promises.push(promiseHelper(partner, _id));
  });
  await Promise.all(promises);
};
promiseHelper = async (partner, _id) => {
  const newPartner = await User.findOneAndUpdate(
    { _id: partner._id, "userData.feedback.member._id": _id },
    {
      $pull: { "userData.feedback": { "member._id": _id } }
    },
    { new: true }
  );
  partnerUpdateGlobal(newPartner, partnerUpdateOptions);
};

//deleting jobApplication if it has this member
const delete_jobApplication = async _id => {
  const query = {
    "member._id": _id
  };
  await JobApplication.deleteMany(query);
};
//delete member from vacancy
const delete_vacancy = async _id => {
  const query = {
    "acceptedMember._id": _id
  };
  await Vacancy.updateMany(query, { acceptedMember: null });
};
//delete accepted member from vacancy from jobApplication
const delete_vacancy_jobApplication = async _id => {
  const query = {
    "vacancy.acceptedMember._id": _id
  };
  await JobApplication.updateMany(query, { "vacancy.acceptedMember": null });
};
//delete member from slots and update lifeCoach
const delete_slots_lifeCoach = async _id => {
  const query = {
    type: "lifeCoach",
    "userData.monthlySlots.member._id": _id
  };
  await User.updateMany(query, {
    $set: {
      "userData.monthlySlots.$.member": null,
      "userData.monthlySlots.$.booked": false,
      "userData.monthlySlots.$.confirmed": false,
      "userData.monthlySlots.$.location": null
    }
  });
};

//grouping up deleteOperations
const deletions = [
  delete_feedback_partner,
  delete_jobApplication,
  delete_vacancy,
  delete_vacancy_jobApplication,
  delete_slots_lifeCoach
];

module.exports = deleteMemberGlobal;
