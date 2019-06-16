const express = require("express");
const validator = require("../../validations/feedbackValidations");
const router = express.Router();
const User = require("../../models/User");
const Feedback = require("../../models/Feedback");
const passport = require("passport");
const partnerServices = require("../../services/updatePartner");
const { updateGlobal, updateOptions } = partnerServices;
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.type !== "member") return res.sendStatus(401);
      const { memberId, partnerId, feedbackText } = req.body;
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res
          .status(400)
          .json({ error: isValidated.error.details[0].message });
      const member = await User.findOne({ _id: memberId, type: "member" });
      if (!member) return res.status(400).json({ error: "member not found" });
      const partner = await User.findOne({ _id: partnerId, type: "partner" });
      if (!partner) return res.status(400).json({ error: "partner not found" });
      const feedback = new Feedback({ member, feedbackText });
      delete feedback.member.userData.reviews;
      partner.userData.feedback.push(feedback);
      const newPartner = await User.findOneAndUpdate(
        { _id: partnerId, type: "partner" },
        partner,
        { new: true }
      );
      updateOptions.update_user = false;
      await updateGlobal(newPartner, updateOptions);
      return res.json({ data: feedback });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.get("/readPartnerFeedbacks/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const partner = await User.findOne({ _id: partnerId, type: "partner" });
    if (!partner)
      // Bad request if not found
      return res.status(400).send({ error: "partner not found" });
    return res.json({ data: partner.userData.feedback });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.get("/readFeedback/:feedbackId", async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const partners = await User.find({ type: "partner" });
    let resultFeedback;
    partners.map(partner => {
      const feedback = partner.userData.feedback.find(
        feedback => feedback._id == feedbackId
      );
      if (feedback) resultFeedback = feedback;
    });
    if (!resultFeedback)
      return res.status(400).send({ error: "feedback not found" });
    return res.json({ data: resultFeedback });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.put(
  "/update/:partnerId/:feedbackId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { partnerId, feedbackId } = req.params;
      const { feedbackText } = req.body;
      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });
      const partner = await User.findOne({ _id: partnerId, type: "partner" });
      if (!partner) return res.status(400).json({ error: "partner not found" });
      const feedback = partner.userData.feedback.find(
        feedback => feedback._id == feedbackId
      );
      if (!feedback)
        return res.status(400).json({ error: "feedback not found" });
      if (req.user.id != feedback.member._id) return res.sendStatus(401);
      const feedbackIndex = partner.userData.feedback.indexOf(feedback);
      partner.userData.feedback[feedbackIndex].feedbackText = feedbackText;
      const newPartner = await User.findOneAndUpdate(
        { _id: partnerId, type: "partner" },
        partner,
        { new: true }
      );
      updateOptions.update_user = false;
      await updateGlobal(newPartner, updateOptions);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.delete(
  "/delete/:partnerId/:feedbackId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { partnerId, feedbackId } = req.params;
      const partner = await User.findOne({ _id: partnerId, type: "partner" });
      if (!partner) return res.status(400).send({ error: "partner not found" });
      const removedFeedback = partner.userData.feedback.find(
        feedback => feedback._id == feedbackId
      );
      if (!removedFeedback)
        return res.status(400).json({ error: "feedback not found" });
      if (
        !(
          req.user.type === "admin" || req.user.id == removedFeedback.member._id
        )
      )
        return res.sendStatus(401);
      const removedFeedbackIndex = partner.userData.feedback.indexOf(
        removedFeedback
      );
      partner.userData.feedback.splice(removedFeedbackIndex, 1);
      const newPartner = await User.findOneAndUpdate(
        { _id: partnerId, type: "partner" },
        partner,
        { new: true }
      );
      updateOptions.update_user = false;
      await updateGlobal(newPartner, updateOptions);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

module.exports = router;
