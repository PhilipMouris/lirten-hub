const express = require("express");
const mongoose = require("mongoose");
const Vacancy = require("../../models/Vacancy");
const User = require("../../models/User");
const JobApplication = require("../../models/JobApplication");
const validator = require("../../validations/vacancyValidation");
const recommender = require("../../services/recommendations");
const passport = require("passport");
const router = express.Router();

router.get("/", async (req, res) => {
  const vacancies = await Vacancy.find();
  return res.json({ data: vacancies });
});
router.post("/updateRecommendation/:memberID/:vacancyID", async (req, res) => {
  const { vacancyID, memberID } = req.params;
  try {
    const member = await User.findById(memberID);
    const vacancy = await Vacancy.findById(vacancyID);
    if (vacancy) {
      console.log("Vacancy beofre update" + vacancy);

      if (member) {
        await recommender.addMemberDetails(member);
        await recommender.addDetailView(vacancyID, memberID);
        await recommender.addItemDetails(vacancy);
        return res.sendStatus(200);
      } else {
        return res.sendStatus(400);
      }
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});
router.post(
  "/updateAppliedRecommendation/:memberID/:vacancyID",
  async (req, res) => {
    const { vacancyID, memberID } = req.params;
    try {
      const member = await User.findById(memberID);
      const vacancy = await Vacancy.findById(vacancyID);
      if (vacancy) {
        await recommender.addItemDetails(vacancy);
        if (member) {
          await recommender.addMemberDetails(member);
          await recommender.addPurchase(vacancyID, memberID);
          return res.sendStatus(200);
        } else {
          return res.sendStatus(400);
        }
      } else {
        return res.sendStatus(400);
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const vacancy = await Vacancy.findById(id);
    if (!vacancy)
      // Bad request if not found
      return res.status(400).send({ error: "vacancy not found" });
    return res.json({ data: vacancy });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});
router.get("/getRecommendationsNormal/:memberID", async (req, res) => {
  const { memberID } = req.params;
  try {
    const allVacancies = await Vacancy.find();
    const recommendedVacancies = [];
    let matchedArray = [];
    let id = memberID;
    const member = await User.findById(id);
    console.log(member);
    if (allVacancies) {
      if (member) {
        allVacancies.map(vacancy => {
          let matchedObject = {
            skillsMatchCount: 0,
            locationMatch: false,
            availabilityMatch: false,
            vacancyID: ""
          };
          matchedObject.vacancyID = vacancy._id;
          if (vacancy.location === member.userData.location) {
            matchedObject.locationMatch = true;
          }
          if (vacancy.availability === member.userData.availability) {
            matchedObject.availabilityMatch = true;
          }
          if (member.userData.skills.length > 0) {
            member.userData.skills.map(skill => {
              // console.log(vacancy.skills);
              if (vacancy.skills.length > 0) {
                if (vacancy.skills.includes(skill)) {
                  matchedObject.skillsMatchCount =
                    matchedObject.skillsMatchCount + 1;
                }
              }
            });
          }

          matchedArray.push(matchedObject);
        });
        console.log(matchedArray, "Before Sorting");
        const sortedArray = matchedArray.sort((v1, v2) => {
          let tp1 = v1.skillsMatchCount;
          let tp2 = v2.skillsMatchCount;
          if (v1.locationMatch === true) {
            tp1 = tp1 + 3;
          }
          if (v2.locationMatch === true) {
            tp2 = tp2 + 3;
          }
          if (v1.availabilityMatch === true) {
            tp1 = tp1 + 2;
          }
          if (v2.availabilityMatch === true) {
            tp2 = tp2 + 2;
          }
          return tp2 - tp1;
        });
        let recommended = [];
        sortedArray.map(x => {
          recommended.push(
            allVacancies.find(vacancy => {
              return x.vacancyID == vacancy._id;
            })
          );
        });
        console.log(recommended);
        return res.json({ data: recommended });
      } else {
        return res.sendStatus(400);
      }
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    return res.status(400);
  }
});
router.get("/getRecommendationsInter/:memberID", async (req, res) => {
  const { memberID } = req.params;
  const allVacancies = await Vacancy.find();
  try {
    const recommendedVacancies = await recommender.getRecommendations(
      memberID,
      2,
      recommendedVacancies => {
        console.log(recommendedVacancies, "In dest");
        const fullVacancies = [];
        recommendedVacancies.recomms.forEach(vacancyID => {
          const vacancy = allVacancies.find(vacancy => {
            return vacancy._id == vacancyID.id;
          });
          fullVacancies.push(vacancy);
        });
        return res.json({ data: fullVacancies });
      }
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});
router.get("/partnerVacancies/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const partner = await User.findOne({ _id: partnerId, type: "partner" });
    if (!partner)
      // Bad request if not found
      return res.status(400).send({ error: "partner not found" });
    const vacancies = await Vacancy.find({ "partner._id": partnerId });
    return res.json({ data: vacancies });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      if (req.user.type !== "partner") return res.sendStatus(401);
      const isValidated = validator.createValidation(req.body);
      if (isValidated.error) {
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });
      }
      const partnerId = req.body.partnerId;
      const partner = await User.findOne({ _id: partnerId, type: "partner" });
      if (!partner)
        // Bad request if not found
        return res.status(400).send({ error: "partner not found" });
      req.body.partner = partner;
      delete req.body.partnerId;
      const vacancy = await Vacancy.create(req.body);
      return res.json({ data: vacancy });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const vacancy = await Vacancy.findById(id);
      const isValidated = validator.updateValidation(req.body);
      if (!vacancy)
        // Bad request if not found
        return res.status(400).send({ error: "vacancy not found" });
      if (!(req.user.type === "admin" || req.user.id == vacancy.partner._id))
        return res.sendStatus(401);
      if (isValidated.error) {
        return res
          .status(400)
          .send({ error: isValidated.error.details[0].message });
      }
      if (vacancy.partner._id != req.body.partnerId)
        return res.status(400).send({ error: "partner cannot be changed" });
      let acceptedMember;
      if (req.body.acceptedMemberId) {
        acceptedMember = await User.findOne({
          _id: req.body.acceptedMemberId,
          type: "member"
        });
        if (!acceptedMember)
          // Bad request if not found
          return res.status(400).send({ error: "member not found" });
      }
      const { partnerId, acceptedMemberId, ...vacancyData } = req.body;
      const { partner } = vacancy;
      let newVacancy;
      if (acceptedMember) {
        newVacancy = await Vacancy.findByIdAndUpdate(
          id,
          {
            partner,
            ...vacancyData,
            acceptedMember
          },
          { new: true }
        );
      } else {
        newVacancy = await Vacancy.findByIdAndUpdate(
          id,
          {
            partner,
            ...vacancyData
          },
          { new: true }
        );
      }
      await JobApplication.updateMany(
        { "vacancy._id": newVacancy._id },
        { vacancy: newVacancy }
      );
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.params;
    try {
      const vacancy = await Vacancy.findById(id);
      if (!vacancy)
        // Bad request if not found
        return res.status(400).send({ error: "vacancy not found" });
      if (!(req.user.type === "admin" || req.user.id == vacancy.partner._id))
        return res.sendStatus(401);
      const deletedVacancy = await Vacancy.findByIdAndRemove(id);
      await JobApplication.deleteMany({ "vacancy._id": deletedVacancy._id });
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  }
);

module.exports = router;
