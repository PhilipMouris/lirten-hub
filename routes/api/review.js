const express = require("express");
const validator = require("../../validations/reviewValidations");
const router = express.Router();
const User = require("../../models/User");
const Review = require("../../models/Reviews");
const passport = require("passport");
const memberServices = require("../../services/updateMember");
const { updateGlobal, updateOptions } = memberServices;
//
router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.type !== "partner") return res.sendStatus(401);
      const { memberID, partnerID, reviewText, rating } = req.body;
      const query1 = { _id: memberID, type: "member" };
      const member = await User.findOne(query1);
      const query2 = { _id: partnerID, type: "partner" };
      const partner = await User.findOne(query2);
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error)
        return res
          .status(400)
          .json({ error: isValidated.error.details[0].message });
      if (!partner) return res.status(400).json({ error: "Partner not Found" });
      if (!member) return res.status(400).json({ error: "Member not Found" });
      delete partner.userData.feedback;
      const datePosted = new Date();
      const newReview = new Review({
        partner,
        reviewText,
        rating,
        datePosted
      });
      member.userData.reviews.push(newReview);
      //await User.updateOne(query1, member);
      const newMember = await User.findOneAndUpdate(query1, member, {
        new: true
      });
      updateOptions.update_user = false;
      await updateGlobal(newMember, updateOptions);
      return res.json({ data: newReview });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.get("/readMemberReviews/:memberId", async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const query = { _id: memberId, type: "member" };
    const member = await User.findOne(query);
    member
      ? res.json({ data: member.userData.reviews })
      : [res.status(400).json({ err: "Member Not Found" })];
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.get("/readReview/:reviewId", async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const allUsers = await User.find();
    let fetchedReview = null;
    let found = false;
    allUsers.map(user => {
      if (user.type === "member") {
        fetchedReview = user.userData.reviews.find(
          review => review._id == reviewId
        );
        if (fetchedReview) {
          found = true;
          return res.json({ data: fetchedReview });
        }
      }
    });
    if (!found) return res.status(400).json({ err: "Review Not Found" });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

// router.get("/read/", (req, res) => {
//   res.json({ data: reviews });
// });

router.put(
  "/update/:memberId/:reviewId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { memberId, reviewId } = req.params;
      const { reviewText, rating } = req.body;
      const isValidated = validator.updateValidation(req.body);
      if (isValidated.error)
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });
      const query1 = { _id: memberId, type: "member" };
      const member = await User.findOne(query1);

      if (!member) {
        return res.status(400).json({ error: "Member not found" });
      }

      const review = member.userData.reviews.find(
        review => review._id == reviewId
      );
      if (!review) {
        return res.status(400).json({ err: "review Not Found" });
      }
      if (req.user.id != review.partner._id) return res.sendStatus(401);
      const datePosted = review.datePosted;
      const reviewIndex = member.userData.reviews.indexOf(review);
      const id = reviewId;
      // member.userData.reviews[reviewIndex] = {
      //   id,
      //   partner:member.userData.reviews[reviewIndex].partner,
      //   reviewText,
      //   rating,
      //   datePosted
      // };
      member.userData.reviews[reviewIndex] = {
        ...member.userData.reviews[reviewIndex],
        reviewText,
        rating
      };
      const newMember = await User.findOneAndUpdate(query1, member, {
        new: true
      });
      updateOptions.update_user = false;
      await updateGlobal(newMember, updateOptions);
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.delete(
  "/delete/:memberId/:reviewId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { memberId, reviewId } = req.params;
      const query1 = { _id: memberId, type: "member" };
      const member = await User.findOne(query1);

      if (!member) {
        return res.status(400).send({ error: "Member not found" });
      }
      const review = member.userData.reviews.find(
        review => review._id == reviewId
      );
      if (!review) {
        return res.status(400).json({ err: "review Not Found" });
      }
      if (!(req.user.type === "admin" || req.user.id == review.partner._id))
        return res.sendStatus(401);
      const reviewIndex = member.userData.reviews.indexOf(review);
      member.userData.reviews.splice(reviewIndex, 1);
      const newMember = await User.findOneAndUpdate(query1, member, {
        new: true
      });
      updateOptions.update_user = false;
      await updateGlobal(newMember, updateOptions);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

// router.get("/read/", (req, res) => {
//   res.json({ data: reviews });
// });
module.exports = router;
